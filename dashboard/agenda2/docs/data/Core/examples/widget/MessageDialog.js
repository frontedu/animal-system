targetElement.classList.add('widgetRow');

new Button({
    appendTo : targetElement,
    text     : 'confirm()',
    onClick  : async() => {
        const result = await MessageDialog.confirm({
            title        : 'The big question',
            message      : 'Do one legged ducks swim in circles?',
            okButton     : 'Yes',
            cancelButton : 'No'
        });

        Toast.show(`You answered ${result === MessageDialog.okButton ? 'Yes' : 'No'}`);
    }
});

new Button({
    appendTo : targetElement,
    text     : 'prompt()',
    onClick  : async() => {
        const result = await MessageDialog.prompt({
            title   : 'Information required!',
            message : 'Enter your name'
        });

        if (result.button === MessageDialog.okButton) {
            Toast.show(`You wrote ${result.text}`);
        }
    }
});

new Button({
    appendTo : targetElement,
    text     : 'alert()',
    onClick  : () => {
        MessageDialog.alert({
            title   : 'Upgrade required!',
            message : 'Internet Explorer is not supported!'
        });
    }
});
