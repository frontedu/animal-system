# Upgrade Font Awesome icons to Pro version

By default, all icons in Bryntum products are based on [Font Awesome 6 Free](https://fontawesome.com/icons?d=gallery&m=free) solid font.
But, if you have a Font Awesome Pro license, you can upgrade the shipped FREE font to one of your Pro fonts.

## Font Awesome fonts

Here is the table of FREE and Pro font's specification. It is valid for Font Awesome v5.15 and might be changed in the future.
For the latest values consult with official Font Awesome [guide](https://fontawesome.com/v5.15/how-to-use/on-the-web/advanced/css-pseudo-elements).

| Style          | Availability      | @font-face weight | @font-face font-family                                    |
|----------------|-------------------|-------------------|-----------------------------------------------------------|
| Solid          | Free Plan         | 900               | Font Awesome 6 Free or Font Awesome 6 Pro (for pro users) |
| Regular        | Pro Plan Required | 400               | Font Awesome 6 Pro                                        |
| Light          | Pro Plan Required | 300               | Font Awesome 6 Pro                                        |
| Duotone        | Pro Plan Required | 900               | Font Awesome 6 Duotone                                    |
| Brands         | Free Plan         | 400               | Font Awesome 6 Brands                                     |
| Uploaded Icons | Pro Plan Required | 400               | Font Awesome Kit                                          |

## Replace FREE icons with Pro icons

Let's say you want to replace our `Font Awesome 6 Free / Solid` font with `Font Awesome 6 Pro / Regular` font.
Download the new Pro font and copy it into your project. Then you have 2 options: either override SCSS variables
and extend one of the Bryntum themes to compile it into new styles, or simple override specific CSS classes.
See the sections below for details.

### Replace icons using SCSS

If you are using SCSS in your application, you can override font specific variables and extend one of the Bryntum themes, for example:

```scss
// This path will need to be adjusted if your project structure is different, for example
$fa-font-path : '../../../build/fonts';
// Use "Font Awesome 6 Pro" icons
$icon-font : 'Font Awesome 6 Pro';
// Use "400" to match the Regular icons
$icon-font-weight : 400;

// Extend a theme you want to use, the Stockholm theme for example.
@import '../../../resources/sass/themes/stockholm.scss';

// Override the theme-info rule with new theme info
.b-theme-info:before {
    content : '{"name":"ProRegularStockholm"}';
}
```

### Replace icons using CSS

All classes with "b-" prefix are Bryntum classes, i.e. `b-grid`, `b-icon`, `b-fa`, etc.
We use our own CSS classes to encapsulate the font specification:

```html
<i class="b-icon b-icon-code"></i>
```

So, as an alternative solution to adjust the icon font, you can override `font-family` and `font-weight` styles of `b-icon` and `b-fa` classes:

```css
.b-fa:before,
.b-icon:before {
    font-family : 'Font Awesome 6 Pro';
    /* Regular icons */
    font-weight : 400;
}
```

## Using different Font Awesome fonts in one application

If you need to combine two and more types of icon fonts in one application, you can specify one font as a default using one of the approaches above.
Then override `font-family` and `font-weight` styles for specific icons using CSS selectors. For example:

```css
/* Use Font Awesome 6 Pro / 400 by default */
.b-fa:before,
.b-icon:before {
    font-family : 'Font Awesome 6 Pro';
    /* Regular icons */
    font-weight : 400;
}

/* Use Font Awesome 6 Pro / 900 for specific panel */
.b-panel[ref="somePanel"] .b-fa:before,
.b-panel[ref="somePanel"] .b-icon:before {
    /* Solid icons */
    font-weight : 900;
}
```


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>