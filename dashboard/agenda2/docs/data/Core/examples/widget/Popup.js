// button that display a popup containing html
new Button({
    appendTo : targetElement,
    cls      : 'b-raised',
    text     : 'Show html popup',
    style    : 'margin-right: .5em',
    onClick  : function(e) {
        const popup = new Popup({
            header      : 'A simple text Popup',
            autoShow    : false,
            centered    : true,
            closeAction : 'destroy',
            closable    : true,
            width       : '30em',
            bbar        : [
                {
                    text     : 'Close',
                    minWidth : 100,
                    onAction : 'up.close'
                }
            ],
            html : `<h3 style="margin-top:0.5em">Bacon ipsum dolor </h3>
                    <p style="line-height:1.5em">amet flank ribeye ham hock, 
                     rump alcatra pork belly pancetta leberkas bacon shoulder 
                    meatloaf ball tip pig. Tongue jerky meatloaf pancetta 
                    pork sirloin. Hamburger corned beef ball tip cupim 
                    sirloin frankfurter tri-tip. Swine kevin ham hock, 
                    drumstick flank pig shoulder shankle. Tri-tip pork 
                    chop fatback turducken pork salami. Tongue boudin 
                    salami flank bacon sirloin</p>`
        });
        popup.show();
    }
});

// button that displays a popup containing widgets
new Button({
    appendTo : targetElement,
    cls      : 'b-raised',
    text     : 'Show widget popup',
    onClick  : function(e) {
        const popup = new Popup({
            header      : 'A Popup containing Widgets',
            autoShow    : false,
            centered    : true,
            closable    : true,
            closeAction : 'destroy',
            width       : '20em',
            minHeight   : '18em',
            bbar        : [
                {
                    text     : 'Cancel',
                    minWidth : 100,
                    onAction : 'up.close'
                },
                {
                    text     : 'OK',
                    minWidth : 100,
                    cls      : 'b-raised b-blue',
                    onAction : () => {
                        Toast.show('Hello ' + popup.widgetMap.nameField.value);
                        popup.close();
                    }
                }
            ],
            items : [
                // a text field
                {
                    ref   : 'nameField',
                    type  : 'text',
                    label : 'Enter your name'
                }
            ]
        });
        popup.show();
    }
});
