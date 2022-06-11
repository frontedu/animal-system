# Styling
The grid is styled using SASS. It ships with both compiled CSS bundles and the original scss files. You can also affect
the appearance of cells and headers using renderers.

**Note:** Trial version has no SASS and Themes. You need full version to be able to follow the instructions below.

## Using a theme

The grid ships with four themes, classic, classic-light, classic-dark and material. Each theme is compiled into a self 
containing bundle under build/. Simply include it on page to use it:

```html
<link rel="stylesheet" href="build/grid.classic.css" data-bryntum-theme>
<link rel="stylesheet" href="build/grid.classic-light.css" data-bryntum-theme>
<link rel="stylesheet" href="build/grid.classic-dark.css" data-bryntum-theme>
<link rel="stylesheet" href="build/grid.material.css" data-bryntum-theme>
```

<div class="note">
The <code>data-bryntum-theme</code> attribute on the link tag is not strictly required, but it allows you to 
programmatically switch the theme at runtime using <code>DomHelper.setTheme()</code>.
</div>

### Comparison of themes:

![Classic theme](Grid/themes/thumb.classic.png "Default theme")
![Classic-Light theme](Grid/themes/thumb.classic-light.png "Light theme")
![Classic-Dark theme](Grid/themes/thumb.classic-dark.png "Dark theme")
![Material theme](Grid/themes/thumb.material.png "Material theme")
![Stockholm theme](Grid/themes/thumb.stockholm.png "Stockholm theme")

In most of the included examples you can switch theme on the fly by clicking on the info icon found in the header and
then picking a theme in the dropdown.

### Combining products

The "normal" themes described above includes all the CSS you need to use Grid and its helper widgets such as Popups,
TextFields and so on. When combining multiple different Bryntum products on a single page using "normal" themes, the
shared styling will be included multiple times.

To avoid this, each theme is available in a version that only has the product specific styling. These are called `thin`
themes (named `[product][theme].thin.css` -> `grid.stockholm.thin.css`). When using them you will need to include one
for each used level in the Bryntum product hierarchy (Grid -> `Core + Grid`, Scheduler -> `Core + Grid + Scheduler` and
so on).

For example to combine Grid and Scheduler using the Stockholm theme, you would include:

`core.stockholm.thin.css` + `grid.stockholm.thin.css` + `scheduler.stockholm.thin.scss`

Which in your html file might look something like this:

```html
<link rel="stylesheet" href="core.stockholm.thin.css" data-bryntum-theme>
<link rel="stylesheet" href="grid.stockholm.thin.css" data-bryntum-theme>
<link rel="stylesheet" href="scheduler.stockholm.thin.css" data-bryntum-theme>
```

<div class="note">
Nothing prevents you from always using thin CSS bundles, but please note that there might be a slight network overhead 
from pulling in multiple CSS files as opposed to a single one with the normal themes.
</div>

## Creating a theme

To create your own theme, follow these steps:

1. Make a copy of and existing theme found under resources/sass/themes, for example light.scss
2. Edit the variables in it to suit your needs (you can find all available variables by looking in resources/sass/variables.scss)
3. Compile it to CSS and bundle it using your favorite SASS compiler/bundler
4. Include your theme on page (and remove any default theme you where using)

Please see <a href="../examples/theme" target="_blank">Theme example</a> for a custom theme in action:

![Custom theme](Grid/themes/thumb.custom.png "Custom theme")

## Using renderers and CSS

Contents of both cells and header can be customized using renderers. Renderers are functions with access to a cell/headers
data and elements. They can manipulate the element directly or return a value to have it displayed.

For more information, see the demo below or check API docs for Column.

<div class="external-example" data-file="Grid/guides/styling/renderers.js"></div>

```javascript
const grid = new Grid({
    columns : [
        {
            text     : 'Name',
            field    : 'firstName',
            flex     : 1,
            renderer : ({ value }) => `My name is ${value}!`
        },
        {
            text  : 'City', // Can be any column to style rows
            field : 'city',
            width : 100,
            renderer({ row, record, value }) {
                // Color only odd rows
                row.eachElement(el => el.style.background = row.index % 2 === 0 ? '#b2ffe9' : '#ffffff');

                return value;
            }
        },
        {
            type           : 'number',
            text           : 'Age',
            field          : 'age',
            width          : 80,
            cellCls        : 'age',
            align          : 'center',
            htmlEncode     : false,
            headerRenderer(column, header) {
                header.style.color = '#1E88E5';
                header.style.fontWeight = '700';
                return `- AGE -`;
            },
            renderer       : ({ value }) => `<i class="b-fa ${value < 40 ? 'b-fa-child' : 'b-fa-male'}"></i>`
        },
        {
            text       : 'Color',
            field      : 'color',
            cls        : 'color',
            flex       : 1,
            htmlEncode : false,
            icon     : 'b-fa b-fa-brush',
            renderer({ value, cellElement }) {
                cellElement.innerHTML = '<div class="color-box"></div>' + value;
                cellElement.firstElementChild.style.cssText = `
                    margin-right: .5em;
                    width: 1em;
                    height: 1em;
                    border-radius: .2em;
                    background-color: ${value};
                `;
            }
        }
    ],
});
```

Happy styling :)


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>