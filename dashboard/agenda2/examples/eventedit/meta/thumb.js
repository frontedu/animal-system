/* global shared */
shared.fireMouseEvent('click', document.querySelector('.b-cal-event-wrap'));
shared.fireMouseEvent('click', document.querySelector('.b-tool[data-ref="edit"]'));

// raise flag for thumb generator indicating page is ready for taking screenshot
window.__thumb_ready = true;
