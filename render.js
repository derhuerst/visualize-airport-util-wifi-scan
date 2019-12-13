'use strict'

const flatten = require('flatten-overlapping-ranges')
const rangesLayout = require('overlapping-ranges-layout')
const hashColor = require('hashcolor')
const chalk = require('chalk')
// const min = require('lodash/min')
// const max = require('lodash/max')
const uniqBy = require('lodash/uniqBy')

const colorHash = str => '#' + hashColor.strHash(str).toString(16)

const render = (ranges) => {
	// const rssis = ranges
	// .flatMap(r => r.measurements)
	// .map(measurement => measurement[1])
	// const minRssi = min(rssis)
	// const maxRssi = max(rssis)
	// todo: render signal strength over time using RSSI
	// U+2588	FULL BLOCK (U+2588)	█
	// U+2589	LEFT SEVEN EIGHTHS BLOCK (U+2589)	▉
	// U+258A	LEFT THREE QUARTERS BLOCK (U+258A)	▊
	// U+258B	LEFT FIVE EIGHTHS BLOCK (U+258B)	▋
	// U+258C	LEFT HALF BLOCK (U+258C)	▌
	// U+258D	LEFT THREE EIGHTHS BLOCK (U+258D)	▍
	// U+258E	LEFT ONE QUARTER BLOCK (U+258E)	▎
	// U+258F	LEFT ONE EIGHTH BLOCK (U+258F)	▏

	const segments = Array.from(flatten(ranges.map(r => [r, r.from, r.to])))
	const layout = rangesLayout(segments)

	const colors = new Map()
	const rangeColor = (range) => {
		if (colors.has(range.bssid)) return colors.get(range.bssid)
		const render = chalk.hex(colorHash(range.bssid))
		colors.set(range.bssid, render)
		return render
	}

	const rangeTitle = r => rangeColor(r)(r.bssid + ' ' + r.name)
	const rangeName = r => rangeColor(r)(r.name)
	const rangeBar = r => rangeColor(r)('|')

	const titlesRendered = new WeakSet()
	const rangeNameOnce = (range) => {
		if (titlesRendered.has(range)) return null
		const rendered = rangeName(range)
		titlesRendered.add(range)
		return rendered
	}

	const chart = []
	for (const [height, ranges] of layout) {
		const titles = ranges
		.filter(range => range !== null)
		.map(rangeNameOnce)
		.filter(rendered => rendered !== null)

		const bars = ranges
		.map(r => r === null ? ' ' : rangeBar(r))
		.join('')

		chart.push(bars + titles.join(' '))
		chart.push(bars)
	}

	return [
		...uniqBy(ranges, r => r.bssid).map(rangeTitle),
		'',
		...chart
	].join('\n')
}

module.exports = render
