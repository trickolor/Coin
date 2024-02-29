const { el, setChildren } = require('redom');

import './currencyRate.scss';

export function rateElement(from, to, rate, change) {
    return el('li', { class: 'currency-rate__list-item' }, [
        el('span', { class: 'currency-rate__pair', textContent: `${from}/${to}` }),
        change === 1 ? el('span', { class: 'currency-rate__pos-dots' }) : el('span', { class: 'currency-rate__neg-dots' }),
        el('span', { class: 'currency-rate__value', textContent: rate }),
        change === 1 ? el('div', { class: 'currency-rate__pos-indicator' }) : el('div', { class: 'currency-rate__neg-indicator' })
    ]);
}

export function currencyRate() {
    const wrapper = el('div', { class: 'currency-rate__wrapper' });
    const container = el('div', { class: 'currency-rate__container' });
    const list = el('ul', { class: 'currency-rate__list' });

    setChildren(container, [el('h1', { class: 'currency-rate__title', textContent: 'Изменение курсов в реальном времени' }), list]);

    setChildren(wrapper, [container]);

    return { wrapper, container, list }
}