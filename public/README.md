# Public

Static assets served directly by the web server.

## Rules

- **Kebab-case file names**: All files must use kebab-case (e.g., `hero-banner.svg`, `og-image.png`). No camelCase or PascalCase.
- **Organize by type**: Group assets into subfolders when the count grows (e.g., `icons/`, `images/`, `fonts/`).
- **Optimize before committing**: Compress images and minify SVGs before adding them. Do not commit raw unoptimized assets.
- **No sensitive data**: Never place API keys, credentials, or internal documents in this folder — everything here is publicly accessible.
- **Use descriptive names**: File names should describe the content, not the usage location (e.g., `arrow-right.svg` not `button-icon.svg`).
- **Prefer SVG for icons**: Use SVG format for icons and logos. Use WebP or optimized PNG/JPG for photographs and complex images.
