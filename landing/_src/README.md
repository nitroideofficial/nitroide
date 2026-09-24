# Landing pages — build system

The 19 pages in `landing/*.html` are **generated** from two sources in this
directory. Edit the sources, regenerate, commit. Never hand-edit the HTML
directly — your changes will be overwritten on the next build.

## Regenerate (one command)

From the repo root:

```sh
python3 landing/_src/build.py
```

Pure stdlib, no dependencies. It rewrites all 19 `landing/*.html` files.
After a clean regeneration with no data edits, `git diff landing/` is empty
(the build is byte-identical to the committed pages).

## Files

- **`base.html`** — the shared skeleton: doctype, `<head>` (meta/OG/Twitter,
  favicons, stylesheets, JSON-LD), the `<nitro-header>` nav, background layers,
  footer, and scripts. Per-page values are `%%PLACEHOLDERS%%`.
- **`pages.json`** — one object per page, keyed by `slug` (the filename).
  Holds everything unique: title/meta/OG/Twitter copy, keywords, the
  WebApplication JSON-LD fields, and the full `<main>` body HTML.
- **`build.py`** — renders every page from `base.html` + `pages.json`.
- **`extract.py`** — one-time derivation script that produced `base.html` and
  `pages.json` from the hand-written pages. Only re-run it if you need to
  re-derive the sources (it must run on pristine committed pages).

## Editing guide

| Want to change… | Edit |
|---|---|
| Page copy, hero, sections, FAQ, tables | that page's `body` in `pages.json` |
| Title, meta/OG/Twitter description, keywords | that page's fields in `pages.json` |
| Something on **all** pages (nav, footer, JSON-LD shape, scripts) | `base.html`, then rebuild |
| Add a new landing page | copy a page object in `pages.json`, change `slug` + fields + `body`, rebuild |

## Per-page flags in `pages.json` (preserve old quirks byte-for-byte)

- `no_html_tag` — page omits the `<html lang="en">` line (3 pages).
- `compact_head` — page uses the compact head-whitespace variant: no trailing
  spaces on blank lines, 2-space phosphor indent, compact `offers` JSON, no
  blank line between the two JSON-LD blocks (jsfiddle, replit, stackblitz).
- `compact_offers` — single-line `offers` objects in both JSON-LD blocks.
- `trailing_newline` — file ends with `</html>\n` instead of `</html>`.
- `robots_ws` — blank line after the canonical link keeps 2 trailing spaces
  (react-online-playground).
- `extra_style` — page-specific `<style>` block in `<head>` (3 comparison pages).
- `faq_jsonld` — page-specific FAQPage JSON-LD block (5 pages).
- `footer_scripts` — custom footer scripts instead of the standard
  `<script defer src="../script.js"></script>` (test-tailwind-css-online,
  which pre-loads the Tailwind CDN config).

## Verify

```sh
python3 landing/_src/build.py && git diff --stat -- landing/
# no output = pages unchanged (byte-identical)
```
