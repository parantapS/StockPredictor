// public/js/script.js

const addBtn = document.getElementById("addBtn");
const input = document.getElementById("tickers");
const latestValue = document.getElementById("latestValue");

let tickersList = [];

addBtn.addEventListener("click", () => {
  const val = input.value.trim();
  if (val && tickersList.length < 3) {
    tickersList.push(val);
    latestValue.textContent = tickersList.join(", ");
    input.value = "";
  } else if (tickersList.length >= 3) {
      alert("You can only add up to 3 tickers.");
  }
});

// Optional: submit tickers as comma-separated string
const form = document.getElementById("simpleForm");
form.addEventListener("submit", async (e) => {

  if (tickersList.length === 0) {
    alert("Please add at least one ticker.");
    return;
  }
  // console.log("Submitting form with tickers:", tickersList);
  input.value = tickersList.join(", ");

});
