import Queue from "bull"

export const APP_JOBS = "APP_JOBS"

export const queues = {
	[APP_JOBS]: new Queue(APP_JOBS, process.env.REDIS_URL)
}
