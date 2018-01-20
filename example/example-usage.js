'use strict'

const pon = require('pon')
const pondoc = require('pon-task-pondoc')

;(async () => {
  const run = pon({
    'doc:pon': pondoc()
  })

  run('myTask01')
}).catch((err) => console.error(err))
