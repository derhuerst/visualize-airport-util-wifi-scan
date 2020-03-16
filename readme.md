# visualize-airport-util-wifi-scan

**Parse & visualize an [iOS AirPort Utility](https://itunes.apple.com/us/app/airport-utility/id427276530) WiFi scan.**

[![npm version](https://img.shields.io/npm/v/visualize-airport-util-wifi-scan.svg)](https://www.npmjs.com/package/visualize-airport-util-wifi-scan)
[![build status](https://api.travis-ci.org/derhuerst/visualize-airport-util-wifi-scan.svg?branch=master)](https://travis-ci.org/derhuerst/visualize-airport-util-wifi-scan)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/visualize-airport-util-wifi-scan.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## Installing

```shell
npm install -g visualize-airport-util-wifi-scan
```

Or just use [`npx`](https://npmjs.com/package/npx): ✨

```shell
npx visualize-airport-util-wifi-scan <scan.txt
```


## Usage

```
cat scan.txt | parse-airport-util-wifi-scan | visualize-airport-util-wifi-scan
```

You can filter a parsed scan using e.g. [`ndjson-cli`](https://github.com/mbostock/ndjson-cli):

```shell
cat scan.txt | parse-airport-util-wifi-scan \
	| ndjson-filter 'd.rssi >= -70' \ # filter weak signals
	| ndjson-filter 'd.name === "foo bar"' \ # filter by ESSID/name
	| visualize-airport-util-wifi-scan >scan.html
```


## Contributing

If you have a question or need support using `visualize-airport-util-wifi-scan`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/visualize-airport-util-wifi-scan/issues).
