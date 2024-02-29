# Coin

Coin is an internet bank prototype supporting cryptocurrency, transactions, transaction history, graphical statistics, currency exchange, and exchange rate tracking. It is developed using Webpack SSR Redux setup with React, Node+Express.js, Nodemon, Typescript, GSAP (a personally developed component for animations), and Redux-Persist.

## Backend for the "Coin" Project

### Installation and Project Setup
1. To run this project, you will need nodejs and npm.
2. Clone this repository to your disk. Then run `npm i` to install dependencies and `npm start` to start the server.
3. By default, the server listens on port 3000 at localhost.

Remember that updates and improvements may have been added to the repository, so don't forget to periodically pull updates using `git pull`.

### Login and Password
Currently, access is only available for the following account:
* Login: `developer`
* Password: `skillbox`

For more details on how to authenticate, see the API documentation below.

### Existing Accounts
Immediately after starting the server, the following accounts exist:
* Your user account with a long history of transfers (incoming transfers from arbitrary accounts will regularly be credited to this account):
	* 74213041477477406320783754
* Other accounts that do not belong to the user but definitely exist. You can use them to test the functionality of transferring funds between accounts:
	* 61253747452820828268825011
	* 05168707632801844723808510
	* 17307867273606026235887604
	* 27120208050464008002528428
	* 2222400070000005
	* 5555341244441115

### API Response Format
All API methods respond with an object in the following common format:
```js
{
	payload, // any arbitrary value returned by the API method (null if there was an error or it is impossible to return any meaningful data)
	error // error description/code text that occurred; filled in only if an error occurred. Upon successful completion of the method, this will always be an empty string.
}
```

## API Methods

### GET /login
User authentication.  
At the moment, the method allows login for the following user:  
```js
{
	login: 'developer',
	password: 'skillbox'
}
```

The response will return a payload in the following format:  
```js
{ token }
```
where token is a string containing information for accessing requests requiring authentication.  

**Possible errors:**  
* `Invalid password` — attempting to log in with an incorrect password;
* `No such user` — the user with such login does not exist.

In the future, the token is specified in the Authorization header for methods requiring authentication: `Authorization: Basic TOKEN`, where TOKEN is replaced with the token value we received.  

If we request any method and it returns an `Unauthorized` error, it means we forgot to provide the token header when calling the method.  

### GET /accounts
Returns a list of user accounts.  
The response will be an array with information about the user's account in approximately this format:  
```js
[
	{
		"account": "74213041477477406320783754",
		"balance": 0,
		"transactions": [
			{
				"amount": 1234,
				"date": "2021-09-11T23:00:44.486Z",
				"from": "61253747452820828268825011",
				"to": "74213041477477406320783754"
			}
		]
	}
]
```
**Note:** This method returns only the last transaction from the transaction history.

### GET /account/{id}
The method returns detailed information about the user's account, where {id} in the method address is the account number.  

The response format is approximately as follows:
```js
[
	{
		"account": "74213041477477406320783754",
		"balance": 0,
		"transactions": [
			{
				"amount": 1234,
				"date": "2021-09-11T23:00:44.486Z",
				"from": "61253747452820828268825011",
				"to": "74213041477477406320783754"
			}
		]
	}
]
```
**Note:** This method returns the complete transaction history for the account.

### POST /create-account
The method creates a new account for the user, the request body is not important.  

Responds with an object containing information about the newly created account:  
```js
	"43123747452820828268825011": {
		"account": "43123747452820828268825011",
		"balance": 0,
		"mine": false,
		"transactions": []
	},
```

### POST /transfer-funds
Method for transferring funds from one account to another.  

Request body:
```js
{
	from, // account from which funds are deducted
	to, // account to which funds are credited
	amount // amount to transfer
}
```

The method responds with an object of the account from which the transfer was made.  

**Possible errors:**  
* `Invalid account from` — account address to be debited is not specified, or this account does not belong to us;
* `Invalid account to`  — credit account is not specified, or this account does not exist;
* `Invalid amount` — transfer amount is not specified, or it is negative;
* `Overdraft prevented` — attempting to transfer more money than is available in the debiting account.


### GET /all-currencies
The method responds with an array containing the codes of all currencies currently used by the backend, for example:
```js
[ 'ETH', 'BTC', 'USD' ]
```


### GET /currencies
The method returns a list of the current user's currency accounts.  
Responds with an object containing information about the balances of the user's currency accounts:  
```js
{
	"AUD": {
		"amount": 22.16,
		"code": "AUD"
	},
	"BTC": {
		"amount": 3043.34,
		"code": "BTC"
	},
	"BYR": {
		"amount": 48.75,
		"code": "BYR"
	},
}
```


### POST /currency-buy
Method for currency exchange.  

Request body:  
```js
{
	from, // currency account code from which funds are deducted
	to, // currency account code to which funds are credited
	amount // amount deducted, conversion is calculated automatically by the server based on the current exchange rate for the currency pair
}
```

The method responds with an object containing information about the balances of the user's currency accounts (see `/currencies`).  

**Possible errors:**  
* `Unknown currency code` — incorrect currency code is passed, the code is not supported by the system (debit currency code or credit currency code);  
`Invalid amount` — transfer amount is not specified, or it is negative;  
`Not

 enough currency` — there are no funds on the debiting currency account;
`Overdraft prevented` — attempting to transfer more than is available on the debiting account.


### Websocket /currency-feed
This is a websocket stream that will provide messages about changes in currency exchange rates.  
  
Message format:  
```js
{
	"type":"EXCHANGE_RATE_CHANGE",
	"from":"NZD",
	"to":"CHF",
	"rate":62.79,
	"change":1
}
```
where:  
* `type` — message type, which can be used to filter this message from any other message types if they occur;
* `from` — currency code from which the conversion is made;
* `to` — currency code to which the conversion is made;
* `rate` — exchange rate for the mentioned currencies;
* `change` — change in the exchange rate compared to the previous value: `1` — rate increase, `-1` — rate decrease, `0` — rate unchanged.  


### GET /banks
The method returns a list of points marking ATM locations:  
```js
[
		{ lat: 44.878414, lon: 39.190289 },
		{ lat: 44.6098268, lon: 40.1006606 }
]
```
where `lat` — latitude, `lon` — longitude.  

# Frontend for the "Coin" Project

To start working with the project:
1. Navigate to the BACKEND folder and enter the following command in the terminal: `npm start` to start the server.

To run the project in development mode:
1. Navigate to the FRONTEND folder and enter `npm run dev` in the terminal.

To build the project:
1. Navigate to the FRONTEND folder and enter `npm run build` in the terminal. The final build will be located in the `dist` folder.

All technical requirements and additional tasks implemented:
- Adaptive design for 320, 768, and 1200 pixels.
- Display of the card payment system type for VISA, MASTERCARD, and MIR systems.
- Data caching (simplified, see `cache.js` file).
- User-customized page layout (see `dragCustomization.js` file).

Unit tests are implemented using Jest, as well as end-to-end tests using Cypress:
- To run unit tests, navigate to the FRONTEND folder and run the command `npm test`.
- To run end-to-end tests, navigate to the FRONTEND folder and run `npm cypress:run` to test through the terminal, and `npm cypress:open` to test through the Cypress spec window.
  * The list of tests will be displayed when using the corresponding commands. If any tests fail, please report by sending logs (!).

The application is implemented as a Single Page Application (SPA).
