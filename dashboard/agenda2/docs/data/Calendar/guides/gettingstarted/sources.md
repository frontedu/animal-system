# Importing EcmaScript modules from sources
Please note that this is not possible with the trial, sources are only included in the paid version.
## Include CSS
Include the CSS for the theme you want to use on page:
```html
<link rel="stylesheet" type="text/css" href="path-to-calendar/calendar.[theme].css" data-bryntum-theme>
```
## Import the classes you need
In your application code, import the classes you need from their source file. All source files are located under `lib/`
and they all offer a default export. Please note that if you want to support older browsers you need to transpile and 
bundle your code since ES modules are only supported in modern browsers.
```javascript
import Calendar from '../lib/Calendar/view/Calendar.js';
```

And then use them:
```javascript
const calendar = new Calendar({
    /*...*/
})
```

Almost all included demos use this technique, see for example the <a href="../examples/basic" target="_blank">Basic example</a>.


<p class="last-modified">Last modified on 2022-05-30 6:38:15</p>