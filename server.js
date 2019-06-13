import url from "url"
import express from "express"
import bodyParser from "body-parser"
import Arena from "bull-arena"

import { queues, APP_JOBS } from "./lib/queues"

const app = express()

app.use(bodyParser.json())

function getRedisConfig(redisUrl) {
	const redisConfig = url.parse(redisUrl)

	return {
		host: redisConfig.hostname || "localhost",
		port: Number(redisConfig.port || 6379),
		database: (redisConfig.pathname || "/0").substr(1) || "0",
		password: redisConfig.auth ? redisConfig.auth.split(":")[1] : undefined
	}
}

app.post("/apps", async (req, res, next) => {
	const { url, payload } = req.body
	queues[APP_JOBS].add({ url, payload })

	res.sendStatus(200)
})

app.post("/example", (req, res) => {
	console.log(`Hit example with ${JSON.stringify(req.body)}`)
	return res.sendStatus(200)
})

app.use(
	"/",
	Arena(
		{
			queues: [
				{
					name: APP_JOBS,
					hostId: "Worker",
					redis: getRedisConfig(process.env.REDIS_URL)
				}
			]
		},
		{
			basePath: "/arena",
			disableListen: true
		}
	)
)

app.listen(process.env.PORT, () => {
	console.log(`Server up on ${process.env.PORT}`)
})
