"""
scripts/optimize_images.py  (#13)
images/{code}.png (1.5~2.5MB each) ->
  images/web/{code}.webp  : 768px long edge, q80  (UI, gallery, image sitemap)
  images/web/{code}.jpg   : 1200x630 letterboxed, q82 (OG / Kakao preview)
Skips outputs that are newer than the source. Run:
  uv run --with pillow python scripts/optimize_images.py
"""
import os, sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "images")
OUT = os.path.join(SRC, "web")
os.makedirs(OUT, exist_ok=True)
BG = (24, 26, 33)

def fresh(src, dst):
    return os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src)

def work(fn):
    code = fn[:-4]
    src = os.path.join(SRC, fn)
    webp = os.path.join(OUT, code + ".webp")
    jpg = os.path.join(OUT, code + ".jpg")
    if fresh(src, webp) and fresh(src, jpg):
        return 0
    im = Image.open(src).convert("RGB")
    w = im.copy(); w.thumbnail((768, 768), Image.LANCZOS)
    w.save(webp, "WEBP", quality=80, method=6)
    og = Image.new("RGB", (1200, 630), BG)
    t = im.copy(); t.thumbnail((1200, 630), Image.LANCZOS)
    og.paste(t, ((1200 - t.width) // 2, (630 - t.height) // 2))
    og.save(jpg, "JPEG", quality=82, optimize=True, progressive=True)
    return 1

files = sorted(f for f in os.listdir(SRC) if f.lower().endswith(".png") and f[:-4].isdigit())
with ThreadPoolExecutor(max_workers=os.cpu_count() or 4) as ex:
    n = sum(ex.map(work, files))
size = sum(os.path.getsize(os.path.join(OUT, f)) for f in os.listdir(OUT))
print(f"processed={n} total_src={len(files)} web_dir={size/1024/1024:.1f}MB files={len(os.listdir(OUT))}")
