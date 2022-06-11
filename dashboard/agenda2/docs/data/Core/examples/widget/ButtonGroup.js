targetElement.innerHTML = `<div id="group1" class="centeredColumn"><p>A ButtonGroup containing some buttons</p></div>
<div id="group2" class="centeredColumn"><p>A toggleable ButtonGroup</p></div>`;

new ButtonGroup({
    appendTo : 'group1',
    cls      : 'b-raised',
    items    : [
        { icon : 'b-fa b-fa-search-plus', cls : 'b-raised' },
        { icon : 'b-fa b-fa-search-minus', cls : 'b-raised' },
        { icon : 'b-fa b-fa-chevron-left', cls : 'b-raised' },
        { icon : 'b-fa b-fa-chevron-right', cls : 'b-raised' },
        { icon : 'b-fa b-fa-calendar-alt', cls : 'b-raised' },
        { icon : 'b-fa b-fa-download', cls : 'b-raised' }
    ]
});

new ButtonGroup({
    appendTo    : 'group2',
    cls         : 'b-raised',
    toggleGroup : true,
    items       : [
        { text : 'Day', pressed : true },
        { text : 'Week' },
        { text : 'Month' },
        { text : 'Quarter' },
        { text : 'Year' }
    ]
});
