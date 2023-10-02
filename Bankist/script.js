'use strict';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// BANKIST APP

// Data ///////////////////////////////////////////////////////////////////////
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements ///////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////////////////////////////

// Elements ///////////////////////////////////////////////////////////////////
const domElements = {
  toFixed: 2,

  containerApp: document.querySelector('.app'),
  containerMovements: document.querySelector('.movements'),

  labelWelcome: document.querySelector('.welcome'),
  labelBalance: document.querySelector('.balance__value'),
  labelSummaryIn: document.querySelector('.summary__value--in'),
  labelSummaryOut: document.querySelector('.summary__value--out'),
  labelSummaryInterest: document.querySelector('.summary__value--interest'),

  inputLoginUsername: document.querySelector('.login__input--user'),
  inputLoginPin: document.querySelector('.login__input--pin'),
  inputLoginButton: document.querySelector('.login__btn'),

  inputTransferTo: document.querySelector('.form__input--to'),
  inputTransferAmount: document.querySelector('.form__input--amount'),
  inputTransferButton: document.querySelector('.form__btn--transfer'),

  // container methods
  showApp(isShow) {
    if (isShow) {
      this.containerApp.classList.remove('app--hidden');
      setTimeout(() => this.containerApp.classList.add('app--opaque'));
    } else {
      this.containerApp.classList.remove('app--opaque');
      setTimeout(() => {
        this.containerApp.classList.add('app--hidden');
      }, 1000);
    }
  },

  refreshMovements(movements) {
    this.containerMovements.innerHTML = '';
    movements.forEach((movement, i) => {
      const movementType = movement > 0 ? 'deposit' : 'withdrawal';
      const TODOOO = '<div class="movements__date">3 days ago</div>';
      const htmlTemplate = `
        <div class="movements__row">
          <div class="movements__type movements__type--${movementType}">${
        i + 1
      } ${movementType}</div>
          <div class="movements__value">${movement.toFixed(this.toFixed)}€</div>
        </div>
      `;
      this.containerMovements.insertAdjacentHTML('afterbegin', htmlTemplate);
    });
  },

  // label methods
  refreshWelcomeMessage(message) {
    this.labelWelcome.textContent = message ?? 'Log in to get started';
  },

  refreshBalance(balance) {
    this.labelBalance.textContent = `${balance.toFixed(this.toFixed)}€`;
  },

  refreshSummaryIn(totalDeposit) {
    this.labelSummaryIn.textContent = `${totalDeposit.toFixed(this.toFixed)}€`;
  },
  refreshSummaryOut(totalWithdrawal) {
    this.labelSummaryOut.textContent = `${Math.abs(totalWithdrawal).toFixed(
      this.toFixed
    )}€`;
  },
  refreshSummaryInterest(interest) {
    this.labelSummaryInterest.textContent = `${interest.toFixed(
      this.toFixed
    )}€`;
  },

  // login methods
  getLoginUsername() {
    return this.inputLoginUsername.value;
  },
  getLoginPin() {
    return this.inputLoginPin.value;
  },
  changeLoginArrowDirection(direction) {
    if (direction === 'right') this.inputLoginButton.innerHTML = '&rarr;';
    else if (direction === 'left') this.inputLoginButton.innerHTML = '&larr;';
  },
  clearLoginFields() {
    this.inputLoginUsername.value = '';
    this.inputLoginPin.value = '';
  },
  blurLoginFields() {
    this.inputLoginUsername.blur();
    this.inputLoginPin.blur();
  },

  // transfer methods
  getTransferTo() {
    return this.inputTransferTo.value;
  },
  getTransferAmount() {
    return this.inputTransferAmount.value;
  },
  clearTransferFields() {
    this.inputTransferTo.value = '';
    this.inputTransferAmount.value = '';
  },
  blurTransferFields() {
    this.inputTransferTo.blur();
    this.inputTransferAmount.blur();
  },

  // total refresh
  refreshSecretAccountDomElements(secretAccount) {
    if (!secretAccount) return this.showApp.call(this, false);

    this.refreshMovements.call(this, secretAccount.getMovements());
    this.refreshBalance.call(this, secretAccount.getNetBalance());
    this.refreshSummaryIn.call(this, secretAccount.getTotalDeposit());
    this.refreshSummaryOut.call(this, secretAccount.getTotalWithdrawal());
    this.refreshSummaryInterest.call(this, secretAccount.getTotalInterest());
    this.refreshWelcomeMessage.call(
      this,
      `Welcome back ${secretAccount.getOwner().split(' ')[0]}!`
    );
    this.showApp.call(this, true);
  },
};

// Account ////////////////////////////////////////////////////////////////////
let secretAccount = undefined;

const createUsername = function (account) {
  account.username = account.owner
    .toLowerCase()
    .split(' ')
    .map((word) => word[0])
    .join('');
  return account.username;
};

const accountPublicMethods = {
  owner: 'TYGVBH fhg GHyj JK Ghkkn g',
  movements: [20000, 4500, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  username: undefined,

  getOwner() {
    return this.owner;
  },
  addMovement(amount) {
    this.movements.push(amount);
  },
  getMovements() {
    return this.movements;
  },
  getUsername() {
    return this.username;
  },

  getTotalDeposit() {
    return this.movements
      .filter((movement) => movement > 0)
      .reduce((sum, deposit) => sum + deposit, 0);
  },
  getTotalWithdrawal() {
    return this.movements
      .filter((movement) => movement < 0)
      .reduce((sum, withdrawal) => sum + withdrawal, 0);
  },
  getNetBalance() {
    return this.movements.reduce((sum, movement) => sum + movement, 0);
  },
  getTotalInterest() {
    const interest =
      (this.movements.reduce((sum, movement) => sum + movement, 0) *
        this.interestRate) /
      100;
    return interest > 0 ? interest : 0;
  },
};

const signIn = function (account, accountPublicMethods) {
  const hiddenAccountInformation = { ...account };
  const publicMethods = { ...accountPublicMethods };
  Object.entries(publicMethods).forEach(([key, value]) => {
    if (typeof value === 'function') {
      publicMethods[key] = value.bind(hiddenAccountInformation);
    } else {
      delete publicMethods[key];
    }
  });
  return publicMethods;
};
const signOut = function () {
  return undefined;
};

// Event Handlers /////////////////////////////////////////////////////////////
const handleLogin = function (e) {
  e.preventDefault();

  // test if already logged in
  if (secretAccount) return;

  // read form elements
  const inputLogin = {
    username: domElements.getLoginUsername(),
    pin: Number(domElements.getLoginPin()),
  };

  // find matching account with login username field
  const testAccount = accounts.find(
    (account) => account.username === inputLogin.username
  );
  // test matching account's pin with login pin field
  if (testAccount?.pin !== inputLogin.pin) return;

  // login
  secretAccount = signIn(testAccount, accountPublicMethods);
  console.log(secretAccount);

  // render dom
  domElements.refreshSecretAccountDomElements(secretAccount);
  domElements.clearLoginFields();
  domElements.changeLoginArrowDirection('left');
  domElements.blurLoginFields();

  // switch click event on button
  this.removeEventListener('click', handleLogin);
  this.addEventListener('click', handleLogout);
};

const handleLogout = function (e) {
  e?.preventDefault();

  // test if not already logged in
  if (!secretAccount) return;

  // logout
  secretAccount = undefined;
  domElements.refreshSecretAccountDomElements(secretAccount);
  domElements.changeLoginArrowDirection('right');
  console.log('LOGOUT');

  // switch click event on button
  this.removeEventListener('click', handleLogout);
  this.addEventListener('click', handleLogin);
};

const handleTransferingMoney = function (e) {
  e.preventDefault();

  // create an object containing transfer information
  const moneyTransfer = {
    from: secretAccount?.getUsername(),
    to: domElements.getTransferTo(),
    amount: Number(domElements.getTransferAmount()),
    transferFee: 0,
  };
  moneyTransfer.transferFee = Number(
    (moneyTransfer.amount * 0.002 + 1).toFixed(2)
  );

  // clear input fields for preventing rapid successions
  domElements.clearTransferFields();
  domElements.blurTransferFields();

  // check input sanity
  const targetAccount = accounts.find(
    (account) => account.username === moneyTransfer.to
  );
  if (
    !targetAccount ||
    !secretAccount ||
    moneyTransfer.amount < 0 ||
    moneyTransfer.amount + moneyTransfer.transferFee >
      secretAccount?.getNetBalance()
  )
    return;

  // tranfer the money
  setTimeout(() => {
    secretAccount?.addMovement(
      -1 * (moneyTransfer.amount + moneyTransfer.transferFee)
    );
    targetAccount.movements.push(moneyTransfer.amount);
  }, 1000);

  // render the new elements
  setTimeout(() => {
    domElements.refreshMovements(secretAccount?.getMovements());
    domElements.refreshBalance(secretAccount?.getNetBalance());
  }, 1001);
};

// Initialization /////////////////////////////////////////////////////////////
accounts.forEach(createUsername);
domElements.inputLoginButton.addEventListener('click', handleLogin);
domElements.inputTransferButton.addEventListener(
  'click',
  handleTransferingMoney
);
