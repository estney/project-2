import React, { useEffect, useState } from "react";
import { database } from "../firebase.jsx";
import { ref, onValue } from "firebase/database";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
ChartJS.register(ArcElement, Tooltip, Legend);
import { filterTransactionsByMonthAndYear } from "./utilities.js";

export default function TransactionStats({ selectedMonth, selectedYear }) {
  const [labels, setLabels] = useState([]);
  const [amountByCategory, setAmountByCategory] = useState({});

  useEffect(() => {
    const totalExpenseAmt = ref(database, "personal-expenses");

    //fetch data and calculate total amount for the selected month and year
    onValue(totalExpenseAmt, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const transactionsArray = Object.values(data);
        console.log("transaction amt", Object.values(data));
        //filter transactions for the selected month and year
        //import filter
        const filteredTransactions = filterTransactionsByMonthAndYear(
          data,
          selectedMonth,
          selectedYear
        );

        // const filteredTransactions = transactionsArray.filter((transaction) => {
        //   const transactionMonth = new Date(
        //     transaction.selectedDate
        //   ).getMonth();
        //   const transactionYear = new Date(
        //     transaction.selectedDate
        //   ).getFullYear();
        //   return (
        //     transactionMonth === selectedMonth &&
        //     transactionYear === selectedYear
        //   );
        // });

        // Calculate total amount for the categories
        // use hashmap to count amount per category

        const amountPerCategory = {}; //

        filteredTransactions.forEach((transaction) => {
          const category = transaction.categoryField;

          // If category exists in the object, add the transaction amount to its total
          if (amountPerCategory[category]) {
            amountPerCategory[category] += Number(transaction.amount);
          } else {
            // If category doesn't exist, initialize the total for that category
            amountPerCategory[category] = Number(transaction.amount);
          }
        });

        setAmountByCategory(amountPerCategory);
        console.log("Amount by category:", amountPerCategory);
        console.log("Amount by category 2:", amountByCategory);

        // Extract category labels from the object keys
        const categories = Object.keys(amountPerCategory);
        setLabels(categories);
        console.log("Category labels:", categories);
        console.log("Category labels 2:", labels);
      } else {
        // no data for the selected month and year
        setAmountByCategory({});
        setLabels([]);
      }
    });
  }, [selectedMonth, selectedYear]);

  // Prepare data for the pie chart
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Amount",
        data: Object.values(amountByCategory),

        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          // Add more colors as needed for different categories
        ],
      },
    ],
  };
  console.log("what this?", amountByCategory);
  return (
    <div>
      <h2>Transaction Stats</h2>
      <div style={{ height: "400px", width: "400px" }}>
        <Pie data={data} />
      </div>
    </div>
  );
}

//import transaction details
//extract data - monthly transaction
//extract labels used
//extract total amount per label
//data must follow the same arrangement.
//eg. red is 9, blue is 2.
//labels - [red, blue]
//data - [9, 12]
//edit pie chart's label and data set with our variables
//to include colours that i want to use in the dataset
//return pie chart
