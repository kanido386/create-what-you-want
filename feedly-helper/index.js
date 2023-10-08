require('dotenv').config()
const fs = require('fs')
const _ = require('lodash')
const { getAllUnreadContents } = require('./api')

async function main() {
  // All articles from all the feeds the user subscribes to
  const streamId = encodeURIComponent(`user/${process.env.USER_ID}/category/global.all`)
  // const projections = ['title', 'canonicalUrl', 'origin.title']
  const projections = ['alternate[0].href']
  const allContents = await getAllUnreadContents(streamId, projections)
  const urls = _.map(allContents, content => _.get(content, 'alternate[0].href'))
  const result = _.map(urls, url => `- [${url}](${url})`).join('\n')
  // console.dir(result, { depth: null })
  
  const filePath = 'output.txt'
  fs.writeFileSync(filePath, result, 'utf-8')
}

main().catch(err => console.log(err))