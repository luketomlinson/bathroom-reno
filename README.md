# Bathroom Renovation — Before &amp; After

A tiny static site with a draggable before/after image slider. No build step, no
dependencies — just HTML, CSS, and a little vanilla JavaScript.

## Use your own photos

Replace the two files in `images/` with your photos, keeping the same names:

- `images/before.jpg`
- `images/after.jpg`

For the cleanest result, export both at the **same dimensions** (the placeholders
are 1200×800). The slider crops to fit, so close-but-not-identical sizes are fine.

## Preview locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or just double-click `index.html`.

## Publish to GitHub Pages

1. Create a repo and push these files to `main`.
2. In the repo: **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*,
   pick `main` and `/ (root)`, then **Save**.
4. Your site goes live at `https://<you>.github.io/<repo>/` within a minute.

## Files

```
index.html    markup
styles.css    styling (light + dark, responsive)
script.js     slider behavior (drag + keyboard)
images/       before.jpg, after.jpg
```

The handle is keyboard accessible: focus it and use ← → (hold Shift for bigger
steps, Home/End to jump to either edge).
