
new Button({
    appendTo : targetElement,

    text : 'alert()',

    onClick() {
        MessageDialog.alert({
            title   : 'Important!',
            message : `Please note that it is ${DateHelper.format(new Date(), 'dddd')} today`
        });
    },

    style : 'margin-right : .5em'
});

new Button({
    appendTo : targetElement,

    text : 'confirm()',

    onClick() {
        MessageDialog.confirm({
            title   : 'Format hard drive',
            message : `Proceed with formatting your hard drive?`
        });
    },

    style : 'margin-right : .5em'
});

new Button({
    appendTo : targetElement,

    text : 'prompt()',

    async onClick() {
        const answer = await MessageDialog.prompt({
            title   : 'What day is it today?',
            message : `Type it here please`
        });

        if (answer.button === MessageDialog.okButton) {

            MessageDialog.alert({
                title   : 'Your answer was...',
                message : answer.text.toLowerCase() === DateHelper.format(new Date(), 'dddd').toLowerCase() ? 'Correct!' : 'Wrong!'
            });
        }
    }
});
