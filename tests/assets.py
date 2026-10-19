"""Rebuild and check sprite crops/exports. Run with Python 3 and Pillow."""
from pathlib import Path
from PIL import Image, ImageChops
import json
import runpy

ROOT = Path(__file__).resolve().parents[1]


def components(image):
    """Find visible connected artwork, including diagonal pixel-art outlines."""
    width, height = image.size
    remaining = bytearray(image.getchannel('A').point(lambda a: 255 if a > 14 else 0).tobytes())
    for start in range(len(remaining)):
        if not remaining[start]:
            continue
        remaining[start] = 0
        pending, pixels = [start], []
        while pending:
            pixel = pending.pop()
            x, y = pixel % width, pixel // width
            pixels.append((x, y))
            for yy in range(max(0, y - 1), min(height, y + 2)):
                for xx in range(max(0, x - 1), min(width, x + 2)):
                    index = yy * width + xx
                    if remaining[index]:
                        remaining[index] = 0
                        pending.append(index)
        # Ignore isolated antialiasing specks, but keep tails and particle effects.
        if len(pixels) > 100:
            yield pixels


def check_character_crops(build):
    checked = 0
    for character in ('robot', 'fox'):
        source = build[character]
        artwork = list(components(source))
        for action, regions in build[character + '_rows'].items():
            for index, region in enumerate(regions):
                name = f'{character}_{action}_{index}'
                x0, y0, x1, y1 = region
                alpha = build['piece'](name, source, region).getchannel('A')
                bodies = 0
                for pixels in artwork:
                    visible = sum(x0 <= x < x1 and y0 <= y < y1 and alpha.getpixel((x - x0, y - y0)) > 14
                                  for x, y in pixels)
                    assert visible in (0, len(pixels)), f'{name}: cropped artwork or neighbor fragment ({visible}/{len(pixels)} pixels)'
                    bodies += visible > 10000
                assert bodies == 1, f'{name}: expected one complete character, got {bodies}'
                checked += 1
    assert checked == 68


def check_exports(build):
    art = ROOT / 'assets/art'
    meta = json.loads((art / 'gpu-atlas.json').read_text())
    assert (art / 'gpu-atlas.js').read_text() == 'window.PIXEL_GPU_ATLAS=' + (art / 'gpu-atlas.json').read_text() + ';'
    atlas = Image.open(art / 'gpu-atlas.webp').convert('RGBA')
    assert atlas.size == (meta['width'], meta['height'])
    assert len(meta['frames']) == 100
    for name, frame in meta['frames'].items():
        x, y, w, h = (frame[key] for key in ('x', 'y', 'w', 'h'))
        assert 0 <= x < x + w <= atlas.width and 0 <= y < y + h <= atlas.height, name
        actual = atlas.crop((x, y, x + w, y + h))
        expected = build['assets'][name]
        assert actual.size == expected.size, name
        assert ImageChops.difference(actual.getchannel('A'), expected.getchannel('A')).getbbox() is None, name
        for background in ('black', 'white'):
            rendered = [Image.alpha_composite(Image.new('RGBA', image.size, background), image).convert('RGB')
                        for image in (actual, expected)]
            assert ImageChops.difference(*rendered).getbbox() is None, name
    for character, length, size in [('robot', 6, (110, 126)), ('fox', 4, (136, 112))]:
        strip = Image.open(art / f'{character}-idle-strip.png').convert('RGBA')
        portrait = Image.open(art / f'{character}-portrait.png').convert('RGBA')
        assert strip.size == (length * size[0], size[1])
        assert portrait.tobytes() == strip.crop((0, 0, *size)).tobytes()


if __name__ == '__main__':
    build = runpy.run_path(str(ROOT / 'tools/build_atlas.py'))
    check_exports(build)
    check_character_crops(build)
    print('OK: 68 complete character frames, 100 atlas entries, menu strips and portraits.')
