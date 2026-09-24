#!/usr/bin/env python3
"""One-time derivation script.

Reads the current landing/*.html pages and produces:
  - landing/_src/base.html : shared skeleton with %%PLACEHOLDERS%%
  - landing/_src/pages.json : per-page unique content keyed by slug

Run once (or to re-derive after hand-editing pages):
    python3 landing/_src/extract.py
Then regenerate with:
    python3 landing/_src/build.py
"""
import glob
import json
import os
import re

SRC = os.path.dirname(os.path.abspath(__file__))
LANDING = os.path.dirname(SRC)
REF_SLUG = "chromebook-code-editor-free.html"


def head_of(html):
    return html[: html.find("<!-- INJECTED DYNAMIC HEADER -->")]


def ld_blocks(html):
    """Return list of (full_block_text, inner_json_text) for ld+json scripts in head."""
    h = head_of(html)
    out = []
    for m in re.finditer(
        r'<script type="application/ld\+json">\n(.*?)\n  </script>', h, re.S
    ):
        out.append((m.group(0), m.group(1)))
    return out


def extract_page(path):
    slug = os.path.basename(path)  # e.g. replit-alternative-free.html
    html = open(path, encoding="utf-8").read()
    h = head_of(html)

    def meta(name):
        m = re.search(r'<meta name="%s" content="(.*?)">' % re.escape(name), h)
        assert m, (slug, name)
        return m.group(1)

    def prop(name):
        m = re.search(
            r'<meta property="%s" content="(.*?)">' % re.escape(name), h
        )
        assert m, (slug, name)
        return m.group(1)

    title = re.search(r"<title>(.*?)</title>", h).group(1)

    blocks = ld_blocks(html)
    wa = [inner for full, inner in blocks if '"WebApplication"' in inner][0]
    wa_name = re.search(r'"name": "(.*?)"', wa).group(1)
    wa_os = re.search(r'"operatingSystem": "(.*?)"', wa).group(1)
    wa_desc = re.search(r'"description": "(.*)"', wa).group(1)

    faq = None
    faq_blocks = [full for full, inner in blocks if '"FAQPage"' in inner]
    if faq_blocks:
        assert len(faq_blocks) == 1, slug
        faq = faq_blocks[0]

    style = None
    sm = re.search(r"(  <style>.*?</style>)", h, re.S)
    if sm:
        style = sm.group(1)

    # main body, byte-exact
    a = html.find("<main>") + len("<main>")
    b = html.find("</main>")
    body = html[a:b]

    # footer scripts region
    fm = html.find("<nitro-modals></nitro-modals>")
    em = html.find("</body>")
    footer_region = html[fm:em]
    if '<script src="../script.js" defer></script>' in footer_region:
        footer_scripts = footer_region[
            len("<nitro-modals></nitro-modals>\n") : -len("\n\n")
        ]
    else:
        footer_scripts = "standard"

    page = {
        "slug": slug,
        "title": title,
        "meta_title": meta("title"),
        "description": meta("description"),
        "keywords": meta("keywords"),
        "og_title": prop("og:title"),
        "og_description": prop("og:description"),
        "twitter_title": prop("twitter:title"),
        "twitter_description": prop("twitter:description"),
        "webapp_name": wa_name,
        "webapp_os": wa_os,
        "webapp_description": wa_desc,
        "body": body,
    }
    if "<!DOCTYPE html>\n<head>" in html:
        page["no_html_tag"] = True
    if "<head>\n\n\n\n" in html:
        page["compact_head"] = True
    lines = html.splitlines()
    for i, l in enumerate(lines):
        if 'rel="canonical"' in l:
            if lines[i + 1] == "  ":
                page["robots_ws"] = True
            break
    if '"offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }' in h:
        page["compact_offers"] = True
    if html.endswith("</html>\n"):
        page["trailing_newline"] = True
    if style:
        page["extra_style"] = style
    if faq:
        page["faq_jsonld"] = faq
    if footer_scripts != "standard":
        page["footer_scripts"] = footer_scripts
    return page


def make_template(ref_html, ref_fields):
    """Replace per-page regions of the reference page with %%PLACEHOLDERS%%."""
    t = ref_html

    def sub_once(old, new):
        nonlocal_t = t
        assert nonlocal_t.count(old) >= 1, "not found: %r" % old[:60]
        return nonlocal_t.replace(old, new, 1)

    # html tag line
    t = sub_once(
        "<!DOCTYPE html>\n<html lang=\"en\">\n<head>",
        "<!DOCTYPE html>\n%%HTML_TAG%%<head>",
    )
    # head blank-line whitespace (majority variant)
    t = sub_once("<head>\n  \n  \n\n", "<head>\n%%HEAD_BL%%")
    # slots
    t = sub_once("<title>%s</title>" % ref_fields["title"], "<title>%%TITLE%%</title>")
    t = sub_once(
        '<meta name="title" content="%s">' % ref_fields["meta_title"],
        '<meta name="title" content="%%META_TITLE%%">',
    )
    t = sub_once(
        '<meta name="description" content="%s">' % ref_fields["description"],
        '<meta name="description" content="%%DESCRIPTION%%">',
    )
    t = sub_once(
        '<meta name="keywords" content="%s">' % ref_fields["keywords"],
        '<meta name="keywords" content="%%KEYWORDS%%">',
    )
    t = sub_once(
        '<meta property="og:title" content="%s">' % ref_fields["og_title"],
        '<meta property="og:title" content="%%OG_TITLE%%">',
    )
    t = sub_once(
        '<meta property="og:description" content="%s">' % ref_fields["og_description"],
        '<meta property="og:description" content="%%OG_DESCRIPTION%%">',
    )
    t = sub_once(
        '<meta property="twitter:title" content="%s">' % ref_fields["twitter_title"],
        '<meta property="twitter:title" content="%%TWITTER_TITLE%%">',
    )
    t = sub_once(
        '<meta property="twitter:description" content="%s">'
        % ref_fields["twitter_description"],
        '<meta property="twitter:description" content="%%TWITTER_DESCRIPTION%%">',
    )
    # page urls -> slug placeholder
    url = "https://nitroide.com/landing/" + ref_fields["slug"]
    assert t.count(url) == 4, t.count(url)  # canonical, og:url, twitter:url, WebApplication url
    t = t.replace(url, "https://nitroide.com/landing/%%SLUG%%.html")
    # blank-line whitespace variants in the shared head (per-page quirks preserved)
    t = sub_once(
        'rel="canonical" href="https://nitroide.com/landing/%%SLUG%%.html">\n\n  <meta property="og:type"',
        'rel="canonical" href="https://nitroide.com/landing/%%SLUG%%.html">\n%%BL_CANON%%\n  <meta property="og:type"',
    )
    t = sub_once(
        'apple-touch-icon.png">\n  \n  <link rel="manifest"',
        'apple-touch-icon.png">\n%%BL_FAVICON%%\n  <link rel="manifest"',
    )
    t = sub_once(
        '  </script>\n\n  <script type="application/ld+json">\n  {\n    "@context": "https://schema.org",\n    "@type": "WebApplication"',
        '  </script>%%BL_LD%%\n  <script type="application/ld+json">\n  {\n    "@context": "https://schema.org",\n    "@type": "WebApplication"',
    )
    # phosphor bold indent (majority variant: 4 spaces)
    t = sub_once(
        '    <link rel="stylesheet" href="/vendor/icons/phosphor/bold/style.css"',
        '%%PB_INDENT%%<link rel="stylesheet" href="/vendor/icons/phosphor/bold/style.css"',
    )
    # extra style slot (reference page has none)
    t = sub_once(
        'media="print" onload="this.media=\'all\'">\n<script type="application/ld+json">',
        'media="print" onload="this.media=\'all\'">\n%%EXTRA_STYLE%%<script type="application/ld+json">',
    )
    # SoftwareApplication offers (expanded variant in reference)
    t = sub_once(
        '''    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },''',
        "    %%OFFERS_SA%%,",
    )
    # WebApplication fields
    t = sub_once(
        '    "name": "%s",' % ref_fields["webapp_name"],
        '    "name": "%%WEBAPP_NAME%%",',
    )
    t = sub_once(
        '    "operatingSystem": "%s",' % ref_fields["webapp_os"],
        '    "operatingSystem": "%%WEBAPP_OS%%",',
    )
    t = sub_once(
        '''    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },''',
        "    %%OFFERS_WA%%,",
    )
    t = sub_once(
        '    "description": "%s"' % ref_fields["webapp_description"],
        '    "description": "%%WEBAPP_DESCRIPTION%%"',
    )
    # FAQ slot (reference page has none)
    t = sub_once("  </script>\n</head>", "  </script>\n%%FAQ_JSONLD%%</head>")
    # body
    t = sub_once("<main>" + ref_fields["body"] + "</main>", "<main>%%BODY%%</main>")
    # footer scripts + tail
    t = sub_once(
        "<nitro-modals></nitro-modals>\n"
        '<script defer src="../script.js"></script>\n'
        "\n</body>\n</html>",
        "<nitro-modals></nitro-modals>\n%%FOOTER_SCRIPTS%%\n\n</body>\n</html>%%TRAILING_NL%%",
    )
    return t


def main():
    files = sorted(glob.glob(os.path.join(LANDING, "*.html")))
    pages = [extract_page(f) for f in files]
    ref = [p for p in pages if p["slug"] == REF_SLUG][0]
    ref_html = open(os.path.join(LANDING, REF_SLUG), encoding="utf-8").read()

    template = make_template(ref_html, ref)

    with open(os.path.join(SRC, "base.html"), "w", encoding="utf-8") as f:
        f.write(template)
    with open(os.path.join(SRC, "pages.json"), "w", encoding="utf-8") as f:
        json.dump(pages, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print("wrote base.html (%d bytes) and pages.json (%d pages)" % (len(template), len(pages)))


if __name__ == "__main__":
    main()
