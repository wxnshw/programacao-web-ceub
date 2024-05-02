let botaoConverter = document.getElementById("botao-converter");
botaoConverter.addEventListener("click", converter);

let botaoLimpar = document.getElementById("botao-limpar");
botaoLimpar.addEventListener("click", limpar);

let botaoInverter = document.getElementById("botao-inverter");
botaoInverter.addEventListener("click", inverter);

let botaoAceitaMensagem = document.getElementById("botao-aceita-mensagem");
botaoAceitaMensagem.addEventListener("click", aceitaMensagem);



function salvaResultadoNoHistorico(conversao){
    recuperaHistoricoDeConversoes();
    let conversaoEmJson = JSON.stringify(conversao);
    localStorage.setItem("historico", conversaoEmJson);
}

function recuperaHistoricoDeConversoes(){
    let historico = localStorage.getItem("historico");
    let historicoConvertido = JSON.parse(historico);
}

let valorUsuario = document.getElementById("valor-usuario");
valorUsuario.addEventListener("keypress", function(event) {

    console.log(event);

    if(event.ctrlKey == true && event.code == "KeyI") {
        inverter();
    }

    if(event.ctrlKey == true && event.code == "KeyL") {
        limpar();
    }

    if(event.key == "Enter") {
        converter();
    }

});

function aceitaMensagem() {
    let divMensagemUsuario = document.getElementById("mensagem-usuario");
   
    divMensagemUsuario.style.display = "none";

    localStorage.setItem("aceitouCookie", "1");
    
}

function limpar() {
    let valorUsuario = document.getElementById("valor-usuario");
    let resultado = document.getElementById("resultado");

    valorUsuario.value = "";
    resultado.textContent = "";
}

function buscaAPI(moedaOrigem="USD", moedaDestino="BRL"){
    let parametro = moedaOrigem + "-" + moedaDestino;
    let url = "https://economia.awesomeapi.com.br/json/last/" + parametro;
    console.log(url);
    return fetch(url).then(function(data){
            if(data.status == 200){
                console.log("Retorno código 200 API!")
            }
            return data.json();
        }).then(function(response){
            return response[moedaOrigem + moedaDestino];
        }).catch()
}

function converter() {
    let valorUsuario = document.getElementById("valor-usuario").value;

    let moedaOrigem  = document.getElementById("moeda1").value;
    let moedaDestino = document.getElementById("moeda2").value;
    
    if(moedaOrigem == "real"){
        urlAPIParametroMoedaOrigem = "BRL";
    }
    if(moedaOrigem = "dolar"){
        urlAPIParametroMoedaOrigem = "USD";
    }
    if(moedaOrigem = "euro"){
        urlAPIParametroMoedaOrigem = "EUR"
    }

    if(valorUsuario == "") {
        alert("Valor não pode ser vazio!");
        return;
    }

    if(moedaOrigem == moedaDestino) {
        alert("As moedas são iguais, não é possível converter");
        return;
    }

    buscaAPI(urlAPIParametroMoedaOrigem, moedaDestino).then(function(response){
        let conversao = valorUsuario * response["ask"];
        console.log(conversao);

        let simbolo = "";
        if (moedaDestino == "BRL") {
            simbolo = "R$";
        }
        if (moedaDestino == "USD") {
            simbolo = "US$"
        }
        if (moedaDestino == "EUR") {
            simbolo = "€";
        }

        let resultado = document.getElementById("resultado");
        resultado.textContent = simbolo + "" + conversao;

        let resultadoConversao = {
            valor: valorUsuario,
            moeda1: moedaOrigem,
            moeda2: moedaDestino,
            resultado: conversao
        }
    
        salvaResultadoNoHistorico(resultadoConversao);
    });
    return;




    let paragrafoResultado = document.getElementById("resultado");
    paragrafoResultado.textContent = simbolo + " " + conversao.toFixed(2);



}

function inverter() {
    let moeda1 = document.getElementById("moeda1").value;
    let moeda2 = document.getElementById("moeda2").value;

    document.getElementById("moeda1").value = moeda2;
    document.getElementById("moeda2").value = moeda1;
}


if(localStorage.getItem("aceitouCookie") == "1"){
    let caixa = document.getElementById("mensagem-usuario")
    caixa.style.display = "none";
}


