const amountInput = document.getElementById("amount");
const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const resultInput = document.getElementById("result");
const statusText = document.getElementById("status");
const convertBtn = document.getElementById("convertBtn");

const API_KEY = "e6770cf6528ad943053cad8f";
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

let rates = {};

// 🔹 Fetch all currencies 
async function loadCurrencies() {
  statusText.textContent = "Loading currencies...";

  try {
    const response = await fetch(BASE_URL);
    const data = await response.json();

    if (data.result !== "success") {
      statusText.textContent = "Failed to load currencies";
      return;
    }

    rates = data.conversion_rates;

    // Populate dropdowns
    Object.keys(rates).forEach(currency => {
      fromCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
      toCurrency.innerHTML += `<option value="${currency}">${currency}</option>`;
    });

    // Default selection
    fromCurrency.value = "USD";
    toCurrency.value = "INR";

    statusText.textContent = "Ready";

    convertCurrency(); // initial conversion

  } catch (error) {
    statusText.textContent = "Network error";
  }
}

// 🔹 Convert currency
async function convertCurrency() {
  const amount = parseFloat(amountInput.value);

  if (isNaN(amount) || amount <= 0) {
    resultInput.value = "";
    statusText.textContent = "Enter a valid amount";
    return;
  }

  const from = fromCurrency.value;
  const to = toCurrency.value;

  statusText.textContent = "Converting...";

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${from}`
    );
    const data = await response.json();

    if (data.result !== "success") {
      statusText.textContent = "API error";
      return;
    }

    const rate = data.conversion_rates[to];
    resultInput.value = (amount * rate).toFixed(2);
    statusText.textContent = "Last updated just now";

  } catch (error) {
    statusText.textContent = "Network error";
  }
}

// 🔹 Events
convertBtn.addEventListener("click", convertCurrency);
amountInput.addEventListener("input", convertCurrency);
fromCurrency.addEventListener("change", convertCurrency);
toCurrency.addEventListener("change", convertCurrency);

// 🔹 Initialize
loadCurrencies();