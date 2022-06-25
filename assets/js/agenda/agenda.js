document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    //Array de eventos
    var events = [
      {
        title: 'All Day Event',
        start: '2022-06-01'
      },
      {
        title: 'Long Event',
        start: '2022-06-07',
        end: '2022-06-10'
      },
      {
        groupId: 999,
        title: 'Repeating Event',
        start: '2022-06-09T16:00:00'
      },
      {
        groupId: 999,
        title: 'Repeating Event',
        start: '2022-06-16T16:00:00'
      },
      {
        title: 'Conference',
        start: '2022-06-11',
        end: '2022-06-13'
      },
      {
        title: 'Meeting',
        start: '2022-06-12T10:30:00',
        end: '2022-06-12T12:30:00'
      },
      {
        title: 'Lunch',
        start: '2022-06-12T12:00:00'
      },
      {
        title: 'Meeting',
        start: '2022-06-12T14:30:00'
      },
      {
        title: 'Happy Hour',
        start: '2022-06-12T17:30:00'
      },
      {
        title: 'Dinner',
        start: '2022-06-12T20:00:00'
      },
      {
        title: 'Birthday Party',
        start: '2022-06-13T07:00:00'
      },
      {
        title: 'Click for Google',
        url: 'http://google.com/',
        start: '2022-06-28'
      }
    ];

    // document.getElementById("adicionarEvento").addEventListener("click", adicionarEvento)
    // let openModalTailwindBtn = document.getElementById("openModalTailwind");

    // function configurarBtn() {
    //   openModalTailwindBtn.setAttribute("data-modal-toggle", "defaultModal");
    //   openModalTailwindBtn.setAttribute("data-modal-target", "defaultModal");
    // }
    // configurarBtn();

    // function adicionarEvento() {
    //   events.push({
    //     title: 'Teste',
    //     start: '2022-06-19',
    //     end: '2022-06-19'
    //   })

    //   initCalendar();
    // }

    document.getElementById("saveEvent").addEventListener("click", saveEvent)

    document.getElementById("closeModal").addEventListener("click", () => {
        document.getElementById("modalArtesanal").classList.toggle("escondido")
    })

    let openModalArtesanal   = document.getElementById("openModalArtesanal");
    
    openModalArtesanal.addEventListener("click", function() {
        document.getElementById("modalArtesanal").classList.toggle("escondido")
    })

    function validateForm() {
      let title = document.getElementById("title-event").value;
      let start_date = document.getElementById("start-date-event").value;
      let start_time = document.getElementById("start-time-event").value;
      let end_date = document.getElementById("end-date-event").value;
      let end_time = document.getElementById("end-time-event").value;

      if(title == "" || start_date == "" || start_time == "" || end_date == "" || end_time == "") {
          alert("Preencha todos os campos!");
          return false;
      } else {
          return true;
      }
    }

    function saveEvent() {

      let isValid = validateForm();

      if(isValid == true) {
        let start_date = document.getElementById("start-date-event").value;
        let start_time = document.getElementById("start-time-event").value;

        let end_date = document.getElementById("end-date-event").value;
        let end_time = document.getElementById("end-time-event").value;

        let start_formatted = start_date + "T" + start_time + ":00";
        let end_formatted = end_date + "T" + end_time + ":00";

        console.log(start_time)
        console.log(end_time)

        var event = {
          title: document.getElementById("title-event").value,
          start: start_formatted,
          end: end_formatted
        };

        console.log(event)

        events.push(event);

        document.getElementById("modalArtesanal").classList.toggle("escondido");
        resetFormValues();

        initCalendar();
      }

    }

    function resetFormValues() {
      document.getElementById("title-event").value = "";
      document.getElementById("start-date-event").value = "";
      document.getElementById("start-time-event").value = "";
      document.getElementById("end-date-event").value = "";
      document.getElementById("end-time-event").value = "";
    }

    function initCalendar() {
      //Inicializa um novo calendário com os novos eventos
      let newCalendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
          left: 'prevYear,prev,next,nextYear today',
          center: 'title',
          right: 'dayGridMonth,dayGridWeek,dayGridDay'
        },
        initialDate: dataAtual,
        navLinks: true, // can click day/week names to navigate views
        editable: true,
        dayMaxEvents: true, // allow "more" link when too many events
        events: events
      });

      newCalendar.render();
    }

    //Recebe um objeto Date e retorna uma string no formato YYYY-MM-DD
    function formatarData(data) {
      var dia = data.getDate();
      var mes = data.getMonth() + 1;
      var ano = data.getFullYear();

      if (dia < 10) {
          dia = '0' + dia;
      }

      if (mes < 10) {
          mes = '0' + mes;
      }

      return ano + '-' + mes + '-' + dia;
    }

    //Recebe um objeto Date e retorna uma string no formato YYYY-MM-DD

    var dataAtual = formatarData(new Date());

    //Inicializa o calendário
    var calendar = new FullCalendar.Calendar(calendarEl, {
      headerToolbar: {
        left: 'prevYear,prev,next,nextYear today',
        center: 'title',
        right: 'dayGridMonth,dayGridWeek,dayGridDay'
      },
      initialDate: dataAtual,
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      dayMaxEvents: true, // allow "more" link when too many events
      events: events
    });

    calendar.render();
});
