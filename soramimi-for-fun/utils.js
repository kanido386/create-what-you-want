const _ = require('lodash')

const mappingObject = {
  く: ['哭'],
  け: ['K'],
  し: ['西', '吸'],
  ず: ['汁'],
  て: ['鐵'],
  と: ['偷', '頭'],
  に: ['你'],
  む: ['母'],
  ゆ: ['U'],
  // 母音延長 https://w81015.pixnet.net/blog/post/114269279
  よう: ['又ー'],
}

const mapping = (key) => {
  const randomIndex = Math.floor(Math.random() * mappingObject[key].length)
  return mappingObject[key][randomIndex]
}

module.exports = {
  mapping
}
