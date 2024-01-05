import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_SOME_CURRENCY_API_KEY;
const API_URL = `https://api.freecurrencyapi.com/v1/latest?apikey=${API_KEY}`;

export default function CurrencyConversion({
  showCurrencyModal,
  handleCloseCurrencyModal,
}) {
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("");
  const [toCurrency, setToCurrency] = useState("SGD"); //default always set to SGD
  const [convertedAmount, setConvertedAmount] = useState("");
  const [currencyOptions, setCurrencyOptions] = useState([]); //list of currency

  //display currency in drop down selection
  useEffect(() => {
    // fetch currencies from the API only when user click on 'convert currency', to save usage.
    if (showCurrencyModal) {
      axios
        .get(API_URL)
        .then((response) => {
          const currencyData = response.data.data;
          console.log("current list - data", currencyData);
          const currencies = Object.keys(currencyData);
          setCurrencyOptions(currencies);
          console.log("currencies", currencies);
        })
        .catch((error) => {
          console.error("Error fetching currencies:", error);
          // Handle error state or display an error message for currency fetch failure
        });
    }
  }, [showCurrencyModal]);

  // Conversion Logic
  // fetch details from the specified currency to SGD first
  // conversion URL base_currency is the foreign currency; set the target currency to SGD
  // calculation: foreign currency amount * SGD rate (e.g., USD 1 * SGD 1.33 = expenses in SGD)
  // display the converted amount (in SGD) to the user
  // allow the user to add the converted amount to the expense tracker - not done

  const calculateConversion = () => {
    let conversion_URL = `${API_URL}&currencies=${toCurrency}&base_currency=${fromCurrency}`;
    console.log("conversion URL data", conversion_URL);

    //only allow user to convert when fromCurrency and amount is valid
    if (amount && fromCurrency) {
      axios
        .get(conversion_URL)
        .then((response) => {
          const exchangeRateValues = response.data.data;
          const exchangeRate = Object.values(exchangeRateValues);
          console.log("chosen curreny exchangeRate:", exchangeRate);
          //calculation
          //input amount * exchangeRate
          const calConversion = amount * exchangeRate;
          setConvertedAmount(calConversion.toFixed(2));
          console.log("converted amt:", convertedAmount);
        })
        .catch((error) => {
          console.error("Currency conversion page error:", error);
        });
    } else {
      console.error("Please provide amount and currency to convert");
      // Handle error state or display an error message for missing input
    }
  };

  const handleCalculate = () => {
    calculateConversion();
  };

  const handleAddToExpenses = () => {
    console.log(`Adding SGD {convertedAmount} to expenses`);
  };

  return (
    <>
      {showCurrencyModal && (
        <div className="modal-background">
          <div className="modal-content">
            <button className="close" onClick={handleCloseCurrencyModal}>
              Close
            </button>
            <h2>Money Currency</h2>
            <p>Amount to be converted:</p>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
            <p>From</p>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
            >
              <option value="">Choose Currency</option>
              {currencyOptions.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            <p>To Converted Amount: {convertedAmount}</p>
            <p>To</p>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
            >
              <option value="">Choose Currency</option>
              {currencyOptions.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>

            <button onClick={handleCalculate}>Calculate</button>
            <br />
            <button onClick={handleAddToExpenses}>Add to Expenses</button>
          </div>
        </div>
      )}
    </>
  );
}
