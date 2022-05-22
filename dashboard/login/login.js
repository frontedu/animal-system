// var div_cadastro = document.getElementById("opcao-cadastro");
// var btn_cadastrar = document.getElementsByClassName("cadastrar");

// function mostrarOpcoesDeCadastro() {
//     div_cadastro.style.display =  "flex";
// }


$(document).ready(() => {
    $("#cadastrar").click(function(){
        $("#opcao-cadastro").css("display", "flex");
      });
})

