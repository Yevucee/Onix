# Uploads archive validation

**Date:** 2026-08-07

## Archive

- **Path:** `migration/source/media/uploads.zip`
- **Size (working tree):** 1.51 GB
- **Git LFS pointer in working tree:** no
- **ZIP integrity test:** passed

## ZIP structure (top level)

Expected root: `uploads/` with WordPress year/month directories.

Top-level entries under `uploads/`:

- .htaccess
- 2019
- 2020
- 2021
- 2022
- 2023
- 2024
- 2025
- 2026
- astra
- astra-addon
- cfdb7_uploads
- complianz
- elementor
- essential-addons-elementor
- forminator
- revslider
- sucuri
- theplus-addons
- wpcf7_uploads
- wpr-addons

## Extraction

Extraction directory not found. Run extraction to `.migration-work/uploads/`.

## Notes

- Source ZIP must not be modified.
- Extracted tree is gitignored via `.migration-work/`.
- `__MACOSX` metadata may be present in ZIP; excluded from extraction where possible.