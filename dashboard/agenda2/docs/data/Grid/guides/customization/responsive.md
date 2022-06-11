# Responsive

The grid can be configured to work well on many different screen sizes. This is achieved by specifying different responsive "levels" on the grid and then having per level configurations on the columns. 

## Responsive levels

Responsive levels can be explained as named widths. When the grid is smaller than the width of a predefined level it applies that level as its current. Which basically does two things:

1. Applies a CSS class to the grid (b-responsive-[level]).
2. Applies any level based configs to the columns.

A basic example of specifying responsive levels:

```javascript
let grid = new Grid({
    responsiveLevels: {
        small: 400,
        normal: '*'
    }
});
```

```css
#responsiveGrid.b-responsive-small { font-size: 2vw; }
```

In the grid below, try resizing the browser window to make it < 400 pixels wide and notice how the text size adjusts
as you drag.

<div class="external-example" data-file="Grid/guides/responsive/basic.js"></div>

Once the grid becomes less than 400 pixels wide it will apply the "small" responsive level. Larger widths will apply the "normal". You can have as many levels as you desired and you can name them freely as long as the name is a valid CSS class.

## Styling based on responsive level

As mentioned above a CSS class corresponding to the currently active level is added to the grid. Using for example the level definitions from the example above, you will get one of the following:

```
<div class="b-grid ... b-responsive-small"></div>
<div class="b-grid ... b-responsive-normal"></div>

```

By scoping your CSS rules to one of those selectors you can have styling applied depending on responsive level. For example, to make the text smaller in headers in a narrower grid:

```css
.b-responsive-small .b-grid-header {
    font-size: .6em; 
}
```

## Using per column configuration

Columns can have a configuration called responsiveLevels, that defines what configuration options to apply to the column at a certain responsive level. For example hiding a column when the grid is small:

```javascript
let grid = new Grid({
    appendTo         : targetElement,
    height           : 200,
    responsiveLevels : {
        small  : 400,
        normal : '*'
    },

    columns : [
        { text : 'Name', field : 'name', flex : 1 },
        {
            text             : 'Age',
            field            : 'age',
            flex             : 1,
            responsiveLevels : {
                small : { hidden : true },
                '*'   : { hidden : false }
            }
        }
    ],

    data : [
        { name : 'Dan Stevenson', city : 'Los Angeles' },
        { name : 'Talisha Babin', city : 'Paris' }
    ]
});
```

Going from one responsive level to another will not replace configuration done on the previous level. Thus you should as in the example above specify any config needed to counteract previous levels (if * did not specify hidden: false it would stay hidden).
Try making the window smaller and see how the Age column is hidden.

<div class="external-example" data-file="Grid/guides/responsive/columns.js"></div>

Supported responsive column configuration options:

* width
* flex
* text
* region
* renderer
* editor
* hidden  

## More demos
A separate Responsive demo can be found in the ´/examples/responsive´ folder, and it shows a combination of the techniques mentioned above.


<p class="last-modified">Last modified on 2022-05-30 6:38:16</p>