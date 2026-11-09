"""
Outlines the wordmark from the Instrument Serif font files (never live text).
  python3 scripts/build-logo.py            (needs fonttools: pip install fonttools)
  python3 scripts/build-logo.py --check    (prints the geometry, writes nothing)

Construction (see docs/brand/LOGO_GUIDELINES.md):
  - ROMAN part in Instrument Serif 400 roman, ITALIC part in 400 italic, 1000-unit em at scale 0.1 on a y=100
    baseline; tracking -1.5 between glyphs, the font's own kerning, +1.0 where roman turns italic.
  - An eight-ray signal burst (outer radius 12, inner 4.2) whose top sits on the cap height, 5.5 units right of
    the last letter's ink.
Writes the WORDMARK_* constants in src/components/ui/Logo/geometry.ts (the monogram is left as is) and the four
wordmark SVGs in public/brand/. Then run `npm run icons` to re-render the PNG exports.
"""
import math
import re
import sys
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROMAN = 'Ads'
ITALIC = 'flux'
NAME = ROMAN + ITALIC
SLUG = NAME.lower()

ROOT = Path(__file__).resolve().parent.parent
FONTS = ROOT / 'node_modules/@fontsource/instrument-serif/files'
GEOMETRY = ROOT / 'src/components/ui/Logo/geometry.ts'
TOKENS = ROOT / 'src/styles/tokens.css'

SCALE = 0.1
BASELINE = 100
TRACKING = -1.5
STYLE_SWITCH_GAP = 1.0
BURST_OUTER, BURST_INNER, BURST_GAP = 12, 4.2, 5.5
CAP_TOP = BASELINE - 73  # cap height 730 units
PAD_X, VIEW_Y, VIEW_H = 1.8, 23, 80

# Variant → (letters colour token, burst colour token). Mirrors LOGO_GUIDELINES.md "Assets".
WORDMARK_SVGS = {
    'ink': ('ink', 'orange'),
    'cream': ('cream', 'orange'),
    'cobalt': ('cobalt', 'orange'),
    'mono-ink': ('ink', 'ink'),
}


def fmt(value: float) -> str:
    text = f'{value:.2f}'
    return text[:-3] if text.endswith('.00') else text


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
    fonts = {style: TTFont(FONTS / f'instrument-serif-latin-400-{style}.woff') for style in ('normal', 'italic')}
    runs = [('normal', ch) for ch in ROMAN] + [('italic', ch) for ch in ITALIC]
    pen_x, paths, right_edge, previous = 0.0, [], 0.0, None
    for style, char in runs:
        font = fonts[style]
        glyph_set, glyph = font.getGlyphSet(), font.getBestCmap()[ord(char)]
        if previous is not None:
            prev_style, prev_glyph = previous
            pen_x += TRACKING
            if prev_style == style:
                pen_x += kerning(font, prev_glyph, glyph) * SCALE
            else:
                pen_x += STYLE_SWITCH_GAP
        svg_pen = SVGPathPen(glyph_set, ntos=fmt)
        glyph_set[glyph].draw(TransformPen(svg_pen, (SCALE, 0, 0, -SCALE, pen_x, BASELINE)))
        paths.append(svg_pen.getCommands())
        bounds_pen = BoundsPen(glyph_set)
        glyph_set[glyph].draw(bounds_pen)
        if bounds_pen.bounds:
            right_edge = max(right_edge, pen_x + bounds_pen.bounds[2] * SCALE)
        pen_x += font['hmtx'][glyph][0] * SCALE
        previous = (style, glyph)
    return ''.join(paths), right_edge


def burst(cx: float, cy: float) -> str:
    points = []
    for i in range(16):
        radius = BURST_OUTER if i % 2 == 0 else BURST_INNER
        angle = -math.pi / 2 + i * math.pi / 8
        points.append(f'{cx + radius * math.cos(angle):.2f} {cy + radius * math.sin(angle):.2f}')
    return 'M' + 'L'.join(points) + 'Z'


def main():
    letters, right_edge = outline_letters()
    cx = right_edge + BURST_GAP + BURST_OUTER
    cy = CAP_TOP + 0.7 + BURST_OUTER
    burst_path = burst(cx, cy)
    view_min_x = -3
    view_width = math.ceil(cx + BURST_OUTER + PAD_X - view_min_x)
    viewbox = f'{view_min_x} {VIEW_Y} {view_width} {VIEW_H}'
    print(f'{NAME}: ink right edge {right_edge:.2f}, burst centre ({cx:.2f}, {cy:.2f}), viewBox "{viewbox}"')
    if '--check' in sys.argv:
        return

    source = GEOMETRY.read_text()
    source = re.sub(r'Outlined Instrument Serif geometry for the \w+ logo \([^)]*\)',
                    f'Outlined Instrument Serif geometry for the {NAME} logo ("{ROMAN}" roman + "{ITALIC}" italic + signal burst)',
                    source)
    source = re.sub(r'Generated once from the font files', 'Generated from the font files by scripts/build-logo.py', source)
    source = re.sub(r'WORDMARK_VIEWBOX = "[^"]*"', f'WORDMARK_VIEWBOX = "{viewbox}"', source)
    source = re.sub(r'WORDMARK_LETTERS = "[^"]*"', f'WORDMARK_LETTERS = "{letters}"', source)
    source = re.sub(r'WORDMARK_BURST = "[^"]*"', f'WORDMARK_BURST = "{burst_path}"', source)
    GEOMETRY.write_text(source)

    tokens = TOKENS.read_text()
    color = lambda name: re.search(rf'--brand-{name}:\s*(#[0-9A-Fa-f]{{6}})', tokens).group(1)
    for variant, (mark, spark) in WORDMARK_SVGS.items():
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{viewbox}" role="img" aria-label="{NAME}">'
               f'<title>{NAME}</title><path fill="{color(mark)}" d="{letters}"/>'
               f'<path fill="{color(spark)}" d="{burst_path}"/></svg>')
        (ROOT / f'public/brand/{SLUG}-wordmark-{variant}.svg').write_text(svg)
    print(f'Wrote {GEOMETRY.relative_to(ROOT)} and public/brand/{SLUG}-wordmark-*.svg — now run `npm run icons`.')


if __name__ == '__main__':
    main()
