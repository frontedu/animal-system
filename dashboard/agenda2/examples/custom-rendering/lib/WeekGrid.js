import Calendar from '../../../lib/Calendar/view/Calendar.js';
import CalendarStores from '../../../lib/Calendar/mixin/CalendarStores.js';
import Grid from '../../../lib/Grid/view/Grid.js';
import '../../../lib/Grid/column/DateColumn.js';
import DateHelper from '../../../lib/Core/helper/DateHelper.js';
import Month from '../../../lib/Core/util/Month.js';

/**
 * A Grid view of a week's events implemented as a custom "mode" widget to be
 * included in a calendar's modes config object.
 *
 * Mixing in CalendarStores means that we can be handed a project
 * and we are automagically configured with an EventStore from the project.
 */
export default class WeekGrid extends Grid.mixin(CalendarStores) {
    static get $name() {
        return 'WeekGrid';
    }

    // Declare config properties at this level. (All Grid's are inherited)
    static get configurable() {
        return {
            // Used by the Calendar's mode selector button
            displayName : 'Week Grid',

            // We can be told to look at a certain date.
            // We snap our week to encapsulate this date.
            date : {
                value : null,

                // Config system automatically rejects non-changes.
                $config : {
                    equal : 'date'
                }
            },

            // We have a Month utility object.
            // It helps us with week values and week change events
            month : true,

            // These are the data we show from the events
            columns : [{
                text  : 'Name',
                field : 'name',
                flex  : 1
            }, {
                text  : 'Start Date',
                type  : 'date',
                field : 'startDate',
                width : '12em'
            }, {
                text  : 'End Date',
                type  : 'date',
                field : 'endDate',
                width : '12em'
            }]
        };
    }

    /**
     * Interface method used by an encapsulating Calendar view to implement the "prev" button.
     */
    previous() {
        this.date = DateHelper.add(this.startDate, -7, 'day');
    }

    /**
     * Interface method used by an encapsulating Calendar view to implement the "next" button.
     */
    next() {
        this.date = this.endDate;
    }

    /**
     * Property used by an encapsulating Calendar view to create the description in its toolbar.
     */
    get description() {
        const
            { count } = this.store,
            week      = this.month.getWeekNumber(this.date);

        return `${week[0]} week ${week[1]}. ${count || 'No'} event${count === 1 ? '' : 's'}`;
    }

    /**
     * Property used by an encapsulating Calendar view to create tooltips for the "prev" and "next" buttons.
     */
    get stepUnit() {
        return 'week';
    }

    /**
     * Property used by an encapsulating Calendar view to see what date range a view encompasses.
     */
    get startDate() {
        return this.month.getWeekStart(this.month.getWeekNumber(this.date));
    }

    /**
     * Property used by an encapsulating Calendar view to see what date range a view encompasses.
     */
    get endDate() {
        return DateHelper.add(this.startDate, 7, 'day');
    }

    /**
     * When an EventStore arrives, chain off a slave store from that which we can then
     * filter to only show the week we are focused upon.
     */
    updateEventStore(eventStore) {
        super.updateEventStore?.(eventStore);

        // Set the grid's store to be the chained store
        this.store = eventStore.chain();

        // Add a filter which limits the store to only exposing events for our date range.
        this.store.filter({
            // eslint-disable-next-line quote-props
            'id'     : 'week-filter',
            filterBy : record => DateHelper.intersectSpans(record.startDate, record.endDate, this.startDate, this.endDate)
        });
    }

    /**
     * When we have our date set, pass it right on to the Month. It will react if that means that
     * we are looking at a different week. We just react to our month's weekChange event.
     */
    updateDate(date) {
        this.month.date = date;
    }

    /**
     * Creates the Month utility objet. We use it to track what week we are looking at.
     */
    changeMonth() {
        // Promote the month to be a Month utility object which informs us whenever setting
        // its date changes the week it is in.
        return new Month({
            date      : this.date || (this.date = new Date()),
            listeners : {
                weekChange : 'onMonthWeekChange',
                thisObj    : this
            }
        });
    }

    /**
     * When the date we have been told to look at is in another week, ask the store to reevaluate the filter.
     * The store will fire events which cause UI update.
     * We must fire a refresh event so that the encapsulating Calendar view knows about this.
     */
    onMonthWeekChange() {
        this.store.filter();
        this.trigger('refresh');
    }

    /**
     * This is added as a listener by the CalendarStores mixin.
     *
     * Our store is chained off of the EventStore; refill it if the EventStore changes.
     * The store will fire events which cause UI update.
     * We must fire a refresh event so that the encapsulating Calendar view knows about this.
     */
    onCalendarStoreChange() {
        this.store.fillFromMaster();
        this.trigger('refresh');
    }
}

// Register with type factory
Calendar.Modes.register('weekgrid', WeekGrid);
