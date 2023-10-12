const { mapping } = require('./utils')

const Kuroshiro = require('kuroshiro').default
const KuromojiAnalyzer = require('kuroshiro-analyzer-kuromoji')
const kuroshiro = new Kuroshiro()

async function main() {
  // const raw = 'しずむ よう に とけて ゆく よう に'
  // // const input = raw.replace(/\s/g, '')
  // console.log(mapping(raw[0]))
  // console.log(mapping(raw[1]))
  // console.log(mapping(raw[2]))

  const raw = '沈むように溶けてゆくように 二人だけの空が広がる夜に'

  await kuroshiro.init(new KuromojiAnalyzer())
  // It may contain wrong conversion like: 二人 --> ににん (should be ふたり)
  const result = await kuroshiro.convert(raw, { mode: 'spaced', to: "hiragana" })
  console.log(result)  // しずむ よう に とけ て ゆく よう に   に にん だけ の そら が ひろがる よる に
}

main().catch(err => console.log(err))
