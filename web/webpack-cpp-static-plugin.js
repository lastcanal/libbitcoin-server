const path = require('path');
const fs = require('fs-extra')

class WebpackCPPPlugin {
  constructor(config) {
    this.config = config
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync(
      'WebpackCPPPlugin', this.start.bind(this))
  }

  async start(compilation, callback) {
    const output = this.config.output
    const target = this.config.target
    const html_file = path.join(output.path, output.filename)
    const build_file = path.join(output.path, target.filename)
    const target_file = path.join(target.path, target.filename)
    const html = await fs.readFile(html_file)
    const cpp = await fs.open(build_file, "w")
    await fs.appendFile(cpp, this.config.content.top)
    await this.writeLines(html, cpp)
    await fs.appendFile(cpp, this.config.content.bottom)
    await fs.copyFile(build_file, target_file)

    callback()
  }

  writeLines(html, cpp) {
    return new Promise((resolve, reject) => {
      this.writeLineRecursive(html, cpp, 0, resolve, reject)
    })
  }

  async writeLineRecursive(html, cpp, cursor, resolve, reject) {
    let width = 74;
    if (html.length < cursor) return resolve(cpp)
    let line = html.toString('utf8', cursor, cursor + width)
    await fs.appendFile(cpp, "\n    " + JSON.stringify(line))
    this.writeLineRecursive(html, cpp, cursor + width, resolve, reject)
  }
}

module.exports = WebpackCPPPlugin
