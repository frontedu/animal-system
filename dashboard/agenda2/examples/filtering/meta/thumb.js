const input = bryntum.fromElement(document.querySelector('input[placeholder="Highlight tasks"]'));
input.value = 's';

// raise flag for thumb generator indicating page is ready for taking screenshot
window.__thumb_ready = true;
