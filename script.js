// DOM Elements
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const clearAllBtn = document.getElementById("clear-all");
const ctx = document.getElementById("expenseChart").getContext("2d");

// Retrieve transactions from localStorage or initialize as empty
const localStorageTransactions = JSON.parse(localStorage.getItem("transactions"));
let transactions = localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Initialize the chart
let chart = new Chart(ctx, {
  type: "doughnut",
  data: {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: ["#2ecc71", "#c0392b"],
      },
    ],
  },
  options: {
    responsive: true, // Ensure the chart resizes with the screen
    maintainAspectRatio: false, // Allow the chart to adjust its aspect ratio
    plugins: {
      legend: {
        position: "bottom",
      },
    },
    animation: {
      duration: 500, // Duration of animation to make transitions smoother
    },
  },
});

// Generate a random ID for each transaction
function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

// Add a transaction
function addTransaction(e) {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add text and amount");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();
    updateChart();

    text.value = "";
    amount.value = "";
  }
}

// Add a transaction to the DOM
function addTransactionDOM(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
    ${transaction.text} <span>${sign}${Math.abs(transaction.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">x</button>
  `;

  list.appendChild(item);
}

// Update the balance, income, and expense
function updateValues() {
  const amounts = transactions.map(transaction => transaction.amount);

  const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
  const expense = (
    amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
}

// Remove a transaction by ID
function removeTransaction(id) {
  transactions = transactions.filter(transaction => transaction.id !== id);
  updateLocalStorage();
  updateChart();
  init();
}

// Update transactions in localStorage
function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

// Update the chart with income and expense data
function updateChart() {
  const amounts = transactions.map(transaction => transaction.amount);

  const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0);
  const expense = amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1;

  chart.data.datasets[0].data = [income, expense];
  chart.update();
  const chartWrapper = document.getElementById("chart-wrapper");
  if (income === 0 && expense === 0) {
    chartWrapper.classList.remove("show");
  } else {
    chartWrapper.classList.add("show");
  }
}

// Clear all transactions
function clearAllTransactions() {
  transactions = [];
  updateLocalStorage();
  updateChart();
  init();
}

// Initialize the app
function init() {
  list.innerHTML = ""; // Clear the transaction list
  transactions.forEach(addTransactionDOM); // Add all transactions to the DOM
  updateValues(); // Update balance, income, and expense
  updateChart(); // Update the chart
}

// Event listener for form submission
form.addEventListener("submit", addTransaction);

// Event listener for the "Clear All" button
clearAllBtn.addEventListener("click", clearAllTransactions);

// Initialize the app on page load
init();
