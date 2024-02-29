import { el, setChildren } from "redom";

import { Chart, chart } from "../chart/chart";
import { processData } from "../../helpers/logic";
import { accountInfo } from "../accountInfo/accountInfo";
import { SkeletonAPI } from "../skeleton/skeleton";
import { customize } from "../../helpers/dragCustomization";
import { transactionHistory } from "../transactionHistory/transactionHistory";

export async function accountAdvancedPage(token, id) {
    SkeletonAPI.advancedDynamicsPage();

    const data = await processData(token, id);
    const main = document.querySelector('.main');
    const container = el('div', { class: 'account-advanced-page__contaniner' });
    const accountInfoHeader = accountInfo(
        () => history.back(),
        data.account,
        data.balance + ' ₽'
    );
    // const longChart = chart('Динамика баланса', data.longValues, data.longMonths);
    // const advancedChart = chart('Соотношение входящих исходящих транзакций', data.longValues, data.longMonths, true, data.lossValues, data.profitValues);

    const longChart = new Chart('Динамика баланса', data.longValues, data.longMonths).simpleChart(window.innerWidth > 649 ? 165 : 100);
    const advancedChart = new Chart('Соотношение входящих исходящих транзакций', data.longValues, data.longMonths).advancedChart(window.innerWidth > 649 ? 165 : 100, data.lossValues, data.profitValues);

    const transactionHistoryElement = transactionHistory(data.allTransactions, true);

    setChildren(container, [accountInfoHeader, longChart, advancedChart, transactionHistoryElement]);
    customize([longChart, advancedChart, transactionHistoryElement]);

    setChildren(main, [container]);
}


