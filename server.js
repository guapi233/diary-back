const Koa = require("koa")
const Router = require("koa-router")
const session = require("koa-session")
const postParser = require("koa-bodyparser")
const cors = require("koa2-cors")
const static = require("koa-static")
const path = require("path")
const config = require("./config")

// init
const server = new Koa()
const router = new Router()

// machining
server.use(async (ctx, next)=>{
  
  await next()
})

// 允许跨域
server.use(cors({
  credentials: true // 允许携带cookie
}))

// session
server.keys = ["session-key", "you are a gay"]
server.use(session(config.session, server))

// post parser
server.use(postParser()) // 引入方法转变

// 静态资源托管
server.use(static(path.join(__dirname, "source")))

// router
router.use(require("./router/index"))

server.use(router.routes())
server.use(router.allowedMethods()) // 处理访问失败的请求头


server.listen(config.serverPort)
