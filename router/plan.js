const router = require("koa-router")()
const db = require("../lib/mysql")

router.get("/", async ctx => {
  let res = await db.cSelect("*", "plan", null, {orderBy: "pID desc"})

  ctx.body = {result: 1, data: res[0] || []}
})

router.post("/add", async ctx => {
  let {pID, originText} = ctx.request.body

  // 更新旧流水的结束时间
  if (pID) {
    let finishTime = new Date().getTime()
    let res = await db.cUpdate({finishTime}, "plan", `pID="${pID}"`)
  }

  let planObj = JSON.stringify(analyzePlan(originText))
  let description = getDesc(originText)
  let createTime = new Date().getTime()

  let res = await db.cInsert({originText, planObj, createTime, description}, "plan")
  
  if (res) {
    ctx.body = {result: 1, message: "创建成功"}
  } else {
    ctx.body = {result: 0, message: "创建失败"}
  }
})

module.exports = router.routes()

/**
 * @param plan 字符串:计划信息
 * @param ctx  对象：koa上下文
 */
function analyzePlan(plan) {
  let res = []

  plan = plan.split(/[，|,]\n/)

  plan = plan.map((item, index) => {
      return item.split("\n")
  })

  plan.forEach(item => {
      item.pop()
      item.shift()
  })

  for (let i = 0; i < plan.length; i++) {
      res[i] = { time: plan[i][0], Monday: plan[i][1], Tuesday: plan[i][2], Wednesday: plan[i][3], Thursday: plan[i][4], Friday: plan[i][5], Saturday: plan[i][6], Sunday: plan[i][7] }
  }

  return res
}

function getDesc (plan) {
  if (plan) return plan.match(/(?<=!{3}).+(?=!{3})/) || ""
}

// 例子
// {
//   8:00
//   吃饭
//   吃饭
//   吃饭
//   吃饭
//   },
//   {
//   10:00
//   吃饭
//   吃饭
//   吃饭
//   吃饭
// }