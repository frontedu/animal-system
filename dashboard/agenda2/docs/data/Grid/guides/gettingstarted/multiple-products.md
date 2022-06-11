# Combining multiple Bryntum products

Bryntum's products share the same data model and can be combined to provide different views of the underlying data. When 
using multiple Bryntum products on the same page you want to import them in a way that avoids downloading the shared code 
and styling more than once. Read on to find out how. 

<div class="tldr">
When combining multiple Bryntum products on a single page, we recommend using thin bundles for both JavaScript and CSS to
reduce the amount of code and CSS that has to be downloaded.
</div>

## Picking which bundles to use

Each product ships with a few different JavaScript and CSS bundles that are useful in different scenarios. 

### JavaScript bundles

Using the bundles of Scheduler here as an example of available bundles:

| Bundle                   | Size (minified) | Purpose                                                              |
|--------------------------|-----------------|----------------------------------------------------------------------|
| scheduler.module.js      | 1.5 MB          | ES modules bundle containing everything needed to use Scheduler      |
| scheduler.module.thin.js | 0.4 MB          | ES modules bundle containing only Scheduler specific code            |
| scheduler.umd.js         | 1.5 MB          | Legacy bundle for older apps that does not use a modern build system |

#### Module bundle

When having a single product on the page, using the full `scheduler.module.js` bundle is easiest and the recommended way. 
It has all the code needed to run Scheduler (namely all code from Core and Grid in addition to Scheduler). It allows you 
to import all  classes you might need from a single source, which is convenient. For example:

```javascript
// Import 3 classes in one go
// * Store from Core
// * GridRowModel from Grid
// * Scheduler from Scheduler :)
import { Store, GridRowModel, Scheduler } from 'scheduler.module.js';
```

#### Thin module bundle

To simplify combining products we offer thin bundles, `scheduler.module.thin.js` in the table above. Each thin bundle 
contains the code for one specific product, which means that it has a much smaller size, but you have to use multiple 
bundles to get anything working (Grid for example has to pull in the Core bundle to work). The example shown above would
with thin bundles be slightly more complicated with thin bundles, but it assures that the code is only downloaded once:

```javascript
// Import 3 classes separately from different thin bundles
import { Store } from 'core.module.thin.js';
import { GridRowModel } from 'grid.module.thin.js';
import { Scheduler } from 'scheduler.module.thin.js';
```

#### UMD bundle

The umd bundle (`scheduler.umd.js` importable as a good old script tag, exposes all classes globally) is to be 
considered legacy. Using it is not something we recommend unless your environment prevents you from using a more modern 
bundle. It will not allow you to combine multiple products very well. Below you find a snippet here for completeness:

```html
<!-- Script tag in your html file -->
<script src="scheduler.umd.js"></script>
```

```javascript
// No imports needed, classes are exposed to window.bryntum.scheduler
const { Store, GridRowModel, Scheduler } = window.bryntum.scheduler;
```

### CSS bundles

For each theme there are two CSS bundles to pick from, a full bundle and a thin bundle. Using material theme of 
Scheduler here as an example:

| Bundle                      | Size   | Purpose                      |
|-----------------------------|--------|------------------------------|
| scheduler.material.css      | 662 KB | All CSS needed for Scheduler |
| scheduler.material.thin.css | 364 KB | Only Scheduler specific CSS  |

As with the JavaScript bundles, we recommend using the full bundle for apps that only use a single product. For apps
using multiple Bryntum products we recommend using thin bundles. A comparison of the two approaches for a single 
product, full bundle:

```html
<!-- Using the full bundle -->
<link rel="stylesheet" href="scheduler.material.css">
```

Using thin bundles requires that you include all products that the current product builds upon:

```html
<!-- Using thin bundles -->
<link rel="stylesheet" href="core.material.thin.css">
<link rel="stylesheet" href="grid.material.thin.css">
<link rel="stylesheet" href="scheduler.material.thin.css">
```

As with JavaScript, using thin bundles is slightly more complicated, but it guarantees the CSS for each product is only
included once.

## Combining multiple products using thin bundles

When combining multiple products, using the full bundle for each product will result in a lot of code being included / 
downloaded twice. For JavaScript there is also a programmatic risk involved since the same class in for example Grid's 
bundle and Scheduler's bundle will not actually be the same, but rather two identical copies. Which will more likely than 
not lead to hard to find bugs. Because of this we strongly recommend thin bundles when combining multiple products.

### JavaScript

You import classes from the thin bundles the same way you would from any other ES modules bundle. The thin bundles
import what they need from the other thin bundles. So for example to create a new Scheduler instance you would do
something like this:

```javascript
import { Scheduler } from 'scheduler.module.thin.js';

const myScheduler = new Scheduler({
    // configs go here
});
```

Under the hood, the above will pull in the thin bundles of Grid and Core, since the Scheduler is built on those products. It gets
slightly more complicated when you want to import classes from other products, since you then have to import from
that corresponding thin bundle directly:

```javascript
import { Scheduler } from 'scheduler.modules.thin.js';
import { Store } from 'core.modules.thin.js';

const myStore = new Store({
    // configs go here
});

const myScheduler = new Scheduler({
    // configs go here
});
```

If not obvious you can always check docs to determine which thin bundle to include from. Take the docs for 
[Store](#Core/data/Store) for example, it shows the full Bryntum path for store as `Core.data.Store`. The first 
part tells you which thin bundle = `core`.

To include for example both Grid & TaskBoard on the same page:

```javascript
import { Grid } from 'grid.module.thin.js';
import { TaskBoard } from 'taskboard.module.thin.js';

const grid = new Grid({
    // configs go here
});

const taskBoard = new TaskBoard({
    // configs go here
});
```
<div class="note">
It is also possible to build custom bundles / make custom app builds with only what you need using the build tools of 
your choosing, but that is not covered here.
</div>

### CSS

As described under "Picking which bundles to use" you have to include the thin CSS bundle for each product in the stack
in your app. For example to combine Grid & TaskBoard using the Material theme:

```html
<link rel="stylesheet" href="core.material.thin.css">
<link rel="stylesheet" href="grid.material.thin.css">
<link rel="stylesheet" href="taskboard.material.thin.css">
```

Both products use styling from Core, so when using full bundles it would be downloaded twice but with thin bundles it is
only downloaded once.

## The product hierarchy

When using thin bundles it is important to know which product builds upon which, to know what to include. This table
summarizes it:

| Product       | Builds on                            |
|---------------|--------------------------------------|
| Core          | None                                 |
| Grid          | Core                                 |
| Scheduler     | Core, Grid                           |
| Scheduler Pro | Core, Grid, Scheduler                |
| Gantt         | Core, Grid, Scheduler, Scheduler Pro |
| Calendar      | Core, Grid, Scheduler                |
| TaskBoard     | Core                                 |

To combine Gantt & Calendar, you would thus have to include the following thin CSS bundles:

```html
<link rel="stylesheet" href="core.material.thin.css">
<link rel="stylesheet" href="grid.material.thin.css">
<link rel="stylesheet" href="scheduler.material.thin.css">
<link rel="stylesheet" href="schedulerpro.material.thin.css">
<link rel="stylesheet" href="gantt.material.thin.css">
<link rel="stylesheet" href="calendar.material.thin.css">
```

The JavaScript imports are not that complicated, since those thin bundles automatically import what they need from the 
others:

```javascript
import { Gantt } from 'gantt.module.thin.js';
import { Calendar } from 'calendar.module.thin.js';
```


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>