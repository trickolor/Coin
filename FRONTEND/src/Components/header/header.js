const { el, setChildren } = require('redom');

import './header.scss';
import { authSet, setRoute } from '../../main';

function createMenuItem(itemText, fromButton = false) {
    return el('button', { class: fromButton ? 'header__menu-item-adaptive' : 'header__menu-item', textContent: itemText })
}

function createHeaderMenu(fromButton = false) {
    const container = el('nav', { class: fromButton ? 'header__menu-adaptive' : 'header__menu' });
    const menuItemList = []
    const menuTextList = ['Банкоматы', 'Счета', 'Валюта', 'Выйти'];
    for (let i of menuTextList) {
        let menuItem = createMenuItem(i, fromButton)
        menuItemList.push(menuItem);
        if (fromButton) {
            menuItem.addEventListener('click', () => {
                container.classList.remove('header__menu-adaptive--active');
            });
        }
    }

    setChildren(container, menuItemList);

    return { container, menuItemList }
}

export function header(withMenu = false, token = null) {
    const logo = el('span', { class: 'header__logo', textContent: 'Coin.' });
    const container = el('div', { class: 'header__container' }, [
        logo,
    ]);

    const header = el('header', { class: 'header' }, [container]);

    const headerMenu = createHeaderMenu();
    const headerMenuAdaptive = createHeaderMenu(true);

    const modal = el('div', { class: 'header__menu-modal' });

    const cross = el('button', { class: 'header__menu-cross' });
    headerMenuAdaptive.container.insertBefore(cross, headerMenuAdaptive.container.firstChild);

    const headerMenuButton = el('button', { class: 'header__menu-button' });

    for (let i = 0; i < 3; ++i) {
        let line = el('span', { class: 'header__menu-button-line header__menu-button-line-' + (i + 1) });
        headerMenuButton.append(line);
    }

    const navigationMap = {
        'Банкоматы': () => {
            setRoute('map');
        },
        'Счета': () => {
            setRoute('accounts');
        },
        'Валюта': () => {
            setRoute('currencies');
        },
        'Выйти': () => {
            localStorage.removeItem('token');
            history.replaceState({}, '', 'auth');
            authSet();
        }
    }

    function addCallbacks(arr) {
        arr.forEach((item) => {
            item.addEventListener('click', (e) => {
                const render = navigationMap[item.textContent];
                render();
                modal.remove();
            });
        });
    }

    addCallbacks(headerMenu.menuItemList);
    addCallbacks(headerMenuAdaptive.menuItemList);



    if (!document.querySelector('.header')) {
        document.body.append(header);
    }

    modal.addEventListener('click', () => {
        headerMenuAdaptive.container.classList.remove('header__menu-adaptive--active');
        modal.remove();
    });

    cross.addEventListener('click', () => {
        headerMenuAdaptive.container.classList.remove('header__menu-adaptive--active');
        modal.remove();
    });

    headerMenuButton.addEventListener('click', () => {
        document.body.append(modal);
        headerMenuAdaptive.container.classList.add('header__menu-adaptive--active');
    });

    if (withMenu) {
        document.querySelector('.header__container').append(headerMenu.container, headerMenuButton, headerMenuAdaptive.container);
    } else {
        return header;
    }
}