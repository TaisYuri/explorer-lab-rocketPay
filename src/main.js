import "./css/index.css";
import IMask from "imask";

//Captura os seletores por classe
const cc = document.querySelector('.cc')
const ccReverse = document.querySelector('.cc-reverse')
const ccReverseDisplay = document.querySelector('.cc-reverse-display')
const ccbgColor = document.querySelector(".cc-bg svg > g g:nth-child(1) path");
const ccgbColor2 = document.querySelector(".cc-bg svg > g g:nth-child(2) path");
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img");
const ccLogoBank = document.querySelector("#logo-bank");

function setCardType(type) {
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    amex: ['#016fd0','#7594b0'],
    hipercard: ['#8d0f16','#d80a12'],
    elo: ['#00a4e0','#ffcb05'],
    default: ["black", "gray"],
  };

  const banks = {
    visa: 'nubank',
    mastercard: 'bradesco',
    amex: 'santander',
    hipercard: 'banco-do-brasil',
    default: 'nubank',
  }

  //muda o atributo para cor e logo
  ccbgColor.setAttribute("fill", colors[type][0]);
  ccgbColor2.setAttribute("fill", colors[type][1]);
  ccLogo.setAttribute("src", `cc-${type}.svg`);
  ccLogoBank.setAttribute("src",`${banks[type]}.svg`)
}

//Adiciona a função para ser usada de forma global
globalThis.setCardType = setCardType;


const securityCode = document.querySelector("#security-code");
const securityCodePattern = { mask: "0000" };
const securityCodeMasked = IMask(securityCode, securityCodePattern);

//ON - segue o mesmo raciociono que addEventListener
//accept - aceito pela mascara
securityCodeMasked.on('accept',() => {
    
    const ccSecurity = document.querySelector('.cc-security .value')
    ccSecurity.innerText = securityCodeMasked.value.length === 0 ? '123' : securityCodeMasked.value
})

//Animação de rotação do card
securityCode.addEventListener('focus', () => {
    cc.classList.remove('animation-reverse')
    cc.classList.add('animation')
    ccReverse.style.display='none'
    ccReverseDisplay.style.display='block'
})

securityCode.addEventListener('blur', () => {
    cc.classList.remove('animation')
    cc.classList.add('animation-reverse')
    ccReverse.style.display='block'
    ccReverseDisplay.style.display='none'
})


const expirationDate = document.querySelector("#expiration-date");
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
      YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2),
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  },
};
const expirationDateMasked = IMask(expirationDate, expirationDatePattern);

expirationDateMasked.on('accept', () => {
    const ccExpiration = document.querySelector('.cc-expiration .value')
    ccExpiration.innerText = expirationDateMasked.value.length === 0 ? '02/32' : expirationDateMasked.value
})

const cardNumber = document.querySelector("#card-number");
const cardNumberPattern = { 
    mask: [
        { 
            mask: '0000 0000 0000 0000',
            regex: /^4\d{0,15}/,
            cardType: 'visa',
        },
        { 
            mask: '0000 0000 0000 0000',
            regex: /(^5[1-5]\d{0,2}|^22[2,9]\d|^2[3,7]\d{0,2})\d{0,12}/,
            cardType: 'mastercard',
        },
        { 
            mask: '0000 0000 0000 0000',
            regex:/^3[47][0-9]\d{0,13}/,
            cardType: 'amex',
        },
        { 
            mask: '0000 0000 0000 0000',
            regex:/^606282|^3841(?:[0|4|6]{1})\d{0,13}/,
            cardType: 'hipercard',
        },
        { 
            mask: '0000 0000 0000 0000',
            regex:/^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^627780\d{0,13}/,
            cardType: 'elo',
        },
        { 
            mask: '0000 0000 0000 0000',
            cardType: 'default',
        },
    ],
    dispatch: function( appended, dynamicMasked){  //função que atualizará a cada digito informado via input
        const number = (dynamicMasked.value + appended).replace(/\D/g,'');     //como um MAP, somará o APPENDED ao DYNAMICMASKED.value a cada inputada e dará replace caso tenha algum NÃO DIGITO
        const foundMask = dynamicMasked.compiledMasks.find( function (item){   //realiza uma busca e caso o regex coincida com o do input retornará o foundMask com o objeto encontrado
            return number.match(item.regex)
        })
        return foundMask
    }
};
const cardNumberMasked = IMask(cardNumber,cardNumberPattern)

cardNumberMasked.on('accept', () => {
    const cardType = cardNumberMasked.masked.currentMask.cardType
    setCardType(cardType)
    const ccNumber = document.querySelector('.cc-number')
    ccNumber.innerText = cardNumberMasked.value.length === 0 ? '1234 5678 9012 3456' : cardNumberMasked.value
})


const cardHolder = document.querySelector('#card-holder')
cardHolder.addEventListener('input', () => {
    const ccHolder = document.querySelector('.cc-holder .value')
    ccHolder.innerText = cardHolder.value.length === 0 ?  'FULANO DA SILVA' : cardHolder.value
})


/*
 VISA
 Inicia com 4 seguido de + 15 digitos
 4234234423432344
 MASTER
 Inicia com 5, seguido de um digito entre 1 e 5, seguido de mais 2 digitos        5[1-5]\d{0,2}
 OU inicia com 22, seguido de um digito entre 2 e 9, seguido de mais 1 digito     22[2,9]\d
 OU inicia com 2, seguido de um digito entre 3 e 7, seguido de mais 2 digitos     2[3,7]\d{0,2}
 seguido de mais 12 digitos
 5353535353535353
 2323232323232323
 2223232323232323
*/
/*
Amex: ^3[47][0-9]{13}$    -ex: 379741
Hipercard: ^606282|^3841(?:[0|4|6]{1})0    -ex: 606282
Elo: /^4011(78|79)|^43(1274|8935)|^45(1416|7393|763(1|2))|^50(4175|6699|67[0-6][0-9]|677[0-8]|9[0-8][0-9]{2}|99[0-8][0-9]|999[0-9])|^627780|^63(6297|6368|6369)|
^65(0(0(3([1-3]|[5-9])|4([0-9])|5[0-1])|4(0[5-9]|[1-3][0-9]|8[5-9]|9[0-9])|5([0-2][0-9]|3[0-8]|4[1-9]|[5-8][0-9]|9[0-8])|7(0[0-9]|1[0-8]|2[0-7])|9(0[1-9]|[1-6][0-9]|7[0-8]))|16(5[2-9]|[6-7][0-9])|
50(0[0-9]|1[0-9]|2[1-9]|[3-4][0-9]|5[0-8]))/   -ex: 627780
Visa: ^4[0-9]{15}$
Mastercard: ^((5(([1-2]|[4-5])[0-9]{8}|0((1|6)([0-9]{7}))|3(0(4((0|[2-9])[0-9]{5})|([0-3]|[5-9])[0-9]{6})|[1-9][0-9]{7})))|((508116)\\d{4,10})|((502121)\\d{4,10})|((589916)\\d{4,10})|(2[0-9]{15})|(67[0-9]{14})|(506387)\\d{4,10})

Aura: /^((?!504175))^((?!5067))(^50[0-9])/
Banese Card: '^636117'
Cabal: '(60420[1-9]|6042[1-9][0-9]|6043[0-9]{2}|604400)'
Diners: '(36[0-8][0-9]{3}|369[0-8][0-9]{2}|3699[0-8][0-9]|36999[0-9])
Discover: /^6(?:011|5[0-9]{2})[0-9]{12}/
Fort Brasil: '^628167'
GrandCard: '^605032'
JCB: /^(?:2131|1800|35\d{3})\d{11}/
Personal Card: '^636085'
Sorocred: '^627892|^636414'
Valecard: '^606444|^606458|^606482'
*/ 

const addButton = document.querySelector('#add-card')
addButton.addEventListener('click', () => alert('Cartão adicionado'))

//não recarrega a pagina quando houver clique do botão (evento padrão)
document.querySelector('form').addEventListener('submit', (event) => event.preventDefault())