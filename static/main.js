import { API } from "./gate.js";

const SEARCH_TIER = document.getElementById("search-tier");
const SEARCH_CAPACITY = document.getElementById("search-capacity");
const SEARCH_KITCHEN = document.getElementById("search-kitchen");
const SEARCH_SMOKING = document.getElementById("search-smoking");
const SEARCH_RESULTS = document.getElementById("search-results");

var CURRENT_SEARCH = {}

SEARCH_TIER.addEventListener("change", async (event) => {
    CURRENT_SEARCH.tier = event.currentTarget.value
    await API.search(CURRENT_SEARCH)
})
SEARCH_CAPACITY.addEventListener("change", async (event) => {
    CURRENT_SEARCH.capacity = Number.parseInt(event.currentTarget.value)
    await API.search(CURRENT_SEARCH)
})
SEARCH_KITCHEN.addEventListener("click", async (event) => {
    CURRENT_SEARCH.kitchen = event.currentTarget.checked ? true : false
    await API.search(CURRENT_SEARCH)
})
SEARCH_SMOKING.addEventListener("click", async (event) => {
    CURRENT_SEARCH.smoking = event.currentTarget.checked ? true : false
    await API.search(CURRENT_SEARCH)
})

API.reactive_callback = async (ret) => {
    SEARCH_RESULTS.innerHTML = "";
    for (let room of ret) {
        console.log(room)
        let root = document.createElement("div")
        root.className = "search-result-root"
            let image = document.createElement("img")
            image.className = "search-result-image"
            image.src = `./images/${room.tier}_tier.jpg`
            root.appendChild(image)
            let tier = document.createElement("div")
            tier.innerText = room.tier
            tier.className = "search-result-tier"
            root.appendChild(tier)
            let capacity = document.createElement("div")
            capacity.innerText = "👤".repeat(room.capacity)
            capacity.className = "search-result-capacity"
            root.appendChild(capacity)
            let kitchen = document.createElement("div")
            kitchen.innerText = room.kitchen ? "With Kitchen 🍳" : "No Kitchen"
            kitchen.className = "search-result-kitchen"
            root.appendChild(kitchen)
            let smoking = document.createElement("div")
            smoking.innerText = room.smoking ? "Smoking 🚬" : "No Smoking 🚭"
            smoking.className = "search-result-smoking"
            root.appendChild(smoking)
            let price = document.createElement("div")
            price.innerText = `Price $${room.price} 💵`
            price.className = "search-result-price"
            root.appendChild(price)
            let book_button = document.createElement("input")
            book_button.type = "button"
            book_button.value = "Book Room"
            book_button.id = `book-${room.id}`
            book_button.className = "search-result-book-button"
            root.appendChild(book_button)
            let view_button = document.createElement("input")
            view_button.type = "button"
            view_button.value = "More Info"
            view_button.id = `view-${room.id}`
            view_button.className = "search-result-view-button"
            root.appendChild(view_button)
        SEARCH_RESULTS.appendChild(root)
    }
}

async function load() {
    await API.search({});
    console.log("loaded")
    SEARCH_TIER.value = ""
    SEARCH_CAPACITY.value = ""
    SEARCH_KITCHEN.checked = true
    SEARCH_SMOKING.checked = false
}

load()
