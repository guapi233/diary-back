const router = require("koa-router")()

router.get("/", async ctx=>{
  ctx.body = "this is index router"
})

router.use("/user", require("./user"))
router.use("/diary", require("./diary"))
router.use("/todo", require("./todo"))
router.use("/plan", require("./plan"))

module.exports = router.routes()