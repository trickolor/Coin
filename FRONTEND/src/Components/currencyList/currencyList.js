const { el, setChildren } = require('redom');

import './currencyList.scss';

export function currencyList(data) {
    const container = el('div', { class: 'currency-list__container', draggable: true });

    const listItems = [];

    data.forEach((item) => {
        let currencyType = el('span', { class: `currency-list__currency-type`, textContent: item.code });
        let dots = el('span', { class: 'currency-list__dots' });
        let amount = el('span', { class: `currency-list__currency-amount`, textContent: Number(item.amount).toFixed(2) });

        let listItem = el('li', { class: 'currency-list__list-item' }, [
            currencyType,
            dots,
            amount
        ])
        listItems.push(listItem);

    });

    const list = el('ul', { class: 'currency-list__list' }, listItems);

    setChildren(container, [
        el('h1', { class: 'currency-list__title', textContent: 'Ваши валюты' }),
        list
    ]);

    return container;
}