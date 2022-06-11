const picker = new DatePicker({
    appendTo          : targetElement,
    width             : '24em',
    date              : new Date(),
    onSelectionChange : ({ selection }) => {
        Toast.show(`You picked ${DateHelper.format(selection[0], 'MMM DD')}`);
    }
});
