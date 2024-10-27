import { getAccessToken } from "./utils.js";

const fetchTicketCount = async () => {
    const token = await getAccessToken();

    try {
        const response = await fetch("http://localhost:8000/ticket-count",
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );
        const data = await response.json();

        document.getElementById('ticket-count').textContent = data.count + " tickets";
    }
    catch (error) {
        alert("Fetching number of generated tickets was unsuccessfull!");
    }
}

const createTicket = () => {
    window.location.href = "/create-ticket";
}

document.getElementById("get-tickets").addEventListener("click", () => fetchTicketCount());
document.getElementById("create-ticket").addEventListener("click", () => createTicket());