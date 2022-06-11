new Container({
    appendTo : targetElement,

    items : [
        {
            type         : 'radio',
            text         : 'Single item',
            name         : 'radioItems',
            checkedValue : 'A',
            autoCollapse : true,

            container : [{
                type        : 'textfield',
                placeholder : 'Additional info...',
                flex        : 1
            }]
        },

        {
            type         : 'radio',
            text         : 'Two items',
            name         : 'radioItems',
            inline       : true,  // can also use false to wrap a single item
            checkedValue : 'B',
            autoCollapse : true,

            container : {
                from : {
                    type        : 'textfield',
                    placeholder : 'From...',
                    flex        : 1
                },
                to : {
                    type        : 'textfield',
                    placeholder : 'To...',
                    flex        : 1,
                    style       : 'margin-left: 1em'
                }
            }
        },

        {
            type         : 'radio',
            text         : 'Child form',
            name         : 'radioItems',
            checkedValue : 'C',
            autoCollapse : true,

            container : {
                from : {
                    type  : 'textfield',
                    label : 'From',
                    width : 'auto'
                },
                to : {
                    type  : 'textfield',
                    label : 'To',
                    width : 'auto'
                }
            }
        }
    ]
});
