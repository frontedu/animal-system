const
    sourceEl = document.querySelector('.b-grid-row[data-index="2"]'),
    destEl   = document.querySelector('.b-dayview-day-detail[data-date="2020-10-14"]');

// Start the drag
window.shared.fireMouseEvent('mousedown', sourceEl);
for (let i = 0; i < 10; i++) {
    window.shared.fireMouseEvent('mousemove', sourceEl, [-i, 0]);
}

// Drag on target
window.shared.fireMouseEvent('mousemove', destEl, [0, -200]);

// raise flag for thumb generator indicating page is ready for taking screenshot
window.__thumb_ready = true;
