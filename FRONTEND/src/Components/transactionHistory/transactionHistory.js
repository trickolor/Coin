const { el, setChildren } = require('redom');
const cardValidator = require('card-validator');

import './transactionHistory.scss';

function createListCategory(text) {
    return el('span', { class: 'transaction-history__list-category', textContent: text })
}

function createListItemValue(text, color = null) {
    let className;
    if (color === 'red') {
        className = 'transaction-history__list-item-value transaction-history__list-item-value-red';
    } else if (color === 'green') {
        className = 'transaction-history__list-item-value transaction-history__list-item-value-green';
    } else {
        className = 'transaction-history__list-item-value';
    }

    const validation = cardValidator.number(text);

    if (validation.isValid) {
        className += ' transaction-history__list-item-value--' + validation.card.type;
    }

    return el('span', { class: className, textContent: text })
}

export function historyItem(from, to, date, amount) {
    const elements = [];
    let setColor = amount > 0 ? 'green' : 'red';

    Array.from(arguments).forEach((value) => {
        if (typeof value === 'number') {
            elements.push(createListItemValue(value, setColor));
        } else {
            elements.push(createListItemValue(value));
        }
    });

    return el('li', { class: 'transaction-history__list-item' }, elements);
}

function mapData(data) {
    return data.map((item) => {
        const elements = [];
        let setColor = item.amount > 0 ? 'green' : 'red';

        const keys = ['from', 'to', 'date', 'amount'];

        keys.forEach((value) => {
            if (typeof item[value] === 'number') {
                elements.push(createListItemValue(item[value], setColor));
            } else {
                elements.push(createListItemValue(item[value]));
            }
        });

        return el('li', { class: 'transaction-history__list-item' }, elements);
    });

}

export function transactionHistory(transactions, isAdvanced = false) {
    const container = el('div', { class: 'transaction-history__container' });

    const categories = [];
    const categoriesContent = ['Счёт отправителя', 'Счёт получателя', 'Дата', 'Сумма'];

    categoriesContent.forEach((category) => {
        categories.push(createListCategory(category));
    });

    const listHeader = el('div', { class: 'transaction-history__list-header' }, categories);

    const mappedData = mapData([...transactions].splice(0, 10));

    const list = el('ul', { class: 'transaction-history__list' }, mappedData);

    setChildren(container, [el('h1', { class: 'transaction-history__title', textContent: 'История переводов' }), listHeader, list]);

    if (isAdvanced) {
        container.classList.add('transaction-history__container--advanced');
        container.classList.remove('transaction-history__container');
        const nav = el('div', { class: 'transaction-history__navigation' });
        const prevButton = el('button', { class: 'transaction-history__prev' });
        const nextButton = el('button', { class: 'transaction-history__next' });
        const pagesCount = transactions.length / 25;
        let curentPage = 1;

        const navPages = el('span', {
            class: 'transaction-history__nav-pages',
            textContent: `${curentPage}/${Math.trunc(pagesCount) + (Math.floor(pagesCount) !== 0 ? 1 : 0)}`
        });

        setChildren(nav, [prevButton, navPages, nextButton]);

        let currentShown = mapData([...transactions].splice(0, 25));

        setChildren(list, currentShown);

        prevButton.addEventListener('click', () => {
            if (curentPage > 1) {
                --curentPage;
                navPages.textContent = curentPage + '/' + (Math.trunc(pagesCount) + (Math.floor(pagesCount) !== 0 ? 1 : 0));

                currentShown = mapData([...transactions].splice((curentPage - 1) * 25, 25));

                setChildren(list, currentShown);
            }
        });

        nextButton.addEventListener('click', () => {
            if (curentPage < (Math.trunc(pagesCount) + (Math.floor(pagesCount) !== 0 ? 1 : 0))) {
                ++curentPage;

                navPages.textContent = curentPage + '/' + (Math.trunc(pagesCount) + (Math.floor(pagesCount) !== 0 ? 1 : 0));

                currentShown = mapData([...transactions].splice((curentPage - 1) * 25, 25));

                setChildren(list, currentShown);
            }
        });

        if (transactions.length > 25) {
            container.append(nav);
        }
    }

    return container;
}