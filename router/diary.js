const router = require("koa-router")()
const db = require("../lib/mysql")

// 获取日记列表
router.get("/", async ctx => {
  // 时间筛选 date: 当天的开始时间
  let {date} = ctx.query
  if (date) {
    try {
      let res = await db.query(`select * from diarys where createTime >= "${date}"`)
      res = res[0]
      
      if (res) {
        ctx.body = {result: 1, data: res}
      } else {
        ctx.body = {result: 0, message: "当日还没有创建日记"}
      }
    }catch (err) {
      console.log(err)
      ctx.body = {result: 0, message: "当日还没有创建日记"}
    }
    // 无时间条件请求全部日记
  } else {
    let res = await db.query(`select * from diarys order by dID desc`)

    if (res[0]) {
      ctx.body = {result: 1, data: res}
    } else {
      ctx.body = {result: 0, message: "当日还没有创建日记"}
    }
  }
})

// 获取单篇日记详情
router.get("/get", async ctx => {
  let {dID} = ctx.query
  if (dID) {
    let res = await db.cSelect("*", "diarys", {dID})
    
    res = res[0]
    if (res) {
      ctx.body = {result: 1, data: res}
    } else {
      ctx.body = {result: 0, message: "文章内容异常"}
    }
  }
})

// 添加日记
router.post("/add", async ctx => {
  // 传入dID表示修改原有文章，否则表示添加新文章
  if (ctx.request.body.dID) {
    try {
      // 解析简述和封皮
      analyze(ctx)
      
      await db.cUpdate(ctx.request.body, "diarys", `dID="${ctx.request.body.dID}"`)
      ctx.body = {result: 1, message: "修改成功!"}
    } catch(err) {
      ctx.body = {result: 0, message: "修改失败!"}
      console.log(err)
    }

  } else {
    try {
      analyze(ctx)
  
      // 文章初始化时，修改时间与创建时间相同
      ctx.request.body.modifyTime = ctx.request.body.createTime
  
      await db.cInsert(ctx.request.body, "diarys")
      ctx.body = {result: 1, message: "添加成功!"}
    }catch(err) {
      ctx.body = {result: 0, message: "添加失败!"}
      
      console.log(err)
    }
  }
})

// 添加音频
router.post("/addmusic", async ctx => {

  let {dID, musicList} = ctx.request.body
  
  // bug：koa-body会拦截文件，导致我无法正常处理它
  if (!ctx.request.body.music && dID) {

    // 读取文章原来的音乐列表
    let res = await db.cSelect(["music", "has"], "diarys", {dID})
    res = res[0].music
    let has = (res[0].has && JSON.parse(res[0].has)) || {}
    has["music"] = "#2ecc71"
    has = JSON.stringify(has)

    // 如果存在音乐列表，则进行合并操作，否则新添加
    if (res && res !== "null") {
      // 合并新旧音乐列表
      let newMusicList = []
      res = Array.from(JSON.parse(res))
      musicList = Array.from(JSON.parse(musicList))

      newMusicList = JSON.stringify(res.concat(musicList))
      
      try {
        await db.cUpdate({music: newMusicList, has}, "diarys", `dID = "${dID}"`)
        ctx.body = {result: 1, message: "添加成功"}
      } catch (err) {
        ctx.body = {result: 0, message: "添加失败"}
        console.log(err)
      }
    } else {
      try {
        await db.cUpdate({music: musicList, has}, "diarys", `dID = "${dID}"`)
        ctx.body = {result: 1, message: "添加成功"}
      } catch (err) {
        ctx.body = {result: 0, message: "添加失败"}
        console.log(err)
      }
    }

    ctx.body = {result: 1, message: "添加成功"}
  } else {
    ctx.body = {result: 0, message: "添加失败"}
  }
})

module.exports = router.routes()



// 文章解析函数
function analyze (ctx) {
  let data = ctx.request.body.input
  let ctBody = ctx.request.body

  // 解析简介
  let sketch = data.match(/(?<=!{3}).+(?=!{3})/g) || null
  if (sketch) ctBody.sketch = sketch[0]

  // 解析封面图
  let cover = data.match(/(?<=!\[\]\().+(?=\))/g) || null
  if (cover) ctBody.cover = cover[0]

  // 解析文章has
  ctBody.has = {}
    // 解析 "bug"
    let bug = /bug/i
    if (bug.test(data)) ctBody.has["bug"] = "#ff4757"

    // 音乐添加不同属其它一个API，所以音乐icon的添加单独分开

    // 解析 "code"
    let code = /<pre>(.|\n)+<\/pre>/i
    if (code.test(data)) ctBody.has["code"] = "#ff7f50"

  // 转换has
  ctBody.has = JSON.stringify(ctBody.has)
}