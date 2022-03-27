let calculator = document.querySelector('.calculator');
let calculatorButton = [...calculator.querySelectorAll('.calculator-button:not(.disabled)')];
let calculatorDisplay = calculator.querySelector('.calculator-display');


let calculatorBuffer = {
  inputString: ['0'],
};

function operate(arg1, arg2, operation) {
  switch (operation) {
    case '+': return parseFloat(arg1) + parseFloat(arg2);
    case '-': return parseFloat(arg1) - parseFloat(arg2);
    case '*': return parseFloat(arg1) * parseFloat(arg2);
    case '/': return parseFloat(arg1) / parseFloat(arg2);

    default: console.error(`Unknown operator : "${operation}"`);
  }
}

function multiOperation(operationString) {
  let opStringCopy = operationString.split(/\s+/g);
  console.log(`1: opStringCopy : ${opStringCopy}`);

if ((/[\+\-\*\/]/).test(opStringCopy[opStringCopy.length - 1])) {
    opStringCopy.pop();
  }

if ((/[\+\-\*\/]/).test(opStringCopy[0])) {
    let firstElement = opStringCopy.shift();
    if (firstElement === '-') {
      opStringCopy[0] *= -1;
    }
  }
  console.log(`2: opStringCopy : ${opStringCopy}`);

  for (let i = 0; i < opStringCopy.length; i++) {

    if ((opStringCopy[i] === '*') || (opStringCopy[i] === '/')) {
      let arg1 = opStringCopy[i - 1];
      let arg2 = opStringCopy[i + 1];

      opStringCopy.splice(i - 1, 3, operate(arg1, arg2, opStringCopy[i]));
      // console.log(opStringCopy);

      i -= 1;
    }
  }
  // console.log(`First Stage : ${opStringCopy}`);

  for (let i = 0; i < opStringCopy.length; i++) {
    // console.log(`element : ${opStringCopy[i]}`);

    if ((opStringCopy[i] === '+') || (opStringCopy[i] === '-')) {
      let arg1 = opStringCopy[i - 1];
      let arg2 = opStringCopy[i + 1];
      let operation = operate(arg1, arg2, opStringCopy[i]);

      opStringCopy.splice(i - 1, 3, operation);
      // console.log(opStringCopy);
      i -= 1;
    }
  }

  opStringCopy[0] = String(parseFloat(parseFloat(opStringCopy[0]).toFixed(4)));
  return opStringCopy[0];
}

function calculatorHandleInput(newInput) {
  // console.log(newInput);
  let latestInput = calculatorBuffer.inputString[calculatorBuffer.inputString.length - 1];

  switch (newInput) {
    case '=':
      console.log(calculatorBuffer.inputString);
      calculatorBuffer.inputString = [String(multiOperation(calculatorBuffer.inputString.join(" ")))];
      break;

    case 'DEL':
      if(isNaN(latestInput)) {
        calculatorBuffer.inputString.pop();
      } else {
        latestInput = latestInput.split("").slice(0, -1).join("");
        calculatorBuffer.inputString.pop();
        if(String(latestInput).length !== 0) {
          calculatorBuffer.inputString.push(String(latestInput))
        }
        // Everything deleted (empty input)
        if(calculatorBuffer.inputString.length === 0) {
          calculatorBuffer.inputString = ['0'];
        }
      }
      break;

    case 'C':
    case 'CE':
      calculatorBuffer.inputString = ['0'];
      break;

    case '.':
      if(!latestInput.includes('.')) {
        latestInput += newInput;
        calculatorBuffer.inputString.pop();
        calculatorBuffer.inputString.push(String(latestInput))
      }
      break;

    case '+/-':
      break;
    
    case '+':
    case '-':
    case '/':
    case '*':

      if (isNaN(latestInput)) {
        calculatorBuffer.inputString.pop();
      }
      calculatorBuffer.inputString.push(newInput);
      break;

    default:
      if (isNaN(latestInput) && (latestInput !== '.')) {
        calculatorBuffer.inputString.push(newInput);
        // console.log('new number after non number');
      } else {
        // console.log('new number after number');
        // console.log(`latestInput = ${latestInput}`);

        if(latestInput === '0') {
          latestInput = newInput;
        } else {
          latestInput += newInput;
        }
        // console.log(`latestInput = ${latestInput}`);

        calculatorBuffer.inputString.pop();
        calculatorBuffer.inputString.push(String(latestInput))
      }
      break;
  }

  console.table(calculatorBuffer);
  calculatorUpdateDisplay();
}

function calculatorButtonEvent() {
  calculatorHandleInput(this.innerText);
}

function userKeyboardEvent(e) {
  // console.log(e);
  let userKeyboardInput = e.key;
  switch (e.key) {
    case 'Delete':
    case 'Backspace': userKeyboardInput = 'DEL'; break;

    case 'm':
    case 'M': userKeyboardInput = '+/-'; break;

    case 'Escape':
    case 'c':
    case 'C': userKeyboardInput = 'C'; break;

    case 'Enter': userKeyboardInput = '='; break;

    default: break;
  }
  // console.log(userKeyboardInput);

  const ACCEPTABLE_INPUTS_REGEXP = (
    /^([CM0-9\=\.\+\-\*\/]|DEL|CE)$/
  );
  if (ACCEPTABLE_INPUTS_REGEXP.test(userKeyboardInput)) {

    correspondingButton = calculatorButton.find((button) => button.innerText === userKeyboardInput);

    if (e.type === 'keydown') {
      calculatorHandleInput(userKeyboardInput);
      correspondingButton.classList.add('button-pressed');
    }

    window.setTimeout(() => {
      calculatorButton.forEach((button) => {
        button.classList.remove('button-pressed');
      });
    }, 100);
  }
}

function calculatorUpdateDisplay() {
  let displayString = [...calculatorBuffer.inputString];
  calculatorDisplay.innerText =
  displayString
    .map((element) => element.match(/^[\+\-\*\/]$/g) ? ` ${element} ` : element)
    .join("");
}


// let testOperationString = "/ 1 + 5 * 100    / 2   -";
// console.log('Result =', multiOperation(testOperationString));

calculatorButton.forEach((button) => button.addEventListener('click', calculatorButtonEvent));
document.addEventListener('keydown', userKeyboardEvent);
// document.addEventListener('keyup', userKeyboardEvent);
