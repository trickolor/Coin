const { el, setChildren } = require('redom');

import './accountListPage.scss'

import { accountClass } from "../accountClass/accountClass";
import { actionMenu } from "../actionMenu/actionMenu";
import { accountPage } from '../accountPage/accountPage';
import { RequestAPI } from '../../helpers/requests';
import { SkeletonAPI } from '../skeleton/skeleton';
import { customize } from '../../helpers/dragCustomization';
import { setRoute } from '../../main';

const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', ' октября', 'ноября', 'декабря'];

function createCard(item, container, token, list) {
    let dateSetting;

    if (item.transactions[0]) {
        let date = new Date(item.transactions[0].date);
        dateSetting = `${date.getDate()} ${months[parseInt(date.getMonth())]} ${date.getFullYear()}`;
    } else {
        dateSetting = 'Отсутсвует';
    }

    let card = new accountClass(
        item.account,
        item.balance + ' ₽',
        dateSetting,
        () => {
            setRoute('accounts?id=' + card.cardNumber);
        }
    );

    list.push(card);

    card.createHTMLElement(container);
}

export async function accountListPage(token) {
    SkeletonAPI.accountsPage(true);
    const data = await RequestAPI.accountsRequest(token);

    const main = document.querySelector('.main');
    const actionsMenu = actionMenu();
    const cards = [];
    const accountsListContainer = el('div', { class: 'account-list-page__container' });

    actionsMenu.options.forEach((o) => {
        o.addEventListener('click', () => {
            const buffer = [...cards];

            switch (o.textContent) {
                case 'По номеру':
                    buffer.sort((a, b) => a.cardNumber - b.cardNumber);
                    break;
                case 'По балансу':
                    buffer.sort((a, b) => parseFloat(a.balance) - parseFloat(b.balance));
                    break;
                case 'По последней транзакции':
                    buffer.sort((a, b) => {
                        const parseCustomDate = (customDate) => {
                            const monthNames = {
                                'января': 0, 'февраля': 1, 'марта': 2, 'апреля': 3, 'мая': 4, 'июня': 5,
                                'июля': 6, 'августа': 7, 'сентября': 8, 'октября': 9, 'ноября': 10, 'декабря': 11,
                            };

                            const parts = customDate.split(' ');
                            const day = parseInt(parts[0], 10);
                            const month = monthNames[parts[1]];
                            const year = parseInt(parts[2], 10);

                            return new Date(year, month, day);
                        };

                        const dateA = a.lastTransactionDate !== 'Отсутствует' ? parseCustomDate(a.lastTransactionDate) : null;
                        const dateB = b.lastTransactionDate !== 'Отсутствует' ? parseCustomDate(b.lastTransactionDate) : null;

                        if (dateA && dateB) {
                            return dateA - dateB;
                        } else if (dateA) {
                            return -1;
                        } else if (dateB) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                    break;
            }

            while (accountsListContainer.firstChild) {
                accountsListContainer.removeChild(accountsListContainer.firstChild);
            }

            buffer.forEach((c) => {
                c.createHTMLElement(accountsListContainer);
            });

            customize(Array.from(accountsListContainer.children))
        });
    });

    actionsMenu.button.addEventListener('click', async () => {
        const accountInfo = await RequestAPI.newAccountRequest(token);
        createCard(accountInfo, accountsListContainer, token, cards);

        while (accountsListContainer.firstChild) {
            accountsListContainer.removeChild(accountsListContainer.firstChild);
        }

        cards.forEach((c) => {
            c.createHTMLElement(accountsListContainer);
        });

        customize(Array.from(accountsListContainer.children));
    });

    data.forEach((accountInfo) => {
        createCard(accountInfo, accountsListContainer, token, cards);
    });

    customize(Array.from(accountsListContainer.children))

    setChildren(main, [actionsMenu.container, accountsListContainer]);
}