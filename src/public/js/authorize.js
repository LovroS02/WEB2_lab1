const authorizeUser = async () => {
    const uuid = document.cookie
        .split('; ')
        .find(row => row.startsWith('uuid='))
        ?.split('=')[1];

    window.location.href = `http://localhost:3000/ticket/${uuid}`;
}

authorizeUser();