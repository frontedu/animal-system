$(document).ready(() => {

  $("#cadastrar").click(function () {
    $("#container-opcao-cadastro").toggle("slow")
  });

  $("#reenviar-senha").click(function () {

    $("#opcao-senha").toggle("slow");
    $("#container-opcao-cadastro").hide();
  })

  $("#btn-email").on("click", function (event) {

    $("#container-opcao-cadastro").hide();

    if ($("#envio-senha").css("display", "none"))
      $("#envio-senha").css("display", "block")

    if ($("#div-reenvio-whats").css("display", "block"))
      $("#div-reenvio-whats").css("display", "none");

    if ($("#div-reenvio-email").css("display", "none")) {
      $("#div-reenvio-email").css("display", "block");
      $("#mensagem-email").css("padding-bottom", "0px").css("margin-bottom", "0px");

    }  
    if ($("#div-btn-enviar-senha").css("display", "none"))
      $("#div-btn-enviar-senha").css("display", "flex");    
   
  })

  $("#btn-whatsapp").on("click", function (event) {

    $("#container-opcao-cadastro").hide();

    if ($("#envio-senha").css("display", "none"))
      $("#envio-senha").css("display", "block")

    if ($("#div-reenvio-email").css("display", "block"))
      $("#div-reenvio-email").css("display", "none");

    if ($("#div-reenvio-whats").css("display", "none")) {
      $("#div-reenvio-whats").css("display", "block");
      $("#mensagem-whatsapp").css("padding-bottom", "0px").css("margin-bottom", "0px");
    }

    if ($("#div-btn-enviar-senha").css("display", "none"))
      $("#div-btn-enviar-senha").css("display", "flex");
  })

  $("#btn-enviar-senha").on("click", function() {
    $("#confirmacao-envio").css("display", "flex")
  })

  $("#btn-fechar-popup").on("click", function(){
    $("#confirmacao-envio").css("display", "none")
  })

  async function login(event) {
    let emailInput = $("#login-email-input").val()
    let senhaInput = $("#login-senha-input").val()
    let msgError   = '';

    if(emailInput == null || emailInput == '') {
      msgError = 'Por favor, preencha o campo de E-mail';
    } else if(senhaInput == null || senhaInput == '') {
      msgError = 'Por favor, preencha o campo de Senha';
    } else {
      let objLogin = {
        email: emailInput,
        senha: senhaInput
      };

      let rawResponse = await fetch('http://localhost:3000/login', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(objLogin),
      })

      let response = await rawResponse.json();
      console.log(response)

      if(response != null) {
        if(response.auth != null) {
          localStorage.setItem('logged', response.auth);
        }

        if(response.error) {
          showSnackbar(response.error, 'error')
        } else {
          showSnackbar('Autenticado com sucesso! Redirecionando...', 'success');
          setTimeout(() => {
            window.location.href = '/dashboard/';
          }, 1500);
        }
      }
    }

    if(msgError != '') {
      showSnackbar(msgError, 'error')
    }
  }

  function showSnackbar(message, type = 'info') {
    const toast     = document.getElementById('toast');
    const toastBody = toast.querySelector('.toast-body');

    toast.classList.remove('visible');
    toastBody.classList.remove('info');
    toastBody.classList.remove('success');
    toastBody.classList.remove('error');

    toastBody.innerHTML = message;

    if(['info', 'success', 'error'].includes(type)) {
      toastBody.classList.add(type);
    } else {
      toastBody.classList.add('info');
    }

    toast.classList.add('visible');
    
    setTimeout(() => {
      toast.classList.remove('visible');
    }, 3000);
  }

  $("#login-button").on("click", login)

});