/* global shared */
shared.fireMouseEvent('contextmenu', document.querySelector('.b-grid-header'));
shared.fireMouseEvent('mouseover', document.querySelector('[data-ref="listRangeItem"]'));

// raise flag for thumb generator indicating page is ready for taking screenshot
window.__thumb_ready = true;
