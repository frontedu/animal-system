const scheduler = new Scheduler({
    appendTo : targetElement,

    autoHeight : true,
    rowHeight  : 40,
    barMargin  : 4,

    startDate : new Date(2018, 4, 6),
    endDate   : new Date(2018, 4, 13),

    viewPreset : {
        base            : 'dayAndWeek',
        timeColumnWidth : 30
    },

    columns : [{
        field      : 'name',
        text       : 'Name',
        width      : 100,
        htmlEncode : false,
        renderer   : ({ record, value }) => value + (record.star ? '<i class="b-fa b-fa-star"></i>' : '')
    }],

    resourceStore : {
        fields : [{ name : 'star', type : 'boolean', defaultValue : false }],
        data   : [
            { id : 1, name : 'Bernard' },
            { id : 2, name : 'Bianca' }
        ]
    },

    events : [
        { id : 1, resourceId : 1, name : 'Right click me', startDate : '2018-05-07', endDate : '2018-05-12' }
    ],

    features : {
        eventMenu : {
            items : {
                // Custom reference to the new menu item
                moveForward : {
                    text   : 'Move 1 hour ahead',
                    icon   : 'b-fa b-fa-long-arrow-alt-right',
                    cls    : 'b-separator', // Add a visual line above the item
                    weight : 400, // Add the item to the bottom
                    onItem : ({ eventRecord }) => {
                        eventRecord.shift(1, 'hour');
                    }
                }
            }
        },
        resourceTimeRanges : true,
        scheduleMenu       : {
            items : {
                // Custom reference to the new menu item
                timeBreak : {
                    text   : 'Add a day off',
                    icon   : 'b-fa b-fa-shield-virus',
                    cls    : 'b-separator', // Add a visual line above the item
                    weight : 200, // Add the item to the bottom
                    onItem : ({ date, resourceRecord }) => {
                        scheduler.resourceTimeRangeStore.add({
                            resourceId     : resourceRecord.id,
                            name           : 'Day off',
                            startDate      : new Date(date.getFullYear(), date.getMonth(), date.getDate()),
                            duration       : 1,
                            timeRangeColor : 'blue'
                        });
                    }
                }
            }
        },
        timeRanges         : true,
        timeAxisHeaderMenu : {
            items : {
                // Custom reference to the new menu item
                ventilationBreak : {
                    text   : 'Room ventilation',
                    icon   : 'b-fa b-fa-shield-virus',
                    cls    : 'b-separator', // Add a visual line above the item
                    weight : 500, // Add the item to the bottom
                    onItem : ({ event }) => {
                        const date = scheduler.getDateFromDomEvent(event);

                        scheduler.project.timeRangeStore.add({
                            startDate    : new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()),
                            duration     : 2,
                            durationUnit : 'h'
                        });
                    }
                }
            }
        },
        cellMenu : {
            items : {
                // Custom reference to the new cell items
                star : {
                    text   : 'Give a star',
                    icon   : 'b-fa b-fa-star',
                    cls    : 'b-separator', // Add a visual line above the item
                    weight : 500, // Add the item to the bottom
                    onItem : ({ record }) => {
                        record.star = true;
                    }
                },
                removeStar : {
                    text   : 'Remove star',
                    icon   : 'b-fa b-fa-star-half-alt',
                    cls    : 'b-separator', // Add a visual line above the item
                    weight : 500, // Add the item to the bottom
                    onItem : ({ record }) => {
                        record.star = false;
                    }
                }
            },
            // Process cell items before showing the menu
            processItems({ items, record }) {
                // Hide either star or removeStar item
                if (record.star) {
                    items.star = false;
                }
                else {
                    items.removeStar = false;
                }
            }
        },
        headerMenu : {
            items : {
                // Custom reference to the new cell items
                star : {
                    text   : 'Add a new guy',
                    icon   : 'b-fa b-fa-plus',
                    weight : 10, // Add the item to the top
                    onItem : () => {
                        scheduler.resourceStore.add({
                            name : 'New employee'
                        });
                    }
                }
            }
        }
    }
});
