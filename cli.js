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
    visualize-airport-util-wifi-scan <scan.txt
\n`)
	process.exit()
}

if (argv.version || argv.v) {
	process.stdout.write(pkg.name + ' ' + pkg.version + '\n')
	process.exit(0)
}

const showError = (err) => {
	console.error(err)
	process.exit(1)
}

const {isatty} = require('tty')
if (isatty(process.stdin.fd)) showError('Put the scan via stdin.')

const parse = require('.')
const render = require('./render')

parse(process.stdin)
.then((ranges) => {
	process.stdout.write(render(ranges))
})
.catch(showError)
