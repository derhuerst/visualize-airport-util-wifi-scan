'use strict'

const {join} = require('path')
const {createReadStream} = require('fs')
const {array: collectStream} = require('get-stream')
const {deepStrictEqual, ok} = require('assert')
const createParser = require('./lib/parser')

const src = join(__dirname, 'example.txt')

const parser = createParser()
createReadStream(src, {encoding: 'utf-8'})
.pipe(parser)

collectStream(parser)
.then((output) => {
	deepStrictEqual(output[0], {
		name: "qwerz",
		bssid: "00:81:C4:E6:69:12",
		rssi: -75,
		channel: 11,
		t: 66909
	})
	deepStrictEqual(output[10], {
		name: "qwerz",
		bssid: "00:81:C4:E6:69:12",
		rssi: -35,
		channel: 11,
		t: 66952
	})
	ok(output.find(r => r.name === 'qwerz' && r.rssi === null))
	deepStrictEqual(output[output.length - 1], {
		name: "BVG Wi-Fi",
		bssid: "00:81:C4:E6:69:10",
		rssi: -64,
		channel: 11,
		t: 66995
	})

	console.info('tests passed ✔︎')
})
.catch((err) => {
	console.error(err)
	process.exit(1)
})
