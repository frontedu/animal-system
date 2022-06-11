# Replacing Font Awesome with Material Icons
Follow the steps below to replace the Font Awesome icons used by Bryntum products by default with
[Material Icons](https://fonts.google.com/icons?selected=Material+Icons).

## Difference between Font Awesome and Material Icons

### Font Awesome
Font Awesome uses special unicode characters for every icon. For example the [code icon](https://fontawesome.com/icons/code?style=solid) (```</>```)
which in Font Awesome  is represented by the **f121** character. To use the icon in HTML two CSS classes are applied to a `i` element : `fa` and `fa-code`:

```html
<i class="fa fa-code"></i>
```

`fa` has styles related to font configurations, like font-family, font-size, etc., and `fa-code` defines which icon using the
[content](https://developer.mozilla.org/en-US/docs/Web/CSS/content) property. In case of "code" icon content is "\f121".

NOTE: The version of Font Awesome that ships with Bryntums products uses a `b-fa` prefix instead of `fa` to not interfere with other versions of Font Awesome already on page.

### Material Icons
Material Icons uses special **words** for every icon. These words are placed inside `<i>` tags. Material Icons
[code icon](https://material.io/resources/icons/?search=code&icon=code&style=baseline) is represented by the word "code".
To use the icon in HTML just one `material-icons` CSS class is used:

```html
<i class="material-icons">code</i>
```

`material-icons` similar to `fa` has styles related to font configurations.

### Using Font Awesome notation with Material Icons

According to the docs of [content](https://developer.mozilla.org/en-US/docs/Web/CSS/content)
*"The **content** CSS property replaces an element with a generated value"*. That means both approaches will work with Material Icons:

```html
<i class="material-icons">code</i>

<i class="material-icons">
    ::before // content : "code"
</i>
```

## Prepare Material Icons

1. Download material icons from [GitHub](https://github.com/google/material-design-icons).
2. Unzip `material-design-icons-master.zip/material-design-icons-master/font` into a new `font` folder.
3. Create a new `material-icons.scss` file with the following content (see the guide [here](https://google.github.io/material-design-icons/#icon-images-for-the-web)).

```scss
@font-face {
  font-family: 'Material Icons';
  font-style: normal;
  font-weight: 400;
  src: url(https://example.com/MaterialIcons-Regular.eot); /* For IE6-8 */
  src: local('Material Icons'),
    local('MaterialIcons-Regular'),
    url(https://example.com/MaterialIcons-Regular.woff2) format('woff2'),
    url(https://example.com/MaterialIcons-Regular.woff) format('woff'),
    url(https://example.com/MaterialIcons-Regular.ttf) format('truetype');
}

.material-icons {
   font-family: 'Material Icons';
   font-weight: normal;
   font-style: normal;
   font-size: 24px;  /* Preferred icon size */
   display: inline-block;
   line-height: 1;
   text-transform: none;
   letter-spacing: normal;
   word-wrap: normal;
   white-space: nowrap;
   direction: ltr;

   /* Support for all WebKit browsers. */
   -webkit-font-smoothing: antialiased;
   /* Support for Safari and Chrome. */
   text-rendering: optimizeLegibility;

   /* Support for Firefox. */
   -moz-osx-font-smoothing: grayscale;

   /* Support for IE. */
   font-feature-settings: 'liga';
}
```

## Replacing Font Awesome with Material Icons

1. Copy the prepared `font` folder of Material Icons fonts to `examples/theme/resources/` (see [Prepare Material Icons](#Grid/guides/customization/iconfont.md#prepare-material-icons) for details).
2. Copy the prepared `material-icons.scss` file to `examples/theme/resources/`.
3. Edit `examples/theme/resources/custom.scss`. Add `material-icons.scss` import to the top and update the `$icon-font` variable:

```scss
 // Import new icon font
@import './material-icons.scss';
// Define icon font variable to be used everywhere
$icon-font : 'Material Icons';
```

### Provide equivalents to icons.scss

All classes with "b-" prefix are Bryntum classes, i.e. `b-grid`, `b-icon`, etc. We use our own CSS classes to encapsulate the font specification:

```html
<i class="b-icon b-icon-code"></i>
```

Let's override `.b-icon-code:before` and some other icons in `examples/theme/resources/custom.scss` right **after** the theme import:

```scss
 // Import new icon font
@import './material-icons.scss';
// Define icon font variable to be used everywhere
$icon-font : 'Material Icons';
// Other variables...

// Path to the font-awesome fonts
$fa-font-path : '../../../build/fonts';

// Extend the classic theme
@import '../../../resources/sass/themes/classic.scss';

// Override the theme-info rule with our theme info
.b-theme-info:before {
    content : '{"name":"Custom"}';
}

// Provide content for icons which are used in the sources, see resources/core-sass/icons.scss
.b-icon-code:before { content : 'code' }
.b-icon-fullscreen:before { content : 'fullscreen' }
.b-icon-cog:before { content : 'settings' }
.b-icon-check:before { content : 'check_box' }
.b-icon-unchecked:before { content : 'check_box_outline_blank' }
.b-icon-star:before { content : 'star' }
.b-icon-picker:before { content : 'arrow_drop_down' }
.b-icon-file-download:before { content : 'file_download' }
.b-icon-sync:before { content : 'sync' }
.b-icon-close:before { content : 'close' }
.b-icon-bad-mood-emoji:before { content : 'mood_bad' }
// and so on...
```

### Checking out the result

Now need to build sass and check how the demo works in a browser:

<img src="Grid/theme-demo-with-material-icons.png" style="max-width : 512px" alt="Theme demo with Material Icons">

## Make Tree demo use Material Icons

1. Copy the prepared `font` folder of Material Icons fonts to `examples/tree/resources/` (see [Prepare Material Icons](#Grid/guides/customization/iconfont.md#prepare-material-icons) for details).
2. Copy the prepared `material-icons.scss` file to `examples/tree/resources/`.
3. Update `examples/tree/index.html` and remove `../../build/grid.stockholm.css` import:

```html
<!--<link rel="stylesheet" href="../../build/grid.stockholm.css" data-bryntum-theme>-->
```

4. Edit `examples/tree/resources/app.scss`:

```scss
// Import new icon font
@import './material-icons.scss';
// Define icon font variable to be used everywhere
$icon-font : 'Material Icons';

// This path will need to be adjusted if your project structure is different
$fa-font-path : '../../../build/fonts';

// Pick out a theme from our shipped themes to extend
@import '../../../resources/sass/themes/stockholm.scss';

// Specify your custom theme name by overriding meta theme info (required)
.b-theme-info:before {
    content: '{"name":"app"}';
}

// Provide content for icons which are used in the sources, see resources/core-sass/icons.scss
.b-icon-tree-collapse:before { content : 'expand_more' }
.b-icon-tree-expand:before { content : 'chevron_right' }
.b-icon-tree-leaf:before { content : 'circle' }
// etc

// Update demo styles to make header look nice
.b-theme-app .demo-header {
    background-color: #2667c8;
}
```

Then need to build sass. The output css will contain our classes with Material Icons font, including expanded/collapsed icons in the tree.

<img src="Grid/tree-demo-with-material-icons.png" style="max-width : 512px" alt="Tree demo with Material Icons">


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>