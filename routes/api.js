const express = require('express');
var https = require('https');
var querystring = require('querystring');
const router = express.Router();
const axios = require('axios');

router.post('/checkout', function(req, res) {
	request(function(responseData) {
		console.log(responseData);
		console.log(responseData.result);
		res.json(responseData);
	});
});

function request(callback) {
	var path = '/v1/checkouts';
	var data = querystring.stringify({
		entityId: process.env.ENTITY_ID,
		amount: '5.00',
		currency: 'SAR',
		paymentType: 'DB',
		testMode: "EXTERNAL",
		merchantTransactionId: "whatisthis?",
		// customer: {
		// givenName: "Sahal",
		// surName: "Alzubair",
		// email: ""
		// },
		// billing: {
		// street1: "fdafsf",
		// city: "fdafdsf",
		// state: "fdafsdf",
		// country: "SA",
		// }
	});
	var options = {
		port: 443,
		host: 'test.oppwa.com',
		path: path,
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': data.length,
			Authorization:
				`Bearer ${process.env.AUTHORIZATION}`,
		},
	};
	var postRequest = https.request(options, function(res) {
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			jsonRes = JSON.parse(chunk);
			return callback(jsonRes);
		});
	});
	postRequest.write(data);
	postRequest.end();
}

router.post('/result', function(req, res) {
	console.log(req.body);
	resultRequest(req.body.resourcePath, function(responseData) {
		res.json(responseData);
	});
});

function resultRequest(resourcePath, callback) {
	var path = resourcePath;
	path += '?entityId=' + process.env.ENTITY_ID;
	const url = 'https://test.oppwa.com' + path;
	axios
		.get(url, {
			headers: {
				Authorization:
					`Bearer ${process.env.AUTHORIZATION}`,
			},
		})
		.then(function(response) {
			// handle success
			// console.log(response);
			try {
				resDate = JSON.parse(response);
			} catch (e) {
				resData = response;
				// console.log(resData.data.id);
			}

			return callback(resData.data);
		})
		.catch(function(error) {
			// handle error
			//

			console.log(error);
		});
}

module.exports = router;
