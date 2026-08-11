# Vendored: GSAP 3.12.5

`gsap.min.js` and `ScrollTrigger.min.js`, pulled from the official `gsap` npm package
(https://www.npmjs.com/package/gsap) rather than a third-party CDN, so the site has
no external runtime dependency and the version is pinned deterministically.

GSAP (core + all bundled plugins, including ScrollTrigger) is free to use under
GreenSock's Standard License — see https://gsap.com/community/standard-license/.

To upgrade: `npm pack gsap@<version>`, then copy `dist/gsap.min.js` and
`dist/ScrollTrigger.min.js` from the extracted tarball into this folder.
