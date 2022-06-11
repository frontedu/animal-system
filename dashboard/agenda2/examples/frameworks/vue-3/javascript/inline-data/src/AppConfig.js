/**
 * Application configuration
 */
export const useCalendarConfig = () => {
    return {
        // Start life looking at this date
        date: new Date(2020, 9, 11),

        // Features named by the properties are included.
        // An object is used to configure the feature.
        eventTooltipFeature: {
            // Configuration options are passed on to the tooltip instance
            // We want the tooltip's left edge aligned to the right edge of the event if possible.
            align: 'l-r'
        },

        // Modes are the views available in the Calendar.
        // An object is used to configure the view.
        modes: {
            year: false
        }
    };
};
