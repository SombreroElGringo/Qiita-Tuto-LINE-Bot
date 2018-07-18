'use strict';
// import packages
const line = require('@line/bot-sdk');
const express = require('express');

const eventHandler = require('./skill/EventHandler');

// create LINE SDK config from env variables
const config = {
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
	channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

// create Express app
const app = express();

// register a webhook handler with middleware
app.post('/callback', line.middleware(config), (req, res) => {
	// handle events sended from LINE
	Promise
		.all(req.body.events.map(event => eventHandler.handleLineLocationMessage(event, client)))
		.then((result) => res.json(result))
		.catch((err) => {
			res.status(500).end();
		});
});

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`listening on ${port}`);
});
