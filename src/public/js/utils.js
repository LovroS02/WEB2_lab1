export const getAccessToken = async () => {
    try {
        const response = await fetch("http://localhost:8000/token");

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