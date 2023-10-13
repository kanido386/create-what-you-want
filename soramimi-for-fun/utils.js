const _ = require('lodash')

const mappingObject = {
  あ: ['阿'],
  い: ['姨'],
  う: ['屋'],
  え: ['A'],
  お: ['喔'],
  か: ['卡'],
  き: ['Ki'],
  く: ['哭'],
  け: ['K'],
  こ: ['摳'],
  さ: ['沙'],
  し: ['西', '吸'],
  す: ['斯'],
  せ: ['誰'],
  そ: ['收'],
  な: ['拿', '那'],
  に: ['你'],
  ず: ['汁'],
  て: ['鐵'],
  と: ['偷', '頭'],
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
