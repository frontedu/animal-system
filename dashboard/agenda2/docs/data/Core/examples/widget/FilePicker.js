new FilePicker({
    appendTo        : targetElement,
    fileFieldConfig : {
        multiple : true,
        accept   : 'image/*'
    },
    buttonConfig : {
        text : 'Pick multiple images',
        cls  : 'b-blue b-raised'
    }
});

new FilePicker({
    appendTo     : targetElement,
    buttonConfig : {
        text : 'Pick single file of any type',
        cls  : 'b-green b-raised'
    },
    style : 'margin-left: 2em;'
});
