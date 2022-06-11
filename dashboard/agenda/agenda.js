document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        
      initialView: 'dayGridMonth',

      timeZone: 'UTC',
      dayMaxEvents: true, 
      events: [
        {}
      ],

      dateClick: function(info) {
        console.log('Date: ' + info.dateStr);
        // console.log('Resource ID: ' + info.resource.id);

        info.dayEl.style.backgroundColor = 'red';

      },

    });

    calendar.render();
});
