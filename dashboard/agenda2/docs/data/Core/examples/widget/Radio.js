new Container({
    appendTo : targetElement,
    items    : [
        {
            tag   : 'p',
            style : 'font-weight:500',
            html  : 'Do you need jQuery in your web app?'
        },
        {
            type         : 'radio',
            name         : 'radios',
            text         : 'No',
            checked      : true,
            checkedValue : 'A'
        },
        {
            type         : 'radio',
            name         : 'radios',
            text         : 'Probably not',
            checkedValue : 'B'
        },
        {
            type         : 'radio',
            name         : 'radios',
            checked      : true,
            text         : 'Unlikely',
            checkedValue : 'C'
        }
    ]
});

new Container({
    appendTo : targetElement,
    style    : 'margin-top:2em',
    items    : [
        {
            tag   : 'p',
            style : 'font-weight:500',
            html  : 'Are colored radio buttons awesome?'
        },
        // green radio
        {
            type         : 'radio',
            color        : 'b-green',
            checked      : true,
            name         : 'coloredradios',
            text         : 'Sure',
            checkedValue : 'A'
        },

        // blue radio
        {
            type         : 'radio',
            color        : 'b-blue',
            name         : 'coloredradios',
            text         : 'Yes',
            checkedValue : 'B'
        },

        // orange radio
        {
            type         : 'radio',
            color        : 'b-orange',
            name         : 'coloredradios',
            text         : 'Kinda',
            checkedValue : 'C'
        },

        // disabled radio
        {
            type         : 'radio',
            disabled     : true,
            name         : 'coloredradios',
            text         : 'Disabled',
            checkedValue : 'D'
        }
    ]
})
