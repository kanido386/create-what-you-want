#!/usr/bin/env node

const { Command } = require('commander')
const program = new Command()
const chalk = require('chalk')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Taipei')

const currentTime = moment().format('HH:mm')

program
  .version('1.0.0')
  .description('A simple CLI tool using Commander and Chalk')

program
  .command('greet <name>')
  .description('Greet someone')
  .action((name) => {
    console.log(`Hello, ${chalk.green(name)}! It's ${currentTime} now.`)
  })

program.parse(process.argv)
