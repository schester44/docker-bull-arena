import { APP_JOBS } from "./queues"
import axios from "axios"

export const processorInitialisers = {
	[APP_JOBS]: (job, done) => {
		axios.post(job.data.url, job.data.payload).then(() => {
			done()
		})
	}
}
