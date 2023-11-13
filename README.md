# text highlighter

[![NPM version][npm-version-image]][npm-url] [![NPM downloads][npm-downloads-size-image]][npm-url] [![NPM downloads][npm-downloads-image]][downloads-url] [![MIT License][license-image]][license-url]

![Text Highlight](https://unpkg.com/lifeweb-text-highlighter@1.0.0/lifeweb-text-highlighter.jpg)

text highlighter... :)

* [Installation](#installation)
* [Usage](#usage)
* [Props](#props)
* [License](#license)
* [Author](#author)

## Installation

```bash
npm i lifeweb-text-highlighter
```

## Usage

```js

import Highlighter from 'lifeweb-text-highlighter'

<Highlighter
    searchWords = {[{text: "test", style: {backgroundColor: 'yellow'}}]}
    textToHighlight = {"this is a test"}
/>
```


## Props

| Attribute        |      type                   |  default |
|------------------|:---------------------------:|---------:|
| caseSensitive    | `boolean`                   | `false`  |
| searchWords      | [`PatternItem[]`](#pattern) | `[]`     |
| textToHighlight  | `string`                    |  ''      |
| globalClassName  | `string`                    |  null    |
| globalStyle      | `CSSProperties`             |  null    |
| globalOnClick    | `function`                  |  null    |
 
#### Pattern Item
| Attribute   |      type        |  default             |
|-------------|:----------------:|---------------------:|
| text        | RegExp `string`  | ``                   |
| className   | `string`         | null                 |
| style       | `CSSProperties`  | {`background`: `yellow`} |
| onClick     | `function`       |  null                |
| render      | `function`       |  null                |


## License

MIT

### author

> Nafiseh Mahdianfar [nama996](https://www.npmjs.com/~nama996)

---
> [Lifeweb Company] <lifeweb.webapp@gmail.com>


[license-image]: http://img.shields.io/npm/l/lifeweb-text-highlighter.svg?style=flat

[license-url]: LICENSE

[npm-url]: https://npmjs.org/package/lifeweb-text-highlighter

[npm-version-image]: http://img.shields.io/npm/v/lifeweb-text-highlighter.svg?style=flat

[npm-downloads-image]: http://img.shields.io/npm/dm/lifeweb-text-highlighter.svg?style=flat

[npm-downloads-size-image]: https://img.shields.io/bundlephobia/minzip/lifeweb-text-highlighter.svg?style=flat

[downloads-url]: https://npmcharts.com/compare/lifeweb-text-highlighter?minimal=true


