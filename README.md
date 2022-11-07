[![npm](https://img.shields.io/npm/v/refresh-helper-webpack-plugin.svg)](https://www.npmjs.com/package/refresh-helper-webpack-plugin) [![npm](https://img.shields.io/npm/dt/refresh-helper-webpack-plugin.svg)](https://www.npmjs.com/package/refresh-helper-webpack-plugin) [![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/mingmingwon/refresh-helper-webpack-plugin/blob/master/LICENSE) 

# Introduction

A webpack plugin that reminds the user of new release to refresh page.

# Install

[![NPM](https://nodei.co/npm/refresh-helper-webpack-plugin.png)](https://nodei.co/npm/refresh-helper-webpack-plugin/)
```
npm i refresh-helper-webpack-plugin -D
```

# Usage

Modify your vue.config.js like below.

```js
const RefreshHelperWebpackPlugin = require('refresh-helper-webpack-plugin')

module.exports = {
  // ...
  configureWebpack: config => {
    // ...
    config.plugins.push(new RefreshHelperWebpackPlugin())
    // ...
  }
  // ...
};
```

Change the `pages/message/btnText/throttle` option if needed, see default value in `Options` section.

```js
const RefreshHelperWebpackPlugin = require('refresh-helper-webpack-plugin')

module.exports = {
  // ...
  configureWebpack: config => {
    // ...
    config.plugins.push(new RefreshHelperWebpackPlugin({
      pages: 'other.html', // String or Array
      message: '提示信息文本',
      btnText: '按钮文本',
      throttle: 180000 // 3 minutes
    }))
    // ...
  }
  // ...
};
```

# Options

|Name|Type|Required|Default|Description|
|:--:|:--:|:-----:|:-----:|:----------|
|pages|String/Array|false|`output pages`|compiled html file name|
|message|String|false|发现新版本啦|new release message|
|btnText|String|false|更新|refresh button text|
|throttle|Number|false|60000|delay between two requests|

# Features

1. Using `visibilitychange` API, see it at [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Visibility_API) and its [compatibility](https://caniuse.com/?search=visibilitychange). It is more in line with our expectations.
2. Desktop pages will show the popup and trigger by clicking refresh button, mobile pages will refresh the page without any reminding. Pages embedded in iframe usually won't effective as mentioned in MDN article above.
3. Throttle delay to avoid fetching version API frequently.
4. Zero dependency, none invasion, and terser compression.


# License

The MIT License