import { el, setChildren } from "redom";

import './skeleton.scss';

export class SkeletonAPI {
    constructor() { }

    static mainSet(skeletonParts, selector = '.main') {
        setChildren(document.querySelector(selector), skeletonParts);
    }

    static accountsPage() {
        const actionsMenu = el('div', { class: 'skeleton__actions-menu' });
        const cardList = el('div', { class: 'skeleton__card-list' });
        for (let i = 0; i < 9; ++i) {
            const card = el('div', { class: 'skeleton__card' });
            cardList.append(card);
        }

        // if (mainRequired) {
        //     const main = el('main.main');
        //     document.body.append(main);
        // }

        this.mainSet([actionsMenu, cardList], 'main');
    }

    static accountIdPage() {
        const container = el('div', { class: 'skeleton__account-id-container' });
        const accountInfoHeader = el('div', { class: 'skeleton__account-info-header' });
        const newTransfer = el('div', { class: 'skeleton__new-transfer' });
        const dynamicsChart = el('div', { class: 'skeleton__dynamics-chart' });
        const transactionHistory = el('div', { class: 'skeleton__transaction-history' });
        setChildren(container, [accountInfoHeader, newTransfer, dynamicsChart, transactionHistory]);
        this.mainSet([container]);
    }

    static advancedDynamicsPage() {
        const container = el('div', { class: 'skeleton__account-id-container' });
        const accountInfoHeader = el('div', { class: 'skeleton__account-info-header' });
        const dynamicsChartFirst = el('div', { class: 'skeleton__dynamics-chart--extended' });
        const dynamicsChartSecond = el('div', { class: 'skeleton__dynamics-chart--extended' });
        const transactionHistory = el('div', { class: 'skeleton__transaction-history' });
        setChildren(container, [accountInfoHeader, dynamicsChartFirst, dynamicsChartSecond, transactionHistory]);
        this.mainSet([container]);
    }

    static currencyPage() {
        const container = el('div', { class: 'skeleton__currency-container' });
        const containerLeftHalf = el('div', { class: 'skeleton__currency-container-left-half' });
        const currencyList = el('div', { class: 'skeleton__currency-list' });
        const currencyExchange = el('div', { class: 'skeleton__currency-exchange' });
        const currencyRates = el('div', { class: 'skeleton__currency-rates' });
        setChildren(containerLeftHalf, [currencyList, currencyExchange]);
        setChildren(container, [containerLeftHalf, currencyRates]);
        this.mainSet([container]);
    }
}