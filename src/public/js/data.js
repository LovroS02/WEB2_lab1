import { getAccessToken } from "./utils.js";

const fetchTicketData = async () => {
    const token = await getAccessToken();

    try {
        const uuid = window.location.pathname.split("/").pop();
        const response = await fetch(`http://localhost:8000/ticket/${uuid}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )
        const data = await response.json();

        const res = await fetch("http://localhost:3000/user");
        const user = await res.json();
        console.log(user)

        document.getElementById('vatin').textContent = data.vatin;
        document.getElementById('first-name').textContent = data.firstName;
        document.getElementById('last-name').textContent = data.lastName;
        document.getElementById('time-created').textContent = data.timeCreated;
        document.getElementById("user").textContent = user.email;
    }
    catch (error) {
        console.log(error);
        alert("Fetching ticket data was unsuccessfull!");
    }
}

fetchTicketData();