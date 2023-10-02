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
  buttonSortMovements: document.querySelector('.btn--sort'),

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

  inputLoanAmount: document.querySelector('.form__input--loan-amount'),
  inputLoanButton: document.querySelector('.form__btn--loan'),

  inputCloseUsername: document.querySelector('.form__input--user'),
  inputClosePin: document.querySelector('.form__input--pin'),
  inputCloseButton: document.querySelector('.form__btn--close'),

  // app methods
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

  // movement methods
  changeMovements(movements) {
    this.containerMovements.innerHTML = '';
    movements.forEach((movement, i) => {
      const movementType = movement > 0 ? 'deposit' : 'withdrawal';
      const TODOOO = '<div class="movements__date">3 days ago</div>';
      const htmlTemplate = `
        <div class="movements__row">
          <div class="movements__type movements__type--${movementType}">${movementType}</div>
          <div class="movements__value">${movement.toFixed(this.toFixed)}€</div>
        </div>
      `;
      this.containerMovements.insertAdjacentHTML('afterbegin', htmlTemplate);
    });
  },

  changeSortButton(message) {
    this.buttonSortMovements.textContent = `↓ ${message.toUpperCase()}`;
  },

  // label methods
  changeWelcomeMessage(message) {
    this.labelWelcome.textContent = message ?? 'Log in to get started';
  },

  changeBalance(balance) {
    this.labelBalance.textContent = `${balance.toFixed(this.toFixed)}€`;
  },

  changeSummaryIn(totalDeposit) {
    this.labelSummaryIn.textContent = `${totalDeposit.toFixed(this.toFixed)}€`;
  },
  changeSummaryOut(totalWithdrawal) {
    this.labelSummaryOut.textContent = `${Math.abs(totalWithdrawal).toFixed(
      this.toFixed
    )}€`;
  },
  changeSummaryInterest(interest) {
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

  // loan methods
  getLoanAmount() {
    return this.inputLoanAmount.value;
  },
  clearLoanFields() {
    //(s) is silent :)
    this.inputLoanAmount.value = '';
  },
  blurLoanFields() {
    //(s) is silent :)
    this.inputLoanAmount.blur();
  },

  // close methods
  getCloseUsername() {
    return this.inputCloseUsername.value;
  },
  getClosePin() {
    return this.inputClosePin.value;
  },
  clearCloseFields() {
    this.inputCloseUsername.value = '';
    this.inputClosePin.value = '';
  },
  blurCloseFields() {
    this.inputCloseUsername.blur();
    this.inputClosePin.blur();
  },

  // total refresh
  refreshSecretAccountDomElements(secretAccount) {
    if (!secretAccount) return this.showApp.call(this, false);

    this.changeMovements.call(this, secretAccount.getMovements());
    this.changeBalance.call(this, secretAccount.getNetBalance());
    this.changeSummaryIn.call(this, secretAccount.getTotalDeposit());
    this.changeSummaryOut.call(this, secretAccount.getTotalWithdrawal());
    this.changeSummaryInterest.call(this, secretAccount.getTotalInterest());
    this.changeWelcomeMessage.call(
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
    return this.movements.slice();
  },
  getUsername() {
    return this.username;
  },
  getPin() {
    return this.pin;
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

  // switch click event on button
  this.removeEventListener('click', handleLogout);
  this.addEventListener('click', handleLogin);
};

const handleMoneyTransfer = function (e) {
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

  // test input sanity and requirements
  const targetAccount = accounts.find(
    (account) => account.username === moneyTransfer.to
  );
  if (
    !secretAccount ||
    !targetAccount ||
    moneyTransfer.amount < 0 ||
    moneyTransfer.amount + moneyTransfer.transferFee >
      secretAccount.getNetBalance()
  )
    return;

  // transfer the money
  const helperTranfer = () => {
    secretAccount.addMovement(
      -1 * (moneyTransfer.amount + moneyTransfer.transferFee)
    );
    targetAccount.movements.push(moneyTransfer.amount);
  };

  // render the changes
  const helperRender = () => {
    domElements.changeMovements(secretAccount.getMovements());
    domElements.changeBalance(secretAccount.getNetBalance());
  };

  // simulate server delay
  setTimeout(() => {
    helperTranfer();
    helperRender();
  }, 1000);
};

const handleLoanRequest = function (e) {
  e.preventDefault();

  // create an object containing input fields
  const loanRequest = {
    amount: Number(domElements.getLoanAmount()),
  };

  // clear input fields for preventing rapid successions
  domElements.clearLoanFields();
  domElements.blurLoanFields();

  // test requirements
  if (
    !secretAccount ||
    !secretAccount
      .getMovements()
      .some((movement) => movement >= loanRequest.amount) ||
    accounts
      .flatMap((account) => account.movements)
      .reduce((sum, movemet) => sum + movemet) <
      loanRequest.amount * 10
  )
    return;

  // transfer loan to account
  const helperLoan = () => {
    secretAccount.addMovement(loanRequest.amount);
  };

  // render changes
  const helperRender = () => {
    domElements.changeMovements(secretAccount.getMovements());
    domElements.changeBalance(secretAccount.getNetBalance());
    domElements.changeSummaryIn(secretAccount.getTotalDeposit());
    domElements.changeSummaryInterest(secretAccount.getTotalInterest());
  };

  // simulate server delay
  setTimeout(() => {
    helperLoan();
    helperRender();
  }, 1000);
};

const handleClosingAccount = function (e) {
  e.preventDefault();

  // create an object containing input fields
  const closeAccount = {
    username: domElements.getCloseUsername(),
    pin: Number(domElements.getClosePin()),
  };

  // clear input fields for preventing rapid successions
  domElements.clearCloseFields();
  domElements.blurCloseFields();

  // test logged user and input fields equality
  if (
    !secretAccount ||
    secretAccount.getUsername() !== closeAccount.username ||
    secretAccount.getPin() !== closeAccount.pin
  )
    return;

  // find the corresponding account and delete it
  const helperDeleteAccount = () => {
    accounts.splice(
      accounts.findIndex(
        (account) => account.username === closeAccount.username
      ),
      1
    );
    secretAccount = undefined;
  };

  // render the changes
  const helperRender = () => {
    // hide app
    domElements.showApp(false);

    // reset app
    domElements.changeWelcomeMessage('Log in to get started');
    domElements.refreshSecretAccountDomElements(secretAccount);

    // change login button event handler
    domElements.inputLoginButton.removeEventListener('click', handleLogout);
    domElements.inputLoginButton.addEventListener('click', handleLogin);
    domElements.changeLoginArrowDirection('right');
  };

  // simulate server delay
  setTimeout(() => {
    helperDeleteAccount();
    helperRender();
  }, 1000);
};

const handleSortingMovements = function (e) {
  e.preventDefault();

  // test requirements
  if (!secretAccount) return;

  // fetch sorting
  const sortingType = this.textContent.slice(2).toLowerCase();
  const sortedMovements = secretAccount.getMovements().slice();

  switch (sortingType) {
    case 'highest':
      sortedMovements.sort((a, b) => a - b);
      break;
    case 'lowest':
      sortedMovements.sort((a, b) => b - a);
      break;
    case 'amount':
      sortedMovements.sort((a, b) => Math.abs(a) - Math.abs(b));
      break;
    case 'recent':
    default:
      break;
  }

  // render changes
  const nextSortingType = {
    highest: 'lowest',
    lowest: 'amount',
    amount: 'recent',
    recent: 'highest',
  };
  domElements.changeSortButton(nextSortingType[sortingType] || 'highest');
  domElements.changeMovements(sortedMovements);
};

// Initialization /////////////////////////////////////////////////////////////
accounts.forEach(createUsername);
domElements.inputLoginButton.addEventListener('click', handleLogin);
domElements.inputTransferButton.addEventListener('click', handleMoneyTransfer);
domElements.inputLoanButton.addEventListener('click', handleLoanRequest);
domElements.inputCloseButton.addEventListener('click', handleClosingAccount);
domElements.buttonSortMovements.addEventListener(
  'click',
  handleSortingMovements
);
