var Calculator = require('../lib/calculator');

//  Very primitive example of using this in the browser...
var calcBtn = document.getElementById('calcBtn');
var resetBtn = document.getElementById('resetBtn');
var input = document.getElementById('calcInput');
var result = document.getElementById('calcResult');
var error = document.getElementById('calcError');
var calculator = new Calculator.Calculator();

var hide = function (el) {
    if (el.style.display === '') {
        el.style.display = 'none';
    }
}

var show = function (el) {
    if (el.style.display === 'none') {
        el.style.display = '';
    }
}

var runCalculation = function () {
    var calcResult = calculator.calc(input.value);

    if (calcResult.error) {
        error.innerText = 'Error: ' + calcResult.errorMessage;

        hide(result);
        show(error);
    } else {
        result.innerText = 'Result: ' + calcResult.result;

        hide(error);
        show(result);
    }
}

var addListener = function (el, event, fn) {
    if (el.addEventListener) {
        el.addEventListener(event, fn, false);
    } else if (btn.attachEvent) {
        el.attachEvent(event, fn);
    }
}

addListener(calcBtn, 'click', runCalculation);
addListener(resetBtn, 'click', function () {
    input.value = '';
    result.innerText = '';
    error.innerText = '';
    hide(error);
    show(result);
});
