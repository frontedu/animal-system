# Loading using EcmaScript module bundle

## Include CSS

Include the CSS for the theme you want to use on page:

```html
<link rel="stylesheet" href="path-to-grid/grid.[theme].css" data-bryntum-theme>
```

## Import from the module bundle

In your application code, import the classes you need from the bundle:

```javascript
import {Grid,Store} from '../build/grid.module.js';
```

And then use them:
```javascript
const store = new Store({
    data : [/*...*/]
});

const grid = new Grid({
    store,

    columns : [/*...*/]
})
```

For a complete example, check out the <a href="../examples/esmodule" target="_blank">EcmaScript module example</a>.


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>