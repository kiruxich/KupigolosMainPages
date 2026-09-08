"""Build small waveform envelopes from the catalogue demos (requires ffmpeg)."""
import array
import concurrent.futures
import json
import math
from pathlib import Path
import re
import subprocess
import tempfile
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
SOURCE = (ROOT / 'script.js').read_text().split('const voiceSlides = [', 1)[1].split('\n];', 1)[0]
URLS = re.findall(r"audio: '([^']+)'", SOURCE)

def analyse(url):
    with tempfile.TemporaryDirectory(prefix='voice-envelope-') as directory:
        demo = Path(directory) / 'demo.mp3'
        with urllib.request.urlopen(url, timeout=40) as response:
            demo.write_bytes(response.read())
        pcm = subprocess.check_output(['ffmpeg', '-v', 'error', '-i', str(demo), '-f', 'f32le', '-ac', '1', '-ar', '8000', '-'])
    samples = array.array('f', pcm)
    size = len(samples)
    energies = []
    for index in range(48):
        chunk = samples[index * size // 48:(index + 1) * size // 48]
        energies.append(math.sqrt(sum(value * value for value in chunk) / max(1, len(chunk))))
    peak = max(energies) or 1
    return url, {'duration': round(size / 8000, 3), 'bars': [max(3, round(34 * value / peak)) for value in energies]}

if __name__ == '__main__':
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        result = dict(executor.map(analyse, URLS))
    assert len(result) == 20
    output = '// Derived from the public catalogue demos; regenerate with scripts/build-voice-waveforms.py.\nwindow.KupiVoiceWaveforms = ' + json.dumps(result, ensure_ascii=False, separators=(',', ':')) + ';\n'
    (ROOT / 'voice-waveforms.js').write_text(output)
    print('Generated real waveform envelopes and durations for', len(result), 'voices.')
