new FileField({
    appendTo : targetElement,
    width    : 300,
    multiple : true,
    accept   : 'image/*',
    label    : 'Pick multiple images',
    style    : 'display: block'
});

new FileField({
    appendTo : targetElement,
    width    : 300,
    label    : 'Pick single file on any type',
    style    : 'display: block; margin-top: 2em;'
});
