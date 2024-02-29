const { el, setChildren } = require('redom');
const cardValidator = require('card-validator');

import { RequestAPI } from '../../helpers/requests';
import { historyItem } from '../transactionHistory/transactionHistory';
import './transfer.scss';

function createInput(title, inputPlaceholder) {
    const container = el('div', { class: 'transfer__input-container' });

    const input = el('input', { class: 'transfer__input', placeholder: inputPlaceholder });

    setChildren(container, [
        el('span', { class: 'transfer__input-title', textContent: title }),
        input
    ])

    return { container, input }
}

function createSpecialInput(title, inputPlaceholder) {
    const container = el('div', { class: 'transfer__input-container' });
    const list = el('ul', { class: 'transfer__account-list' });
    const input = el('input', { class: 'transfer__input', placeholder: inputPlaceholder });
    const pseudoButton = el('button', { class: 'transfer__button-pseudo' });


    if (JSON.parse(localStorage.getItem('transferBuffer'))) {
        input.classList.add('transfer__input-special');

    } else {
        input.style.backgroundImage = 'none';
    }

    pseudoButton.addEventListener('click', () => {
        const accounts = JSON.parse(localStorage.getItem('transferBuffer'));

        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        if (localStorage.getItem('transferBuffer')) {
            input.classList.toggle('transfer__input-special--active');
            list.classList.toggle('transfer__account-list--active');
            accounts.forEach((e) => {

                const listItem = el('li', { class: 'transfer__account-list-item', textContent: e });
                if (!list.contains(listItem)) {
                    list.append(listItem);
                }

                listItem.addEventListener('click', () => {
                    list.classList.toggle('transfer__account-list--active');
                    input.classList.toggle('transfer__input-special--active');
                    input.value = listItem.textContent;
                    input.classList.remove('transfer__input-special--visa', 'transfer__input-special--mir', 'transfer__input-special--mastercard')
                });

            });
        }
    });

    let specialClass;

    input.addEventListener('input', () => {
        const validation = cardValidator.number(input.value);
        if (validation.isValid) {
            specialClass = 'transfer__input-special--' + validation.card.type;
            input.classList.add(specialClass);
        } else {
            input.classList.remove(specialClass);
        }
    });

    setChildren(container, [
        el('span', { class: 'transfer__input-title', textContent: title }),
        input,
        list,
        pseudoButton
    ]);

    return { container, input, list };
}

export function transfer(token, account) {
    const container = el('div', { class: 'transfer__container' });
    const input = createInput('Сумма перевода', 'Placeholder');
    const specialInput = createSpecialInput('Номер счёта получателя', 'Placeholder');

    const button = el('button', { class: 'transfer__button', textContent: 'Отправить' });

    [input.input, specialInput.input].forEach((i) => {
        i.addEventListener('input', () => {
            let inputValue = i.value;
            inputValue = inputValue.replace(/[^0-9]/g, '');
            i.value = inputValue;
        });
    });

    button.addEventListener('click', async () => {
        const request = await RequestAPI.transferRequest(token, account, specialInput.input.value, input.input.value);
        if (request === 0) {
            if (localStorage.getItem('transferBuffer')) {
                const accounts = JSON.parse(localStorage.getItem('transferBuffer'));
                if (!accounts.includes(specialInput.input.value) && specialInput.input.value.length > 15) {
                    accounts.push(specialInput.input.value);
                }
                localStorage.setItem('transferBuffer', JSON.stringify(accounts));
            } else {
                localStorage.setItem('transferBuffer', JSON.stringify([specialInput.input.value]));
            }

            const date = new Date();
            const formatedDate = [date.getDay() + 1, date.getMonth() + 1, date.getFullYear()].join('.');

            const historyList = document.querySelector('.transaction-history__list');
            historyList.insertBefore(historyItem(account, specialInput.input.value, formatedDate, Number(input.input.value)), historyList.firstChild);
            historyList.removeChild(historyList.lastChild);

            const balanceSum = document.querySelector('.account-info__balance-sum');
            balanceSum.textContent = Number(balanceSum.textContent.substring(0, balanceSum.textContent.length - 2)) - Number(input.input.value) + ' ₽';
        }
        input.input.value = '';
        specialInput.input.value = '';
    })

    setChildren(container, [
        el('h1', { class: 'transfer__title', textContent: 'Новый перевод' }),
        specialInput.container,
        input.container,
        button
    ]);

    return { container, button, specialInput, input };
}