
'use strict'

const { exec } = require('child_process')
const path = require('path')
const {EOL} = require('os')
const writeout = require('writeout')
const { sortProperties } = require('fmtjson')
const { promisify } = require('util')

/**
 * Define task
 * @memberof module:pon-task-pondoc
 * @function define
 * @param {string} src - Source pon file
 * @param {string} dest - Destination
 * @param {Object} [options={}] - Optional settings
 * @param {string} [options.tasksNamepath] = Namepath of tasks
 * @returns {function} Defined task
 */
function define (src, dest, options = {}) {
  if(options.taskModuleName){
    console.warn(`[pon-task-pondoc] taskModuleName`)
    options.tasksNamepath = options.taskModuleName
  }
  const {
    tasksNamepath = 'module:tasks'
  } = options

  const tasksDefFrom = async (src) => {
    const command = require.resolve('jsdoc/jsdoc.js')
    const { stdout } = await promisify(exec)(`${command} -X ${src}`)
    const data = JSON.parse(String(stdout))
    return data
      .filter(({ memberof }) => memberof === tasksNamepath)
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
    }), null, 2) + EOL
    const { skipped } = await writeout(dest, doc, {
      skipIfIdentical: true,
      mkdirp: true,
      mode: '444',
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
