const filterTransactionsByMonthAndYear = (
  data,
  selectedMonth,
  selectedYear
) => {
  if (!data) return [];

  const transactionsArray = Object.values(data);

  return transactionsArray.filter((transaction) => {
    const transactionMonth = new Date(transaction.selectedDate).getMonth();
    const transactionYear = new Date(transaction.selectedDate).getFullYear();
    return (
      selectedMonth === transactionMonth && selectedYear === transactionYear
    );
  });
};

export { filterTransactionsByMonthAndYear };
