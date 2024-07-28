// Easy api for crud operations on backend

async function request(method, route, body) {
	let ret = await (await fetch("/api" + route, {
		method,
		body:JSON.stringify(body),
		headers: {
			"Content-Type": "application/json",
		},
	})).json();
	return ret;
}

export const API = {
	reactive_callback: async (response)=>{},

	// BOOKINGS
	async booking_create(
		{
			f_name = undefined,
			l_name = undefined,
			address_1 = undefined,
			address_2 = undefined,
			city = undefined,
			state = undefined,
			zip_code = undefined,
			phone = undefined,
			email = undefined,
			check_in = undefined,
			check_out = undefined,
			checkin_key = undefined,
			room_id = -1
		}
	) {
		console.log({f_name, l_name, address_1, address_2, city, state, zip_code, phone, email,
			check_in, check_out, checkin_key, room_id})
		let ret = await request("POST", "/user/booking", {f_name, l_name, address_1, address_2, city, state, zip_code, phone, email,
			check_in, check_out, checkin_key, room_id})
		
		await this.reactive_callback(ret);
		
		return ret;
	},
	async admin_booking_get(
		password, {
			f_name = undefined,
			l_name = undefined,
			address_1 = undefined,
			address_2 = undefined,
			city = undefined,
			state = undefined,
			zip_code = undefined,
			phone = undefined,
			email = undefined,
			check_in = undefined,
			check_out = undefined,
			checkin_key = undefined,
			room_id = undefined
		}
	) {
		let ret = await request("PATCH", "/admin/booking", {booking:{f_name, l_name, address_1, address_2, city, state, zip_code, phone, email,
			check_in, check_out, checkin_key, room_id}, login:{password}})
		
		await this.reactive_callback(ret);
		
		return ret;
	},
	async user_booking_get(name, password) {
		let ret = await request("PATCH", "/user/booking", {name, password})
		
		await this.reactive_callback(ret);
		
		return ret;
	},
	async user_booking_delete(name, password) {
		let ret = await request("DELETE", "/user/booking", {name, password})
		
		await this.reactive_callback(ret);
		
		return ret;
	},
	async admin_booking_update(
		password, id, {
			f_name = undefined,
			l_name = undefined,
			address_1 = undefined,
			address_2 = undefined,
			city = undefined,
			state = undefined,
			zip_code = undefined,
			phone = undefined,
			email = undefined,
			check_in = undefined,
			check_out = undefined,
			checkin_key = undefined,
			room_id = undefined
		}
	) {
		let ret = await request("PUT", "/admin/booking", {booking:{id, f_name, l_name, address_1, address_2, city, state, zip_code, phone, email,
			check_in, check_out, checkin_key, room_id}, login:{password}})
		
		await this.reactive_callback(ret);
		
		return ret;
	},
	async admin_booking_delete(password, id) {
		let ret = await request("DELETE", "/admin/booking", {booking:{id}, login:{password}})
		
		await this.reactive_callback(ret);
		
		return ret;
	},
	async check_date_overlap(check_in, check_out, room_id) {
		let ret = await request("POST", "/user/booking/checkdate", {check_in, check_out, room_id})
		
		await this.reactive_callback(ret["overlap"]);
		
		return ret["overlap"];
	},

	// ROOMS

	async room_create(
		password, {
			tier = undefined,
			capacity = undefined,
			price = undefined,
			smoking = undefined,
			kitchen = undefined,
			number = undefined
		}
	) {
		let ret = await request("POST", "/admin/room", {room:{tier, capacity, price, smoking, kitchen, number}, login:{password}})
		
		await this.reactive_callback(ret);
		
		return ret;
	},
	async room_get(
		{
			id = undefined,
			tier = undefined,
			capacity = undefined,
			smoking = undefined,
			kitchen = undefined,
			price = undefined,
			number = undefined
		}
	) {
		let ret = await request("POST", "/room/search", {id, tier, capacity, price, smoking, kitchen, number})
		
		await this.reactive_callback(ret);
		
		return ret;
	},
	async room_delete(password, id) {
		let ret = await request("DELETE", "/admin/room", {room:{id}, login:{password}})
		
		await this.reactive_callback(ret);
		
		return ret;
	},
}
