#!/usr/bin/env node
'use strict'

const mri = require('mri')

const pkg = require('./package.json')

const argv = mri(process.argv.slice(2), {
	boolean: [
		'help', 'h',
		'version', 'v'
	]
})

if (argv.help || argv.h) {
	process.stdout.write(`
Usage:
    visualize-airport-util-wifi-scan <parsed-scan.ndjson
\n`)
	process.exit()
}

if (argv.version || argv.v) {
	process.stdout.write(pkg.name + ' ' + pkg.version + '\n')
	process.exit(0)
}

const showError = (err) => {
	if (!err) return;
	console.error(err)
	process.exit(1)
}

const pump = require('pump')
const {parse} = require('ndjson')
const visualizer = require('./lib/visualizer')

pump(
	process.stdin,
	parse(),
	visualizer(),
	process.stdout,
	showError
)
