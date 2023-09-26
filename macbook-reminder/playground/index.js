const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs').promises

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

async function runOsascript() {
  try {
    const message = '別忘了做某件事情哦！'
    const title = '提醒'
    const subtitle = ''
    const soundFile = ''
    const script = `display notification "${message}" with title "${title}" subtitle "${subtitle}" sound name "${soundFile}"`

    const command = `osascript -e \'${script}\'`

    const { stdout, stderr } = await exec(command)

    console.log(`Command output: ${stdout}`)
    console.error(`Stderr: ${stderr}`)

    // TODO:
    await sleep(5000)

  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
}

async function writeJson() {
  try {
    const newData = {
      '07:00': [
        { title: '🤷‍♂️', message: 'Wake up!' }
      ],
      '23:30': [
        { title: 'title1', message: 'message1' },
        { title: 'title2', message: 'message2' }
      ]
    }
    const jsonData = JSON.stringify(newData, null, 2)
    const filePath = 'data.json'
    await fs.writeFile(filePath, jsonData, 'utf8')
    console.log('Data has been written to JSON file:', jsonData)
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
}

async function readJson() {
  try {
    const filePath = 'data.json'
    const data = await fs.readFile(filePath, 'utf8')
    const parsedData = JSON.parse(data)
    console.log('Read data from JSON file:', parsedData)
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
}

async function main() {
  // await runOsascript()
  // await runOsascript()
  await writeJson()
  await readJson()
}

main().catch(err => console.log(err))