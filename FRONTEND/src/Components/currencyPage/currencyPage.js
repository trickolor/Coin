const { el, setChildren } = require('redom');

import './currencyPage.scss';
import { currencyList } from "../currencyList/currencyList";
import { currencyExchange } from "../currencyExchange/currencyExchange";
import { currencyRate, rateElement } from "../currencyRate/currencyRate";
import { RequestAPI } from "../../helpers/requests";
import { processCurrencies } from "../../helpers/logic";
import { SkeletonAPI } from "../skeleton/skeleton";
import { customize } from "../../helpers/dragCustomization";

export async function currencyPage(token) {
    SkeletonAPI.currencyPage();

    const main = document.querySelector('.main');
    const currRates = currencyRate();

    const socket = new WebSocket('ws://localhost:3000/currency-feed');

    socket.onmessage = function (event) {
        const message = JSON.parse(event.data);

        if (message.type === "EXCHANGE_RATE_CHANGE") {
            const { from, to, rate, change } = message;
            currRates.list.append(rateElement(from, to, rate, change));

            if (currRates.list.childElementCount > (window.innerWidth > 1440 ? 20 : 10)) {
                currRates.list.removeChild(currRates.list.firstChild);
            }
        }
    };

    socket.onerror = function (error) {
        console.error('WebSocket error:', error);
    };

    const [currTypesData, currListData] = await Promise.all([RequestAPI.currenciesTypesRequest(token), RequestAPI.currenciesRequest(token)]);

    const container = el('div', { class: 'currency-page__container' });

    const currencyListElement = currencyList(processCurrencies(currListData));
    const currencyExchangeElement = currencyExchange(token, currTypesData);

    const boxLeft = el('div', { class: 'currency-page__box-left' });
    setChildren(boxLeft, [
        currencyListElement,
        currencyExchangeElement
    ]);

    const boxMain = el('div', { class: 'currency-page__box-main' }, [
        boxLeft,
        currRates.wrapper
    ]);

    customize([currencyListElement, currencyExchangeElement]);

    setChildren(container, [
        el('h1', { class: 'currency-page__title', textContent: 'Валютный обмен' }),
        boxMain
    ]);

    setChildren(main, [container]);
}
