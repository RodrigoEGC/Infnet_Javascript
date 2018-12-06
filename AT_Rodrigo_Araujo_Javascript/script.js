/*
Assessment: Javascript
Prof: Paulo Marinho
Aluno: Rodrigo Araújo
Turma: [GRPEDC01C1-M1-P1] - Classe 2 - Manhã
Referências: 
Youtube: https://www.youtube.com/watch?v=U0I6Z06N0kM
Site: https://developer.mozilla.org/pt-BR/docs/Web/API
Site: https://api.jquery.com/
*/

(function (){//Criando variaveis globais e um array das cartas
  var imagens = ['img/01.png','img/02.png','img/03.png','img/04.png','img/05.png','img/06.png','img/07.png','img/08.png','img/00.png'];
  var imgPares = imagens.concat(imagens).sort();//Aqui retorno o array com todo elementos unidos de forma ordenado ou não.
  var start = false, click = 0, face = "", contagem = 0, intervalo;
  var storage = window.localStorage;// Salva dados ao armazenamento local atual

  app.jogodamemoria = function(imagens) {//Aqui utilizo o metodo .splice()para alterar e adciona os pares de cada carta.  
    let cards = "";
    imgPares.splice($.inArray('img/00.png', imgPares),2);
    for (var i = 0; i < 16; i++) {
      cards += ` <div id="${i}" class="carta virada" onclick="app.virarCarta($(this));">
                    <div class="face"><img src="${imgPares[i]}"></div>
                    <div class="verso"><img src="${imagens[8]}"></div>
                  </div>`;
    }
    $('#container').html(cards);
  }
//Função Iniciar
  app.start = function(btn) {
    btn.html('Reiniciar');
    if(!start) {
      let imgRandon = imgPares.sort(function(){return 0.5 - Math.random()});
      $('#jogodamemoria .carta .face img').each(function(i){
        $(this).attr("src",imgRandon[i]);
      });
      setTimeout(function(){
        $('#jogodamemoria .carta .face').slideDown("slow").fadeOut("slow");
        start = true;
        cronometro($('#tempo'));
      }, 3000);
    } else {
      location.reload();
    }
  }

  app.rank = function(){
    var dbb = storage.getItem('db');
    window.alert(`Melhor tempo atual é: ${dbb}`);
  };
    
  function win(check) {
    if (check === 7) {
      window.alert("Fim de Jogo!")
      clearInterval(intervalo);
      var novoTempo = $('#tempo').text();
      save(novoTempo);
      location.reload();
    }
  }
    
/*A logica para comparar as cartas, é você ter uma função, que ao realizar o evento click 
numa carta, o jogo irá salvar essa entrada atribuindo a sua source correspondente.
Apos selecionada duas cartas, comparo se o par corresponde a mesma source,
*/
  function comparaCartas(carta, click) {
    let compare = false;
    if (click === 0){
      face = carta.children('.face').children().attr('src');//obtendo o filho de cada elemento
      carta.addClass("tentativa");//adciona a uma classe especifica
    } else if (click === 1) {
      if(face === carta.children('.face').children().attr('src')) {
        compare = true;
      }
      carta.addClass("tentativa");
    }
    return compare;
  }
/*
Através dessa função retorno o tempo armazenado no local storage.
O DBB armazena dados em um campo que pode ser um objeto ou uma matriz.
db banco de dados de consulta.
*/
  function save(novoTempo) {
      var dbb = storage.getItem('db');//o método getItem() da interface Storage retornará o seu valor.
      if(dbb == null) {
        storage.setItem('db', novoTempo);
      } else {
        if(novoTempo < dbb ) {
          storage.setItem('db', novoTempo);//O método setItem() da interface Storage irá adicionar "o tempo" ao storage, ou atualizar o valor caso a chave já exista.
        }
      }
  }

  function cronometro(element) {
    var dateInicial = new Date();//O objeto Date()é um utilitário que fornece JavaScript para criar datas e horas.
    intervalo = setInterval(function() {
      var dateAtual = new Date();//Usando funções getHours(), getMinutes()e getSeconds()o objeto Date, o relógio exibe apenas as informações de tempo.
      var contador = new Date(dateAtual - dateInicial);//Se a hora, minuto ou segundo forem menores que 9, o JavaScript não adiciona o 0 na frente, portanto, o resultado não é totalmente satisfatório.
      var minutoAtual = (contador.getMinutes() <= 9) ? `0${contador.getMinutes()}` : `${contador.getMinutes()}`;//O código a seguir resolve esse problema adicionando um 0 quando necessário.
      var segundotual = (contador.getSeconds() <= 9) ? `0${contador.getSeconds()}` : `${contador.getSeconds()}`;
      element.html(minutoAtual + ":" + segundotual);
    }, 1000);
  }

  app.virarCarta = function(carta) {
    if (start) {
      carta.addClass("virada").children('.face').slideDown("slow").fadeIn("slow");
        if(comparaCartas(carta,click)) {
          $('#jogodamemoria .tentativa').each(function(i){
            $(this).removeClass('tentativa');
          });
          click = 0;
          contagem ++;
          setTimeout(function(){ win(contagem) }, 800);
        } else {
          if (click == 1){
            start = false;
            setTimeout(function(){
              $('#jogodamemoria .tentativa').each(function(i){
                $(this).removeClass('tentativa').removeClass('virada').children('.face').slideUp("slow").fadeOut("slow");
              });
              start = true;
            }, 1500);
            click = 0;
          } else {
            click ++;
          }
        }
    }
  }

  app.inicio = function() {
    var strHtml = `<div id="hud" class="hud">
                    <div class="container">
                      <button onclick="app.start($(this));" class="btn" type="button">Iniciar</span></button>
                      <button onclick="app.rank();" class="btn btn-secondary" type="button">Melhor Tempo</span></button>
                      <div id="tempo" class="tempo">00:00</div>
                    </div>
                  </div>
                  <div id="container" class="container"></div>`;
    $('#jogodamemoria').html(strHtml);
    app.jogodamemoria(imagens);
  }
})();
$( document ).ready(function() {
  app.inicio();
});