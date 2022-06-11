import { Calendar, LocaleManager, Localizable } from '../../build/calendar.module.js?459414';
import shared from '../_shared/shared.module.js?459414';
/**
 * Localization demo main app file
 */

// Importing custom locales

// Enable missing localization Error throwing here to show how it can be used in end-user apps
// All non-localized strings which are in `L{foo}` format will throw runtime error
LocaleManager.throwOnMissingLocale = true;

/**
 * Updates localizable properties after locale change
 */
function updateLocalization() {
    setDemoTitle();
    setMyButtonText();
}

/**
 * Sets the translated demo title in header and document.title
 */
function setDemoTitle() {
    const title = Localizable().L('L{App.Localization demo}');
    document.querySelector('#title').innerHTML = `<h1>${title}</h1>`;
    document.title = title;
}

/**
 * Sets My Button text by calling L function and providing data
 */
function setMyButtonText() {
    myButton.text = myButton.L('L{My button}', Math.floor(Math.random() * 100));
}

// Add listener to update contents when locale changes
LocaleManager.on('locale', updateLocalization);

// panel with toolbar and grid
const calendar = new Calendar({
        // Start life looking at this date
        date : new Date(2020, 9, 12),

        // CrudManager arranges loading and syncing of data in JSON form from/to a web service
        crudManager : {
            transport : {
                load : {
                    url : 'data/data.json'
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
            day  : null,
            year : null
        },

        tbar : {
            items : {
                showAllDayEvents : {
                    type       : 'button',
                    text       : 'L{Show all day events}',
                    toggleable : true,
                    pressed    : true,
                    onToggle({ pressed }) {
                        if (!pressed) {
                            calendar.eventStore.filter({
                                id       : 'allday',
                                filterBy : record => !record.allDay
                            });
                        }
                        else {
                            calendar.eventStore.removeFilter('allday');
                        }
                    }
                },
                myButton : {
                    type : 'button'
                }
            }
        }
    }),

    { myButton } = calendar.tbar.widgetMap;

// update localization after load
updateLocalization();
