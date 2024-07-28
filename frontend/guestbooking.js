import {API} from './gate.js'

window.onload = async ()  => {
    const INFO = document.getElementById("guest-booking-info-section");
    
    const first_name = sessionStorage.getItem("first_name");
    const booking_id = sessionStorage.getItem("booking_id");
    let booking = await API.user_booking_get(first_name, booking_id);
    
    if (typeof booking.success !== 'undefined') {
        INFO.innerText = booking.msg;
    } else {
        let room = (await API.room_get({id:Number(booking.room_id)}))[0];
        INFO.innerHTML = `
        <div>
            <div>
                <h2>Room #${room.number} With ${room.capacity} Bed (${room.tier} tier)</h2>
                <h1>$${room.price}</h1>
                <h3>Booked by ${booking.f_name} ${booking.l_name}</h3>
                <h4>From ${booking.check_in} to ${booking.check_out}</h4>
                <label><input type="checkbox" disabled ${room.smoking == 1 ? "checked" : ""}> Smoking</label>
                <label><input type="checkbox" disabled ${room.kitchen == 1 ? "checked" : ""}> Kitchen</label>
            </div>
        </div>
        `
    }
}