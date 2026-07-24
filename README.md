# Bathroom Renovation — Before &amp; After

A tiny static site with a draggable before/after image slider and a small gallery
of views (vanity, shower, full room). No build step, no dependencies — just HTML,
CSS, and a little vanilla JavaScript.

## Use your own photos

Each view is one before/after pair in `images/`. Replace these files with your
photos, keeping the same names:

| View   | Before                      | After                      |
| ------ | --------------------------- | -------------------------- |
| Vanity | `images/vanity-before.jpg`  | `images/vanity-after.jpg`  |
| Shower | `images/shower-before.jpg`  | `images/shower-after.jpg`  |
| Full   | `images/full-before.jpg`    | `images/full-after.jpg`    |

For each pair, shoot the **before and after from the same spot** and export both
at the **same dimensions** (the photos are 1200×1600, portrait) so the slider
reveals a clean transformation.

### Add or remove a view

The gallery is driven entirely by markup — no JavaScript changes needed. In
`index.html`, copy a `.scene` button inside `<div class="scenes">` and point its
attributes at your images:

```html
<button type="button" class="scene"
        data-before="images/floor-before.jpg"
        data-after="images/floor-after.jpg"
        data-title="Heated floor">
  <img src="images/floor-after.jpg" alt="" loading="lazy" />
  <span class="scene__name">Floor</span>
</button>
```

To remove a view, delete its button. To change which view loads first, move a
button to the top and give it `class="scene is-active"` and `aria-current="true"`.

## Progress photos

The **process** section fills itself from numbered photos — no markup to edit.
Drop files into `images/` named `progress-1.jpg`, `progress-2.jpg`, and so on
(lowercase `.jpg`). They show up in number order, gaps are fine, and the whole
section stays hidden until at least one photo exists.

Adding more than 12? Bump `MAX_PHOTOS` near the bottom of `script.js`.

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
index.html    markup + the scene list
styles.css    styling (light + dark, responsive)
script.js     slider behavior (drag + keyboard) and scene switching
images/       <view>-before.jpg / <view>-after.jpg pairs
```

The handle is keyboard accessible: focus it and use ← → (hold Shift for bigger
steps, Home/End to jump to either edge). The view thumbnails are buttons — Tab to
one and press Enter to compare it.
