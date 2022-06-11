# Loading using EcmaScript module bundle
## Include CSS
Include the CSS for the theme you want to use on page:
```html
<link rel="stylesheet" type="text/css" href="path-to-calendar/calendar.[theme].css" data-bryntum-theme>
```
## Import from the module bundle
In your application code, import the classes you need from the bundle:
```javascript
import {Calendar} from '../build/calendar.module.js';
```

And then use them:
```javascript
const calendar = new Calendar({
    /*...*/
})
```

For a complete example, check out the <a href="../examples/esmodule" target="_blank">EcmaScript module example</a>.


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>