'use strict';

var {
    DateHelper,
    Calendar,
    DomHelper,
    StringHelper
} = bryntum.calendar;
var calendar = new Calendar({
    // Start life looking at this date
    date        : new Date(2020, 9, 12),
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        transport : {
            load : {
                url : `data/data.json`
            }
        },
        autoLoad : true
    },
    appendTo : 'container',
    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventTooltip : {
            // Configuration options are passed on to the tooltip instance
            // We want the tooltip's left edge aligned to the right edge of the event if possible.
            align : 'l-r'
        }
    },
    modes : {
        month : {
            // Overflow button looks different if we are expanding the week height when clicked
            overflowButtonRenderer(buttonConfig, count) {
                buttonConfig.style.justifyContent = 'unset';
                buttonConfig.className['b-fa'] = 1;

                if (this.overflowClickAction === 'shrinkwrap') {
                    buttonConfig.className['b-fa-arrow-down'] = 1;
                    buttonConfig.text = 'Expand';
                }
                else {
                    buttonConfig.className['b-fa-window-maximize'] = 1;
                    buttonConfig.text = `Show ${count} more`;
                }

                return buttonConfig;
            }

        }
    },
    // The Calendar's top toolbar.
    // We can alter its items configuration.
    // In this case, we add a new UI item.
    tbar : {
        items : {
            settings : {
                type    : 'button',
                icon    : 'b-fa b-fa-cog',
                tooltip : 'Settings',
                // High weight so it goes at the end
                weight  : 800,
                style   : 'margin-left: 1em',
                menu    : {
                    align : 't100-b100',
                    items : {
                        hideEventOverflow : {
                            text     : 'Hide event overflow',
                            checked  : false,
                            onToggle : ({
                                checked
                            }) => calendar.modes.agenda.hideEventOverflow = checked,
                            style : 'margin-right:1em'
                        },
                        toggleShowWeek : {
                            text    : 'Week column',
                            checked : true,

                            onToggle({
                                checked
                            }) {
                                calendar.activeView.showWeekColumn = checked;
                            }

                        },
                        toggleNonWorkingDays : {
                            text    : 'Nonworking days',
                            checked : true,

                            onToggle({
                                checked
                            }) {
                                calendar.activeView.hideNonWorkingDays = !checked;
                            }

                        },
                        toggleMonthViewOverflowClick : {
                            text    : 'Expand row on overflow click',
                            checked : false,

                            onToggle({
                                checked
                            }) {
                                calendar.activeView.overflowClickAction = checked ? 'shrinkwrap' : 'popup';
                            }

                        },
                        collapseExpandedWeeks : {
                            text : 'Collapse expanded weeks',
                            icon : 'b-fa-angle-up b-fa-fw',

                            onItem() {
                                for (var i = 0; i < 6; i++) {
                                    calendar.activeView.flexWeekRow(i);
                                }
                            }

                        }
                    }
                }
            }
        }
    },
    // The utility panel which is at the left by default.
    // We can alter its items configuration.
    // Add to its items configuration.
    sidebar : {
    // Extra UI Widgets can be easily added to the sidebar
        items : {
            // Provided widgets can be removed.
            // We don't want the date picker in our app.
            datePicker : null,
            addNew     : {
                // Top position
                weight    : 0,
                type      : 'button',
                text      : 'Create',
                icon      : 'b-fa b-fa-plus',
                // Will look in ownership hierarchy and call on the Calendar
                listeners : {
                    click : 'up.createEvent',
                    // Use the default (which is the Calendar date).
                    // The event will be pushed into 2nd position.
                    args  : [undefined]
                }
            },
            filterTitle : {
                type   : 'label',
                // Add simple title just before resourceFilter
                weight : 199,
                cls    : 'resource-filter-title',
                html   : 'Select resources'
            },
            eventLog : {
                // We want this in last position
                weight : 250,
                type   : 'panel',
                cls    : 'calendar-event-log',
                title  : 'Interaction log',
                tools  : {
                    delete : {
                        cls     : 'b-icon-trash',
                        tooltip : 'Clear event log',
                        // Will look in ownership hierarchy and call on the Calendar
                        handler : 'up.clearEventLog'
                    }
                }
            }
        }
    },

    log(message) {
        var logEl = this.widgetMap.eventLog.contentElement;
        DomHelper.createElement({
            parent : logEl,
            html   : message
        });
        logEl.scrollTop = Number.MAX_SAFE_INTEGER;
    },

    clearEventLog() {
        this.widgetMap.eventLog.contentElement.innerHTML = '';
    },

    listeners : {
    // On view paint, sync our settings with the active view's settings
        viewPaint({
            source: view
        }) {
            var {
                hideEventOverflow,
                toggleShowWeek,
                toggleMonthViewOverflowClick,
                collapseExpandedWeeks,
                toggleNonWorkingDays
            } = this.tbar.widgetMap.settings.menu.widgetMap; // Do some logging just for demo purposes

            view.parent.parent.log(`${view.title}View activated`); // This setting is only for AgendaView

            hideEventOverflow.disabled = !view.isAgendaView; // These views can hide and show a week column

            if (view.isMonthView || view.isYearView) {
                toggleShowWeek.disabled = toggleMonthViewOverflowClick.disabled = collapseExpandedWeeks.disabled = false;
                toggleShowWeek.checked = view.showWeekColumn;
            }
            else {
                toggleShowWeek.disabled = toggleMonthViewOverflowClick.disabled = collapseExpandedWeeks.disabled = true;
            } // A one day DayView can't toggle hiding and showing nonworking days

            if (view.isDayView && view.duration === 1) {
                toggleNonWorkingDays.disabled = true;
            }
            else {
                toggleNonWorkingDays.disabled = false;
                toggleNonWorkingDays.checked = !view.hideNonWorkingDays;
            }
        },

        // Log events just for demo purposes
        beforeEventEdit({
            eventRecord
        }) {
            this.log(StringHelper.xss`Edit ${eventRecord.name}`);
        },

        weekNumberClick({
            week
        }) {
            this.log(`Clicked week ${week}`);
        },

        monthNameClick({
            month
        }) {
            this.log(`Clicked month ${month + 1}`);
        },

        eventClick({
            eventRecord
        }) {
            this.log(StringHelper.xss`Clicked ${eventRecord.name}`);
        },

        cellOverflowClick({
            date
        }) {
            this.log(`Clicked cell ${DateHelper.format(date, 'L')} overflow indicator`);
        },

        scheduleClick({
            date
        }) {
            this.log(`Clicked cell ${DateHelper.format(date, 'L')}`);
        },

        dayNumberClick({
            date
        }) {
            this.log(`Clicked day ${DateHelper.format(date, 'L')}`);
        },

        navigate({
            item
        }) {
            var newRecord = item && calendar.activeView.getEventRecord(item),
                to = newRecord ? StringHelper.xss`to ${newRecord.name}` : 'off any event';
            this.log(`Navigated ${to}`);
        },

        selectionChange({
            selection
        }) {
            this.log(StringHelper.xss`Selected ${selection.length ? selection[0].name : 'Nothing'}`);
        },

        dateRangeChange({
            new: {
                startDate,
                endDate
            }
        }) {
            this.log(`${DateHelper.makeKey(startDate)} - ${DateHelper.makeKey(endDate)}`);
        }

    }
});
