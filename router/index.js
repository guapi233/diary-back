const router = require("koa-router")()

router.get("/", async ctx=>{
  ctx.body = "hahah"
})

router.use("/user", require("./user"))

module.exports = router.routes()