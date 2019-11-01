const router = require("koa-router")()

router.get("/", async ctx=>{
  ctx.body = "this is index router"
})

router.use("/user", require("./user"))
router.use("/diary", require("./diary"))
router.use("/todo", require("./todo"))

module.exports = router.routes()