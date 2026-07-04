# DnDash
A DnD dashboard app built with React and Vite.

Contains cards for
- Loot splitting
- Currency conversion
- Die rolling

## Development

```sh
npm install
npm run dev
```

Vite will print a local URL, usually:

```text
http://localhost:5173/
```

React routes are hash-based for now:

```text
http://localhost:5173/#/home
http://localhost:5173/#/about
```

## GitHub Pages

The app uses hash routes and Vite is configured with relative asset paths, so it
can be served from a GitHub Pages project subpath.

To create a static build for GitHub Pages configured to serve from `/docs`:

```sh
npm run build:pages
```

Then commit the generated `docs/` directory and set GitHub Pages to deploy from
the `docs` folder on the publishing branch.
