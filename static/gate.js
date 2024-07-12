// Easy api for crud operations on backend
export const API = {
	reactive_callback: async (ret)=>{},
	async search({tier = undefined, capacity = undefined, kitchen = undefined, smoking = undefined}) {
		let body = {tier, capacity, kitchen, smoking}

		let ret = await (await fetch("/search", {
			method:"POST",
			body:JSON.stringify(body),
			headers: {
				"Content-Type": "application/json",
			},
			})).json()

		console.log("ret", ret)
		
		await this.reactive_callback(ret);
		
		return ret;
	},
	async admin_get(password) {
		return (await (await fetch("/admin", {
			method:"PUT",
			body:JSON.stringify({
				password:password
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})).json())["Success"]
	},
	async admin_update(password, id, tier = undefined, capacity = undefined, kitchen = undefined, smoking = undefined){
		let body = {password, id, tier, capacity, kitchen, smoking}

		let ret = (await (await fetch("/admin", {
				method:"PATCH",
				body:JSON.stringify(body),
				headers: {
					"Content-Type": "application/json",
				},
			})).json())["Success"]
		
		await this.search({});
		
		return ret;
	},
	async admin_delete(password, id){
		let ret =  (await (await fetch("/admin", {
			method:"DELETE",
			body:JSON.stringify({
				password:password,
				id:id
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})).json())["Success"]

		await this.search({});

		return ret;
	},
	async admin_add(password, tier, capacity, kitchen, smoking, price){
		let ret = (await (await fetch("/admin", {
			method:"POST",
			body:JSON.stringify({
				password,
				tier,
				capacity,
				kitchen,
				smoking,
				price
			}),
			headers: {
				"Content-Type": "application/json",
			},
		})).json())["Success"]

		await this.search({});

		return ret
	},
}
