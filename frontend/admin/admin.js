import { API } from "../gate.js";

const ROOM_LIST = document.getElementById("room-list")
const BOOKING_LIST = document.getElementById("booking-list")
const PASSWORD_INPUT = document.getElementById("admin-password-input")
const REFRESH_BUTTON = document.getElementById("refresh-button")
const CREATE_ROOM_FORM = document.getElementById("create-room-form")

window.onload = () => {
    REFRESH_BUTTON.onclick = refresh;
    refresh();
}

async function refresh() {
    const rooms = await API.room_get({});
    const bookings = await API.admin_booking_get(PASSWORD_INPUT.value, {});
    console.log(bookings);
    ROOM_LIST.innerHTML = `
    <tr>
        <th>ID</th>
        <th>Price</th>
        <th>Tier</th>
        <th>Beds</th>
        <th>Smoking</th>
        <th>Kitchen</th>
        <th>X</th>
    </tr>
    `
    for (let room of rooms) {

        let row = document.createElement('tr');
        row.innerHTML = `
        <th>${room.id}</th>
        <th>$${room.price}</th>
        <th>${room.tier}</th>
        <th>${room.capacity}</th>
        <th><input name="smoking" type="checkbox" ${room.smoking == 1 ? "checked" : ""} disabled></th>
        <th><input name="kitchen" type="checkbox" ${room.kitchen == 1 ? "checked" : ""} disabled></th>
        `;
        let delcol = document.createElement('th')
        let button = document.createElement('button');
        delcol.appendChild(button)
        row.appendChild(delcol)
        button.innerText = "Delete"
        button.addEventListener("click", async e => {
            await delete_room(room.id)
            await refresh();
        })
        ROOM_LIST.appendChild(row);
    }
    BOOKING_LIST.innerHTML = `
    <tr>
        <th>ID</th>
        <th>First Name</th>
        <th>Last Name</th>
        <th>Address Line 1</th>
        <th>Address Line 2</th>
        <th>City</th>
        <th>State</th>
        <th>Zip-Code</th>
        <th>Phone</th>
        <th>Email</th>
        <th>Check-In</th>
        <th>Check-Out</th>
        <th>Check-In Key Hash</th>
        <th>Room ID</th>
        <th>X</th>
    </tr>
    `
    for (let booking of bookings) {

        let row = document.createElement('tr');
        row.innerHTML = `
        <th>${booking.id}</th>
        <th>${booking.f_name}</th>
        <th>${booking.l_name}</th>
        <th>${booking.address_1}</th>
        <th>${booking.address_2}</th>
        <th>${booking.city}</th>
        <th>${booking.state}</th>
        <th>${booking.zip_code}</th>
        <th>${booking.phone}</th>
        <th>${booking.email}</th>
        <th>${booking.check_in}</th>
        <th>${booking.check_out}</th>
        <th>${booking.checkin_key}</th>
        <th>${booking.room_id}</th>
        `;
        let delcol = document.createElement('th')
        let button_delete = document.createElement('button');
        delcol.appendChild(button_delete)
        row.appendChild(delcol)
        button_delete.innerText = "Delete"
        button_delete.addEventListener("click", async e => {
            await delete_booking(booking.id)
        })
        BOOKING_LIST.appendChild(row);
    }
}

async function delete_booking(id) {
    console.log(await API.admin_booking_delete(PASSWORD_INPUT.value, id));
    await refresh();
}

async function delete_room(id) {
    console.log(await API.room_delete(PASSWORD_INPUT.value, id));
    await refresh();
}

CREATE_ROOM_FORM.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(event.target);
    
    await API.room_create(PASSWORD_INPUT.value, {
        tier: data.get("tier"),
        capacity: Number(data.get("capacity")),
        price: data.get("price"),
        smoking: data.get("smoking") == "on" ? 1 : 0,
        kitchen: data.get("kitchen") == "on" ? 1 : 0,
    })
    await refresh();
})
