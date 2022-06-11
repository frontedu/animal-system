# Loading using `<script>`

## Include script and CSS

To include Bryntum Grid on your page using a plain old script tag, just include a tag like the following before
including any script that uses the grid:

```html

<script type="text/javascript" src="path-to-grid/grid.umd.js"></script>
```

Also include the CSS for the theme you want to use:

```html
<link rel="stylesheet" href="path-to-grid/grid.[theme].css" data-bryntum-theme>
```

## Use it in your code

From your scripts you can access our classes in the global bryntum namespace:

```javascript
var grid = new bryntum.grid.Grid();
```

For a complete example, check out the <a href="../examples/scripttag" target="_blank">scripttag example</a>.


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>