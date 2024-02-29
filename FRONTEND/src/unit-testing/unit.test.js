import { createAccountInfoHeader } from '../Components/accountInfo/accountInfoHeader';
import { el } from 'redom';

describe('createAccountInfoHeader', () => {
    it('should return the correct DOM elements', () => {
        const mockGoBackFunc = jest.fn();

        const accountNumber = '123456';
        const balanceSum = '500';
        const header = createAccountInfoHeader(mockGoBackFunc, accountNumber, balanceSum);

        const expectedTitle = el('h1', { class: 'account-info__title', textContent: 'Просмотр счёта ' });
        const expectedButton = el('button', { class: 'account-info__back-button', textContent: 'Вернуться назад', onclick: mockGoBackFunc });
        const expectedAccountNumber = el('h2', { class: 'account-info__number', textContent: accountNumber });
        const expectedBalanceBox = el('div', { class: 'account-info__balance-box' }, [
            el('span', { class: 'account-info__balance-title', textContent: 'Баланс' }),
            el('span', { class: 'account-info__balance-sum', textContent: balanceSum })
        ]);
        const expectedContainer = el('div', { class: 'account-info__container', draggable: true }, [
            expectedTitle, expectedButton, expectedAccountNumber, expectedBalanceBox
        ]);

        expect(header).toEqual(expectedContainer);

        expectedButton.onclick();
        expect(mockGoBackFunc).toHaveBeenCalled();
    });
});

import { createSelect } from '../Components/actionMenu/actionsMenu';

describe('createSelect function', () => {
    test('it should create a select container with options', () => {
        const classNameRoot = 'test-root';
        const optionContents = ['Option 1', 'Option 2', 'Option 3'];
        const content = 'Test Content';

        const select = createSelect(classNameRoot, optionContents, content);

        expect(select.container.classList.contains(`${classNameRoot}__select-container`)).toBe(true);
        expect(select.options.length).toBe(optionContents.length);

        select.options.forEach((option, index) => {
            expect(option.textContent).toBe(optionContents[index]);
        });
    });

    test('it should toggle the active class when the current option is clicked', () => {
        const classNameRoot = 'test-root';
        const optionContents = ['Option 1', 'Option 2', 'Option 3'];
        const content = 'Test Content';

        const select = createSelect(classNameRoot, optionContents, content);

        expect(select.container.classList.contains(`${classNameRoot}__options-container--active`)).toBe(false);
        expect(select.optionCurrent.classList.contains(`${classNameRoot}__option-current--active`)).toBe(false);

        select.optionCurrent.click();
        expect(select.optionsContainer.classList.contains(`${classNameRoot}__options-container--active`)).toBe(true);
        expect(select.optionCurrent.classList.contains(`${classNameRoot}__option-current--active`)).toBe(true);

        select.optionCurrent.click();
        expect(select.optionsContainer.classList.contains(`${classNameRoot}__options-container--active`)).toBe(false);
        expect(select.optionCurrent.classList.contains(`${classNameRoot}__option-current--active`)).toBe(false);
    });
});

import { createBalanceDynamicsChart } from '../Components/chart/balanceDynamicsBox';

describe('createBalanceDynamicsChart function', () => {
    test('it should create a basic chart without advanced values', () => {
        const title = 'Basic Chart';
        const values = [10, 20, 30, 40, 50];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];

        const chart = createBalanceDynamicsChart(title, values, months);

        expect(chart.classList.contains('balance-dynamics__container')).toBe(true);
        expect(chart.querySelectorAll('.balance-dynamics__bar').length).toBe(values.length);
    });

    test('it should create an advanced chart with loss and profit values', () => {
        const title = 'Advanced Chart';
        const values = [10, 20, 30, 40, 50];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        const lossValues = [5, 10, 15, 20, 25];
        const profitValues = [15, 10, 15, 20, 15];

        const chart = createBalanceDynamicsChart(title, values, months, true, lossValues, profitValues);

        expect(chart.classList.contains('balance-dynamics__container')).toBe(true);
        expect(chart.querySelectorAll('.balance-dynamics__advanced-bar').length).toBe(values.length);
    });

    test('it should create an extended chart when there are more than 6 months', () => {
        const title = 'Extended Chart';
        const values = [10, 20, 30, 40, 50, 60, 70];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

        const chart = createBalanceDynamicsChart(title, values, months);

        expect(chart.classList.contains('balance-dynamics__container--extended')).toBe(true);
        expect(chart.querySelector('.balance-dynamics__x-scale--extended')).not.toBeNull();
    });
});

import { createCurrencyExchange } from '../Components/currencyExchange/currencyExchange';

describe('createCurrencyExchange function', () => {
    test('it should create a currency exchange container with input elements', () => {
        const token = 'test-token';
        const currencyTypes = ['USD', 'EUR', 'GBP'];

        const currencyExchangeContainer = createCurrencyExchange(token, currencyTypes);

        expect(currencyExchangeContainer.classList.contains('currency-exchange__container')).toBe(true);

        const exchangeInputs = currencyExchangeContainer.querySelectorAll('.currency-exchange__select-container');
        expect(exchangeInputs.length).toBe(2);

        const sumInput = currencyExchangeContainer.querySelector('.currency-exchange__sum-input');
        expect(sumInput).toBeTruthy();

        const exchangeButton = currencyExchangeContainer.querySelector('.currency-exchange__button');
        expect(exchangeButton).toBeTruthy();
    })
});

import { createCurrenciesList } from '../Components/currencyList/currenciesList';

describe('createCurrenciesList function', () => {
  test('it should create a list of currencies with the correct data', () => {
    const data = [
      { code: 'USD', amount: 100 },
      { code: 'EUR', amount: 200 },
      { code: 'GBP', amount: 300 },
    ];

    const currenciesListContainer = createCurrenciesList(data);

    expect(currenciesListContainer.classList.contains('currencies__container')).toBe(true);

    const listItems = currenciesListContainer.querySelectorAll('.currencies__list-item');
    expect(listItems.length).toBe(data.length);

    listItems.forEach((listItem, index) => {
      const currencyType = listItem.querySelector('.currencies__currency-type').textContent;
      const amount = parseFloat(listItem.querySelector('.currencies__currency-amount').textContent);

      expect(currencyType).toBe(data[index].code);
      expect(amount).toBe(data[index].amount);
    });
  });
});

import { createCurrencyRates, createRate } from '../Components/currencyRate/currencyRates';

describe('createRate function', () => {
  test('it should create a rate item with positive change', () => {
    const from = 'USD';
    const to = 'EUR';
    const rate = 1.2;
    const change = 1;

    const rateItem = createRate(from, to, rate, change);

    expect(rateItem.classList.contains('currency-rates__list-item')).toBe(true);
    expect(rateItem.querySelector('.currency-rates__pair').textContent).toBe(`${from}/${to}`);
    expect(rateItem.querySelector('.currency-rates__pos-dots')).toBeTruthy();
    expect(rateItem.querySelector('.currency-rates__value').textContent).toBe(rate.toString());
    expect(rateItem.querySelector('.currency-rates__pos-indicator')).toBeTruthy();
  });

  test('it should create a rate item with negative change', () => {
    const from = 'USD';
    const to = 'EUR';
    const rate = 1.2;
    const change = -1;

    const rateItem = createRate(from, to, rate, change);

    expect(rateItem.classList.contains('currency-rates__list-item')).toBe(true);
    expect(rateItem.querySelector('.currency-rates__pair').textContent).toBe(`${from}/${to}`);
    expect(rateItem.querySelector('.currency-rates__neg-dots')).toBeTruthy();
    expect(rateItem.querySelector('.currency-rates__value').textContent).toBe(rate.toString());
    expect(rateItem.querySelector('.currency-rates__neg-indicator')).toBeTruthy();
  });
});

describe('createCurrencyRates function', () => {
  test('it should create currency rates container with wrapper, container, and list elements', () => {
    const { wrapper, container, list } = createCurrencyRates();

    expect(wrapper.classList.contains('currency-rates__wrapper')).toBe(true);
    expect(container.classList.contains('currency-rates__container')).toBe(true);
    expect(list.classList.contains('currency-rates__list')).toBe(true);

    expect(container.children.length).toBe(2); 
    expect(container.querySelector('.currency-rates__title')).toBeTruthy();
    expect(container.querySelector('.currency-rates__list')).toBeTruthy();
  });
});

