const fs = require('fs')
const path = require('path')
const cheerio = require('cheerio')
const axios = require('axios')
const Image = require('./Image')
const Category = require('./Category')
const conn = require('./db')
const { resolve } = require('path')
const { rejects } = require('assert')
const Artist = require('./Artist')
const Theme = require('./Theme')

// 获取图片所在的a标签
async function getUrl(url) {
  try {
    const res = await axios({
      url: url,
      method: 'get',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.72 Safari/537.36'
      }
    })
    const $html = res.data
    const $ = cheerio.load($html)
    $('.pic a').each((index, element) => {
      const infos = getImg($(element).attr('href'))
    })
  } catch (error) {
    console.log(error)
  }
}
// 获取图片地址
async function getImg($href) {
  try {
    const res = await axios({
      url: $href,
      method: 'get'
    })
    const $html = res.data
    const $ = cheerio.load($html)
    const infos = {
      name: $('.workIntro h1').text(),
      artist: {
        name: $('.authDetail h4').text(),
        info: $('.htmlEdit p').text().trim()
      },
      date: $('.table tr:nth-of-type(1) :last-child').text().trim(),
      category: $('.table tr:nth-of-type(2) :nth-child(2)').text().trim(),
      theme: $('.table .last').text() == '' ? '未知' : $('.table .last').text(),
      bigImg: `http://localhost:3000/uploads/big/${Date.now()}.jpg`,
      smallImg: `http://localhost:3000/uploads/small/${Date.now()}.jpg`
    }

    const $smallImg = await axios.get($('.workShow .imgWrap img').attr('src'), {
      responseType: 'stream'
    })
    const $bigImg = await axios.get($('#bigPic').attr('src'), {
      responseType: 'stream'
    })
    const bigImg = '../../uploads/big'
    const smallImg = '../../uploads/small'
    try {
      if (!fs.existsSync(bigImg) || !fs.existsSync(smallImg)) {
        fs.mkdirSync(bigImg)
        fs.mkdirSync(smallImg)
      }
      // 保存为本地图片
      const small = fs.createWriteStream(
        `../../uploads/small/${infos.smallImg.slice(
          infos.smallImg.lastIndexOf('/') + 1
        )}`
      )
      const big = fs.createWriteStream(
        `../../uploads/big/${infos.bigImg.slice(
          infos.bigImg.lastIndexOf('/') + 1
        )}`
      )
      $smallImg.data.pipe(small)
      $bigImg.data.pipe(big)
      // 将信息存入数据库
      saveDB(infos)
    } catch (error) {
      console.log(error)
    }
  } catch (err) {
    console.log(err)
  }
}
async function saveDB(infos) {
  // console.log(infos)
  const cate = await Category.updateOne(
    {
      name: infos.category
    },
    {
      $setOnInsert: {
        name: infos.category
      }
    },
    { upsert: true }
  )
  const theme = await Theme.updateOne(
    {
      name: infos.theme,
      category_id: await Category.findOne({ name: infos.category })
    },

    {
      $setOnInsert: {
        name: infos.theme
      }
    },
    { upsert: true }
  )

  const artist = {
    name: infos.artist.name,
    info: infos.artist.info == '' ? '暂无作者信息' : infos.artist.info
  }
  const art = await Artist.updateOne(
    artist,
    { $setOnInsert: artist },
    { upsert: true }
  )
  const img = new Image({
    name: infos.name == '' ? '无题' : infos.name,
    artist_id: await Artist.findOne({ name: infos.artist.name }),
    date: infos.date,
    cid: await Category.findOne({ name: infos.category }),
    theme_id: await Theme.findOne({ name: infos.theme }),
    bigImg: infos.bigImg,
    smallImg: infos.smallImg
  })

  const res = await img.save()
  // console.log(art)
  // console.log(cate)
  // console.log(res)
}
async function run(end) {
  console.log(`开始爬取>>>>>>`)
  let i = 5
  for (j = 0; j < end; j++) {
    const url = `https://gallery.artron.net/works/youhua-all-0-${i}.html?upset=5`
    await getUrl(url)
    console.log(`爬取第${i}页中...`)
    i++
  }
  console.log(`爬取完成>>>>>>`)
}
run(1).then((resolve) => {
  console.log('success')
  return
})
