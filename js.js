'use strict';

const account1 = {
  owner: 'Dmitrii Fokeev',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2023-04-25T17:01:17.194Z',
    '2023-04-28T23:36:17.929Z',
    '2023-04-29T10:51:36.790Z',
  ],
  currency: 'RUB',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Anna Filimonova',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Polina Filimonova',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'es-PE',
};

const account4 = {
  owner: 'Stanislav Ivanchenko',
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
  currency: 'USD',
  locale: 'ru-RU',
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

// format date
function formatMovementDate(date) {
  const calcDaysPassed = function (date1, date2) {
    return Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
  };

  const dayPassed = calcDaysPassed(new Date(), date);
  console.log(dayPassed);

  if (dayPassed === 0) return 'Сегодня';
  if (dayPassed === 1) return 'Вчера';
  if (dayPassed >= 2 && dayPassed <= 4) return `Прошло ${dayPassed} дня назад`;
  if (dayPassed <= 7) return `Прошло ${dayPassed} дней назад`;

  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const day = `${date.getDate()}`.padStart(2, 0);
  const hours = `${date.getHours()}`.padStart(2, 0);
  const minutes = `${date.getMinutes()}`.padStart(2, 0);

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// show on page income and outcome
function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (value, index) {
    const type = value > 0 ? 'deposit' : 'withdrawal';
    const typeMessage = value > 0 ? 'внесение' : 'снятие';

    const date = new Date(acc.movementsDates[index]);

    const displayDate = formatMovementDate(date);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${index + 1} ${typeMessage}
          </div>
          <div class="movements__date">${displayDate}</div>
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
  displayMovements(acc);
  calcPrintBalance(acc);
  calcDisplaySum(acc.movements);
}

// login operations
let currentAccount;
btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find((acc) => {
    return acc.logIn === inputLoginUsername.value;
  });
  // console.log(currentAccount)

  // pin
  if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
    containerApp.style.opacity = 100;

    // erase data
    inputLoginPin.value = '';
    inputLoginUsername.value = '';

    // data
    const now = new Date();
    const year = now.getFullYear();
    const month = `${now.getMonth() + 1}`.padStart(2, 0);
    const date = `${now.getDate()}`.padStart(2, 0);
    const hours = `${now.getHours()}`.padStart(2, 0);
    const minutes = `${now.getMinutes()}`.padStart(2, 0);
    labelDate.textContent = `${date}/${month}/${year} ${hours}:${minutes}`;

    // show info
    updateUi(currentAccount);
  }
});

// transfer money to other acc
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const reciveAcc = accounts.find((acc) => {
    return acc.logIn === inputTransferTo.value;
  });
  const amount = +inputTransferAmount.value;
  // console.log(amount, reciveAcc)

  if (
    reciveAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    reciveAcc.logIn != currentAccount.logIn
  ) {
    currentAccount.movements.push(-amount);
    reciveAcc.movements.push(amount);

    // add data when add new transfer money
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUi(currentAccount);

    // erase data
    inputTransferTo.value = '';
    inputTransferAmount.value = '';
  }
});

// close acc
btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.logIn &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex((acc) => {
      return acc.logIn === currentAccount.logIn;
    });
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }

  // erase data
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});

// put money
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0) {
    currentAccount.movements.push(amount);

    // add data when add new transfer money
    currentAccount.movementsDates.push(new Date().toISOString());

    updateUi(currentAccount);
  }

  // erase data
  inputLoanAmount.value = '';
});

//sum all money of accs
const accMov = accounts.map((acc) => {
  return acc.movements;
});

const allMov = accMov.flat();
const allBalance = allMov.reduce((acc, mov) => {
  return acc + mov;
}, 0);

const overalBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

//add sort method
let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});

//add description of value
labelBalance.addEventListener('click', () => {
  Array.from(document.querySelectorAll('.movements__value'), function (val, i) {
    return (val.innerText = val.textContent.replace('₽', 'RUB'));
  });
});
