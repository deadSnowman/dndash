# DnDash React App

This is the new React migration target for DnDash. It is intentionally isolated
from the existing AngularJS app in the repository root.

## Run the React app

```sh
cd react-app
npm install
npm run dev
```

Vite will print a local URL, usually:

```text
http://localhost:5173/
```

The React app currently uses hash routes:

```text
http://localhost:5173/#/home
http://localhost:5173/#/about
```

## Build the React app

```sh
cd react-app
npm run build
```

The production build is written to `react-app/dist`.
