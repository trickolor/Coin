const { el, setChildren } = require('redom');

import './accountPage.scss';
import { transfer } from '../transfer/transfer.js';
import { Chart, chart } from '../chart/chart.js';
import { transactionHistory } from '../transactionHistory/transactionHistory';
import { accountInfo } from '../accountInfo/accountInfo.js';
import { processData } from '../../helpers/logic.js';
import { SkeletonAPI } from '../skeleton/skeleton.js';
import { customize } from '../../helpers/dragCustomization.js';
import { setRoute } from '../../main';

export async function accountPage(token, id) {
    SkeletonAPI.accountIdPage();

    const data = await processData(token, id);

    const main = document.querySelector('main');

    const container = el('div', { class: 'account-page__container' });


    // const balanceDynamicsChart = chart('Динамика баланса', data.shortValues, data.shortMonths);
    const chart = new Chart('Динамика баланса', data.shortValues, data.shortMonths).simpleChart(window.innerWidth > 649 ? 165 : 100);
    const transactionHistoryElement = transactionHistory(data.lastTenTransactions);
    const transferBox = transfer(token, data.account);
    const infoHeader = accountInfo(() => history.back(), data.account, data.balance + ' ₽');

    customize([transferBox.container, chart, transactionHistoryElement]);

    [chart, transactionHistoryElement].forEach((e) => {
        let callbackFlag = true;

        const callback = () => {
            setRoute('accounts?id=' + id + '&advanced=true');
            console.log('callback added');
        }

        e.addEventListener('click', callback);

        const drag = e.querySelector('.drag');

        drag.addEventListener('mouseover', () => {
            e.removeEventListener('click', callback);
            callbackFlag = false;
        });

        drag.addEventListener('mouseout', () => {
            if (callbackFlag === false) {
                e.addEventListener('click', callback);
            }
        });
    });

    setChildren(container, [
        infoHeader,
        transferBox.container,
        chart,
        transactionHistoryElement
    ]);

    setChildren(main, [container]);
}