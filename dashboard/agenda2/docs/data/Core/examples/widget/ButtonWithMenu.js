const button = new Button({
    icon    : 'b-fa-chart-line',
    appendTo: targetElement,
    menu    : {
        items: [
            {
                text  : 'Click me',
                onItem: () => console.log('I was clicked')
            }
        ]
    }
});

const button2 = new Button({
    text    : 'Settings button',
    icon    : 'b-fa-cog',
    appendTo: targetElement,
    style   : 'margin-left:1em',
    menu    : {
        items: [
            {
                text  : 'Click me',
                onItem: () => console.log('I was clicked')
            }
        ]
    }
});
