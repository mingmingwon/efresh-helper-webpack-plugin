const chalk = require('chalk')
const dayjs = require('dayjs')
const { readFileSync, writeFileSync } = require('fs')

const errLog = (msg = 'error') => {
  console.log(`\n${chalk.white.bgRed(' ERROR ')}${chalk.red(' [refresh-helper-webpack-plugin] ' + msg)}`)
  process.exit(1)
}

module.exports = class RefreshHelperWebpackPlugin {
  constructor ({ pages = [], message = '发现新版本啦', btnText = '更新', throttle = 60000, iframe = false } = {}) {
    const uPages = require(`${process.cwd()}/vue.config.js`).pages
    pages = Array.isArray(pages) ? pages : [pages]
    pages = pages.length ? pages : Object.keys(uPages).map(item => {
      const page = uPages[item]
      return typeof page === 'string' ? `${item}.html` : page.filename
    })
    this.config = {
      pages,
      message,
      btnText,
      throttle,
      iframe
    }
  }

  apply (compiler) {
    const afterEmit = (compilation, callback) => {
      this.version = compilation.hash
      this.datetime = dayjs().format('YYYY-MM-DD HH:mm:ss')
      this.config.pages.forEach(item => {
        const page = compilation.assets[item]
        if (!page) {
          errLog(`Can't find the page ${chalk.yellow(item)}, please check ${chalk.yellow('pages')} configuration`)
        }
        this.appendScript(page.existsAt)
      })
      this.recordInfos(compilation.outputOptions.path)
      callback()
    }

    if (compiler.hooks) {
      compiler.hooks.afterEmit.tapAsync('afterEmit', afterEmit)
    } else {
      compiler.plugin('after-emit', afterEmit)
    }
  }

  appendScript (pageFile) {
    try {
      const content = readFileSync(pageFile, 'utf-8')
      writeFileSync(pageFile, content.replace(/(<\/body>)/, `${this.generateScript()}$1`))
    } catch (err) {
      errLog(err)
    }
  }

  generateScript () {
    return `
      <script type="text/javascript" id="__refresh_script__">
        (function () {
          var id = '__refresh_helper__';
          function getRefresh () {
            return document.querySelector('#' + id);
          }
          function refreshHandler () {
            if (/(iPhone|iPad|iOS|Android)/i.test(navigator.userAgent)) {
              location.reload();
            } else if (window !== window.parent && !${this.config.iframe}) {
              location.reload();
            } else {
              var refresh = getRefresh();
              if (!refresh) {
                refresh = document.createElement('div');
                refresh.id = id;
                refresh.style = 'position: fixed; z-index: 99999; background-color: #fff; right: 20px; bottom: 20px; text-align: center; box-shadow: rgba(0, 0, 0, .1) 0 2px 6px 1px; border-radius: 3px; padding: 10px 15px; font-size: 12px;';
                var message = document.createElement('p');
                message.innerHTML = '${this.config.message}';
                refresh.appendChild(message);
                var button = document.createElement('button');
                button.style = 'margin-top: 5px; padding: 0 15px; height: 24px; line-height: 1; color: #4453db; background-color: #dde8ff; border: 1px solid #dde8ff; font-size: 12px; border-radius: 3px; cursor: pointer; outline: none; -webkit-appearance: none;';
                button.innerHTML = '${this.config.btnText}';
                button.addEventListener('click', function () {
                  location.reload();
                });
                refresh.appendChild(button);
                document.body.appendChild(refresh);
              }
              refresh.style.display = 'block';
            }
          }
          function createXHR (cb) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
              if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                document.visibilityState === 'visible' && cb.call(xhr, JSON.parse(xhr.responseText).version);
              }
            };
            return function () {
              xhr.open('GET', '/release.json?t=' + new Date().getTime());
              xhr.send();
              return xhr;
            };
          }
          var xhr = createXHR(function (version) {
            if ('${this.version}' !== version) {
              refreshHandler();
            }
          });
          var req = null;
          var ajax = (function throttle(fn, delay) {
            var timer;
            return function () {
              if (timer) return;
              timer = setTimeout(function () {
                timer = null;
              }, delay);
              fn.apply(this, arguments);
            };
          })(xhr, ${this.config.throttle});
          document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'visible') {
              if (!getRefresh()) {
                req = ajax();
              }
            } else {
              req && req.readyState !== 4 && req.abort();
            }
          });
        })();
      </script>
    `.split(/[\r\n]/).map(line => line.trim()).join('')
  }

  recordInfos (rootPath) {
    try {
      writeFileSync(`${rootPath}/release.json`, JSON.stringify({
        version: this.version,
        datetime: this.datetime
      }, null, 2))
    } catch (err) {
      errLog(err)
    }
  }

  error (err) {
    errLog(err)
  }
}
