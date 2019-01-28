/**
 * Generate document for pon
 * @module pon-task-pondoc
 * @version 1.0.9
 */

'use strict'

const define = require('./define')

let lib = define.bind(this)

Object.assign(lib, define, {
  define
})

module.exports = lib
