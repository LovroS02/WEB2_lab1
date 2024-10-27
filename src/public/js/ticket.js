import { getAccessToken } from "./utils.js";

const generateNewTicket = async () => {
    const token = await getAccessToken();

    const vatin = document.getElementById("vatin").value;
    const firstName = document.getElementById("first-name").value;
    const lastName = document.getElementById("last-name").value;

    try {
        const response = await fetch(`https://web2-lab1-api.onrender.com/generate-ticket`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(
                    {
                        vatin: vatin,
                        firstName: firstName,
                        lastName: lastName
                    }
                )
            }
        );

        if (response.ok) {
            const data = await response.json();

            document.getElementById('qr-code').innerHTML = `<img src="${data.qrCode}" alt="QR Code">`;
        } else {
            const data = await response.json();

            alert(data.error);
        }
    }
    catch (error) {
        alert("Generating new ticket was unsuccessfull!");
    }
}

document.getElementById("generate-ticket").addEventListener("click", () => generateNewTicket());
