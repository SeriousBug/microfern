# ![Microfern - Minimal JavaScript & TypeScript string templating engine that runs anywhere](/site/static/img/splash.png)

[![NPM Version](https://img.shields.io/npm/v/microfern?color=blue)](https://www.npmjs.com/package/microfern)
[![documentation microfern.bgenc.net](https://img.shields.io/badge/Docs-microfern.bgenc.net-blue?logo=docusaurus)](https://microfern.bgenc.net)
[![GitHub License](https://img.shields.io/github/license/seriousbug/microfern)](https://github.com/SeriousBug/microfern/blob/main/LICENSE.txt)
[![Codecov](https://img.shields.io/codecov/c/github/seriousbug/microfern)](https://app.codecov.io/gh/SeriousBug/microfern)

Microfern is a minimal string templating engine for JavaScript & TypeScript that works
in [Node.js](https://nodejs.org/en), browsers ([Firefox](https://www.mozilla.org/en-US/firefox/new/),
[Chrome](https://www.google.com/chrome/), [Safari](https://www.apple.com/safari/)), Edge functions such as [Cloudflare Workers](https://workers.cloudflare.com) or [Vercel Edge Functions](https://vercel.com/blog/edge-functions-generally-available), and [Bun](https://bun.sh). There are no files, no template
inheritance, no recursion or complex operations. The template language is
inspired by [Nunjucks](https://github.com/mozilla/nunjucks), and should be easy
for anyone to write.

Microfern has no dependencies. The core export fits within 1kb minzipped, and
the total including everything is under 2kb minzipped.
