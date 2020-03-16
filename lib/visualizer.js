'use strict'

const {readFileSync} = require('fs')
const {join} = require('path')
const {Transform} = require('stream')

const HEAD = readFileSync(join(__dirname, 'head.html'), {encoding: 'utf8'})
const TAIL = readFileSync(join(__dirname, 'tail.html'), {encoding: 'utf8'})

const airportUtilWifiScanVisalizer = (opt = {}) => {
	// by BSSID
	const ts = Object.create(null)
	const rssis = Object.create(null)

	const write = (data, _, cb) => {
		const bssid = data.bssid.toLowerCase()
		if (!ts[bssid]) ts[bssid] = [data.t]
		else ts[bssid].push(data.t)
		if (!rssis[bssid]) rssis[bssid] = [data.rssi]
		else rssis[bssid].push(data.rssi)
		cb(null)
	}

	const final = (cb) => {
		const bssids = Object.keys(rssis)

		const tColumns = Object.entries(ts)
		.map(([bssid, ts]) => [bssid + '-t', ...ts])
		const rssiColumns = Object.entries(rssis)
		.map(([bssid, rssis]) => [bssid + '-rssis', ...rssis])
		const columns = [...tColumns, ...rssiColumns]

		const xs = Object.fromEntries(
			bssids.map(b => [b + '-rssis', b + '-t'])
		)
		const names = Object.fromEntries(
			bssids.map(b => [b + '-rssis', b])
		)

		out.push(HEAD)
		out.push(JSON.stringify({
			type: 'spline',
			columns,
			xs,
			names,
		}) + '\n')
		out.push(TAIL)
		cb(null)
	}

	const out = Transform({
		objectMode: true,
		write,
		final
	})
	return out
}

module.exports = airportUtilWifiScanVisalizer
