const router = require("koa-router")()
const db = require("../lib/mysql")

router.get("/", async ctx=>{
  let res
  if (ctx.session.login !== "1") {
    res = {result: 0}
  } else {
    res = {result: 1}
  }

  ctx.body = res
})

router.post("/test", async ctx => {
  ctx.body = "hahah"
})

// 登录处理
router.post("/login", async ctx=>{
  let {user, password} = ctx.request.body
  
  let res = await db.cSelect("*", "users", {user, password})

  let body
  // 添加登陆成功的状态
  
  if (res != false) {
    res[0]["login"] = 1
    ctx.session.login = "1"
    body = {result: 1, message: "登陆成功，正在跳转...", data: res[0]}
  } else {
    body = {result: 0, message: "账号或密码错误"}
  }

  ctx.body = body
})

module.exports = router.routes()