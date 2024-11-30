let currentNumberRawString = "0";
let currentNumber = 0;
let processQueue = [0]
let prevActiveOperand = null;

let operations = {
    "plus" : "+",
    "minus" : "-",
    "multiply" : "*",
    "divide" : "/",
    "equals" : "=",
    "clear" : clearDisplay,
    "sign" : changeSign,
    "backspace" : backspace,
}

let upperDisplay = document.body.querySelector(".upper");
let mainDisplay = document.body.querySelector(".main");

let numberButtons = document.body.querySelectorAll(".num");
let operandButtons = document.body.querySelectorAll(".operand");
let decimalPoint = document.body.querySelector(".decimal");


decimalPoint.addEventListener("click", () => {
    if (!currentNumberRawString.includes(".")) {
        currentNumberRawString += ".";
        mainDisplay.innerText = currentNumberRawString;
    }
})

for (numberButton of numberButtons) {
    numberButton.addEventListener("click", e => {
        let currDigit = e.target.innerText;
        renderNumber(currDigit);
    })
}

for (operandButton of operandButtons) {
    operandButton.addEventListener("click", e => {
        let operationPressed = e.target;
        // clear, sign, backspace can be called anytime
        if (operationPressed.id == "clear" || operationPressed.id == "sign" || operationPressed.id == "backspace") {
            operations[operationPressed.id].call();
        } 

        else {
            switch (processQueue.length) {
                // 1 -> add operand to queue if in +-*/
                case 1:
                    if (operationPressed.id != "equals") {
                        processQueue.push(operations[operationPressed.id])
                        showCurrentOperand(operationPressed);
                        renderUpperDisplay();
                        currentNumberRawString = "0";
                        currentNumber = 0;
                        mainDisplay.innerText = currentNumberRawString;
                    }
                    break
                
                // 2 -> change current operand if not equals, eval if equals
                case 2:
                    if (operationPressed.id != "equals") {
                        processQueue[1] = operations[operationPressed.id]
                        showCurrentOperand(operationPressed);
                        renderUpperDisplay();
                    } else {
                        processQueue.push(0);
                        operate(processQueue);
                    }
                    break;

                // 3 -> eval first, if operand in +-*/ then take the result as the first number of the new queue
                case 3:
                    operate(processQueue)
                    processQueue.push("=")
                    if (operationPressed.id != "equals") {
                        processQueue = [currentNumber, operations[operationPressed.id]]
                        showCurrentOperand(operationPressed);
                        renderUpperDisplay();
                        currentNumberRawString = "0";
                        currentNumber = 0;
                        mainDisplay.innerText = currentNumberRawString;
                    }
                    break

                // 4 -> take the result as the first number of the new queue
                    case 4:
                        processQueue = [currentNumber, operations[operationPressed.id]]
                        showCurrentOperand(operationPressed);
                        renderUpperDisplay();
                        currentNumberRawString = "0";
                        currentNumber = 0;
                        mainDisplay.innerText = currentNumberRawString;
                        break;
            }
        }
    })
}


function renderNumber(dStr) {
    if (currentNumberRawString == "0") {
        currentNumberRawString = dStr;
    } else {
        currentNumberRawString += dStr;
    }
                                    
    if (currentNumberRawString.includes(".")) {
        currentNumber = parseFloat(currentNumberRawString, 10);
    } else {
        currentNumber = parseInt(currentNumberRawString, 10);
    }

    updateQueueNumber(currentNumber);
    mainDisplay.innerText = currentNumberRawString;
    console.log(processQueue)
}

function updateQueueNumber(number) {   
    switch (processQueue.length) {
        // 1, 3 -> update number (first number, second number)
        case 1:
        case 3:
            processQueue[processQueue.length - 1] = currentNumber;
            break

        // 2 -> add number to the queue (operation selected)
        case 2:
            processQueue.push(number);
            prevActiveOperand.classList.remove("active");
            break
    }
}

function showCurrentOperand(button){
    if (prevActiveOperand != null) prevActiveOperand.classList.remove("active");
    button.classList.add("active");
    prevActiveOperand = button;
}

function renderUpperDisplay() {
    upperDisplay.innerText = processQueue.join(" ");
}

function operate(queue) {
    let [num1, op, num2] = [...queue];
    let result = 0

    upperDisplay.innerText = queue.join(" ") + " =";
    switch (op) {
        case "+":
            result = num1 + num2;
            break
        case "-":
            result = num1 - num2;
            break
        case "*":
            result = num1 * num2;
            break
        case "/":
            num2 == 0 ? result = "ERROR" : result = num1 / num2;
            break
    }
    mainDisplay.innerText = result;
    currentNumber = result;
    currentNumberRawString = result.toString();
    if (prevActiveOperand != null) prevActiveOperand.classList.remove("active");
}

function clearDisplay() {
    currentNumber = 0;
    currentNumberRawString = "0";
    upperDisplay.innerText = "\u200b";
    mainDisplay.innerText = currentNumberRawString;
    processQueue = [0];
}

function changeSign() {
    if (processQueue.length == 4) {
        processQueue = [currentNumber]
    }   
    if (currentNumber != 0 && (processQueue.length == 1 || processQueue.length == 3)) {
        currentNumber *= -1;
        if (currentNumberRawString.includes("-")) {
            currentNumberRawString = currentNumberRawString.slice(1,);
        } else {
            currentNumberRawString = "-" + currentNumberRawString;
        }
        processQueue[processQueue.length - 1] = currentNumber;
    }
    
                                     
    mainDisplay.innerText = currentNumberRawString;
}

function backspace(){
    if (currentNumberRawString.length == 1) {
        currentNumberRawString = "0"
    } else {
        currentNumberRawString = currentNumberRawString.slice(0, currentNumberRawString.length - 1)
    }

    if (currentNumberRawString.includes(".")) {
        currentNumber = parseFloat(currentNumberRawString);
    } else {
        currentNumber = parseInt(currentNumberRawString);
    }

    mainDisplay.innerText = currentNumberRawString;
    updateQueueNumber(currentNumber);
}