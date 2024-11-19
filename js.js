let currentNumberRawString = "0";
let currentNumber = 0;
let isFloat = false;
let processQueue = [];

let upperDisplay = document.body.querySelector(".upper");
let mainDisplay = document.body.querySelector(".main");


let numberButtons = document.body.querySelectorAll(".num");
for (numberButton of numberButtons) {
    numberButton.addEventListener("click", e => {
        let currDigit = e.target.innerText;
        isFloat ? renderFloat(currDigit) : renderInt(currDigit);
    })
}


let decimalPoint = document.body.querySelector(".decimal");
decimalPoint.addEventListener("click", () => {
    if (!isFloat) {
        isFloat = true;
        currentNumberRawString += ".";
        mainDisplay.innerText = currentNumberRawString;
    }
})


let operandButtons = document.body.querySelectorAll(".operand");
for (operandButton of operandButtons) {
    operandButton.addEventListener("click", e => {
        // 0 -> first number, 2 -> second number for operands taking 2 arguments
        if (processQueue.length == 0 || processQueue.length == 2) processQueue.push(currentNumber)
        
        // 1 -> overwriting operand
        else if (processQueue.length == 1) 1==1
        
    })
}


function renderInt(nStr) {
    if (currentNumberRawString == "0") {
        if (nStr != "0") {
            currentNumberRawString = nStr
        } 
    } else {
        currentNumberRawString += nStr;
    }
    currentNumber = parseInt(currentNumberRawString, 10);
    mainDisplay.innerText = currentNumberRawString;
}

function renderFloat(nStr) {
    currentNumberRawString += nStr;
    currentNumber = parseFloat(currentNumberRawString, 10);
    mainDisplay.innerText = currentNumberRawString;
}