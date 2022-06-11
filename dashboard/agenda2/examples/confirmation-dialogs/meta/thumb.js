/* global shared */
function init() {
    const eventEl = document.querySelector('.b-weekview .b-cal-event-wrap[data-event-id="17"]');

    if (eventEl && shared) {
        shared.fireMouseEvent('mouseover', eventEl);
        shared.fireMouseEvent('mousedown', eventEl);
        shared.fireMouseEvent('mousemove', eventEl, [0, -100]);
        shared.fireMouseEvent('mousemove', eventEl.parentNode, [0, 42 * 6.2]);
        shared.fireMouseEvent('mouseup', eventEl.parentNode, [0, 42 * 6.2]);

        window.__thumb_ready = true;
    }
    setTimeout(init, 500);
}
init();
