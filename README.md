# template-web-app-swc

This repo provides a starting point for creating web applications using Adobe-themed components. The code is written in [TypeScript](https://www.typescriptlang.org/), and relies on [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) for the user interface and [MobX](https://mobx.js.org/README.html) for state management.

To create a new application based on the code found here, click the green "Use this template" button. Once you have created a new repo and cloned the code locally on your machine, you'll need to change settings that include "template-web-app-swc" in the `package.json` and `vite.config.ts` files. And of course, you should update this README file!

# Development

## One-time setup

Make sure you have the prerequisites:

- [yarn](https://yarnpkg.com/) (version 1.22.18 or greater)
- [node.js](https://nodejs.org/) (version 16 or greater)

Install the node packages that this app depends on:

```sh
yarn install
```

## Running the app locally

Run the app in development mode and display it in your default browser:

```sh
yarn dev
```

The app is recompiled and the page is reloaded whenever you make edits to the source code.

## Building locally

Compile the app into the `dist` folder:

```sh
yarn build
```

## Deploying to github pages

Compile the app and deploy it using `gh-pages` to the github pages location specified in the `vite.config.ts` file:

```sh
yarn deploy
```

# Learn more

#### Language

- [TypeScript](https://www.typescriptlang.org/) - a strongly-typed superset of JavaScript.

#### User interface

- [Spectrum Web Components](https://opensource.adobe.com/spectrum-web-components/) - Adobe's themed user interface components.
- [Lit](https://lit.dev/) - Makes it easier to build web components.
- [Web Components](https://www.webcomponents.org/) - Browser technology that lets you create custom HTML elements.

#### State management

- [MobX](https://mobx.js.org/) - functional, reactive state management.

#### Similar apps within Adobe Research

- [Fusion web prototype](https://git.corp.adobe.com/fusion/fusion-web)
