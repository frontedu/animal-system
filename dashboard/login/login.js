$(document).ready(() => {

  $("#cadastrar").click(function () {
    $("#container-opcao-cadastro").toggle("slow")
  });

  $("#reenviar-senha").click(function () {
    $("#opcao-senha").toggle("slow")
  })

  $("#btn-email").on("click", function (event) {

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


});