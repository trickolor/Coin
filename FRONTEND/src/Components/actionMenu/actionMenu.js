import { el, setChildren } from 'redom';

import './actionMenu.scss'

export function createOption(content, classNameRoot, parentContainer) {
    const option = el('div', { class: `${classNameRoot}__option`, tabIndex: 0, textContent: content });

    option.addEventListener('click', () => {
        if (parentContainer.querySelector(`.${classNameRoot}__option--active`)) {
            parentContainer.querySelector(`.${classNameRoot}__option--active`).classList.toggle(`${classNameRoot}__option--active`);
        }

        parentContainer.parentElement.querySelector(`.${classNameRoot}__option-current`).textContent = option.textContent;
        parentContainer.parentElement.querySelector(`.${classNameRoot}__option-current`).classList.toggle(`${classNameRoot}__option-current--active`);

        option.classList.toggle(`${classNameRoot}__option--active`);
        parentContainer.classList.toggle(`${classNameRoot}__options-container--active`);
    });

    return option;
}

export function select(classNameRoot, optionContents, content) {
    const container = el('div', { class: `${classNameRoot}__select-container` });

    const optionCurrent = el('div', {
        class: `${classNameRoot}__option-current`, textContent: content, onclick: () => {
            console.log('TEST');
            optionsContainer.classList.toggle(`${classNameRoot}__options-container--active`);
            optionCurrent.classList.toggle(`${classNameRoot}__option-current--active`);
        }
    });
    const optionsContainer = el('div', { class: `${classNameRoot}__options-container` });

    const options = [];

    for (let i of optionContents) {
        options.push(createOption(i, classNameRoot, optionsContainer));
    }

    setChildren(optionsContainer, options);
    setChildren(container, [optionCurrent, optionsContainer]);

    return { container, optionsContainer, options, optionCurrent };
}

export function actionMenu(classNameRoot = 'action-menu') {
    const button = el('button', { class: 'action-menu__button', textContent: 'Создать новый счёт' });
    const selectElement = select(classNameRoot, ['По номеру', 'По балансу', 'По последней транзакции'], 'Сортировка');

    const container = el('div', { class: 'action-menu__container' }, [
        el('h1', { class: 'action-menu__title', textContent: 'Ваши счета' }),
        selectElement.container,
        button
    ]);

    return { container, button, options: selectElement.options };
}
