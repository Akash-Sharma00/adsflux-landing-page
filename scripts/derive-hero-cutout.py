"""
Derive the hero cut-out from the services collage original.

The supplied collage bakes its decorative backdrop into the picture: a cobalt blob, an orange disc with
ring text, an orange brush stroke, an orbit line and dots. The site redraws those as animated SVG
(src/pages/home/sections/hero-collage/), so this script keeps only the six service cards and the phone.

  in : assets/originals/adsflux-services-collage.png   (never modified)
  out: assets/derived/adsflux-services-cutout.png       (source for `npm run assets`)
       src/assets/generated/heroCutoutPieces.ts         (clip outline + centre of the phone and each card, so the
                                                         site can animate every piece of the cut-out on its own)

The brush stroke crossed in front of the phone's bottom-right corner. That corner is rebuilt in a
perspective-flattened view of the phone: the frame is mirrored from the clean left side, the nav bar is
extended along its rows, and the screen is filled from neighbouring pixels. The phone's right side face
reflected the old orange/blue backdrop, so the whole right-hand frame is mirrored the same way.

Run:  python3 scripts/derive-hero-cutout.py   (needs numpy, opencv-python-headless, pillow)
Then: npm run assets
"""

from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "assets/originals/adsflux-services-collage.png"
OUTPUT = ROOT / "assets/derived/adsflux-services-cutout.png"
PIECES_TS = ROOT / "src/assets/generated/heroCutoutPieces.ts"

SUPERSAMPLE = 4
MIN_CARD_AREA = 15_000
# Cards in card_hulls() order (rows top to bottom, then left to right).
CARD_NAMES = ["socialMedia", "ugcInfluencers", "creativeProduction", "performanceAds", "brandStrategy", "analyticsGrowth"]
# Clip outlines are grown a little past each piece's alpha, so antialiased edges are never cut.
CLIP_GROW = 6

# Outer phone silhouette, measured on the source (TL, TR, BR, BL), and the flattened working size.
PHONE_CORNERS = np.float32([[705.7, 154.0], [1002.4, 169.9], [897.0, 839.0], [586.5, 795.0]])
FLAT_W, FLAT_H = 320, 700
# In the flattened view: screen spans x 15..297 (y to 671); the outer rim of the frame sits at x = 0 and 312.
SCREEN_LEFT, SCREEN_RIGHT, SCREEN_BOTTOM = 15, 297, 671
MIRROR_AXIS = 312  # right-hand pixel x is rebuilt from left-hand pixel (MIRROR_AXIS - x)
NAV_TOP, NAV_BOTTOM = 632, 671
PHONE_RADIUS = 50


def channels(rgba):
    rgba = rgba.astype(np.int32)
    return rgba[..., 0], rgba[..., 1], rgba[..., 2], rgba[..., 3]


def card_hulls(src):
    """Each card's cream face is one big opaque near-white component; its convex hull is the card."""
    r, g, b, a = channels(src)
    lo = np.minimum(np.minimum(r, g), b)
    hi = np.maximum(np.maximum(r, g), b)
    cream = ((a > 250) & (lo > 225) & (hi - lo < 28)).astype(np.uint8) * 255
    cream = cv2.morphologyEx(cream, cv2.MORPH_OPEN, np.ones((5, 5), np.uint8))
    count, labels, stats, _ = cv2.connectedComponentsWithStats(cream)
    hulls = []
    for i in range(1, count):
        if stats[i, cv2.CC_STAT_AREA] < MIN_CARD_AREA:
            continue
        contours, _ = cv2.findContours((labels == i).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        hulls.append(cv2.convexHull(max(contours, key=cv2.contourArea)).reshape(-1, 2))
    if len(hulls) != 6:
        raise SystemExit(f"Expected 6 cards, found {len(hulls)}")
    return sorted(hulls, key=lambda h: (h[:, 1].min() // 200, h[:, 0].min()))


def fill_polys(shape, polys):
    h, w = shape
    big = np.zeros((h * SUPERSAMPLE, w * SUPERSAMPLE), np.uint8)
    for poly in polys:
        cv2.fillPoly(big, [np.round(poly * SUPERSAMPLE).astype(np.int32)], 255, lineType=cv2.LINE_AA)
    return cv2.resize(big, (w, h), interpolation=cv2.INTER_AREA)


def rounded_rect(shape, x0, y0, x1, y1, radius, supersample=1):
    s = supersample
    img = np.zeros((shape[0] * s, shape[1] * s), np.uint8)
    x0, y0, x1, y1, rad = x0 * s, y0 * s, x1 * s, y1 * s, radius * s
    cv2.rectangle(img, (x0 + rad, y0), (x1 - rad, y1), 255, -1)
    cv2.rectangle(img, (x0, y0 + rad), (x1, y1 - rad), 255, -1)
    for cx, cy in ((x0 + rad, y0 + rad), (x1 - rad, y0 + rad), (x0 + rad, y1 - rad), (x1 - rad, y1 - rad)):
        cv2.circle(img, (cx, cy), rad, 255, -1, lineType=cv2.LINE_AA)
    return cv2.resize(img, (shape[1], shape[0]), interpolation=cv2.INTER_AREA) if s > 1 else img


def rebuild_phone(src):
    """Returns (rgba patch in source space, mask of rebuilt pixels, phone alpha) — see module docstring."""
    h, w = src.shape[:2]
    to_flat = cv2.getPerspectiveTransform(PHONE_CORNERS, np.float32([[0, 0], [FLAT_W, 0], [FLAT_W, FLAT_H], [0, FLAT_H]]))
    flat = cv2.warpPerspective(src, to_flat, (FLAT_W, FLAT_H), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REPLICATE)
    r, g, _, _ = channels(flat)

    # The stroke over the corner: strongly orange pixels (skin tones have much higher green).
    hole = ((r - g > 90) & (g < 140) & (r > 170)).astype(np.uint8) * 255
    hole[:470], hole[:, :170] = 0, 0
    hole = cv2.morphologyEx(hole, cv2.MORPH_CLOSE, np.ones((11, 11), np.uint8))
    hole = cv2.dilate(hole, np.ones((7, 7), np.uint8))
    hole[:470], hole[:, :170] = 0, 0
    _, labels, stats, _ = cv2.connectedComponentsWithStats(hole)
    hole = ((labels == 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])) * 255).astype(np.uint8)

    screen = rounded_rect((FLAT_H, FLAT_W), SCREEN_LEFT, 15, SCREEN_RIGHT, SCREEN_BOTTOM, 30)
    rows, cols = np.mgrid[0:FLAT_H, 0:FLAT_W]
    mirror_src = np.clip(MIRROR_AXIS - cols, 0, FLAT_W - 1)
    out = flat.copy()

    # Frame + bezel on the right half (and in the hole): mirror of the left side.
    frame = (screen == 0) & ((cols > FLAT_W // 2) | (hole > 0))
    out[frame] = flat[rows[frame], mirror_src[frame]]

    # Nav bar rows: the bar's own colour (median of its darker, icon-free pixels).
    in_screen_hole = (hole > 0) & (screen > 0)
    for y in range(NAV_TOP, NAV_BOTTOM + 1):
        row = flat[y, 25:195, :3].astype(np.float32)
        lum = row.mean(1)
        colour = np.median(row[lum < np.percentile(lum, 60)], 0)
        sel = in_screen_hole[y]
        out[y, sel, :3] = colour
        out[y, sel, 3] = 255
    # Screen above the bar: the sweater/hand texture just to the left.
    upper = in_screen_hole & (rows < NAV_TOP)
    out[upper] = flat[rows[upper], cols[upper] - 95]
    seam = cv2.morphologyEx(hole, cv2.MORPH_GRADIENT, np.ones((5, 5), np.uint8)) & screen
    smoothed = cv2.inpaint(np.ascontiguousarray(out[..., :3]), seam, 3, cv2.INPAINT_TELEA)
    out[..., :3] = np.where(seam[..., None] > 0, smoothed, out[..., :3])

    rebuilt = np.maximum(hole, (frame * 255).astype(np.uint8))
    alpha = rounded_rect((FLAT_H, FLAT_W), 0, 0, MIRROR_AXIS + 1, FLAT_H, PHONE_RADIUS, SUPERSAMPLE)

    to_src = np.linalg.inv(to_flat)
    warp = lambda img, interp: cv2.warpPerspective(img, to_src, (w, h), flags=interp)
    return warp(out, cv2.INTER_CUBIC), warp(rebuilt, cv2.INTER_LINEAR), warp(alpha, cv2.INTER_LINEAR)


def compose(src, hulls):
    patch, rebuilt, phone_alpha = rebuild_phone(src)
    cards = cv2.erode(fill_polys(src.shape[:2], hulls), np.ones((3, 3), np.uint8))

    weight = (rebuilt.astype(np.float32) / 255)[..., None]
    rgb = src[..., :3].astype(np.float32) * (1 - weight) + patch[..., :3].astype(np.float32) * weight
    alpha = np.maximum(phone_alpha, cards).astype(np.float32)

    # Drop leftover backdrop colour in a thin band along the silhouette.
    r, g, b, _ = channels(src)
    backdrop = ((b - r > 25) & (b > g)) | ((r - b > 60) & (r - g > 35))
    inner = cv2.erode((alpha > 127).astype(np.uint8), np.ones((9, 9), np.uint8))
    band = (alpha > 0) & (inner == 0) & (rebuilt < 128)
    alpha[band & backdrop] = 0
    alpha = np.minimum(alpha, np.where(rebuilt > 127, 255, src[..., 3]))
    return np.dstack([rgb.clip(0, 255).astype(np.uint8), alpha.astype(np.uint8)]), phone_alpha


def clip_outline(mask):
    """Convex outline around a piece's mask, grown by CLIP_GROW and simplified."""
    grown = cv2.dilate((mask > 20).astype(np.uint8), np.ones((2 * CLIP_GROW + 1,) * 2, np.uint8))
    contours, _ = cv2.findContours(grown, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
    hull = cv2.convexHull(max(contours, key=cv2.contourArea))
    poly = cv2.approxPolyDP(hull, 5.0, True).reshape(-1, 2)
    x, y, w, h = cv2.boundingRect(poly)
    # Relative segments keep the numbers (and the eager bundle) small.
    steps = "".join(f"l{bx - ax} {by - ay}" for (ax, ay), (bx, by) in zip(poly[:-1], poly[1:]))
    return f"M{poly[0][0]} {poly[0][1]}{steps}z", (x + w // 2, y + h // 2)


def write_pieces(hulls, phone_alpha, size):
    masks = {"phone": phone_alpha}
    for name, hull in zip(CARD_NAMES, hulls):
        masks[name] = fill_polys(size, [hull])
    lines = []
    for name, mask in masks.items():
        outline, (cx, cy) = clip_outline(mask)
        lines.append(f"  {name}: {{ outline: '{outline}', center: [{cx}, {cy}] }},")
    PIECES_TS.write_text(
        "/* Generated by scripts/derive-hero-cutout.py — do not edit by hand. */\n\n"
        "/** Coordinate space of the pieces (source pixels of the hero cut-out). */\n"
        f"export const HERO_CUTOUT_SIZE = {{ width: {size[1]}, height: {size[0]} }} as const\n\n"
        "/** Each separately animatable piece of the cut-out: a clip outline (SVG path) and its centre. */\n"
        "export const HERO_CUTOUT_PIECES = {\n" + "\n".join(lines) + "\n} as const\n\n"
        "export type HeroCutoutPiece = keyof typeof HERO_CUTOUT_PIECES\n"
    )


def main():
    src = np.array(Image.open(SOURCE).convert("RGBA"))
    hulls = card_hulls(src)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    cutout, phone_alpha = compose(src, hulls)
    Image.fromarray(cutout).save(OUTPUT, optimize=True)
    write_pieces(hulls, phone_alpha, src.shape[:2])
    print(f"Wrote {OUTPUT.relative_to(ROOT)} and {PIECES_TS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
