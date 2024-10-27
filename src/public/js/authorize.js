const authorizeUser = async () => {
    const uuid = document.cookie
        .split('; ')
        .find(row => row.startsWith('uuid='))
        ?.split('=')[1];

    window.location.href = `https://web2-lab1-lcu4.onrender.com/ticket/${uuid}`;
}

authorizeUser();