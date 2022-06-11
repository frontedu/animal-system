'use strict';

var {
    Calendar,
    DateHelper,
    StringHelper
} = bryntum.calendar;
var calendar = new Calendar({
    // CrudManager arranges loading and syncing of data in JSON form from/to a web service
    crudManager : {
        eventStore : {
            // Field definition added to the event record fields in this store
            fields : [{
                name : 'room'
            }]
        },
        transport : {
            load : {
                url : 'data/data.json'
            }
        },
        autoLoad : true
    },
    appendTo : 'container',
    // Start life looking at this date
    date     : '2020-01-01',
    // Features named by the properties are included.
    // An object is used to configure the feature.
    features : {
        eventTooltip : {
            // Configuration options are passed on to the tooltip instance.
            // Override the default which is to show on click.
            showOn   : 'hover',
            // We want the tooltip's left edge aligned to the right edge of the event if possible.
            align    : 'l-r',
            // Mustn't shrink because of large, graphical content
            minWidth : null,
            tools    : {
                left : {
                    cls     : 'b-fa b-fa-angle-left',
                    weight  : 20,
                    tooltip : {
                        // Value found by looking up ownership hierarchy.
                        // Will find an implementation in the Calendar
                        getHtml : 'up.moveEarlierTooltip'
                    },

                    handler() {
                        // Move backwards by the configured autoCreate step time quantum
                        var step = DateHelper.parseDuration(calendar.autoCreate.step);
                        this.eventRecord.shift(-step.magnitude, step.unit);
                    }

                },
                right : {
                    cls     : 'b-fa b-fa-angle-right',
                    weight  : 10,
                    tooltip : {
                        // Value found by looking up ownership hierarchy.
                        // Will find an implementation in the Calendar
                        getHtml : 'up.moveLaterTooltip'
                    },

                    handler() {
                        // Move forwards by the configured autoCreate step time quantum
                        var step = DateHelper.parseDuration(calendar.autoCreate.step);
                        this.eventRecord.shift(step.magnitude, step.unit);
                    }

                }
            },
            renderer : data => `<dl>
                <dt>Assigned to:</dt>
                <dd>
                    ${data.eventRecord.resource.get('image') ? `<img class="resource-image" src="../_shared/images/users/${data.eventRecord.resource.get('image')}"/>` : ''}
                    ${StringHelper.encodeHtml(data.eventRecord.resource.name)}
                </dd>
                <dt>Time:</dt>
                <dd>
                    ${DateHelper.format(data.eventRecord.startDate, 'LT')} - ${DateHelper.format(data.eventRecord.endDate, 'LT')}
                </dd>
                ${data.eventRecord.get('note') ? `<dt>Note:</dt><dd>${StringHelper.encodeHtml(data.eventRecord.note)}</dd>` : ''}
    
                ${data.eventRecord.get('image') ? `<dt>Image:</dt><dd><img class="image" src="${data.eventRecord.get('image')}"/></dd>` : ''}
            </dl>
            `,

            onBeforeShow() {
                // Delete tool hidden for recurring occurrences
                this.tools.delete.hidden = this.eventRecord.isOccurrence;
            }

        }
    },

    moveEarlierTooltip() {
        return `Move event earlier by ${this.autoCreate.step}`;
    },

    moveLaterTooltip() {
        return `Move event later by ${this.autoCreate.step}`;
    }

});
