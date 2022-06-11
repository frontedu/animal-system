const menu = new Menu({
    anchor  : true,
    autoShow: false,
    items   : [
        {
            icon: 'b-fw-icon b-icon-add',
            text: 'Add'
        },
        {
            icon: 'b-fw-icon b-icon-trash',
            text: 'Remove'
        },
        {
            icon    : 'b-fw-icon b-icon-lock',
            disabled: true,
            text    : 'I am disabled'
        },
        {
            text: 'Sub menu',
            menu: [{
                icon: 'b-fw-icon b-fa-play',
                text: 'Play'
            }]
        }
    ],
    // Method is called for all ancestor levels
    onItem({ item }) {
        Toast.show('You clicked ' + item.text);
    }
});

new Button({
    appendTo: targetElement,
    cls     : 'b-raised',
    text    : 'Show menu',
    menu
});
