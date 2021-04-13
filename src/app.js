import Koa2 from 'koa'
import KoaBody from 'koa-body'
import KoaStatic from 'koa-static2'
import cors from 'koa2-cors'
import { System as SystemConfig } from './config'
import path from 'path'
import Routes from './routes/index'
import ErrorRoutesCatch from './middleware/ErrorRoutesCatch'
import ParseUserInfo from './middleware/ParseUserInfo'
import RequestLog from './middleware/RequestLog'
import jwt from 'koa-jwt'
import fs from 'fs'
import im from './im'
import EasySocket from './lib/EasySocket'
import imRoutes from './im/routes'
const https = require('https')

const app = new Koa2()
const env = process.env.NODE_ENV || 'development' // Current mode

const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pub'))

app.use(cors())
if (env === 'development') {
	// logger
	app.use((ctx, next) => {
		const start = new Date()
		return next().then(() => {
			const ms = new Date() - start
			console.log(
				`${ctx.ip} ${ctx.method} ${decodeURI(ctx.url)} - ${ms}ms`
			)
		})
	})
}
app.use(ErrorRoutesCatch())
	.use(KoaStatic('assets', path.resolve(__dirname, '../assets'))) // Static resource
	// ! 权限控制。
	// .use(
	// 	jwt({ secret: publicKey }).unless({
	// 		path: [/^\/public|\/auth\/login|\/resetdb|\/assets/]
	// 	})
	// )
	.use(ParseUserInfo())
if (env === 'production') {
	app.use(RequestLog())
}
app.use(
	KoaBody({
		multipart: true,
		strict: false,
		formidable: {
			uploadDir: path.join(__dirname, '../assets/uploads/tmp')
		},
		jsonLimit: '10mb',
		formLimit: '10mb',
		textLimit: '10mb'
	})
)

Object.keys(Routes).forEach(function(key) {
	app.use(Routes[key].routes()).use(Routes[key].allowedMethods())
})

// https
// 	.createServer(options, app.callback())
// 	.listen(SystemConfig.API_SERVER_PORT, () => {
// 		console.log(
// 			'Now start API server on port ' +
// 				SystemConfig.API_SERVER_PORT +
// 				'...'
// 		)
// 	})
app.listen(SystemConfig.API_SERVER_PORT)
console.log(
	'Now start API server on port ' + SystemConfig.API_SERVER_PORT + '...'
)

const imMergeRoutes = {}
Object.keys(imRoutes).forEach(function(key) {
	Object.assign(imMergeRoutes, imRoutes[key].default)
})
const easySocket = new EasySocket()
easySocket
	.connectionUse(im.connectMiddleware())
	.closeUse(im.closeMiddleware())
	//.messageUse(im.roomInfoMiddleware())
	//.messageUse(im.messageMiddleware()) //与messageRouteMiddleware为两种方案
	.messageUse(im.messageRouteMiddleware(imMergeRoutes))
	.remoteEmitUse(im.remoteEmitMiddleware())
	.listen(SystemConfig.WS_CONFIG)

easySocket.on('chat message', function(data) {
	//触发执行remoteEmit中间件(如果有)
	easySocket.emit('chat message', data)
})
easySocket.on('user login', function(data) {
	//触发执行remoteEmit中间件(如果有)
	easySocket.emit('user login', data)
})

console.log(
	'Now start WebSocket server on port ' + SystemConfig.WS_CONFIG.port + '...'
)
export default app 
