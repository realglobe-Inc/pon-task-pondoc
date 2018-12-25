/**
 * Define task
 * @function define
 * @param {string} src - Source pon file
 * @param {string} dest - Destination
 * @param {Object} [options={}] - Optional settings
 * @returns {function} Defined task
 */
'use strict'

const { exec } = require('child_process')
const path = require('path')
const writeout = require('writeout')
const { sortProperties } = require('fmtjson')
const { promisify } = require('util')

/** @lends define */
function define (src, dest, options = {}) {

  const {
    taskModuleName = 'module:tasks'
  } = options

  const tasksDefFrom = async (src) => {
    const command = require.resolve('jsdoc/jsdoc.js')
    const { stdout } = await promisify(exec)(`${command} -X ${src}`)
    const data = JSON.parse(String(stdout))
    return data
      .filter(({ memberof }) => memberof === taskModuleName)
      .map((data) => Object.assign({}, data, { name: data.name.replace(/"/g, '').trim() }))
      .reduce((data, { name, description }) => Object.assign({},
        data,
        { [name]: description },
      ), {})
  }

  async function task (ctx) {
    const { logger } = ctx
    const doc = JSON.stringify(sortProperties({
      ponfile: path.relative(process.cwd(), src),
      tasks: await tasksDefFrom(src)
    }), null, 2)
    const { skipped } = await writeout(dest, doc, {
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
