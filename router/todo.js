const router = require("koa-router")()
const db = require("../lib/mysql")

router.get("/", async ctx => {
  let res = await db.cSelect("*", "todo")

  if (res[0]) {
    ctx.body = {result: 1, data: res}
  } else {
    ctx.body = {result: 0}
  }
})

router.post("/add", async ctx => {
  let res = await db.cInsert(ctx.request.body, "todo")

  if (res) {
    ctx.body = {result: 1, message: "添加成功"}
  } else {
    ctx.body = {result: 0, message: "添加失败"}
  }
})

router.post("/delete", async ctx => {
  let {tID} = ctx.request.query

  if (!tID) ctx.body = {result: 0, message: "信息异常"}

  let res = await db.cDelete("todo", `tID="${tID}"`)

  if (res) ctx.body = {result: 1, message: "已删除此项任务"}
  else ctx.body = {result: 0, message: "信息异常"}
})

router.get("/complete", async ctx => {
  let {tID, state} = ctx.request.query

  if (!tID) ctx.body = {result: 0, message: "信息异常"}

  let finishTime = new Date().getTime()
  let res = await db.cUpdate({state, finishTime}, "todo", `tID="${tID}"`)

  if (res) ctx.body = {result: 1, message: "已结束此项任务"}
  else ctx.body = {result: 0, message: "信息异常"}
})

module.exports = router.routes()