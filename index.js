const ccxt = require("ccxt");
const express = require("express");
const app = express();
const fs = require("fs");
const https = require("https");
const { Telegraf } = require("telegraf");

require('dotenv').config();

/**
	* Generates APP_APIKEY.
	* !!DO NOT RUN IN PRODUCTION ENV!!
	* const crypto = require("crypto");
	* console.log(crypto.randomUUID());
	*/

// Telegram bot (@mdnt_plntrm_bot)
const tgbot = new Telegraf(process.env.TELEGRAM_TOKEN);
const tgChatId = process.env.TELEGRAM_CHATID;

// // Express server configuration
https.createServer(
	{
		key: fs.readFileSync('YOUR_PRIVKEY.pem', 'utf8'),
		cert: fs.readFileSync('YOUR_CERT.pem'),
		ca: fs.readFileSync('YOUR_CHAIN.pem')
	},
	app
).listen(443, () => {
	console.log("HTTPS Express Server running. Listening on port 443.");
	tgbot.telegram.sendMessage(
		tgChatId,
		"Express server running.\n" +
		"Awaiting indicator signals from Tradingview.\n\n" +
		"<u><b>MARKETS ENABLED</b></u>\n" +
		"<pre>[1] BINANCE:BTCUSDT</pre>",
		{ parse_mode: 'HTML' }
	);
});

app.use(express.json());
app.use(express.static(__dirname + '/home/ubuntu/static', { dotfiles: 'allow' }));

// Instantiate exchange (Binance)
let binance = new ccxt.binance ({
	apiKey: process.env.BINANCE_APIKEY,
	'secret': process.env.BINANCE_SECRET,
	'enablerateLimit': true,
	'options': {
		'createMarketBuyOrderRequiresPrice': false
	}
});

// Uncomment to use Binance Testnet
binance.setSandboxMode (true);

// ETHUSDT Trade
app.post('/api/v1/trade/ethusdt', function (req, res) {
	if (!apikey || apiKey !== process.env.APP_APIKEY) {
		res.status(401).json({error: 'unauthorised'});
	} else {
		if (payload.signal === "long") {
			(async () => {
				let symbol = "ETH/USDT";
				let usdtBal = await binance.fetchBalance ().then(res => {
					return res.free.USDT;
				});
				let ethPrice = await binance.fetchTicker ('ETH/USDT').then(res => {
					return res.last;
				});
				let ethAmount = (usdtBal * 0.95) / ethPrice;
				binance.createMarketBuyOrder(symbol, ethAmount).then(res => {
					tgbot.telegram.sendMessage(
						tgChatId,
						"<u>TRADE EXECUTED</u>\n\n" +
						"<b>Market: </b><pre>" + res.symbol + "</pre>\n" +
						"<b>Type: </b><pre>" + res.info.type + "</pre>\n" +
						"<b>Side: </b><pre>" + res.info.side + "</pre>\n" +
						"<b>TradeID: </b><pre>" + res.clientOrderId + "</pre>\n" +
						"<b>Execution Timestamp: </b><pre>" + res.datetime + "</pre>\n" +
						"<b>Status: </b><pre>" + res.info.status + "</pre>\n" +
						"<b>Price: </b><pre>" + res.price + " USDT</pre>\n" +
						"<b>Quantity: </b><pre>" + res.filled + " ETH</pre>",
						{ parse_mode : 'HTML' }
					)
					binance.fetchBalance ().then(balances => {
						tgbot.telegram.sendMessage(
							tgChatId,
							"<u>BALANCES UPDATE</u>\n\n" +
							"<b>ETH: </b><pre>" + balances.free.ETH + "</pre>\n" +
							"<b>USDT: </b><pre>" + balances.free.USDT + "</pre>",
							{ parse_mode : 'HTML' }
						)
					})
				});
			}) ();
		}

		if (payload.signal === "short") {
			(async () => {
				let symbol = "ETH/USDT";
				let ethAmount = await binance.fetchBalance ().then(res => {
					return res.free.ETH;
				});
				binance.createMarketSellOrder(symbol, ethAmount).then(res => {
					tgbot.telegram.sendMessage(
						tgChatId,
						"<u>TRADE EXECUTED</u>\n\n" +
						"<b>Market: </b><pre>" + res.symbol + "</pre>\n" +
						"<b>Type: </b><pre>" + res.info.type + "</pre>\n" +
						"<b>Side: </b><pre>" + res.info.side + "</pre>\n" +
						"<b>TradeID: </b><pre>" + res.clientOrderId + "</pre>\n" +
						"<b>Execution Timestamp: </b><pre>" + res.datetime + "</pre>\n" +
						"<b>Status: </b><pre>" + res.info.status + "</pre>\n" +
						"<b>Price: </b><pre>" + res.price + " USDT</pre>\n" +
						"<b>Quantity: </b><pre>" + res.filled + " ETH</pre>",
						{ parse_mode : 'HTML' }
					)
					binance.fetchBalance ().then(balances => {
						tgbot.telegram.sendMessage(
							tgChatId,
							"<u>BALANCES UPDATE</u>\n\n" +
							"<b>ETH: </b><pre>" + balances.free.ETH + "</pre>\n" +
							"<b>USDT: </b><pre>" + balances.free.USDT + "</pre>",
							{ parse_mode : 'HTML' }
						)
					})
				});
			}) ();
		}
	}
})
