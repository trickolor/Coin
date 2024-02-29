const { el, setChildren } = require('redom');

import './accountInfo.scss'

export function accountInfo(goBackFunc, number, balanceSum) {
    const container = el('div', { class: 'account-info__container' });
    const title = el('h1', { class: 'account-info__title', textContent: 'Просмотр счёта ' });
    const button = el('button', { class: 'account-info__back-button', textContent: 'Вернуться назад', onclick: goBackFunc });
    const accountNumber = el('h2', { class: 'account-info__number', textContent: number });

    const balanceBox = el('div', { class: 'account-info__balance-box' }, [
        el('span', { class: 'account-info__balance-title', textContent: 'Баланс' }),
        el('span', { class: 'account-info__balance-sum', textContent: balanceSum })
    ]);

    setChildren(container, [
        title, button, accountNumber, balanceBox
    ]);

    return container
}
