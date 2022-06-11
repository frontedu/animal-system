new Button({
    appendTo : targetElement,
    cls      : 'b-raised',
    text     : 'Show mask',
    onClick  : () => {
        Mask.mask({
            target : targetElement,
            text   : 'Masked (2 seconds)',
            mode   : 'dark-blur'
        });

        setTimeout(() => {
            Mask.unmask(targetElement);
        }, 2000);
    }
});

new Button({
    appendTo : targetElement,
    cls      : 'b-raised',
    text     : 'Show Progress',
    style    : 'margin-left:1em',
    onClick  : () => {
        const mask = Mask.mask({
            target      : targetElement,
            text        : 'The task is in progress',
            mode        : 'dark-blur',
            progress    : 0,
            maxProgress : 100
        });

        const timer = setInterval(() => {
            mask.progress += 5;
            if (mask.progress >= mask.maxProgress) {
                Mask.unmask(targetElement);
                clearInterval(timer);
            }
        }, 100);
    }
});
