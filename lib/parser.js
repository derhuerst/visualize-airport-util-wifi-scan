'use strict'

const createCsvParser = require('csv-parser')

// todo: this is buggy, find npm package for this
const unescape = (str) => {
	const iMax = str.length - 1
	if (str.length < 2 || str[0] !== '"' || str[iMax] !== '"') return str
	return str.slice(1, -1).replace(/""/g, '"')
}

// todo: this fails during DST change
const parseTime = (str) => {
	str = str.split(':')
	const iMax = str.length - 1
	return (
		parseInt(str[iMax - 2]) * 3600
		+ parseInt(str[iMax - 1]) * 60
		+ parseInt(str[iMax])
	)
}

const airportUtilWifiScanParser = (input, opt = {}) => {
	return createCsvParser({
		// separator is `, `, so we have to unquote & unescape manually
		mapValues: ({header, value}) => {
			value = unescape(value.trim())
			if (header === 'channel') return parseInt(value)
			if (header === 'rssi') {
				value = parseInt(value)
				return Number.isNaN(value) || value === 0 ? null : value
			}
			if (header === 't') return parseTime(value)
			return value
		},
		// column names are localized so we can't use them
		skipLines: 1,
		headers: ['name', 'bssid', 'rssi', 'channel', 't']
	})
}

module.exports = airportUtilWifiScanParser
