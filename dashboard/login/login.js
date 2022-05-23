// var div_cadastro = document.getElementById("opcao-cadastro");
// var btn_cadastrar = document.getElementsByClassName("cadastrar");

// function mostrarOpcoesDeCadastro() {
//     div_cadastro.style.display =  "flex";
// }


$(document).ready(() => {

  $("input[name='usuario-input']").focus();

  $("#cadastrar").click(function () {
    $("#opcao-cadastro").css("display", "flex");
  });

  $("#reenviar-senha").click(function () {
    $("#opcao-senha").css("display", "flex");
  })

  // $("#cadastrar").on("click", function () {
  //   $("#opcao-cadastro").css("display", "flex");
  // });

  // $("#reenviar-senha").on("click", function () {
  //   $("#opcao-senha").css("display", "flex");
  // });

  $("#reenviar-senha").click(function (event) {
    $("#opcao-senha").css("display", "flex");
  })

  // $("#btn-e-mail").click(function () {
  $("#btn-e-mail").on("click", function () {
    $("#input-envio-senha").css("display", "none");
    $("#input-envio-senha").css("display", "flex");
    $("#p-whatsapp").css("display", "none");
    $("#input-whatsapp").css("display", "none");

    
    $("#input-envio-senha").prepend("<input type='email' id='input-email' placeholder='e-mail@e-mail.com.br' required>")
    .focus()
    .css("margin-top", "0px");
  
    $("#input-envio-senha").prepend("<p id='p-e-mail'> Informe o e-mail cadastrado no sistema: </p")
    .css("display", "block")
    .css("padding-botton", "0px");
    
  })

  // $("#btn-whatsapp").click(function () {
  $("#btn-whatsapp").on("click", function () {
    $("#input-envio-senha").css("display", "none");
    $("#input-envio-senha").css("display", "flex");
    $("#p-e-mail").css("display", "none");
    $("input-email").css("display", "none");

    
    $("#input-envio-senha").prepend("<input type='tel' id='input-whatsapp' placeholder='(34)99999-9999' required>");
    
    $("#input-envio-senha").prepend("<p id='p-whatsapp'> Informe o seu número de whatsapp cadastrado no sistema: </p")
      .css("display", "block")
      .css("padding-botton", "0px")
      .css("margin-botton", "0px");
    
      $("#input-envio-senha").focus();
  })
})