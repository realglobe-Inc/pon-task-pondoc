/**
 * Define task
 * @function define
 * @param {string} src - Source pon file
 * @param {string} dest - Destination
 * @param {Object} [options={}] - Optional settings
 * @returns {function} Defined task
 */
'use strict'

const {exec} = require('child_process')
const path = require('path')
const writeout = require('writeout')
const {promisify} = require('util')

/** @lends define */
function define (src, dest, options = {}) {

  const {
    taskModuleName = 'module:tasks'
  } = options

  async function task (ctx) {
    const {logger} = ctx
    const {stdout} = await promisify(exec)(`jsdoc -X ${src}`)
    const data = JSON.parse(String(stdout))

    const doc = JSON.stringify({
      ponfile: path.relative(process.cwd(), src),
      tasks: data.filter(({memberof}) => memberof === 'module:tasks')
        .map((data) => Object.assign({}, data, {name: data.name.replace(/"/g, '')}))
        .sort((a, b) => a.name.localeCompare(b.name))
        .reduce((data, {name, description}) => Object.assign({},
          data,
          {[name]: description},
        ), {})
    }, null, 2)
    const {skipped} = await writeout(dest, doc, {
      skipIfIdentical: true,
      mkdirp: true,
    })
    if (!skipped) {
      logger.debug(`File generated:`, path.relative(process.cwd(), dest))
    }
  }

  return Object.assign(task,
    // Define sub tasks here
    {}
  )
}

module.exports = define
