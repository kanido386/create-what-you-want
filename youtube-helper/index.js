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

const getChannelIdFromUrl = async (url) => {
  let channelId = null
  try {
    const customUsername = await getCustomUsernameFromUrl(url)
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
  
  return channelId
}

const getAllVideosFromChannel = async (channelId) => {
  try {
    let allVideos = []
    let nextPageToken = null

    do {
      const currentDate = new Date()
      const twelveDaysAgo = new Date(currentDate.getTime() - 12 * 24 * 60 * 60 * 1000)
      const rfc3339FormattedDate = twelveDaysAgo.toISOString()
      console.log('rfc3339FormattedDate: ', rfc3339FormattedDate)
      const response = await axios('https://www.googleapis.com/youtube/v3/search', {
        params: {
          key: process.env.API_KEY,
          channelId: channelId,
          part: 'id,snippet',
          maxResults: 50,
          type: 'video',
          // TODO:
          // publishedAfter: rfc3339FormattedDate,
          pageToken: nextPageToken,
        },
      })

      const { items, nextPageToken: next } = response.data
      if (items) {
        allVideos = allVideos.concat(items)
      }

      // console.log('allVideos: ', allVideos)

      nextPageToken = next
      console.log('nextPageToken: ', nextPageToken)
    } while (nextPageToken)

    return allVideos
  } catch (error) {
    console.error('Error fetching videos:', error.message)
    return []
  }
}

async function main() {
  const channelId = await getChannelIdFromUrl('https://www.youtube.com/@kanido386')
  console.log('channelId: ', channelId)
  const allVideos = await getAllVideosFromChannel(channelId)
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
      thumbnail: highThumbnail || mediumThumbnail || defaultThumbnail
    }
  })
  console.log('Final results: ', result)
  const thumbnails = allVideos[0].snippet.thumbnails
  console.log('thumbnails: ', thumbnails)
}

main().catch(err => console.log(err))