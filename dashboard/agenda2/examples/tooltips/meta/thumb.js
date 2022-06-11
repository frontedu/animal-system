/* global shared */
shared.fireMouseEvent('mouseover', document.querySelector('.b-cal-event-wrap[data-event-id="4"]'), [10, 10]);

setTimeout(() => {
    // raise flag for thumb generator indicating page is ready for taking screenshot
    window.__thumb_ready = true;
}, 300);
