const { el } = require('redom');

import './accountClass.scss'

function createCardComponent(tag, elementClass, content, callback = null) {
    if (callback) {
        return el(tag, { className: elementClass, textContent: content, onclick: callback });
    }

    return el(tag, { className: elementClass, textContent: content });
}

export class accountClass {
    constructor(cardNumber, balance, lastTransactionDate, callback) {
        this.__cardNumber = cardNumber;
        this.__balance = balance;
        this.__lastTransactionDate = lastTransactionDate;
        this.callback = callback;
    }

    createHTMLElement(container) {
        const tags = ['span', 'span', 'span', 'span', 'button'];
        const values = [this.cardNumber, this.balance, 'Последняя транзакция', this.lastTransactionDate, 'Открырть'];
        const classes = ['account-class__number', 'account-class__balance', 'account-class__date-title', 'account-class__date', 'account-class__button'];

        const elements = [];

        for (let i = 0; i < tags.length; i++) {
            let item = createCardComponent(tags[i], classes[i], values[i], tags[i] === 'button' ? this.callback : null);
            elements.push(item);
        }

        container.append(el('div', { className: 'account-class__container' }, elements));
    }

    set balance(balance) {
        this.__balance = balance;
    }

    get balance() {
        return this.__balance;
    }

    set lastTransactionDate(lastTransactionDate) {
        this.__lastTransactionDate = lastTransactionDate;
    }

    get lastTransactionDate() {
        return this.__lastTransactionDate;
    }

    set cardNumber(cardNumber) {
        this.__cardNumber = cardNumber;
    }

    get cardNumber() {
        return this.__cardNumber;
    }
}
