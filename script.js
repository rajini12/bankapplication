'use strict';
const accounts = [
  { owner: 'Jonas Schmedtmann', movements: [200, 450, -400, 3000, -650, -130, 70, 1300], interestRate: 1.2, pin: 1111 },
  {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
  },
  {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
  },
  { owner: 'Sarah Smith', movements: [430, 1000, 700, 50, 90], interestRate: 1, pin: 4444 },
];

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const labelWelcome = document.querySelector('.welcome');
const btnLogin = document.querySelector('.login__btn');
//const labelWelcome = document.querySelector('.welcome');
//const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
//containerApp.style.opacity = 0;
const containerMovements = document.querySelector('.movements');

//const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

//const inputLoginUsername = document.querySelector('.login__input--user');
//const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//to updateDate
const labelDate = document.querySelector('.date');

var updateddate = new Date().toJSON().slice(0, 10);
labelDate.textContent = updateddate;


function updateUI(acc) {
  displayMovements(acc);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
}

let calcDisplaySummary = function (acc) {
  //Total In
  const income = acc.movements.filter(mov => mov > 0).reduce((accu, mov) => accu + mov, 0);
  labelSumIn.textContent = `${income}€`;

  //Total Out
  const out = acc.movements.filter(mov => mov < 0).reduce((accu, mov) => accu + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  //Total Interest
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * 1.2) / 100)
    .filter(mov => mov >= 1)
    .reduce((accu, mov) => accu + mov, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

let calcDisplayBalance = function(acc){
  const DisplayBalance = acc.movements.reduce((a, b) => a + b, 0);
  labelBalance.innerHTML = `${DisplayBalance} $`;
}

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movements = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;
  movements.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
  `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};


//sorting
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});



//login details
let currentAccount = accounts.find(function (account) {
    return account.owner === inputLoginUsername.value
  });



btnLogin.addEventListener('click', function (account) {
  account.preventDefault();

  currentAccount = accounts.find(acc => inputLoginUsername.value === acc.owner);
  console.log(currentAccount.owner);

  if(currentAccount.pin === Number(inputLoginPin.value)){
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner}`;
  containerApp.style.opacity = 10;
  }else{
    console.log("Enter correct name and pin")
  }
 
  updateUI(currentAccount);
});






btnTransfer.addEventListener("click", function(event) {
    event.preventDefault();
    let currentAccount = accounts.find(function (account) {
      return account.owner === inputLoginUsername.value;
    });
    const receiverAccount =  accounts.find( acc => inputTransferTo.value === acc.owner && acc.owner !== currentAccount.owner);
    console.log(receiverAccount.owner);
    const amount = inputTransferAmount.value;
    if (amount > 0 && amount <= currentAccount.movements.reduce((a,b)=>a+b,0)){
    
         currentAccount.movements.push(-amount);
         console.log(currentAccount.movements);
         receiverAccount.movements.push(amount);
         console.log(receiverAccount.movements);
      updateUI(currentAccount);
    }

    inputTransferAmount.value = inputTransferTo.value = "";

});


btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
    let currentAccount = accounts.find(function (account) {
      return account.owner === inputLoginUsername.value;
    });
  const requestedamount = Number(inputLoanAmount.value);

  if (requestedamount > 0 && currentAccount.movements.some(mov => mov >= requestedamount * 0.1)) {
    // Add movement
    currentAccount.movements.push(requestedamount);

    // Update UI
    updateUI(currentAccount);
    
  }
  
});

//Account close
btnClose.addEventListener('click', function (account) {
  account.preventDefault();

let currentAccount = accounts.find(function (account) {
  return account.owner === inputLoginUsername.value; 
});

  if (inputCloseUsername.value === currentAccount.owner && Number(inputClosePin.value) === currentAccount.pin) {
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
  inputLoginUsername.value = inputLoginPin.value = '';
  labelWelcome.innerHTML= `log in to get started`
});
