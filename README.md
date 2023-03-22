
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
[Preview Site >>](https://www.campaign.hogarthww.digital/ctus-nationwide/ctus-nationwide-h262982/preview/categories/html/index.html)

[JIRA >>](https://hogarthdigital.atlassian.net/browse/CTUS-658)

---
### Dev Overview
- All typography is a Google webfont. All images are inlined SVG.
- Message 2 & 3 quizes with strikethoughs have duplicate ordered lists. The 1st list shows the initial answers. The 2nd list has the wrong answers with the strikethroughs as psuedo elements and stacks directly on top of the 1st list. I did this because psuedo elements cannot be animated because they are not part of the DOM apparently. Using lists ensure the text will always maintain correct spacing no matter how the browser renders the font.
- The highlighted answers use a custom left margin property to accommodate their.
- Message 2 + 3 share the same animation & CSS templates, but have a couple custom properties injected from the config.
- The positions of the end frame copy on most units are intentionally unique per creative direction.

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
`build1` | Compiles template & partials for all HTML/CSS/JS for Message 1 banners.
`build2` | Compiles template & partials for all HTML/CSS/JS for Message 2 banners.
`build3` | Compiles template & partials for all HTML/CSS/JS for Message 3 banners.
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