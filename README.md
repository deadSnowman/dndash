# DnDash
A DnD dashboard app written with AngularJS

Contains cards for
- Loot splitting
- Currency conversion
- Die rolling

![Split Loot](/images/dndash-0.png?raw=true "DnDash")

## Running the existing AngularJS app

The original AngularJS app still lives at the repository root and can be run as
a static site.

Option 1: open `index.html` directly in a browser.

Option 2: serve the repository root with any static file server, for example:

```sh
npx http-server .
```

Then open the URL printed by the server and use the existing hash routes:

```text
#!/home
#!/about
```

## Running the new React app

The React migration target lives in `react-app/` and uses Vite.

```sh
cd react-app
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
