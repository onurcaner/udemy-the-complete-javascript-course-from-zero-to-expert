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
// Elements ///////////////////////////////////////////////////////////////////
const domElements = {
  movements: document.querySelector('.movements'),
  balance: document.querySelector('.balance__value'),
  summaryIn: document.querySelector('.summary__value--in'),
  summaryOut: document.querySelector('.summary__value--out'),
  summaryInterest: document.querySelector('.summary__value--interest'),

  refreshMovements(movements) {
    this.movements.innerHTML = '';
    movements.forEach((movement, i) => {
      const movementType = movement > 0 ? 'deposit' : 'withdrawal';
      const TODOOO = '<div class="movements__date">3 days ago</div>';
      const htmlTemplate = `
        <div class="movements__row">
          <div class="movements__type movements__type--${movementType}">${
        i + 1
      } ${movementType}</div>
          <div class="movements__value">${movement}€</div>
        </div>
      `;
      this.movements.insertAdjacentHTML('afterbegin', htmlTemplate);
    });
  },

  refreshBalance(balance) {
    this.balance.textContent = `${balance}€`;
  },

  refreshSummaryIn(totalDeposit) {
    this.summaryIn.textContent = `${totalDeposit}€`;
  },

  refreshSummaryOut(totalWithdrawal) {
    this.summaryOut.textContent = `${Math.abs(totalWithdrawal)}€`;
  },

  refreshSummaryInterest(interest) {
    this.summaryInterest.textContent = `${interest}€`;
  },
};

// Account Methods ////////////////////////////////////////////////////////////
const accountPublicMethods = {
  owner: 'TYGVBH fhg GHyj JK Ghkkn g',
  movements: [20000, 4500, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  username: undefined,

  getMovements() {
    return this.movements;
  },
  createUsername() {
    this.username = this.owner
      .toLowerCase()
      .split(' ')
      .map((word) => word[0])
      .join('');
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

let secretAccount;
const signIn = function (account) {
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

secretAccount = signIn(accounts[0]);
console.log(secretAccount);

domElements.refreshMovements(secretAccount.getMovements());
domElements.refreshBalance(secretAccount.getNetBalance());
domElements.refreshSummaryIn(secretAccount.getTotalDeposit());
domElements.refreshSummaryOut(secretAccount.getTotalWithdrawal());
domElements.refreshSummaryInterest(secretAccount.getTotalInterest());
