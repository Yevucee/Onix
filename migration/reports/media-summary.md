# Media Summary

**Source:** Attachment metadata in WordPress XML export  
**Local files supplied:** None

---

## Overview

| Metric | Value |
|--------|-------|
| Total attachment records | 563 |
| Referenced in post/page content | 106 (confirmed) |
| Files available locally | **0** |
| Production base URL | `https://onixdatacentres.com/wp-content/uploads/` |

---

## File type breakdown

| Extension | Count | Notes |
|-----------|-------|-------|
| JPG | 250 | Photos, heroes, team images |
| PNG | 183 | Logos, graphics, UI elements |
| JPEG | 108 | Photos (alternate extension) |
| WebP | 9 | Modern format images |
| PDF | 8 | Brochures, legal documents, policies |
| SVG | 4 | Logos/icons |
| ZIP | 1 | Unknown archive — investigate |

---

## Purpose classification (heuristic from filenames)

| Purpose | Count |
|---------|-------|
| General images | 516 |
| Team / leadership photos | 17 |
| Logos | 16 |
| Documents / brochures | 8 |
| Hero / banner images | 5 |

---

## PDF documents (downloadable files)

| Path | Likely purpose |
|------|----------------|
| `2025/12/Onix-Brochure-2025K.pdf` | Marketing brochure |
| `2025/04/Onix-Data-Centre-Brochure-2025-.pdf` | Marketing brochure |
| `2025/05/IMS-SIMPLIFIED-12-May-2025.pdf` | IMS documentation |
| `2023/11/IMS-Simplified.pdf` | IMS documentation |
| `2023/05/ONIXDC-ISMS-A1801-Legal-Responsibilities-Policy.pdf` | Legal/policy |
| `2023/05/Cybersecurity-Act-2020-Act-1038.pdf` | Legal reference |
| `2023/05/data-protection-act-2012-act-843.pdf` | Legal reference |
| `2023/05/The-Regulation-of-Investigatory-Powers-Act-2000.pdf` | Legal reference |

**Migration note:** PDFs require download tracking in new analytics system.

---

## Key brand assets (from live site crawl)

| Asset | URL pattern |
|-------|-------------|
| Primary logo | `/wp-content/uploads/2021/10/ONIX-logo-png-*.png` |
| White logo variant | `/wp-content/uploads/2022/11/Onix_white_logo.png` |
| Homepage collage | `/wp-content/uploads/2024/04/Images-collage-3.png` |

---

## Videos

No video files in uploads inventory. Video content is **embedded** (YouTube/Vimeo) in 18 post/page items — streams hosted externally.

---

## Duplicate files

Filename-based duplicate detection flagged items where the same filename appears multiple times (often WordPress size variants or Polylang duplicates). See `duplicate_of` column in `media-inventory.csv`.

WordPress typically generates multiple sizes per upload (`-300x196`, `-1024x670`, etc.) — not true duplicates.

---

## Unusually large files

Dimensions and file sizes **not available** without downloading from production. Recommend:

1. Bulk download all 563 files
2. Run size/dimension analysis
3. Flag files > 500KB for optimisation review

---

## Migration gaps and risks

| Issue | Severity | Action |
|-------|----------|--------|
| No local media archive | **Blocker** | Download from production before migration |
| 457 attachments not confirmed in content | Low | May be unused — audit after download |
| External hotlink dependency during dev | Medium | Mirror to staging media storage |
| PDF versioning (multiple brochure years) | Low | Keep all versions; mark latest in CMS |
| Missing alt text | Medium | Extract from attachment postmeta in DB |

---

## Recommended download strategy

1. Parse all attachment URLs from XML + content body references
2. Deduplicate to unique file paths (exclude size variants if desired)
3. Download with rate limiting from production (read-only)
4. Store in `migration/source/media/` or directly in Payload media storage
5. Verify 563/563 downloaded successfully
6. Update `media-inventory.csv` with dimensions and file sizes

Full per-file inventory: `migration/reports/media-inventory.csv`
