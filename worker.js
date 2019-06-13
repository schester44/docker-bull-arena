import { queues } from "./lib/queues"
import { processorInitialisers } from "./lib/processors"

Object.entries(queues).forEach(([queueName, queue]) => {
	queue.on("completed", job => {
		console.log(`Job completed`, job.id)
	})

	console.log(`Worker up for ${queueName}`)
	queue.process(processorInitialisers[queueName])
})
