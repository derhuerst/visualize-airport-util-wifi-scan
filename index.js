'use strict'

const createCsvParser = require('csv-parser')
const pump = require('pump')
const {Transform, Writable} = require('stream')

const THRESHOLD = 6 // seconds

// todo: this is buggy, find npm package for this
const unescape = (str) => {
	const iMax = str.length - 1
	if (str.length < 2 || str[0] !== '"' || str[iMax] !== '"') return str
	return str.slice(1, -1).replace(/""/g, '"')
}

const parseTime = (str) => { // this fails during DST change
	str = str.split(':')
	const iMax = str.length - 1
	return (
		parseInt(str[iMax - 2]) * 3600
		+ parseInt(str[iMax - 1]) * 60
		+ parseInt(str[iMax])
	)
}

const defaultWifiId = (wifi) => wifi.name + '-' + wifi.bssid

const parse = (input, opt = {}) => {
	const {wifiId} = {
		wifiId: defaultWifiId,
		...opt
	}

	const parseRow = (raw, _, cb) => {
		const row = {
			name: raw.name,
			bssid: raw.bssid,
			rssi: parseInt(raw.rssi),
			channel: parseInt(raw.channel),
			t: parseTime(raw.time)
		}
		row.id = wifiId(row)
		cb(null, row)
	}

	const streaks = []
	const currentStreak = Object.create(null)

	const onRow = (row) => {
		const {id, name, bssid, rssi, channel, t} = row
		const measurement = [t, rssi, channel]

		// todo: exports are not sorted by time!
		if (currentStreak[id] && (t - currentStreak[id].lastSeen) > THRESHOLD) {
			// seen too long ago -> flush old streak
			streaks.push(currentStreak[id])
			currentStreak[id] = null
		}

		if (currentStreak[id]) { // recently seen?
			currentStreak[id].measurements.push(measurement)
			currentStreak[id].lastSeen = t
		} else { // never seen so far or not recently seen
			currentStreak[id] = {
				id, name, bssid,
				measurements: [measurement],
				lastSeen: t
			}
		}
	}

	const afterLastRow = (cb) => {
		for (const bssid in currentStreak) streaks.push(currentStreak[bssid])
		cb()
	}

	return new Promise((resolve, reject) => {
		pump(
			input,
			createCsvParser({
				// separator is `, `, so we have to unquote & unescape manually
				mapValues: ({value}) => unescape(value.trim()),
				// column names are localized so we can't use them
				skipLines: 1,
				headers: ['name', 'bssid', 'rssi', 'channel', 'time']
			}),
			new Transform({objectMode: true, transform: parseRow}),
			new Writable({
				objectMode: true,
				write: (row, _, cb) => cb(null, onRow(row)),
				final: afterLastRow
			}),
			(err) => {
				if (err) return reject(err)

				for (const s of streaks) {
					s.from = s.measurements[0][0]
					s.to = s.measurements[s.measurements.length - 1][0]
				}
				resolve(streaks)
			}
		)
	})
}

module.exports = parse
