export const getAccessToken = async () => {
    try {
        const response = await fetch("https://web2-lab1-api.onrender.com/token");

        if (response.ok) {
            const data = await response.json();

            return data.token;
        }
        else {
            return "";
        }
    }
    catch (error) {
        alert('Failed to get access token');
    }
}