[//]: # (Links in this document only works when viewed in the documentation browser, surf to ./docs)

# Bryntum Calendar

Welcome to the Bryntum Calendar, a pure JavaScript calendar component which integrates easily with popular frameworks.
Click a logo below to open the integration guide for the framework:

<div class="framework-logos">
<a href="#Calendar/guides/integration/react/guide.md"><img src="Core/logo/react.svg" alt="React"><span>React</span></a>
<a href="#Calendar/guides/integration/angular/guide.md"><img src="Core/logo/angular.svg" alt="Angular"><span>Angular</span></a>
<a href="#Calendar/guides/integration/vue/guide.md"><img src="Core/logo/vue.svg" alt="Vue"><span>Vue</span></a>
<a href="#Calendar/guides/integration/ionic.md"><img src="Core/logo/ionic.svg" alt="Ionic"><span>Ionic</span></a>
<a href="#Calendar/guides/integration/salesforce/readme.md"><img src="Core/logo/salesforce.svg" alt="Salesforce"><span>Salesforce</span></a>
</div>

This document contains very brief info on the Calendar's structure and how to get started. For more information, please
view the guides and API Docs ([open Calendar in API docs](#Calendar/view/Calendar)).

## Live demo

Here you can try out the Calendar and some of its main features. For more demos please refer to the example browser.

<div class="external-example" data-file="Calendar/guides/readme/replaceimage.js"></div>

## Framework agnostic

The Bryntum Calendar does not require any framework but works perfectly with popular frameworks such as React, Angular,
Vue, Ionic and Ext JS. It also ships with frameworks demos which can be found in the `examples/frameworks` folder.

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

| File                     | Contents                                                            |
|--------------------------|---------------------------------------------------------------------|
| `package.json`           | Importable npm package                                              |
| `calendar.lite.umd.js`   | UMD-format bundle without transpilation and WebComponents included  |
| `calendar.module.js`     | ES module bundle for usage with modern browsers or in build process |
| `calendar.lwc.module.js` | ES module bundle for usage with Lightning Web Components            |
| `calendar.umd.js`        | Transpiled (babel -> ES5) bundle in UMD-format                      |

All bundles are also available in minified versions, denoted with a `.min.js` file extension.
Typings for TypeScripts can be found in files with a `.d.ts` file extension.

Example inclusion of UMD bundle:

```html
<script type="text/javascript" src="build/calendar.umd.js"></script>
```

### Using themes

The themes are located in `/build`. Theme files are:

| File                         | Contents            |
|------------------------------|---------------------|
| `calendar.classic-dark.css`  | Classic-Dark theme  |
| `calendar.classic.css`       | Classic theme       |
| `calendar.classic-light.css` | Classic-Light theme |
| `calendar.material.css`      | Material theme      |
| `calendar.stockholm.css`     | Stockholm theme     |

Each theme also exists in a `thin` version that only contains product specific styling (Calendars full themes include
Calendar + Scheduler + Grid + all core styling such as buttons etc). For example `calendar.stockholm.thin.css`. These
are intended for when you include multiple Bryntum products on the same page, to avoid loading shared styling multiple
times.

All themes are also available in minified versions, denoted with a `.min.css` file extension.

Example inclusion of Material theme:

```html
<link rel="stylesheet" href="build/calendar.material.css" data-bryntum-theme>
```

## Some good to know details

### Code and technologies

* The calendar is written in ES 2020 using ECMAScript modules. The modules are built into a bundle (as mentioned above)
  using WebPack + Babel. These bundles work in all supported browsers (Chrome, Firefox, Safari, and Edge 79+).
* The calendar is internally styled using SASS. During the build it generates CSS themes from the SASS files. In most
  cases you include one of the themes in your app. For more details on styling, see the guides under guides/styling.

### Calendar class structure

* The calendar is based on the Bryntum infrastructure Widget class and inherits the way of creating and configuring from
  this well documented, robust base.
* For performance reasons scheduled event elements are reused when moving a view through time, meaning that you should
  never manipulate such DOM elements directly (do it from eventRenderers etc. instead).

### External dependencies

Bryntum Calendar has very few external dependencies, you can see our current dependencies in the licenses.md file

## Copyright and license

Copyright © 2009 - {{YEAR}}, Bryntum

All rights reserved.

[License](https://www.bryntum.com/products/calendar/license/)


<p class="last-modified">Last modified on 2022-05-30 6:39:04</p>