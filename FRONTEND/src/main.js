import 'normalize.css'

import { el } from 'redom';
import { accountListPage } from './Components/accountListPage/accountListPage.js';
import { header } from './Components/header/header.js';
import { map } from './Components/map/map.js';
import { currencyPage } from './Components/currencyPage/currencyPage.js';
import { accountPage } from './Components/accountPage/accountPage.js';
import { accountAdvancedPage } from './Components/accountAdvancedPage/accountAdvancedPage.js';
import { authPage } from './Components/authPage/authPage.js';
import Navigo from 'navigo';
import { RequestAPI } from './helpers/requests.js';

const router = new Navigo('/');

function preset() {
    if (!document.querySelector('header')) {
        document.body.append(header(false));
        header(true, localStorage.getItem('token'));
    }

    if (!document.querySelector('main')) {
        document.body.append(el('main.main'));
    }
}

export function authSet() {
    const authInit = authPage(
        async () => {
            const token = await RequestAPI.authRequest(
                authInit.login.value,
                authInit.password.value,
                authInit.invalidMessage,
                authInit.container,
            );

            if (token) {
                history.replaceState({}, '', 'accounts');
                await accountListPage(token);
                localStorage.setItem('token', token);
                header(true, localStorage.getItem('token'));
            }
        }
    )
}

function getURL() {
    return new URL(window.location.href);
}

export function setRoute(path) {
    router.navigate(path);
}

if (getURL().pathname === '/') {
    history.replaceState({}, '', localStorage.getItem('token') ? 'accounts' : 'auth');

    if (localStorage.getItem('token')) {
        preset();
        accountListPage(localStorage.getItem('token'))
    } else {
        authSet();
    }
}

if (getURL().pathname !== '/auth') {
    preset();
}

router.on({
    'auth': () => authSet(),
    'accounts': ({ params }) => {
        if (localStorage.getItem('token')) {
            if (!params) {
                accountListPage(localStorage.getItem('token'));
            } else if (params.id && !params.advanced) {
                accountPage(localStorage.getItem('token'), params.id)
            } else if (params.id && params.advanced) {
                accountAdvancedPage(localStorage.getItem('token'), params.id);
            }
        } else {
            history.replaceState({}, '', 'auth');
        }
    },
    'map': () => {
        if (localStorage.getItem('token')) {
            map();
        } else {
            history.replaceState({}, '', 'auth');
        }
    },
    'currencies': () => {
        if (localStorage.getItem('token')) {
            currencyPage(localStorage.getItem('token'));
        } else {
            history.replaceState({}, '', 'auth');
        }
    }
});

window.addEventListener('popstate', () => {
    if (!localStorage.getItem('token')) {
        history.replaceState({}, '', 'auth');
    }
})

router.resolve();
