// Data comes down asynchronously, wait for it to arrive
setTimeout(() => {
    window.shared.fireMouseEvent('click', document.querySelector('.b-list-item[data-id="hotel"]'));

    // raise flag for thumb generator indicating page is ready for taking screenshot
    setTimeout(() => window.__thumb_ready = true, 100);
}, 1000);
