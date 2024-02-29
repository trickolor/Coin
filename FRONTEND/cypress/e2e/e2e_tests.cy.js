import { getFromCache } from "../../src/helpers/cache";

describe('Логин на сайте', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('Должен войти с правильным логином и паролем', () => {
    cy.get('.auth__input').eq(0).type('developer');
    cy.get('.auth__input').eq(1).type('skillbox');
    cy.get('.auth__button').click();
    cy.url().should('eq', 'http://localhost:8080/accounts');
  });
});

describe('Тесты на ввод неверных данных', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('Должен показать сообщение о минимальной длине пароля', () => {
    cy.get('.auth__input').eq(0).type('developer');
    cy.get('.auth__input').eq(1).type('12345');
    cy.get('.auth__button').click();
    cy.contains('Минимальное количество символов: 6').should('exist');
  });

  it('Должен показать сообщение о неверном логине', () => {
    cy.get('.auth__input').eq(0).type('wrong_login');
    cy.get('.auth__input').eq(1).type('skillbox');
    cy.get('.auth__button').click();
    cy.contains('Пользователь не найден').should('exist');
  });

  it('Должен показать сообщение о неверном пароле', () => {
    cy.get('.auth__input').eq(0).type('developer');
    cy.get('.auth__input').eq(1).type('wrong_password');
    cy.get('.auth__button').click();
    cy.contains('Неверный пароль').should('exist');
  });
});

describe('Тест на проверку сортировки банковских счетов', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.get('.auth__input').eq(0).type('developer');
    cy.get('.auth__input').eq(1).type('skillbox');
    cy.get('.auth__button').click();
  });

  it('Должен проверить сортировку по номеру', () => {
    cy.get('.actions-menu__option-current').click();
    cy.contains('По номеру').click();
    cy.get('.bank-account__container').should('have.length.gt', 1).each(($el, index, $list) => {
      if (index < $list.length - 1) {
        const currentAccountNumber = parseFloat($el.find('.bank-account__number').text());
        const nextAccountNumber = parseFloat($list.eq(index + 1).find('.bank-account__number').text());
        expect(currentAccountNumber).to.be.lte(nextAccountNumber);
      }
    });
  });

  it('Должен проверить сортировку по балансу', () => {
    cy.get('.actions-menu__option-current').click();
    cy.contains('По балансу').click();
    cy.get('.bank-account__container').should('have.length.gt', 1).each(($el, index, $list) => {
      if (index < $list.length - 1) {
        const currentAccountBalance = parseFloat($el.find('.bank-account__balance').text().replace('$', '').replace(',', ''));
        const nextAccountBalance = parseFloat($list.eq(index + 1).find('.bank-account__balance').text().replace('$', '').replace(',', ''));
        expect(currentAccountBalance).to.be.lte(nextAccountBalance);
      }
    });
  });

  it('Должен проверить сортировку по последней транзакции', () => {
    const parseCustomDate = (customDate) => {
      const months = [
        'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
        'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
      ];
      const parts = customDate.split(' ');
      const day = parseInt(parts[0], 10);
      const monthIndex = months.indexOf(parts[1]);
      const year = parseInt(parts[2], 10);
      return new Date(year, monthIndex, day).getTime();
    };
    cy.get('.actions-menu__option-current').click();
    cy.contains('По последней транзакции').click();
    cy.get('.bank-account__container').should('have.length.gt', 1).each(($el, index, $list) => {
      if (index < $list.length - 1) {
        const currentAccountDateText = $el.find('.bank-account__date').text();
        const nextAccountDateText = $list.eq(index + 1).find('.bank-account__date').text();
        const currentAccountDate = parseCustomDate(currentAccountDateText);
        const nextAccountDate = parseCustomDate(nextAccountDateText);
        const currentCondition = isNaN(currentAccountDate);
        const nextCondition = isNaN(nextAccountDate);
        if (!currentCondition && !nextCondition) {
          expect(currentAccountDate).to.be.at.most(nextAccountDate);
        } else if (currentCondition || nextCondition) {
          expect(nextAccountDate).to.be.NaN;
        }
      }
    });
  });
});

describe('Тест на создание нового счёта и выполнение перевода средств', () => {
  let accountNumber;

  beforeEach(() => {
    cy.visit('http://localhost:8080');
    cy.get('.auth__input').eq(0).type('developer');
    cy.get('.auth__input').eq(1).type('skillbox');
    cy.get('.auth__button').click();
    cy.get('.bank-account__number').first().invoke('text').then((number) => {
      accountNumber = number;
    });
  });

  it('Должен создать новый банковский счет', () => {
    cy.get('.actions-menu__button').click();
    cy.get('.bank-account__container').should('have.length.gt', 0).then(($accounts) => {
      const newAccount = $accounts.last();
      cy.wrap(newAccount).should('have.class', 'bank-account__container');
    });
  });

  it('Должен выполнить перевод средств', () => {
    cy.intercept('POST', '/api/transfer-funds').as('transferFunds');
    cy.get('.bank-account__button').first().click();
    cy.get('.bank-account-page__container', { timeout: 10000 }).should('be.visible');
    cy.url().should('include', `id=${accountNumber}`);
    cy.get('.new-transfer__input').eq(0).type('4111111111111111');
    cy.get('.new-transfer__input').eq(0).should('have.class', 'new-transfer__input-special--visa');
    cy.get('.new-transfer__input').eq(0).clear();
    cy.get('.new-transfer__input').eq(0).type('2222400070000005');
    cy.get('.new-transfer__input').eq(1).type('100');
    cy.get('.new-transfer__button').click();
    cy.wait('@transferFunds').its('response.statusCode').should('eq', 200);
  });
});

describe('Тест на навигацию', () => {
  it('Должен выполнить навигацию по всем разделам приложения', () => {
    cy.visit('http://localhost:8080');
    cy.get('.auth__input').eq(0).type('developer');
    cy.get('.auth__input').eq(1).type('skillbox');
    cy.get('.auth__button').click();
    cy.intercept('GET', '/api/banks').as('getBanks');
    cy.intercept('GET', '/api/accounts').as('getAccounts');
    cy.intercept('GET', '/api/currencies').as('getCurrencies');
    cy.intercept('GET', '/api/all-currencies').as('getAllCurrencies');
    cy.viewport('macbook-15');
    cy.contains('Банкоматы').click();
    if (getFromCache('map', 60000)) {
      cy.wait('@getBanks').its('response.statusCode').should('eq', 200);
    }
    cy.contains('Счета').click();
    if (getFromCache('accounts', 60000)) {
      cy.wait('@getAccounts').its('response.statusCode').should('eq', 200);
    }
    cy.viewport(900, 800);
    cy.get('.header__menu-button').click();
    cy.wait(1000);
    cy.get('.header__menu-item-adaptive').eq(2).should('be.visible').click();
    if (getFromCache('currencyType', 60000)) {
      cy.wait('@getCurrencies').its('response.statusCode').should('eq', 200);
    }
    if (getFromCache('currencyList', 60000)) {
      cy.wait('@getAllCurrencies').its('response.statusCode').should('eq', 200);
    }
    cy.get('.header__menu-button').click();
    cy.wait(1000);
    cy.get('.header__menu-item-adaptive').eq(3).should('be.visible').click();
    cy.url().should('eq', 'http://localhost:8080/auth');
  });
})

describe('Тест карты', () => {
  it('Должен загрузить Яндекс карту и выполнить скроллинг', () => {
    cy.visit('http://localhost:8080');
    cy.get('.auth__input').eq(0).type('developer');
    cy.get('.auth__input').eq(1).type('skillbox');
    cy.get('.auth__button').click();
    cy.contains('Банкоматы').click();
    cy.get('#map__container').should('exist');
    cy.wait(5000);
    cy.get('#map__container')
      .trigger('mousedown', { button: 0, pageX: 300, pageY: 300 })
      .trigger('mousemove', { button: 0, pageX: 100, pageY: 300 })
      .trigger('mouseup', { force: true });
    cy.wait(2000);
    cy.get('#map__container')
      .trigger('mousedown', { button: 0, pageX: 300, pageY: 300 })
      .trigger('mousemove', { button: 0, pageX: 300, pageY: 100 })
      .trigger('mouseup', { force: true });
    cy.wait(2000);
  });
});

describe('Тест на обмен валюты', () => {
  it('Должен выполнить обмен валюты', () => {
    cy.intercept('GET', '/api/currencies').as('getCurrencies');
    cy.intercept('GET', '/api/all-currencies').as('getAllCurrencies');
    cy.intercept('POST', '/api/currency-buy').as('currencyBuy');
    cy.visit('http://localhost:8080');
    cy.get('.auth__input').eq(0).type('developer');
    cy.get('.auth__input').eq(1).type('skillbox');
    cy.get('.auth__button').click();
    cy.contains('Валюта').click();
    if (getFromCache('currencyType', 60000)) {
      cy.wait('@getCurrencies').its('response.statusCode').should('eq', 200);
    }
    if (getFromCache('currencyList', 60000)) {
      cy.wait('@getAllCurrencies').its('response.statusCode').should('eq', 200);
    }
    cy.get('.currency-exchange__option-current').eq(0).click();
    cy.get('.currency-exchange__options-container.currency-exchange__options-container--active')
      .find('.currency-exchange__option')
      .contains('BTC')
      .click();
    cy.get('.currency-exchange__option-current').eq(1).click();
    cy.get('.currency-exchange__options-container.currency-exchange__options-container--active')
      .find('.currency-exchange__option')
      .contains('RUB')
      .click();
    cy.get('.currency-exchange__sum-input').type('1');
    cy.get('.currency-exchange__button').click();
    cy.wait('@currencyBuy').its('response.statusCode').should('eq', 200);
  });
});

describe('Тест на загрузку истории транзакций', () => {
  it('Должен открыть информацию с полной историей транзакций и проверить навигацию по ней', () => {
    cy.visit('http://localhost:8080');
    cy.get('.auth__input').eq(0).type('developer');
    cy.get('.auth__input').eq(1).type('skillbox');
    cy.get('.auth__button').click();
    cy.get('.bank-account__container').first().find('.bank-account__button').click();
    cy.get('.balance-dynamics__container').click();
    cy.wait(10000);
    cy.get('.transaction-history__container--advanced').should('be.visible').as('transactionHistory');
    cy.get('.advanced-dynamics__transaction-history-next').click();
    cy.get('@transactionHistory').find('.transaction-history__list-item').should('have.length.gt', 0);
    cy.get('.advanced-dynamics__transaction-history-prev').click();
    cy.get('@transactionHistory').find('.transaction-history__list-item').should('have.length.gt', 0);
  });
});
