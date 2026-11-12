"""
Builds the Adsflux "Breakout" logo: every vector logo file comes from here (never hand-edit them).
  python3 scripts/build-logo.py            (needs fonttools + brotli: pip install fonttools brotli)
  python3 scripts/build-logo.py --check    (prints the geometry, writes nothing)

Construction (see docs/brand/LOGO_GUIDELINES.md), in a 50-unit mark:
  - FRAME: a square outline (40 × 40, stroke 7) whose top-right corner is cut open.
  - SIGNAL: a solid 24 × 24 block breaking out through that corner, 3 units clear of the frame.
  - WORDMARK: the mark, then "adsflux" in Space Grotesk Bold, outlined from the font file. The letters sit on
    the frame's bottom edge; their ascender height matches the frame's top edge. 14 units between mark and text.
  - MONOGRAM: the mark alone, centred on a 64 × 64 tile.
Writes src/components/ui/Logo/geometry.ts, public/brand/adsflux-{wordmark,monogram}-*.svg and public/favicon.svg.
Then run `npm run icons` to re-render the PNG exports (social card, 512 px monogram, apple-touch icon).
"""
import re
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

NAME = 'Adsflux'
TEXT = 'adsflux'
SLUG = NAME.lower()

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / 'node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2'
GEOMETRY = ROOT / 'src/components/ui/Logo/geometry.ts'
TOKENS = ROOT / 'src/styles/tokens.css'

WEIGHT = 700
MARK_SIZE = 50
FRAME_TOP, FRAME_RIGHT, FRAME_STROKE = 10, 40, 7
SIGNAL_LEFT, SIGNAL_SIZE = 26, 24
BASELINE = MARK_SIZE  # letters stand on the frame's bottom edge
TEXT_GAP = 14
TRACKING = -0.03  # × font size
PAD = 2
TILE = 64

# Variant → (mark colour token, signal colour token). Mirrors LOGO_GUIDELINES.md "Assets".
WORDMARK_SVGS = {
    'ink': ('ink', 'orange'),
    'cream': ('cream', 'orange'),
    'cobalt': ('cobalt', 'orange'),
    'mono-ink': ('ink', 'ink'),
}
# Variant → (tile, mark, signal).
MONOGRAM_SVGS = {
    'cobalt': ('cobalt', 'cream', 'orange'),
    'cream': ('cream', 'ink', 'orange'),
    'orange': ('orange', 'ink', 'ink'),
}


def fmt(value: float) -> str:
    text = f'{value:.2f}'.rstrip('0').rstrip('.')
    return '0' if text in ('-0', '') else text


def polygon(points, dx=0.0, dy=0.0) -> str:
    return 'M' + 'L'.join(f'{fmt(x + dx)} {fmt(y + dy)}' for x, y in points) + 'Z'


def frame_path(dx=0.0, dy=0.0) -> str:
    """The frame, open at the top-right where the signal breaks out (3 units of clearance)."""
    s, top, right = FRAME_STROKE, FRAME_TOP, FRAME_RIGHT
    cut_x, cut_y = SIGNAL_LEFT - 3, SIGNAL_SIZE + 3
    return polygon(
        [(0, top), (cut_x, top), (cut_x, top + s), (s, top + s), (s, MARK_SIZE - s), (right - s, MARK_SIZE - s),
         (right - s, cut_y), (right, cut_y), (right, MARK_SIZE), (0, MARK_SIZE)],
        dx, dy,
    )


def signal_path(dx=0.0, dy=0.0) -> str:
    x0, size = SIGNAL_LEFT, SIGNAL_SIZE
    return polygon([(x0, 0), (x0 + size, 0), (x0 + size, size), (x0, size)], dx, dy)


def kerning(font: TTFont, left: str, right: str) -> int:
    """Horizontal advance adjustment from GPOS pair positioning (formats 1 and 2)."""
    if 'GPOS' not in font:
        return 0
    for lookup in font['GPOS'].table.LookupList.Lookup:
        for sub in lookup.SubTable:
            if lookup.LookupType == 9:
                sub = sub.ExtSubTable
            if getattr(sub, 'LookupType', lookup.LookupType) != 2 or left not in sub.Coverage.glyphs:
                continue
            if sub.Format == 1:
                pair_set = sub.PairSet[sub.Coverage.glyphs.index(left)]
                for record in pair_set.PairValueRecord:
                    if record.SecondGlyph == right and record.Value1 is not None:
                        return getattr(record.Value1, 'XAdvance', 0) or 0
            elif sub.Format == 2:
                class1 = sub.ClassDef1.classDefs.get(left, 0)
                class2 = sub.ClassDef2.classDefs.get(right, 0)
                value = sub.Class1Record[class1].Class2Record[class2].Value1
                if value is not None and getattr(value, 'XAdvance', 0):
                    return value.XAdvance
    return 0


def outline_letters():
    """'adsflux' outlined at the size where the ascender of 'd' reaches the frame's top edge. → (d, right edge)."""
    font = instancer.instantiateVariableFont(TTFont(FONT), {'wght': WEIGHT})
    glyphs, cmap, hmtx = font.getGlyphSet(), font.getBestCmap(), font['hmtx']
    ascender = BoundsPen(glyphs)
    glyphs[cmap[ord('d')]].draw(ascender)
    size = (BASELINE - FRAME_TOP) / ascender.bounds[3] * font['head'].unitsPerEm
    scale = size / font['head'].unitsPerEm

    # Start so the first letter's ink (not its side bearing) begins exactly TEXT_GAP after the mark.
    first = BoundsPen(glyphs)
    glyphs[cmap[ord(TEXT[0])]].draw(first)
    pen, bounds = SVGPathPen(glyphs, fmt), BoundsPen(glyphs)
    cursor, previous = MARK_SIZE + TEXT_GAP - first.bounds[0] * scale, None
    for char in TEXT:
        glyph = cmap[ord(char)]
        if previous:
            cursor += kerning(font, previous, glyph) * scale + TRACKING * size
        for target in (pen, bounds):
            glyphs[glyph].draw(TransformPen(target, (scale, 0, 0, -scale, cursor, BASELINE)))
        cursor += hmtx[glyph][0] * scale
        previous = glyph
    return pen.getCommands(), bounds.bounds


def svg(viewbox: str, body: str) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img" aria-label="{NAME}">'
        f'<title>{NAME}</title>{body}</svg>\n'
    )


def main():
    letters, (_, _, right, _) = outline_letters()
    width = right
    wordmark_viewbox = f'{-PAD} {-PAD} {fmt(width + PAD * 2)} {MARK_SIZE + PAD * 2}'
    wordmark_mark = frame_path() + letters
    wordmark_signal = signal_path()
    inset = (TILE - MARK_SIZE) / 2
    monogram_frame = frame_path(inset, inset)
    monogram_signal = signal_path(inset, inset)

    if '--check' in sys.argv:
        print('viewBox', wordmark_viewbox, '· aspect', round((width + PAD * 2) / (MARK_SIZE + PAD * 2), 3))
        return

    GEOMETRY.write_text(
        '/**\n'
        ' * Adsflux "Breakout" logo geometry: the frame, the signal block breaking out of its corner, and "adsflux"\n'
        ' * outlined from Space Grotesk Bold. Generated by scripts/build-logo.py (mirrored in public/brand/*.svg and\n'
        ' * public/favicon.svg). Do not hand-edit.\n'
        ' */\n'
        f'export const WORDMARK_VIEWBOX = "{wordmark_viewbox}"\n'
        '/** Frame + letters (mark colour). */\n'
        f'export const WORDMARK_MARK = "{wordmark_mark}"\n'
        '/** The block (signal colour). */\n'
        f'export const WORDMARK_SIGNAL = "{wordmark_signal}"\n\n'
        '/** 64 × 64 tile: the mark alone, centred. */\n'
        f'export const MONOGRAM_FRAME = "{monogram_frame}"\n'
        f'export const MONOGRAM_SIGNAL = "{monogram_signal}"\n'
    )

    tokens = TOKENS.read_text()
    color = lambda name: re.search(rf'--brand-{name}:\s*(#[0-9A-Fa-f]{{6}})', tokens).group(1)
    for variant, (mark, signal) in WORDMARK_SVGS.items():
        body = f'<path fill="{color(mark)}" d="{wordmark_mark}"/><path fill="{color(signal)}" d="{wordmark_signal}"/>'
        (ROOT / f'public/brand/{SLUG}-wordmark-{variant}.svg').write_text(svg(wordmark_viewbox, body))
    for variant, (tile, mark, signal) in MONOGRAM_SVGS.items():
        body = (
            f'<rect width="{TILE}" height="{TILE}" fill="{color(tile)}"/>'
            f'<path fill="{color(mark)}" d="{monogram_frame}"/><path fill="{color(signal)}" d="{monogram_signal}"/>'
        )
        content = svg(f'0 0 {TILE} {TILE}', body)
        (ROOT / f'public/brand/{SLUG}-monogram-{variant}.svg').write_text(content)
        if variant == 'cobalt':
            (ROOT / 'public/favicon.svg').write_text(content)
    print(f'Wrote {GEOMETRY.relative_to(ROOT)}, public/brand/{SLUG}-*.svg and public/favicon.svg — now run `npm run icons`.')


if __name__ == '__main__':
    main()
