'use strict';

const account1 = {
  owner: 'Dmitrii Fokeev',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
};

const account2 = {
  owner: 'Anna Filimonova',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,
};

const account3 = {
  owner: 'Polina Filimonova',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,
};

const account4 = {
  owner: 'Stanislav Ivanchenko',
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// show on page income and outcome
function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a,b) => a-b) : movements;

  movs.forEach(function (value, index) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const typeMessage = value > 0 ? 'внесение' : 'снятие';
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${index + 1} ${typeMessage}
          </div>
          <div class="movements__date">3 дня назад</div>
          <div class="movements__value">${value}₽</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

// login and fio in obj
function createLogin(accs) {
  accs.forEach((acc) => {
    acc.logIn = acc.owner
      .toLowerCase()
      .split(' ')
      .map((val) => {
        return val[0];
      })
      .join('');
  });
}
createLogin(accounts);

// common balance
function calcPrintBalance(acc) {
  acc.balance = acc.movements.reduce((acc, val) => {
    return acc + val;
  });
  labelBalance.textContent = `${acc.balance} RUB`;
}


// outcome and income
function calcDisplaySum(movements) {
  const incomes = movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} RUB`;

  const out = movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(out)} RUB`;

  labelSumInterest.textContent = `${incomes + out} RUB`;
}

function updateUi(acc) {
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  calcDisplaySum(acc.movements);
}


// login operations
let currentAccount;
btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find((acc) => {
    return acc.logIn === inputLoginUsername.value
  })
  // console.log(currentAccount)

  // pin
  if(currentAccount && currentAccount.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 100;

    // erase data
    inputLoginPin.value = '';
    inputLoginUsername.value = '';

    // show info
    updateUi(currentAccount)
  }
})

// transfer money to other acc
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const reciveAcc = accounts.find((acc) => {
    return acc.logIn === inputTransferTo.value;
  })
  const amount = +inputTransferAmount.value;
  // console.log(amount, reciveAcc)

  if(reciveAcc && amount > 0 && currentAccount.balance >= amount && reciveAcc.logIn != currentAccount.logIn) {
    currentAccount.movements.push(-amount);
    reciveAcc.movements.push(amount);
    updateUi(currentAccount);

     // erase data
     inputTransferTo.value = '';
     inputTransferAmount.value = '';
  }
}) 


// close acc
btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  if(inputCloseUsername.value === currentAccount.logIn && Number(inputClosePin.value) === currentAccount.pin)
  {
    const index = accounts.findIndex(acc => {
      return acc.logIn === currentAccount.logIn
    })
    console.log(index)
    accounts.splice(index, 1)
    containerApp.style.opacity = 0;
  }

  // erase data
  inputCloseUsername.value = '';
  inputClosePin.value = '';
})


// put money
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value)
  if(amount > 0) {
    currentAccount.movements.push(amount)
    updateUi(currentAccount)
  }

   // erase data
   inputLoanAmount.value = '';
})

//sum all money of accs
const accMov = accounts.map(acc => {
  return acc.movements
})

const allMov = accMov.flat();
const allBalance = allMov.reduce((acc, mov) => {
  return acc + mov
}, 0)

console.log(allBalance)

const overalBalance = accounts.map(acc => acc.movements).flat().reduce((acc,mov) => acc + mov, 0);

//add sort method
let sorted = false
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted)
  sorted = !sorted
})