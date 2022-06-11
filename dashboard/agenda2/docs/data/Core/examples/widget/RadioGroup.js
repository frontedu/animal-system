new RadioGroup({
    appendTo : targetElement,
    name     : 'radioItems',
    title    : 'Contextual Options',
    defaults : {
        autoCollapse : true
    },

    options : {
        A : {
            text      : 'Single item',
            container : [{
                type        : 'textfield',
                placeholder : 'Additional info...',
                flex        : 1
            }]
        },

        B : {
            text      : 'Two items',
            inline    : true,  // can also use false to wrap a single item
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

         C : {
            text      : 'Child form',
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
    }
});
