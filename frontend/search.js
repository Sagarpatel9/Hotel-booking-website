import {API} from './gate.js'
const SEARCH_RESULTS = document.getElementById("search-results")



window.addEventListener("load", async () => {
    
    
    const urlParams = new URLSearchParams(window.location.search);
    let response = await API.room_get({
        tier: urlParams.get("tier"),
        capacity: Number(urlParams.get("capacity")),
        smoking: urlParams.get("smoking") == "on" ? 1 : 0,
        kitchen: urlParams.get("kitchen") == "on" ? 1 : 0
    });
    for (let room of response) {
        switch (room["tier"]) {
            case "basic":
                SEARCH_RESULTS.innerHTML += `
                <div class="room-listing">
        <div class="room">
            <div class="room-image-slider" id="slider${room["id"]}">
                <div class="slider">
                    <div class="slide"><img src="${["./image/basic_single_bed/1_king_bed.webp", "./image/basic_double_bed/double_bed_basic.webp"][Number(room["capacity"])-1]}" alt="Room Image 2"></div>
                    <div class="slide"><img src="${["./image/basic_single_bed/restroom_1_king_bed.webp", "./image/basic_double_bed/basic_double_bed_restroom.webp"][Number(room["capacity"])-1]}" alt="Room Image 3"></div>
                </div>
                <button class="prev" onclick="moveSlide(-1, 'slider${room["id"]}')">&#10094;</button>
                <button class="next" onclick="moveSlide(1, 'slider${room["id"]}')">&#10095;</button>
                <span class="tier-label">Basic</span>
            </div>
            <div class="room-details">
                <h3>${room["capacity"]} King Bed</h3>
                <p>Capacity: ${room["capacity"]} bed</p>
                <p>Smoking: ${["no","yes"][Number(room["smoking"])]}</p>
                <p>Kitchen: ${["no","yes"][Number(room["kitchen"])]}</p>
                <div class="dropdown">
                    <button class="dropdown-toggle" onclick="toggleDropdown(this)">Amenities and Details &#9660;</button>
                    <div class="dropdown-content">
                        <p>Free Wi-Fi</p>
                        <p>Air Conditioning</p>
                        <p>Room Service</p>
                        <p>Private Bathroom</p>
                    </div>
                </div>
    
                <div class="price">
                    <span class="price-per-night">$${room["price"]} per night</span>
                    ${await get_reserve_btn(urlParams.get("check_in"), urlParams.get("check_out"), Number(room["id"]))}
                </div>
            </div>
        </div>
    </div>
                `
                break;
            case "business":
                SEARCH_RESULTS.innerHTML += `
<div class="room-listing">
        <div class="room">
            <div class="room-image-slider" id="slider${room["id"]}">
                <div class="slider">
                    <div class="slide"><img src="${["./image/bussiness_single_bed/single_bed.webp", "./image/bussiness_double_bed/bussiness_double_bed.webp"][Number(room["capacity"])-1]}" alt="Room Image 2"></div>
                    <div class="slide"><img src="${["./image/bussiness_single_bed/restroom_bussiness.webp", "./image/bussiness_double_bed/bussiness_double_bed_restroom.webp"][Number(room["capacity"])-1]}" alt="Room Image 3"></div>
                </div>
                <button class="prev" onclick="moveSlide(-1, 'slider${room["id"]}')">&#10094;</button>
                <button class="next" onclick="moveSlide(1, 'slider${room["id"]}')">&#10095;</button>
                <span class="tier-label">Business</span>
            </div>
            <div class="room-details">
                <h3>${room["capacity"]} King Bed</h3>
                <p>Capacity: ${room["capacity"]} bed</p>
                <p>Smoking: ${["no","yes"][Number(room["smoking"])]}</p>
                <p>Kitchen: ${["no","yes"][Number(room["kitchen"])]}</p>
                <div class="dropdown">
                    <button class="dropdown-toggle" onclick="toggleDropdown(this)">Amenities and Details &#9660;</button>
                    <div class="dropdown-content">
                        <p> High speed Free Wi-Fi</p>
                        <p>Air Conditioning</p>
                        <p>Bussiness room set-up</p>
                        <p>Room Service</p>
                        <p>Private luxury Bathroom</p>
                        <p>Mini-bar</p>
                    </div>
                </div>
    
                <div class="price">
                    <span class="price-per-night">$${room["price"]} per night</span>
                    ${await get_reserve_btn(urlParams.get("check_in"), urlParams.get("check_out"), Number(room["id"]))}
                </div>
            </div>
        </div>
    </div>
                `
                break;
            case "vip":
                SEARCH_RESULTS.innerHTML += `
            <div class="room-listing">
        <div class="room">
            <div class="room-image-slider" id="slider${room["id"]}">
                <div class="slider">
                    <div class="slide"><img src="${["./image/vip_single_bed/vip_single_bed.webp", "./image/vip_double_bed/vipdouble_bed.webp"][Number(room["capacity"])-1]}" alt="Room Image 2"></div>
                    <div class="slide"><img src="${["./image/vip_single_bed/vip_restroom.webp", "./image/vip_double_bed/vip_double bed_restroom.webp"][Number(room["capacity"])-1]}" alt="Room Image 3"></div>
                </div>
                <button class="prev" onclick="moveSlide(-1, 'slider${room["id"]}')">&#10094;</button>
                <button class="next" onclick="moveSlide(1, 'slider${room["id"]}')">&#10095;</button>
                <span class="tier-label">VIP</span>
            </div>
            <div class="room-details">
                <h3>${room["capacity"]} King Bed</h3>
                <p>Capacity: ${room["capacity"]} bed</p>
                <p>Smoking: ${["no","yes"][Number(room["smoking"])]}</p>
                <p>Kitchen: ${["no","yes"][Number(room["kitchen"])]}</p>
                <div class="dropdown">
                    <button class="dropdown-toggle" onclick="toggleDropdown(this)">Amenities and Details &#9660;</button>
                    <div class="dropdown-content">
                        <p>Free Wi-Fi</p>
                        <p>Air Conditioning</p>
                        <p>Room Service</p>
                        <p>VIP Bathroom</p>
                        <p>VIP Bar</p>
                    </div>
                </div>
    
                <div class="price">
                    <span class="price-per-night">$${room["price"]} per night</span>
                    ${await get_reserve_btn(urlParams.get("check_in"), urlParams.get("check_out"), Number(room["id"]))}
                </div>
            </div>
        </div>
    </div>
                `
                break;
        }
    }
})

async function get_reserve_btn(check_in, check_out, room_id) {
    return !await API.check_date_overlap(check_in, check_out, room_id) ?
        `<button onclick="window.location='${checkout_page_url(check_in, check_out, room_id)}';" class="reserve-btn">RESERVE NOW</button>` :
        `<button class="already-reserved">Already Reserved</button>`;
}


function checkout_page_url(check_in, check_out, room_id) {
    let url = new URLSearchParams();
    url.append("check_in", check_in);
    url.append("check_out", check_out);
    url.append("room_id", room_id);
    console.log("/reservenow.html?" + url.toString());
    return "/reservenow.html?" + url.toString();
}