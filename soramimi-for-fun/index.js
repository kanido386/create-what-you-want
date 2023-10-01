const { mapping } = require('./utils')

async function main() {
  const raw = 'しずむ よう に とけて ゆく よう に'
  // const input = raw.replace(/\s/g, '')
  console.log(mapping(raw[0]))
  console.log(mapping(raw[1]))
  console.log(mapping(raw[2]))
}

main().catch(err => console.log(err))
