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

// // Telegram bot (@mdnt_plntrm_bot)
// const tgbot = new Telgraf(process.env.TELEGRAM_TOKEN);
// const tgChatId = process.env.TELEGRAM_CHATID;

// // Express server configuration
// https.createServer(
// 	{
// 		key: fs.readFileSync('YOUR_PRIVKEY.pem', 'utf8'),
// 		cert: fs.readFileSync('YOUR_CERT.pem'),
// 		ca: fs.readFileSync('YOUR_CHAIN.pem')
// 	},
// 	app
// ).listen(443, () => {
// 	console.log("HTTPS Express Server running. Listening on port 443.");
// 	tgbot.telegram.sendMessage(
// 		tgChatId,
// 		"Express server running.\n" +
// 		"Awaiting indicator signals from Tradingview.\n\n" +
// 		"<u><b>MARKETS ENABLED</b></u>\n" +
// 		"<pre>[1] BINANCE:BTCUSDT</pre>",
// 		{ parse_mode: 'HTML' }
// 	);
// });

// app.use(express.json());
// app.use(express.static(__dirname + '/home/ubuntu/static', { dotfiles: 'allow' }));

// Instantiate exchange (Binance)
let binance = new ccxt.binance ({
	apiKey: process.env.BINANCE_APIKEY,
	secret: process.env.BINANCE_SECRET
});

binance.fetchMyTrades ('FRONT/BUSD').then(res => {
	console.log(res)
})