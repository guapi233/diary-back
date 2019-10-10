const Koa = require("koa")
const Router = require("koa-router")
const Session = require("koa-session")
const PostParser = require("koa-bodyparser")
const Cors = require("koa2-cors")
const config = require("./config")

// init
const server = new Koa()
const router = new Router()

// machining
server.use(async (ctx, next)=>{
  
  await next()
})

// 允许跨域
server.use(Cors())

// session
server.keys = ["session-key", "you are a gay"]
server.use(Session(config.session, server))

// post parser
server.use(PostParser()) // 引入方法转变

// router
router.use(require("./router/index"))
server.use(router.routes())
server.use(router.allowedMethods()) // 处理访问失败的请求头


server.listen(config.serverPort)
