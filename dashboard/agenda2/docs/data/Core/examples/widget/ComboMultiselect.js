// multiSelect
new Combo({
    appendTo    : targetElement,
    multiSelect : true,
    style       : 'margin-top:3em',
    label       : 'Skills - multiSelect',
    value       : ['Javascript', 'SQL'],
    items       : [
        'BASIC',
        'COBOL',
        'FORTRAN',
        'DBL',
        'SQL',
        'C/C++',
        'Java',
        'Javascript'
    ],
    width : '100%'
});

// Grouped list + multiSelect
CSSHelper.insertRule('.foodmenu-combo .b-chip i { margin-right:0.4em }');
CSSHelper.insertRule('.b-list-item-group-header { font-size:1.1em; }');
CSSHelper.insertRule('.b-foodmenu-item { display:flex; flex-direction:column; align-items:flex-start; margin-left:0.3em}');
CSSHelper.insertRule('.b-foodmenu-item span.name { font-size:1.1em; }');
CSSHelper.insertRule('.b-foodmenu-item small { display:block; color:#999; margin-top:0.3em;}');
CSSHelper.insertRule('.b-foodmenu-item small { display:block; color:#999; margin-top:0.3em;}');

new Combo({
    appendTo     : targetElement,
    width        : '100%',
    multiSelect  : true,
    cls          : 'foodmenu-combo',
    style        : 'margin-top:3em',
    label        : 'Grouped list + multiSelect',
    displayField : 'name',
    valueField   : 'id',
    value        : [1, 5, 9],
    listCls      : 'grouped-combo',
    picker       : {
        groupHeaderTpl : (record, groupName) => `
           <i class="b-fa b-fa-${groupName === 'Food' ? 'pizza-slice' : groupName === 'Drinks' ? 'wine-glass' : 'utensils'}" style="margin-right:0.8em;"></i>${groupName}
        `
    },
    chipView : {
        iconTpl : (record) => `<i class="b-fa b-fa-${record.icon}"></i>`
    },

    listItemTpl : record => `
        <div class="b-foodmenu-item">
            <span class="name">${record.name}</span>
            <small>${record.calories} calories</small>
        </div>
    `,
    editable : false,
    store    : {
        fields : [
            'type',
            'calories',
            'icon'
        ],
        groupers : [
            { field : 'type', ascending : false }
        ],
        data : [
            { id : 1, name : 'Cheese sticks', type : 'starters', calories : 312, icon : 'cheese' },
            { id : 2, name : 'Fried onion rings', type : 'starters', calories : 234, icon : 'ring' },
            { id : 3, name : 'Hummus', type : 'starters', calories : 532, icon : 'seedling' },
            { id : 4, name : 'Fried fish', type : 'food', calories : 243, icon : 'fish' },
            { id : 5, name : 'Pizza', type : 'food', calories : 687, icon : 'pizza-slice' },
            { id : 6, name : 'Hamburger', type : 'food', calories : 734, icon : 'hamburger' },
            { id : 7, name : 'Hot dog', type : 'food', calories : 435, icon : 'hotdog' },
            { id : 8, name : 'Salad', type : 'food', calories : 112, icon : 'salad' },
            { id : 9, name : 'Gin tonic', type : 'drinks', calories : 145, icon : 'glass-martini' },
            { id : 10, name : 'Wine', type : 'drinks', calories : 150, icon : 'glass-wine' },
            { id : 11, name : 'Soda', type : 'drinks', calories : 205, icon : 'glass-citrus' },
            { id : 12, name : 'Beer', type : 'drinks', calories : 109, icon : 'beer' }
        ]
    }
});
