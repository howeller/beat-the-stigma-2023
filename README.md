
# Beat The Stigma Banners 2023

### Table of Contents
- [Beat The Stigma Banners 2023](#beat-the-stigma-banners-2023)
    - [Table of Contents](#table-of-contents)
    - [Project Links](#project-links)
    - [Dev Overview](#dev-overview)
    - [HTML Build Notes](#html-build-notes)
    - [Gulp Tasks](#gulp-tasks)
    - [ADA Compliance](#ada-compliance)

### Project Links
[Preview Site >>](https://www.campaign.hogarthww.digital/ctus-nationwide/nationwide-h262982/preview/categories/english/index.html)

[JIRA >>](https://hogarthdigital.atlassian.net/browse/CTUS-658)

---
### Dev Overview
- All typography is a Google webfont. All images are inlined SVG.
- All banners passed an ADA QA review. Some concepts require spans with descriptive text of the photos to be mixed in with the copy. This reads better than using alt txt in the layout.

---
### HTML Build Notes
- The HTML banners use [Gulp](https://gulpjs.com/docs/en/getting-started/quick-start/) tasks to automate the workflow (compiling HTML, zipping, contentData.js creation).
- To install the packages needed to run the Gulp tasks open the command line and run `npm install`. That will download `node_modules` (not included in this repo).

``` cli
cd existing_folder
npm install
```
- All banners are built from a main handlebars HTML template. The css, js & svg and inserted as modules (handlebars partials). These modules are compiled via [gulp-compile-handlebars](https://www.npmjs.com/package/gulp-compile-handlebars)
- All content (Copy + data) live in `src/config.json`. This is where the banner copy and structure for the preview site lives.

---
### Gulp Tasks

Task Name    | What it Does
-------------|-----------
`backups` | Copies and compresses all backup PNGs.
`b1` | Compiles template & partials for all HTML/CSS/JS for Message 1 banners.
`b2` | Compiles template & partials for all HTML/CSS/JS for Message 2 banners.
`b3` | Compiles template & partials for all HTML/CSS/JS for Message 3 banners.
`build` | Runs `b1` `b2` & `b3` in a series.
`all` | Runs `clean:html`, `b1` `b2` & `b3` in a series.
`clean` | Deletes all files inside `build/html/` & `build/zips/`.
`clean:html` | Deletes everything inside `build/html/`.
`clean:zips` | Deletes everything inside  `build/zips/`.
`watch` | Automatically runs the default task if any files in `src/` change.
`zip` | Zips all deliverable baner files (excluding backups). Sets HTML name back to banner name.

---
### ADA Compliance
- HTML banners are built to be ADA compliant. The CSS class `.sr-only` hides extra content intended to only be read aloud. Enables the quiz answer to be available for the non sighted users.
- Semantic markup is used as much as possible.