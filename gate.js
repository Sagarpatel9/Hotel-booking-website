// Easy api for crud operations on backend
export const API = {
	async search(tier = null, capacity = null, kitchen = null, smoking = null) {
		body = {}
		if (tier !== null)
			body.tier = tier
		if (capacity !== null)
			body.capacity = capacity
		if (kitchen !== null)
			body.kitchen = kitchen
		if (smoking !== null)
			body.smoking = smoking
		await fetch("/search", {
		body:JSON.stringify(body)
		})
	}
}
