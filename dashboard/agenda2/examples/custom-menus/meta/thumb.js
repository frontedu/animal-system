/* global shared */
function init() {
    const eventEl = document.querySelector('.b-weekview .b-cal-event-wrap[data-event-id="18"]');

    if (eventEl && shared) {
        shared.fireMouseEvent('contextmenu', eventEl);

        window.__thumb_ready = true;
    }
    setTimeout(init, 500);
}
init();
