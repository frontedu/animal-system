/* global calendar */
calendar.activeView.scrollEventIntoView(calendar.activeView.eventStore.first).then(() => {
    window.__thumb_ready = true;
});
