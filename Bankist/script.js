'use strict';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
// BANKIST APP

// Data ///////////////////////////////////////////////////////////////////////
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
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

const accounts = [account1, account2];

const rates = {
  USDEUR: 0.95,
  EURUSD: 1.06,
};

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
  // app
  containerApp: document.querySelector('.app'),
  // login
  inputLoginUsername: document.querySelector('.login__input--user'),
  inputLoginPin: document.querySelector('.login__input--pin'),
  inputLoginButton: document.querySelector('.login__btn'),
  // header
  labelWelcome: document.querySelector('.welcome'),
  labelDate: document.querySelector('.date'),
  labelBalance: document.querySelector('.balance__value'),
  // movements
  containerMovements: document.querySelector('.movements'),
  labelSummaryIn: document.querySelector('.summary__value--in'),
  labelSummaryOut: document.querySelector('.summary__value--out'),
  labelSummaryInterest: document.querySelector('.summary__value--interest'),
  buttonSortMovements: document.querySelector('.btn--sort'),
  // transfer
  inputTransferTo: document.querySelector('.form__input--to'),
  inputTransferAmount: document.querySelector('.form__input--amount'),
  inputTransferButton: document.querySelector('.form__btn--transfer'),
  // loan
  inputLoanAmount: document.querySelector('.form__input--loan-amount'),
  inputLoanButton: document.querySelector('.form__btn--loan'),
  // close
  inputCloseUsername: document.querySelector('.form__input--user'),
  inputClosePin: document.querySelector('.form__input--pin'),
  inputCloseButton: document.querySelector('.form__btn--close'),
  // timer
  labelTimer: document.querySelector('.timer'),

  // helper functions
  helperTransformCurrency(value, locale, currency) {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(+value.toFixed(this.toFixed));
  },

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

  // header methods
  changeWelcomeMessage(message) {
    this.labelWelcome.textContent = message ?? 'Log in to get started';
  },

  changeDate(locale, date) {
    const dateDisplayOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit',
    };
    this.labelDate.textContent = new Intl.DateTimeFormat(
      locale,
      dateDisplayOptions
    ).format(new Date(date));
  },

  changeBalance(balance, locale, currency) {
    this.labelBalance.textContent = this.helperTransformCurrency.call(
      this,
      balance,
      locale,
      currency
    );
  },

  // movements methods
  changeMovements(movements, locale, currency) {
    const dateDisplayOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    this.containerMovements.innerHTML = '';
    movements.forEach(({ amount, date }, i) => {
      const movementType = amount > 0 ? 'deposit' : 'withdrawal';
      const htmlTemplate = `
        <div class="movements__row">
          <div class="movements__type movements__type--${movementType}">${movementType}</div>
          <div class="movements__date">${new Intl.DateTimeFormat(
            locale,
            dateDisplayOptions
          ).format(new Date(date))}</div>
          <div class="movements__value">${this.helperTransformCurrency.call(
            this,
            amount,
            locale,
            currency
          )}</div>
        </div>
      `;
      this.containerMovements.insertAdjacentHTML('afterbegin', htmlTemplate);
    });
  },

  changeSummaryIn(totalDeposit, locale, currency) {
    this.labelSummaryIn.textContent = this.helperTransformCurrency.call(
      this,
      totalDeposit,
      locale,
      currency
    );
  },
  changeSummaryOut(totalWithdrawal, locale, currency) {
    this.labelSummaryOut.textContent = this.helperTransformCurrency.call(
      this,
      Math.abs(totalWithdrawal),
      locale,
      currency
    );
  },
  changeSummaryInterest(interest, locale, currency) {
    this.labelSummaryInterest.textContent = this.helperTransformCurrency.call(
      this,
      interest,
      locale,
      currency
    );
  },

  changeSortButton(message) {
    this.buttonSortMovements.textContent = `↓ ${message.toUpperCase()}`;
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
    // (s) is silent in methodName
    this.inputLoanAmount.value = '';
  },
  blurLoanFields() {
    // (s) is silent in methodName
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

  // timer methods
  changeTimer(locale, date) {
    const dateDisplayOptions = {
      minute: '2-digit',
      second: '2-digit',
    };
    this.labelTimer.textContent = new Intl.DateTimeFormat(
      locale,
      dateDisplayOptions
    ).format(date);
  },

  // total refresh
  refreshSecretAccountDomElements(secretAccount) {
    if (!secretAccount) return this.showApp.call(this, false);

    const localeAndCurrency = [
      secretAccount.getLocale(),
      secretAccount.getCurrency(),
    ];

    this.showApp.call(this, true);
    this.changeWelcomeMessage.call(
      this,
      `Welcome back ${secretAccount.getOwner().split(' ')[0]}!`
    );
    this.changeDate.call(this, localeAndCurrency[0], Date());
    this.changeBalance.call(
      this,
      secretAccount.getNetBalance(),
      ...localeAndCurrency
    );
    const sortLabel = this.buttonSortMovements.textContent
      .slice(2)
      .toLowerCase();
    const currentSortingType = {
      highest: 'recent', //'lowest',
      lowest: 'highest', //'amount',
      amount: 'lowest', //'recent',
      recent: 'amount', //'highest',
    };
    this.changeMovements.call(
      this,
      secretAccount.getSortedMovements(
        currentSortingType[sortLabel] || 'recent'
      ),
      ...localeAndCurrency
    );
    this.changeSummaryIn.call(
      this,
      secretAccount.getTotalDeposit(),
      ...localeAndCurrency
    );
    this.changeSummaryOut.call(
      this,
      secretAccount.getTotalWithdrawal(),
      ...localeAndCurrency
    );
    this.changeSummaryInterest.call(
      this,
      secretAccount.getTotalInterest(),
      ...localeAndCurrency
    );
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
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE

  getOwner() {
    return this.owner;
  },
  addMovement({ amount, date }) {
    this.movements.push(amount);
    this.movementsDates.push(date);
  },
  getMovements() {
    return this.movements.map((movement, i) => ({
      amount: movement,
      date: this.movementsDates[i],
    }));
  },
  getSortedMovements(sortingType) {
    const sortedMovements = accountPublicMethods.getMovements.call(this);

    switch (sortingType) {
      case 'highest':
        sortedMovements.sort(({ amount: a }, { amount: b }) => a - b);
        break;
      case 'lowest':
        sortedMovements.sort(({ amount: a }, { amount: b }) => b - a);
        break;
      case 'amount':
        sortedMovements.sort(
          ({ amount: a }, { amount: b }) => Math.abs(a) - Math.abs(b)
        );
        break;
      case 'recent':
      default:
        break;
    }

    return sortedMovements;
  },
  getUsername() {
    return this.username;
  },
  getPin() {
    return this.pin;
  },
  getCurrency() {
    return this.currency;
  },
  getLocale() {
    return this.locale;
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

const timer = { minute: 0, id: setTimeout(() => {}), logoutDate: new Date() };
const setLogoutTimeout = (seconds) => {
  // modify important variables
  timer.logoutDate = new Date();
  timer.logoutDate.setSeconds(timer.logoutDate.getSeconds() + seconds);
  timer.minute = new Date().getMinutes();

  // clear interval and setup new one
  clearInterval(timer.intervalID);
  timer.intervalID = setInterval(() => {
    const nowDate = new Date();
    const remainingTime = timer.logoutDate.getTime() - nowDate.getTime();

    // refresh welcome time if minute changes
    if (timer.minute !== nowDate.getMinutes()) {
      timer.minute = nowDate.getMinutes();
      domElements.refreshSecretAccountDomElements(secretAccount);
    }
    // check remaining time
    if (remainingTime <= 0)
      setTimeout(() => {
        clearInterval(timer.intervalID);
        handleLogout(new Event('click'));
      });

    // refresh logout time label
    domElements.changeTimer(
      secretAccount?.getLocale(),
      new Date(remainingTime > 0 ? remainingTime : null)
    );
  }, 200);
};

// Event Handlers /////////////////////////////////////////////////////////////
const handleLogin = function (e) {
  e.preventDefault();

  // test if already logged in
  if (secretAccount) return;

  // read form elements
  const inputLogin = {
    username: domElements.getLoginUsername(),
    pin: +domElements.getLoginPin(),
  };

  // find matching account with login username field
  const testAccount = accounts.find(
    (account) => account.username === inputLogin.username
  );
  // test matching account's pin with login pin field
  if (testAccount?.pin !== inputLogin.pin) return;

  // login
  secretAccount = signIn(testAccount, accountPublicMethods);
  setLogoutTimeout(120);

  // clean form fields
  domElements.clearLoginFields();
  domElements.blurLoginFields();

  // render dom
  domElements.refreshSecretAccountDomElements(secretAccount);
  domElements.changeLoginArrowDirection('left');

  // switch click event on button
  domElements.inputLoginButton.removeEventListener('click', handleLogin);
  domElements.inputLoginButton.addEventListener('click', handleLogout);
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
  domElements.inputLoginButton.removeEventListener('click', handleLogout);
  domElements.inputLoginButton.addEventListener('click', handleLogin);
};

const handleMoneyTransfer = function (e) {
  e.preventDefault();

  // create an object containing transfer information
  const moneyTransfer = {
    from: secretAccount?.getUsername(),
    to: domElements.getTransferTo(),
    amount: +domElements.getTransferAmount(),
    conversion: 'EURUSD',
    date: new Date().toISOString(),
    transferFee: 0,
  };
  moneyTransfer.transferFee = +(+moneyTransfer.amount * 0.002 + 1).toFixed(2);

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
    // prepare currency conversion fields
    moneyTransfer.conversion = `${secretAccount.getCurrency()}${
      targetAccount.currency
    }`;
    const shouldConvert =
      moneyTransfer.conversion.slice(0, 3) !==
      moneyTransfer.conversion.slice(-3);

    // commit changes
    secretAccount.addMovement({
      amount: -1 * (moneyTransfer.amount + moneyTransfer.transferFee),
      date: moneyTransfer.date,
    });
    console.log(moneyTransfer);
    shouldConvert && (moneyTransfer.amount *= rates[moneyTransfer.conversion]);
    console.log(rates[moneyTransfer.conversion]);
    console.log(moneyTransfer);
    targetAccount.movements.push(moneyTransfer.amount);
    targetAccount.movementsDates.push(moneyTransfer.date);
  };

  // render the changes
  const helperRender = () => {
    domElements.changeMovements(
      secretAccount.getMovements(),
      secretAccount.getLocale(),
      secretAccount.getCurrency()
    );
    domElements.changeBalance(
      secretAccount.getNetBalance(),
      secretAccount.getLocale(),
      secretAccount.getCurrency()
    );
    domElements.changeSortButton('highest');
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
    amount: +domElements.getLoanAmount(),
    date: new Date().toISOString(),
  };

  // clear input fields for preventing rapid successions
  domElements.clearLoanFields();
  domElements.blurLoanFields();

  // test requirements
  if (
    !secretAccount ||
    loanRequest.amount <= 0 ||
    !secretAccount
      .getMovements()
      .some(({ amount }) => amount >= loanRequest.amount) ||
    accounts
      .flatMap((account) => account.movements)
      .reduce((sum, movemet) => sum + movemet) <
      loanRequest.amount * 10
  )
    return;

  // transfer loan to account
  const helperLoan = () => {
    secretAccount.addMovement({
      amount: loanRequest.amount,
      date: loanRequest.date,
    });
  };

  // render changes
  const helperRender = () => {
    const localeAndCurrency = [
      secretAccount.getLocale(),
      secretAccount.getCurrency(),
    ];
    domElements.changeMovements(
      secretAccount.getMovements(),
      ...localeAndCurrency
    );
    domElements.changeBalance(
      secretAccount.getNetBalance(),
      ...localeAndCurrency
    );
    domElements.changeSummaryIn(
      secretAccount.getTotalDeposit(),
      ...localeAndCurrency
    );
    domElements.changeSummaryInterest(
      secretAccount.getTotalInterest(),
      ...localeAndCurrency
    );
    domElements.changeSortButton('highest');
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
    pin: +domElements.getClosePin(),
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

  // render changes
  domElements.changeMovements(
    secretAccount.getSortedMovements(sortingType),
    secretAccount.getLocale(),
    secretAccount.getCurrency()
  );
  const nextSortingType = {
    highest: 'lowest',
    lowest: 'amount',
    amount: 'recent',
    recent: 'highest',
  };
  domElements.changeSortButton(nextSortingType[sortingType] || 'highest');
};

const handleActivity = function (e) {
  e?.preventDefault();

  // if not logged in, don't even create a new timer
  if (!secretAccount) return;

  setLogoutTimeout(120);
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
window.addEventListener('click', handleActivity);
/* window.addEventListener('keydown', handleActivity); */
window.addEventListener('touchstart', handleActivity);

// auto login
/* (() => {
  domElements.inputLoginUsername.value = 'js';
  domElements.inputLoginPin.value = '1111';
  domElements.inputLoginButton.click();
})(); */

console.log(accounts);