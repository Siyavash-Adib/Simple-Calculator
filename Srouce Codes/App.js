let calculator = document.querySelector('.calculator');
let calculatorButton = [...calculator.querySelectorAll('.calculator-button')];


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
  // console.log(`1: opStringCopy : ${opStringCopy}`);

  if ((/\D/).test(opStringCopy[opStringCopy.length - 1])) {
    opStringCopy.pop();
  }

  if ((/\D/).test(opStringCopy[0])) {
    let firstElement = opStringCopy.shift();
    if (firstElement === '-') {
      opStringCopy[0] *= -1;
    }
  }
  // console.log(`2: opStringCopy : ${opStringCopy}`);

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

      opStringCopy.splice(i - 1, 3, operate(arg1, arg2, opStringCopy[i]));
      // console.log(opStringCopy);
      i -= 1;
    }
  }

  return opStringCopy[0];
}

function calculatorHandleInput(newInput) {
  console.log(newInput);
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

    if(e.type === 'keydown') {
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


// let testOperationString = "/ 1 + 5 * 100    / 2   -";
// console.log('Result =', multiOperation(testOperationString));

calculatorButton.forEach((button) => button.addEventListener('click', calculatorButtonEvent));
document.addEventListener('keydown', userKeyboardEvent);
// document.addEventListener('keyup', userKeyboardEvent);
