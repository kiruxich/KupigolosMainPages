"""Author transparent Pixi textures from the approved studio illustrations.

Run with Python 3.12 and Pillow. This authoring pipeline preserves the source
colours and texture; it is not used by the website at runtime.
"""

from collections import deque
import json
import math
from pathlib import Path
import re

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
REFERENCES = ROOT / "output/imagegen/studio-pen-storyboard-v1"
MASKS = ROOT / "components/home/studio"
OUTPUT = ROOT / "public/assets/studio/textures"
SCALE = 3
CURVE_SAMPLES = 12
GROUPS = {
    "torso": ("torso",),
    "pelvis": ("pelvis",),
    "front-arm": ("frontUpperArm", "frontForearm"),
    "back-arm": ("backUpperArm", "backForearm"),
    "front-leg": ("frontThigh", "frontShin"),
    "back-leg": ("backThigh", "backShin"),
    "head": ("head",),
    "front-hand": ("frontHand",),
    "back-hand": ("backHand",),
    "front-shoe": ("frontShoe",),
    "back-shoe": ("backShoe",),
}


def read_parts(filename: str) -> dict[str, str]:
    return dict(re.findall(r"\b(\w+):\s*`([^`]+)`", (MASKS / filename).read_text()))


def read_environment() -> dict[str, dict]:
    text = (MASKS / "reference-environment.ts").read_text()
    layers = {}
    for name, body in re.findall(r"\b(\w+):\s*\{([^}]+)\}", text):
        source = re.search(r"\bsource:\s*[\"']([^\"']+)[\"']", body)
        path = re.search(r"\bd:\s*`([^`]+)`", body)
        seeds = re.search(r"\bpaperSeeds:\s*(\[[^\n]+\])", body)
        holes = re.search(r"\bpaperHoles:\s*`([^`]+)`", body)
        if source and path and name != "floor":
            layers[name] = {
                "source": source.group(1), "d": path.group(1),
                "removePaper": bool(re.search(r"\bremovePaper:\s*true", body)),
                "paperSeeds": json.loads(seeds.group(1)) if seeds else [],
                "paperHoles": holes.group(1) if holes else "",
            }
    return layers


def polygons(path: str) -> list[list[tuple[float, float]]]:
    """Sample the authored absolute M/L/C paths into closed polygons."""
    tokens = re.findall(r"[A-Za-z]|-?(?:\d*\.\d+|\d+)", path)
    output = []
    polygon = []
    position = 0
    command = ""
    current = (0.0, 0.0)
    while position < len(tokens):
        if tokens[position].isalpha():
            command = tokens[position]
            position += 1
        if command in ("Z", "z"):
            if polygon:
                output.append(polygon)
                current = polygon[0]
                polygon = []
            command = ""
            continue
        if command in ("M", "L"):
            point = (float(tokens[position]), float(tokens[position + 1]))
            position += 2
            if command == "M":
                if polygon:
                    output.append(polygon)
                polygon = []
                command = "L"
            polygon.append(point)
            current = point
        elif command == "C":
            values = [float(value) for value in tokens[position:position + 6]]
            position += 6
            a, b, end = (values[0], values[1]), (values[2], values[3]), (values[4], values[5])
            for step in range(1, CURVE_SAMPLES + 1):
                t = step / CURVE_SAMPLES
                u = 1 - t
                polygon.append((
                    u ** 3 * current[0] + 3 * u ** 2 * t * a[0] + 3 * u * t ** 2 * b[0] + t ** 3 * end[0],
                    u ** 3 * current[1] + 3 * u ** 2 * t * a[1] + 3 * u * t ** 2 * b[1] + t ** 3 * end[1],
                ))
            current = end
        else:
            raise ValueError(f"Unsupported mask command: {command!r}")
    if polygon:
        output.append(polygon)
    return output


def exterior_paper_alpha(source: Image.Image, background_seeds: list[tuple[int, int]]) -> Image.Image:
    """Remove paper connected to the crop edge or an authored background seed.

    Authored seeds reach background enclosed by furniture and cables without
    removing white surfaces inside the equipment. Character textures never
    pass through this operation.
    """
    width, height = source.size
    colour = source.convert("RGB").tobytes()
    eligible = bytearray(
        1 if min(colour[index:index + 3]) >= 232
        and max(colour[index:index + 3]) - min(colour[index:index + 3]) <= 24 else 0
        for index in range(0, len(colour), 3)
    )
    visited = bytearray(width * height)
    queue = deque()

    def seed(index: int) -> None:
        if eligible[index] and not visited[index]:
            visited[index] = 1
            queue.append(index)

    for x in range(width):
        seed(x)
        seed((height - 1) * width + x)
    for y in range(height):
        seed(y * width)
        seed(y * width + width - 1)
    for x, y in background_seeds:
        # A small neighbourhood also seeds the surrounding paper when the
        # exact point happens to land on one darker grain in the source.
        for sy in range(max(0, y - 2), min(height, y + 3)):
            for sx in range(max(0, x - 2), min(width, x + 3)):
                seed(sy * width + sx)
    while queue:
        index = queue.popleft()
        x, y = index % width, index // width
        if x:
            seed(index - 1)
        if x + 1 < width:
            seed(index + 1)
        if y:
            seed(index - width)
        if y + 1 < height:
            seed(index + width)
    return Image.frombytes("L", (width, height), bytes(0 if value else 255 for value in visited))


def path_mask(paths: list[str], bounds: tuple[int, int, int, int]) -> Image.Image:
    x, y, right, bottom = bounds
    width, height = right - x, bottom - y
    mask = Image.new("L", (width * SCALE, height * SCALE))
    draw = ImageDraw.Draw(mask)
    # Sharing one mask also unions adjacent sleeve/trouser pieces before the
    # antialiasing pass, so their internal cut edges cannot leave alpha seams.
    for path in paths:
        for shape in polygons(path):
            draw.polygon([((px - x) * SCALE, (py - y) * SCALE) for px, py in shape], fill=255)
    return mask.resize((width, height), Image.Resampling.LANCZOS)


class Author:
    def __init__(self) -> None:
        self.sources = {}
        self.manifest = {}
        self.images = {}
        self.underpaint = read_parts("reference-underpaint.ts")

    def source(self, name: str) -> Image.Image:
        if name not in self.sources:
            self.sources[name] = Image.open(REFERENCES / name).convert("RGBA")
        return self.sources[name]

    def clean_pelvis(self, rgba: Image.Image, bounds: tuple[int, int, int, int]) -> Image.Image:
        # Frame 07's lowered hand and cuff cover the jeans. They belong to the
        # moving arm, so they must not remain baked into its stationary pelvis.
        # Frame 06b exposes the same waistband with both hands raised. Map that
        # clean fabric into frame 07 coordinates, replacing only the occlusion.
        parts = read_parts("reference-parts.ts")
        patch = path_mask([parts["backForearm"], parts["backHand"]], bounds)
        patch = patch.filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(1.25))
        x, y, _, _ = bounds
        donor = self.source("frame-06b-recording-gesture.png").transform(
            rgba.size,
            Image.Transform.AFFINE,
            (0.84, 0, 0.84 * x + 175.64, 0, 1, y + 8),
            resample=Image.Resampling.BICUBIC,
        )
        # The normal pelvis silhouette is applied afterwards: no bounds, outer
        # alpha, rig anchors, or separate hand textures change with this repair.
        return Image.composite(donor, rgba, patch)

    def extend_torso(self, rgba: Image.Image, bounds: tuple[int, int, int, int],
                     visible_paths: list[str]) -> Image.Image:
        # The lowered sleeve hides the sweater's left side in frame 07. Reuse
        # the clean right chest from that same drawing under the moving sleeve.
        # This affine donor stays inside the sweater and avoids the baked hand.
        x, y, _, _ = bounds
        donor = self.source("frame-07-cta.png").transform(
            rgba.size,
            Image.Transform.AFFINE,
            (0.5, -0.15, 0.5 * x - 0.15 * y + 641, 0, 1, y),
            resample=Image.Resampling.BICUBIC,
        )
        # Keep every previously visible torso pixel. Only the newly uncovered
        # side receives donor cloth; the combined silhouette is applied later.
        hidden = ImageChops.invert(path_mask(visible_paths, bounds))
        return Image.composite(donor, rgba, hidden)

    def texture(self, name: str, source: str, paths: list[str], remove_paper: bool = False,
                paper_seeds: list | None = None, paper_holes: str = "") -> None:
        visible_paths = paths
        if name == "torso":
            paths = [*paths, self.underpaint["torsoHidden"]]
        elif name == "relaxed-hand":
            paths = [self.underpaint["relaxedHand"]]
        shapes = [polygon for path in paths for polygon in polygons(path)]
        points = [point for shape in shapes for point in shape]
        bounds = (
            math.floor(min(point[0] for point in points)) - 2,
            math.floor(min(point[1] for point in points)) - 2,
            math.ceil(max(point[0] for point in points)) + 2,
            math.ceil(max(point[1] for point in points)) + 2,
        )
        x, y, right, bottom = bounds
        width, height = right - x, bottom - y
        mask = path_mask(paths, bounds)
        rgba = self.source(source).crop(bounds)
        if name == "pelvis":
            rgba = self.clean_pelvis(rgba, bounds)
        elif name == "torso":
            rgba = self.extend_torso(rgba, bounds, visible_paths)
        if remove_paper:
            seeds = [(int(px - x), int(py - y)) for px, py in (paper_seeds or [])]
            mask = ImageChops.multiply(mask, exterior_paper_alpha(rgba, seeds))
        if paper_holes:
            mask = ImageChops.subtract(mask, path_mask([paper_holes], bounds))
        rgba.putalpha(ImageChops.multiply(mask, rgba.getchannel("A")))
        rgba.save(OUTPUT / f"{name}.webp", format="WEBP", lossless=True, exact=True, method=6)
        self.manifest[name] = {"file": f"{name}.webp", "x": x, "y": y, "width": width, "height": height}
        self.images[name] = rgba

    def character(self, source: str, parts: dict[str, str], prefix: str = "") -> None:
        for name, keys in GROUPS.items():
            paths = [parts[key] for key in keys if parts.get(key)]
            if paths:
                self.texture(prefix + name, source, paths)

    def place(self, canvas: Image.Image, name: str) -> None:
        item = self.manifest[name]
        canvas.alpha_composite(self.images[name], (item["x"], item["y"]))

    def save_poster(self, canvas: Image.Image, name: str) -> None:
        poster = canvas.crop((0, 230, 1536, 910))
        poster.save(OUTPUT / f"{name}.webp", format="WEBP", lossless=True, exact=True, method=6)
        self.manifest[name] = {"file": f"{name}.webp", "x": 0, "y": 230, "width": 1536, "height": 680}

    def poster(self, environment: dict[str, dict], final_parts: dict[str, str],
               seated_parts: dict[str, str], seated_head: str) -> None:
        self.texture("poster-character", "frame-07-cta.png", list(final_parts.values()))
        canvas = Image.new("RGBA", (1536, 1024))
        for name in ("plant", "desk", "chair"):
            if name in environment:
                self.place(canvas, name)
        self.place(canvas, "poster-character")
        if "mic" in environment:
            self.place(canvas, "mic")
        # Headphones are already worn by the character in the final pose.
        self.save_poster(canvas, "poster")

        self.texture("initial-poster-character", "frame-01-desk.png", [*seated_parts.values(), seated_head])
        initial = Image.new("RGBA", (1536, 1024))
        for name in ("plant", "desk"):
            if name in environment:
                self.place(initial, name)
        self.place(initial, "initial-poster-character")
        # The seated masks exclude the chair's occluded areas. Place the chair
        # in front of the seated figure, matching the first animation frame.
        for name in ("chair", "mic", "headphones"):
            if name in environment:
                self.place(initial, name)
        self.save_poster(initial, "initial-poster")

        # The union images are authoring intermediates, never runtime textures.
        for name in ("poster-character", "initial-poster-character"):
            del self.manifest[name]
            (OUTPUT / f"{name}.webp").unlink()


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    author = Author()
    final_parts = read_parts("reference-parts.ts")
    seated_parts = read_parts("reference-seated.ts")
    author.character("frame-07-cta.png", final_parts)
    author.character("frame-01-desk.png", seated_parts, "seated-")
    heads = dict(re.findall(r"export const (\w+)\s*=\s*`([^`]+)`", (MASKS / "reference-heads.ts").read_text()))
    for name, source, key in (
        ("seated-head", "frame-01-desk.png", "seatedHeadClip"),
        ("walking-head", "frame-03-walk.png", "walkingHeadClip"),
        ("relaxed-hand", "frame-06c-recording-finish.png", "relaxedHandClip"),
    ):
        author.texture(name, source, [heads[key]])
    environment = read_environment()
    for name, layer in environment.items():
        author.texture(name, layer["source"], [layer["d"]], layer["removePaper"],
                       layer["paperSeeds"], layer["paperHoles"])
    author.poster(environment, final_parts, seated_parts, heads["seatedHeadClip"])
    (OUTPUT / "manifest.json").write_text(json.dumps(author.manifest, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    main()
