import { el } from "redom";
import { saveToCache, getFromCache } from "./cache";

export class RequestAPI {
    constructor() { }

    static infoPanel(message) {
        if (document.querySelector('.main').contains(document.querySelector('.response-info'))) {
            document.querySelector('.response-info').remove();
        }

        const info = el('div', { class: 'response-info', textContent: message });
        document.querySelector('.main').append(info);

        setTimeout(() => {
            if (document.body.contains(info)) {
                document.querySelector('.main').removeChild(info);
            }
        }, 4000);

    }

    static async authRequest(loginInput, passwordInput) {
        try {
            if (loginInput.length < 6 || passwordInput.length < 6) {
                this.infoPanel('Минимальное количество символов: 6');
            } else {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ login: loginInput, password: passwordInput })
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.error.length !== 0) {
                        switch (data.error) {
                            case 'Invalid password':
                                this.infoPanel('Неверный пароль');
                                break;
                            case 'No such user':
                                this.infoPanel('Пользователь не найден');
                                break;
                        }
                    } else {
                        return data.payload.token;
                    }
                } else {
                    this.infoPanel('Ошибка сервера! Код: ' + response.status);
                    throw new Error('Request failed with status ' + response.status);
                }
            }
        } catch (error) {
            this.infoPanel('Произошла ошибка!');
            console.log(error);
        }
    }

    static async accountsRequest(token) {
        try {
            const response = await fetch('/api/accounts', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.payload;
            }
            else {
                this.infoPanel('Ошибка сервера! Код: ' + response.status);
                throw new Error('Request failed with status ' + response.status);
            }
        } catch (error) {
            this.infoPanel('Произошла ошибка!');
            console.log(error);
        }
    }

    static async newAccountRequest(token) {
        try {
            const response = await fetch('/api/create-account', {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.payload;
            }
            else {
                this.infoPanel('Ошибка сервера! Код: ' + response.status);
                throw new Error('Request failed with status ' + response.status);
            }
        } catch (error) {
            this.infoPanel('Произошла ошибка!');
            console.log(error);
        }
    }

    static async AccountIdRequest(token, id) {
        try {
            const response = await fetch('/api/account/' + id, {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data.payload;
            }
            else {
                this.infoPanel('Ошибка сервера! Код: ' + response.status);
                throw new Error('Request failed with status ' + response.status);
            }
        } catch (error) {
            this.infoPanel('Произошла ошибка!');
            console.log(error);
        }
    }

    static async currenciesTypesRequest(token) {
        try {
            const cachedData = getFromCache('currencyType', 60000);
            if (cachedData) {
                return cachedData;
            }

            const response = await fetch('/api/all-currencies', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                saveToCache('currencyType', data.payload);
                return data.payload;
            }
            else {
                this.infoPanel('Ошибка сервера! Код: ' + response.status);
                throw new Error('Request failed with status ' + response.status);
            }
        } catch (error) {
            this.infoPanel('Произошла ошибка!');
            console.log(error);
        }
    }

    static async currenciesRequest(token) {
        try {
            const cachedData = getFromCache('currencyList', 60000);
            if (cachedData) {
                return cachedData;
            }

            const response = await fetch('/api/currencies', {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                saveToCache('currencyList', data.payload);
                return data.payload;
            }
            else {
                this.infoPanel('Ошибка сервера! Код: ' + response.status);
                throw new Error('Request failed with status ' + response.status);
            }
        } catch (error) {
            this.infoPanel('Произошла ошибка!');
            console.log(error);
        }
    }

    static async transferRequest(token, from, to, amount) {
        try {
            if (to.length === 0 || amount.length === 0) {
                this.infoPanel('Все поля должны быть заполнены');
            } else {
                const response = await fetch('/api/transfer-funds', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from,
                        to,
                        amount
                    })
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.error.length !== 0) {
                        switch (data.error) {
                            case 'Invalid account from':
                                this.infoPanel('Cчёт списания указан неверно (техническая ошибка)');
                                break;
                            case 'Invalid account to':
                                this.infoPanel('Счёт зачисления указан неверно или отсутствует');
                                break;
                            case 'Invalid amount':
                                this.infoPanel('Сумма перевода указана неверно или отсутсвует');
                                break;
                            case 'Overdraft prevented':
                                this.infoPanel('Попытка перевести больше денег, чем доступно на счёте списания');
                                break;
                        }
                        return 1;
                    } else {
                        this.infoPanel('Сумма успешна переведена на счёт под номером ' + to);
                        return 0;
                    }
                }
                else {
                    this.infoPanel('Ошибка сервера! Код: ' + response.status);
                    throw new Error('Request failed with status ' + response.status);
                }
            }
        } catch (error) {
            this.infoPanel('Произошла ошибка!');
            console.log(error);
        }
    }

    static async currencyBuyRequest(token, from, to, amount) {
        try {
            if (to === '---' || amount === '---' || amount.length === 0) {
                this.infoPanel('Все поля должны быть заполнены');
            } else {
                const response = await fetch('/api/currency-buy', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from,
                        to,
                        amount
                    })
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data.error.length !== 0) {
                        switch (data.error) {
                            case 'Unknown currency code':
                                this.infoPanel('Неверный валютный код, код не поддерживается системой (валютный код списания или валютный код зачисления)');
                                break;
                            case 'Invalid amount':
                                this.infoPanel('Сумма перевода указана неверно или отсутсвует');
                                break;
                            case 'Not enough currency':
                                this.infoPanel('На валютном счёте списания нет средств');
                                break;
                            case 'Overdraft prevented':
                                this.infoPanel('Попытка перевести больше денег, чем доступно на счёте списания');
                                break;
                        }
                    } else {
                        this.infoPanel(`Вы успешно преобрели ${to} на сумму ${amount} за ${from}`);
                    }

                }
                else {
                    console.log('Request failed with status ' + response.status);
                    return;
                }
            }
        } catch (error) {
            this.infoPanel('Произошла ошибка!');
            console.log(error);
        }
    }

    static async mapRequest() {
        try {
            const cachedData = getFromCache('map', 60000);
            if (cachedData) {
                return cachedData;
            }

            const response = await fetch('/api/banks', {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                saveToCache('map', data.payload);
                return data.payload;
            }
            else {
                console.log('Request failed with status ' + response.status);
                return;
            }
        } catch (error) {
            this.infoPanel('Произошла ошибка!');
            console.log(error);
        }
    }
}

