const balanceEl = document.getElementById("balance");
const incomeAmountEl = document.getElementById("income-amount");
const expenseAmountEl = document.getElementById("expense-amount");
const transactionListEl = document.getElementById("transaction-list");
const transactionFormEl = document.getElementById("transaction-form");
const descriptionEl = document.getElementById("description");
const amountEl = document.getElementById("amount");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];   /*getting previous transactions*/

transactionFormEl.addEventListener("submit", addTransaction);

function addTransaction(e) {
  
  e.preventDefault();

  // get form values
  const description = descriptionEl.value.trim();
  const amount = parseFloat(amountEl.value);

  transactions.push({                                /*add to array the new one- no need to declare the variable*/
    id: Date.now(),
    description,
    amount,
    date:new Date().toLocaleDateString("en-LK"),
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));   /*save in the browser(if page is closed,data aint lost*/

  updateTransactionList();     /*UI update*/
  updateSummary();

  transactionFormEl.reset();               /*input fields clear*/
}

function updateTransactionList() {
  transactionListEl.innerHTML = "";                           /*old list clear-if not data is duplicated*/

  const sortedTransactions = [...transactions].reverse();     /*create a copy of the arr,newest first*/

  sortedTransactions.forEach((transaction) => {
    const transactionEl = createTransactionElement(transaction);
    transactionListEl.appendChild(transactionEl);                   /*add to screen*/
  });
}

function createTransactionElement(transaction) {      /*each transaction as HTML item*/
  const li = document.createElement("li");             /*new list item-html tag name=li*/
  li.classList.add("transaction");                    /*to add css class to the HTML element*/
  li.classList.add(transaction.amount > 0 ? "income" : "expense");       /*applying css styles*/

 li.innerHTML = `
  <div>
    <strong>${transaction.description}</strong>
    <small>
      ${transaction.date ? transaction.date : new Date(transaction.id).toLocaleDateString("en-LK")}
    </small>
  </div>

  <span>
    ${formatCurrency(transaction.amount)}
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  </span>
`;

  return li;
}

function updateSummary() {                    /*calculate*/
  // 100, -50, 200, -200 => 50
  const balance = transactions.reduce((acc, transaction) => acc + transaction.amount, 0);   /*final balance return*/

  const income = transactions
    .filter((transaction) => transaction.amount > 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  const expenses = transactions
    .filter((transaction) => transaction.amount < 0)
    .reduce((acc, transaction) => acc + transaction.amount, 0);

  // update ui -change the text in html element
  balanceEl.textContent = formatCurrency(balance);
  incomeAmountEl.textContent = formatCurrency(income);
  expenseAmountEl.textContent = formatCurrency(expenses);
}

function formatCurrency(number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "lkr",
  }).format(number);
}

function removeTransaction(id) {
  // filter out the one we wanted to delete
  transactions = transactions.filter((transaction) => transaction.id !== id);

  localStorage.setItem("transactions", JSON.stringify(transactions));

  updateTransactionList();
  updateSummary();
}

// initial render
updateTransactionList();
updateSummary();