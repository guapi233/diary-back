const router = require("koa-router")()
const db = require("../lib/mysql")

router.get("/", async ctx=>{
  ctx.body = "hello, i'm user log page"
})

router.post("/login", async ctx=>{
  let {user, password} = ctx.request.body
  
  let res = await db.cSelect(["uID", "user", "password"], "users", {user, password})

  let body
  if (res != false) {
    body = {result: 1, message: "登陆成功，正在跳转..."}
  } else {
    body = {result: 0, message: "账号或密码错误"}
  }

  ctx.body = body
})

module.exports = router.routes()