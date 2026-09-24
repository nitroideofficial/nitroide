#!/usr/bin/env python3
"""Render all landing pages from landing/_src/base.html + landing/_src/pages.json.

Usage:
    python3 landing/_src/build.py        # regenerate landing/*.html

Pure stdlib, no dependencies. After running, `git diff --stat landing/`
should show no changes unless page data was edited.
"""
import json
import os
import sys

SRC = os.path.dirname(os.path.abspath(__file__))
LANDING = os.path.dirname(SRC)

OFFERS_SA_EXPANDED = (
    '"offers": {\n'
    '      "@type": "Offer",\n'
    '      "price": "0",\n'
    '      "priceCurrency": "USD"\n'
    "    }"
)
OFFERS_SA_COMPACT = '"offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }'
OFFERS_WA_EXPANDED = (
    '"offers": {\n'
    '      "@type": "Offer",\n'
    '      "price": "0.00",\n'
    '      "priceCurrency": "USD"\n'
    "    }"
)
OFFERS_WA_COMPACT = (
    '"offers": { "@type": "Offer", "price": "0.00", "priceCurrency": "USD" }'
)
FOOTER_STANDARD = '<script defer src="../script.js"></script>'


def render(page, template):
    slug = page["slug"]
    if slug.endswith(".html"):
        slug = slug[: -len(".html")]
    rep = {
        "%%HTML_TAG%%": "" if page.get("no_html_tag") else '<html lang="en">\n',
        "%%HEAD_BL%%": "\n\n\n" if page.get("compact_head") else "  \n  \n\n",
        "%%PB_INDENT%%": "  " if page.get("compact_head") else "    ",
        "%%TITLE%%": page["title"],
        "%%META_TITLE%%": page["meta_title"],
        "%%DESCRIPTION%%": page["description"],
        "%%KEYWORDS%%": page["keywords"],
        "%%OG_TITLE%%": page["og_title"],
        "%%OG_DESCRIPTION%%": page["og_description"],
        "%%TWITTER_TITLE%%": page["twitter_title"],
        "%%TWITTER_DESCRIPTION%%": page["twitter_description"],
        "%%SLUG%%": slug,
        "%%BL_CANON%%": "  " if page.get("robots_ws") else "",
        "%%BL_FAVICON%%": "" if page.get("compact_head") else "  ",
        "%%BL_LD%%": "" if page.get("compact_head") else "\n",
        "%%EXTRA_STYLE%%": (page["extra_style"] + "\n") if page.get("extra_style") else "",
        "%%OFFERS_SA%%": OFFERS_SA_COMPACT if page.get("compact_offers") else OFFERS_SA_EXPANDED,
        "%%WEBAPP_NAME%%": page["webapp_name"],
        "%%WEBAPP_OS%%": page["webapp_os"],
        "%%OFFERS_WA%%": OFFERS_WA_COMPACT if page.get("compact_offers") else OFFERS_WA_EXPANDED,
        "%%WEBAPP_DESCRIPTION%%": page["webapp_description"],
        "%%FAQ_JSONLD%%": ("\n  " + page["faq_jsonld"] + "\n") if page.get("faq_jsonld") else "",
        "%%BODY%%": page["body"],
        "%%FOOTER_SCRIPTS%%": page.get("footer_scripts") or FOOTER_STANDARD,
        "%%TRAILING_NL%%": "\n" if page.get("trailing_newline") else "",
    }
    out = template
    for key, val in rep.items():
        if key not in out:
            sys.exit("template is missing placeholder %s" % key)
        out = out.replace(key, val)
    if "%%" in out:
        sys.exit("unreplaced placeholder remains in rendered page " + slug)
    return out


def main():
    with open(os.path.join(SRC, "base.html"), encoding="utf-8") as f:
        template = f.read()
    with open(os.path.join(SRC, "pages.json"), encoding="utf-8") as f:
        pages = json.load(f)
    for page in pages:
        out = render(page, template)
        dest = os.path.join(LANDING, page["slug"])
        with open(dest, "w", encoding="utf-8", newline="") as f:
            f.write(out)
        print("wrote", dest)


if __name__ == "__main__":
    main()
