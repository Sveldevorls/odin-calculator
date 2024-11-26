let currentNumberRawString = "0";
let currentNumber = 0;
let processQueue = [0]
let isFloat = false;
let prevActiveOperand = null;

let operations = {
    "plus" : "+",
    "minus" : "-",
    "multiply" : "*",
    "divide" : "/",
    "equals" : "=",
    /* "clear" : clearDisplay,
    "sign" : changeSign,
    "backspace" : backspace, */
}

let upperDisplay = document.body.querySelector(".upper");
let mainDisplay = document.body.querySelector(".main");

let numberButtons = document.body.querySelectorAll(".num");
let operandButtons = document.body.querySelectorAll(".operand");
let decimalPoint = document.body.querySelector(".decimal");


decimalPoint.addEventListener("click", () => {
    if (!isFloat) {
        isFloat = true;
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
                        isFloat = false;
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
                        processQueue.push(currentNumber)
                        operate(processQueue)
                    }
                    break;

                // 3 -> eval first, if operand in +-*/ then take the result as the first number of the new queue
                case 3:
                    operate(processQueue)
                    if (operationPressed.id != "equals") {
                        //
                    }
                    break
            }
        }
    })
}






function renderNumber(dStr) {
    currentNumberRawString == "0" ? currentNumberRawString = dStr :
                                    currentNumberRawString += dStr;
    isFloat ? currentNumber = parseFloat(currentNumberRawString, 10) :
              currentNumber = parseInt(currentNumberRawString, 10);
    mainDisplay.innerText = currentNumberRawString;
    updateQueueNumber(currentNumber);
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
            break
    }
    if (prevActiveOperand) prevActiveOperand.classList.remove("active");
}

function showCurrentOperand(button){
    if (prevActiveOperand != null) prevActiveOperand.classList.remove("active")
        button.classList.add("active");
        prevActiveOperand = button;
}

function renderUpperDisplay() {
    upperDisplay.innerText = processQueue.join(" ");
}

function operate(queue) {
    let [num1, op, num2] = [...queue];
    upperDisplay.innerText = queue.join(" ") + " =";
    switch (op) {
        case "+":
            mainDisplay.innerText = (num1 + num2).toString();
            break
        case "-":
            mainDisplay.innerText = (num1 - num2).toString();
            break
        case "*":
            mainDisplay.innerText = (num1 * num2).toString();
            break
        case "/":
            if (num2 == 0) mainDisplay.innerText = "ERROR"
            else mainDisplay.innerText = (num1 / num2).toString();
            break
    }
}