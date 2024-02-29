const { el, setChildren } = require('redom');

import { select } from '../actionMenu/actionMenu';

import './currencyExchange.scss';
import { RequestAPI } from '../../helpers/requests';

export function currencyExchange(token, currencyTypes) {
    const container = el('div', { class: 'currency-exchange__container', draggable: true });

    const currencyFrom = select('currency-exchange', currencyTypes, '---');
    const currencyTo = select('currency-exchange', currencyTypes, '---');

    const exchangeInputBox = el('div', { class: 'currency-exchange__currency-input-box' }, [
        el('span', { class: 'currency-exchange__currency-input-span', textContent: 'Из' }),
        currencyFrom.container,
        el('span', { class: 'currency-exchange__currency-input-span', textContent: 'В' }),
        currencyTo.container,
    ]);

    const amountInput = el('input', { class: 'currency-exchange__sum-input', placeholder: 'Placeholder' });

    amountInput.addEventListener('input', () => {
            let inputValue = amountInput.value;
            inputValue = inputValue.replace(/[^0-9]/g, '');
            amountInput.value = inputValue;
    });

    const sumBox = el('div', { class: 'currency-exchange__sum-input-box' }, [
        el('span', { class: 'currency-exchange__sum-input-title', textContent: 'Сумма' }),
        amountInput
    ]);

    const boxLeft = el('div', { class: 'currency-exchange__box-left' });

    setChildren(boxLeft, [
        el('h1', { class: 'currency-exchange__title', textContent: 'Обмен валюты' }),
        exchangeInputBox,
        sumBox
    ]);

    const btn = el('button', { class: 'currency-exchange__button', textContent: 'Обменять' });

    btn.addEventListener('click', () => {
        RequestAPI.currencyBuyRequest(token, currencyFrom.optionCurrent.textContent, currencyTo.optionCurrent.textContent, parseFloat((amountInput.value)));
        currencyFrom.optionCurrent.textContent = '---';
        currencyTo.optionCurrent.textContent = '---';
        exchangeInputBox.querySelectorAll('.currency-exchange__option--active').forEach(e => e.classList.remove('currency-exchange__option--active'));
        amountInput.value = '';
    });

    setChildren(container, [
        boxLeft,
        btn
    ])

    return container;
}