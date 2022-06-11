[//]: # (Links in this document only works when viewed in the documentation browser, surf to ./docs)

# Bryntum Grid

Welcome to the Bryntum Grid, a pure JavaScript grid component which integrates easily with popular frameworks. Click a
logo below to open the integration guide for the framework:

<div class="framework-logos">
<a href="#Grid/guides/integration/react/guide.md"><img src="Core/logo/react.svg" alt="React"><span>React</span></a>
<a href="#Grid/guides/integration/angular/guide.md"><img src="Core/logo/angular.svg" alt="Angular"><span>Angular</span></a>
<a href="#Grid/guides/integration/vue/guide.md"><img src="Core/logo/vue.svg" alt="Vue"><span>Vue</span></a>
<a href="#Grid/guides/integration/ionic.md"><img src="Core/logo/ionic.svg" alt="Ionic"><span>Ionic</span></a>
<a href="#Grid/guides/integration/salesforce/readme.md"><img src="Core/logo/salesforce.svg" alt="Salesforce"><span>Salesforce</span></a>
</div>

This document contains very brief info on the Grid's structure and how to get started. For more information, please
view the guides and API Docs ([open Grid in API docs](#Grid/view/Grid)).

Here you can try out the Grid and some of its main features. For more demos please refer to the example browser.

<div class="external-example" data-file="Grid/guides/readme/replaceimage.js"></div>

## Include on your page

Include the distributed bundles using a script tag or as an ES module. Source maps are included so debugging should be a
breeze :) For info on other use cases please view the guides found under /docs.

## Folder structure

The project has the following folders:

| Folder       | Contents                                                                                     |
|--------------|----------------------------------------------------------------------------------------------|
| `/build`     | Distribution folder, contains js bundles, css themes, locales and fonts. More info below.    |
| `/docs`      | Documentation, open it in a browser (needs to be on a web server) to view guides & API docs. |
| `/examples`  | Demos, open it in a browser (needs to be on a web server)                                    |
| `/lib`       | Source code, can be included in your ES6+ project using `import`.                            |
| `/resources` | SCSS files to build our themes or your own custom theme.                                     |
| `/tests`     | Our complete test suite, including Siesta Lite to allow you to run them in a browser.        |

### Using bundles

The bundles are located in `/build`. Bundle files are:

| File                 | Contents                                                            |
|----------------------|---------------------------------------------------------------------|
| `package.json`       | Importable npm package                                              |
| `grid.lite.umd.js`   | UMD-format bundle without transpilation and WebComponents included  |
| `grid.module.js`     | ES module bundle for usage with modern browsers or in build process |
| `grid.lwc.module.js` | ES module bundle for usage with Lightning Web Components            |
| `grid.umd.js`        | Transpiled (babel -> ES5) bundle in UMD-format                      |

All bundles are also available in minified versions, denoted with a `.min.js` file extension.
Typings for TypeScripts can be found in files with a `.d.ts` file extension.

Example inclusion of UMD bundle:

```html
<script type="text/javascript" src="build/grid.umd.js"></script>
```

### Using themes

The themes are located in `/build`. Theme files are:

| File                     | Contents            |
|--------------------------|---------------------|
| `grid.classic-dark.css`  | Classic-Dark theme  |
| `grid.classic.css`       | Classic theme       |
| `grid.classic-light.css` | Classic-Light theme |
| `grid.material.css`      | Material theme      |
| `grid.stockholm.css`     | Stockholm theme     |

Each theme also exists in a `thin` version that only contains product specific styling (Grids full themes include
Grid styling + all core styling such as buttons etc). For example `grid.stockholm.thin.css`. These are intended for
when you include multiple Bryntum products on the same page, to avoid loading shared styling multiple times.

All themes are also available in minified versions, denoted with a `.min.css` file extension.

Example inclusion of Classic-Light theme:

```html
<link rel="stylesheet" href="build/grid.classic-light.css" data-bryntum-theme>
```

### Basic usage

How to create a simple grid with two columns and a couple of rows of data (using umd bundle):

```javascript
const grid = new bryntum.grid.Grid({
    height: 400,
    columns: [
        { field: 'name', text: 'Name', width: 200 },
        { field: 'city', text: 'City', flex: 1 }
    ],

    data: [
        { name: 'Dan Stevenson', city: 'Los Angeles' },
        { name: 'Talisha Babin', city: 'Paris' }
    ]
});
```

<div class="external-example" data-file="Grid/guides/readme/basic.js"></div>

## Some good to know details

### Code and technologies

* The grid is written in ECMAScript 2020 using modules. The modules are built into bundles (as mentioned above) using
  WebPack + Babel. These bundles work in all supported browsers (Chrome, Firefox, Safari and modern Edge).
* The grid is internally styled using SASS. During the build it generates CSS themes from the SASS files. In most cases
  you include one of the themes in your app. For more details on styling, see the guides under guides/styling.

### Grids structure

* A grid can consist of multiple subgrids, each with its own horizontal scroller. All subgrids share a vertical
  scroller.
* For performance reasons grid row elements are reused when scrolling, meaning that you should not manipulate row and
  cell dom elements directly (do it from renderers instead).

### External dependencies

The Grid has no external dependencies.

See licenses for our current dependencies in the licenses.md file

## Copyright and license

Copyright © 2009 - {{YEAR}}, Bryntum

All rights reserved.

[License](https://www.bryntum.com/products/grid/license/)


<p class="last-modified">Last modified on 2022-05-30 6:39:04</p>