const { el, setChildren } = require('redom');

import './authPage.scss';
import { header } from '../header/header';

function createInputContainer(inputTitle, inputPlaceholder) {
    const container = el('div', { class: 'auth-page__input-container' });
    const input = el('input', { class: 'auth-page__input', placeholder: inputPlaceholder });

    setChildren(container, [
        el('span', { class: 'auth-page__input-title', textContent: inputTitle }),
        input,
    ])

    return { container, input };
}

export function authPage(authCallback) {
    const body = document.body;
    const container = el('div', { class: 'auth-page__container' });
    const login = createInputContainer('Логин', 'Логин');
    const password = createInputContainer('Пароль', 'Пароль');
    const button = el('button', { class: 'auth-page__button', textContent: 'Войти' });

    password.input.type = 'password';

    setChildren(container, [
        el('div', { class: 'auth-page__login-container' }, [
            el('h1', { class: 'auth-page__title', textContent: 'Вход в аккаунт' }),
            login.container,
            password.container,
            button
        ])
    ]);

    const main = el('main', { class: 'main' });
    setChildren(main, [container]);
    setChildren(body, [header(false), main]);

    button.addEventListener('click', async () => {
        [login.input, password.input].forEach((i) => {
            if (i.value.length < 6) {
                i.classList.add('invalid-input');
            }
        });
        authCallback();
    });

    [login.input, password.input].forEach((i) => {
        i.addEventListener('input', () => {
            if (i.classList.contains('invalid-input')) {
                i.classList.remove('invalid-input');
            }
        });
    });

    return { container, login: login.input, password: password.input, button };
}

