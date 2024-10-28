import { getAccessToken } from "./utils.js";

const fetchTicketData = async () => {
    const token = await getAccessToken();

    try {
        const uuid = window.location.pathname.split("/").pop();
        const response = await fetch(`https://web2-lab1-api.onrender.com/ticket/${uuid}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )
        const data = await response.json();

        const res = await fetch("https://web2-lab1-lcu4.onrender.com/user");
        const user = await res.json();

        document.getElementById('vatin').textContent = data.vatin;
        document.getElementById('first-name').textContent = data.firstName;
        document.getElementById('last-name').textContent = data.lastName;
        document.getElementById('time-created').textContent = data.timeCreated;
        document.getElementById("user").textContent = user.email;
    }
    catch (error) {
        alert("Fetching ticket data was unsuccessfull!");
    }
}

fetchTicketData();