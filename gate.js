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
		return await (await fetch("/search", {
		body:JSON.stringify(body)
		})).json()
	}
	async admin_get(password){
		return (await (await fetch("/admin", {
			method:"GET",
			body:JSON.stringify({
				password:password
			})
		})).json())["Success"]
	}
	async admin_update(password, id, tier = null, capacity = null, kitchen = null, smoking = null, price = null){
		body = {password:password, id:id}
		if (tier !== null)
			body.tier = tier
		if (capacity !== null)
			body.capacity = capacity
		if (kitchen !== null)
			body.kitchen = kitchen
		if (smoking !== null)
			body.smoking = smoking
		if (price !== null)
			body.price = price
		return (await (await fetch("/admin", {
			method:"PUT",
			body:JSON.stringify(body)
		})).json())["Success"]
	}
	async admin_delete(password, id){
		return (await (await fetch("/admin", {
			method:"DELETE",
			body:JSON.stringify({
				password:password,
				id:id
			})
		})).json())["Success"]
	}
	async admin_add(password, tier, capacity, kitchen, smoking, price){
		return (await (await fetch("/admin", {
			method:"POST",
			body:JSON.stringify({
				password:password,
				tier:tier,
				capacity:capacity,
				kitchen:kitchen,
				smoking:smoking,
				price:price
			})
		})).json())["Success"]
	}

}
