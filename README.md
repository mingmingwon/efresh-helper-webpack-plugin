[![npm](https://img.shields.io/npm/v/refresh-helper-webpack-plugin.svg)](https://www.npmjs.com/package/refresh-helper-webpack-plugin) [![npm](https://img.shields.io/npm/dt/refresh-helper-webpack-plugin.svg)](https://www.npmjs.com/package/refresh-helper-webpack-plugin) [![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/mingmingwon/refresh-helper-webpack-plugin/blob/master/LICENSE) 

# Introduction

A webpack plugin that reminds the user of new release to refresh page.

# Install

[![NPM](https://nodei.co/npm/refresh-helper-webpack-plugin.png)](https://nodei.co/npm/refresh-helper-webpack-plugin/)
```
npx i refresh-helper-webpack-plugin -D
```

# Usage

Modify your vue.config.js like below.

```js
const RefreshHelperWebpackPlugin = require('refresh-helper-webpack-plugin')

module.exports = {
  // ...
  configureWebpack: config => {
    // ...
    process.argv.includes('build') && config.plugins.push(new RefreshHelperWebpackPlugin()) // limit in build mode
    // ...
  }
  // ...
};
```

Change the "pages", "message", "btnText" or "throttle" option if needed.

```js
const RefreshHelperWebpackPlugin = require('refresh-helper-webpack-plugin')

module.exports = {
  // ...
  configureWebpack: config => {
    // ...
    process.argv.includes('build') && config.plugins.push(new RefreshHelperWebpackPlugin({
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
|pages|String/Array|false|`all pages`|bundled html filename|
|message|String|false|发现新版本啦|new release message|
|btnText|String|false|更新|refresh button text|
|throttle|Number|false|60000|delay between requests|


# License

The MIT License