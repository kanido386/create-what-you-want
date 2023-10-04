const fs = require('fs').promises
const axios = require('axios')
require('dotenv').config()

const getCustomUsernameFromUrl = async (url) => {
  const customUrlRegex = /youtube\.com\/@([^/]+)/
  const match = url.match(customUrlRegex)
  if (!match) {
    throw 'Invalid YouTube channel URL'
  }
  return match[1]
}

const getChannelInfoFromUrl = async (url) => {
  let channelId = null
  let customUsername = null
  try {
    customUsername = await getCustomUsernameFromUrl(url)
    const response = await axios('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: process.env.API_KEY,
        part: 'id,snippet',
        maxResults: 1,
        type: 'channel',
        q: `@${customUsername}`,
      },
    })
    const { data } = response
    if (data.items && data.items.length > 0) {
      channelId = data.items[0].snippet.channelId
    } else {
      console.error('Channel not found')
    }
  } catch (err) {
    console.error('Error fetching channel data:', err)
  }
  
  return { channelId, customUsername }
}

const getAllVideosFromChannel = async (channelId, publishedAfter = null) => {
  try {
    let allVideos = []
    let nextPageToken = null

    const currentDate = new Date()
    // const twelveDaysAgo = new Date(currentDate.getTime() - 12 * 24 * 60 * 60 * 1000)
    // const rfc3339FormattedDate = twelveDaysAgo.toISOString()
    // console.log('rfc3339FormattedDate: ', rfc3339FormattedDate)

    do {
      const response = await axios('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: process.env.API_KEY,
          channelId: channelId,
          part: 'id,snippet',
          maxResults: 50,
          type: 'video',
          order: 'date',
          publishedAfter,
          pageToken: nextPageToken,
        },
      })

      const { items, nextPageToken: next } = response.data
      if (items) {
        allVideos = allVideos.concat(items)
      }

      // console.log('allVideos: ', allVideos)

      nextPageToken = next
      // console.log('nextPageToken: ', nextPageToken)
    } while (nextPageToken)

    return {
      allVideos,
      lastFetch: currentDate.toISOString()
    }
  } catch (error) {
    console.error('Error fetching videos:', error.message)
    return []
  }
}

const createDirectoryIfNotExists = async (directoryPath) => {
  try {
    await fs.access(directoryPath)
  } catch (err) {
    await fs.mkdir(directoryPath)
  }
}

const readJson = async (name) => {
  try {
    const filePath = `./data/${name}.json`
    const data = await fs.readFile(filePath, 'utf8')
    const parsedData = JSON.parse(data)
    // console.log('Read data from JSON file:', parsedData)
    return parsedData
  } catch (err) {
    console.error(`Error: ${err.message}`)
    // FIXME: Maybe it's not good to do this here
    return { videos: [], lastFetch: null }
  }
}

const writeJson = async (obj, name) => {
  try {
    await createDirectoryIfNotExists('./data')
    const jsonData = JSON.stringify(obj, null, 2)
    const filePath = `./data/${name}.json`
    await fs.writeFile(filePath, jsonData, 'utf8')
    // console.log('Data has been written to JSON file:', jsonData)
  } catch (err) {
    console.error(`Error: ${err.message}`)
  }
}

async function main() {
  const { channelId, customUsername } = await getChannelInfoFromUrl('https://www.youtube.com/@kanido386')
  // console.log('channelId: ', channelId)
  const { videos, lastFetch: publishedAfter } = await readJson(customUsername)
  const { allVideos, lastFetch } = await getAllVideosFromChannel(channelId, publishedAfter)
  const result = allVideos.map(video => {
    const {
      id: { videoId },
      snippet: {
        title,
        thumbnails: {
          default: defaultThumbnail,
          medium: mediumThumbnail,
          high: highThumbnail
        }
      }
    } = video
    return {
      videoId,
      url: `https://www.youtube.com/watch?v=${videoId}`,
      title,
      thumbnail: highThumbnail?.url || mediumThumbnail?.url || defaultThumbnail?.url
    }
  })
  // console.log('Final results: ', result)
  // console.log('lastFetch: ', lastFetch)
  const obj = { videos: [ ...result, ...videos ], lastFetch }
  await writeJson(obj, customUsername)
  console.log('ok')
  // const thumbnails = allVideos[0].snippet.thumbnails
  // console.log('thumbnails: ', thumbnails)
}

main().catch(err => console.log(err))