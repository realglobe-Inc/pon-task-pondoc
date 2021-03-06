/**
 * Test case for define.
 * Runs with mocha.
 */
'use strict'

const define = require('../lib/define.js')
const ponContext = require('pon-context')
const {ok} = require('assert')

describe('define', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Define', async () => {
    let ctx = ponContext()
    let task = define(
      `${__dirname}/../misc/mocks/Ponfile.js`,
      `${__dirname}/../tmp/testing-doc.json`,
      {})
    ok(task)

    await Promise.resolve(task(ctx))
  })
})

/* global describe, before, after, it */
