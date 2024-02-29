import { RequestAPI } from "./requests";

export async function processData(token, id) {
  const data = await RequestAPI.AccountIdRequest(token, id);
  const months = ['января', 'февраля', 'марта', 'апреля', 'май', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
  const transactions = data.transactions;
  const currentDate = new Date();

  const allTransactions = [...transactions].map((t) => {
    const date = new Date(t.date);
    const adjDate = [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('.');
    t.date = adjDate;
    return t;
  });

  const dataSetting = (howMuchAgo) => {
    const monthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - howMuchAgo, 1);
    monthsAgo.setUTCHours(0, 0, 0, 0);
    return monthsAgo
  };

  const sixMonthsAgo = dataSetting(6);
  const twelveMonthsAgo = dataSetting(12);

  const shortLastTransactions = [];
  const longLastTransactions = [];
  const shortMonthIndexes = [];
  const longMonthIndexes = [];

  const filterTransactions = (storageTransactionArray, storageMonthIndexArray, comparator) => {

    [...allTransactions].forEach((t) => {
      const date = new Date(t.date.split('.').reverse());
      if (date >= comparator) {
        storageTransactionArray.push(t);
        if (!storageMonthIndexArray.includes(date.getMonth())) {
          storageMonthIndexArray.push(date.getMonth());
        }
      }
    });

    if ([...allTransactions].length === 0) {
      storageMonthIndexArray.push(currentDate.getMonth());
    }
  }

  filterTransactions(shortLastTransactions, shortMonthIndexes, sixMonthsAgo);
  filterTransactions(longLastTransactions, longMonthIndexes, twelveMonthsAgo);

  const allShortAmounts = [];
  const allLongAmounts = [];

  let shortAmount = data.balance;
  let longAmount = data.balance;

  const getValues = (lastTransactions, monthIndexes, accumArray, amount) => {
    [...monthIndexes].reverse().forEach((i) => {
      if (i === monthIndexes[monthIndexes.length - 1]) {
        accumArray.push(amount);
      } else {
        [...lastTransactions].reverse().forEach((t) => {
          const date = new Date(t.date.split('.').reverse());
          if (date.getMonth() === i && i !== monthIndexes[monthIndexes.length - 1]) {
            if (t.to === data.account) {
              amount -= t.amount;
            } else if (t.from === data.account) {
              amount += t.amount;
            }
          }
        });

        accumArray.push(amount);
      }
    });
  }

  getValues(shortLastTransactions, shortMonthIndexes, allShortAmounts, shortAmount);
  getValues(longLastTransactions, longMonthIndexes, allLongAmounts, longAmount);

  let lastShortMonth = shortMonthIndexes[0];
  while (shortMonthIndexes.length !== 6) {
    if (lastShortMonth > 0) {
      --lastShortMonth;
    } else {
      lastShortMonth += 11;
    }
    shortMonthIndexes.unshift(lastShortMonth);
    allShortAmounts.push(0);
  }

  const profits = [];
  const losses = [];
  let prof = 0;
  let loss = 0;

  [...longMonthIndexes].forEach((i) => {
    [...longLastTransactions].reverse().forEach((t) => {
      const date = new Date(t.date.split('.').reverse());
      if (date.getMonth() === i) {
        if (t.to === data.account) {
          prof += t.amount;
        } else if (t.from === data.account) {
          loss += t.amount;
        }
      }
    });

    profits.push(prof);
    losses.push(loss);
    prof = 0;
    loss = 0;
  });

  let lastLongMonth = longMonthIndexes[0];
  while (longMonthIndexes.length !== 12) {
    if (lastLongMonth > 0) {
      --lastLongMonth;
    } else {
      lastLongMonth += 11;
    }
    longMonthIndexes.unshift(lastLongMonth);
    allLongAmounts.push(0);
    profits.unshift(0);
    losses.unshift(0);
  }

  const shortMonths = [];
  const longMonths = [];

  const getAbreviations = (monthIndexes, monthAbreviations) => {
    monthIndexes.forEach((i) => {
      monthAbreviations.push(months[i].substring(0, 3));
    });
  }

  getAbreviations(shortMonthIndexes, shortMonths);
  getAbreviations(longMonthIndexes, longMonths);

  const processedData = {
    account: data.account,
    balance: data.balance,
    lastTenTransactions: [...allTransactions].reverse().splice(0, 10),
    allTransactions: [...allTransactions].reverse(),
    shortMonths,
    longMonths,
    shortValues: [...allShortAmounts].reverse().map((item) => parseFloat(item.toFixed(2))),
    longValues: [...allLongAmounts].reverse().map((item) => parseFloat(item.toFixed(2))),
    lossValues: [...losses].map((item) => parseFloat(item.toFixed(2))),
    profitValues: [...profits].map((item) => parseFloat(item.toFixed(2)))
  }

  return processedData;
}

export function processCurrencies(data) {
  const arr = []
  Object.keys(data).forEach((key) => {
    arr.push(data[key]);
  })

  return arr;
}