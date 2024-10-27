const express = require("express");
const path = require("path");
const { auth } = require('express-openid-connect');
const dotenv = require("dotenv");

const app = express();
dotenv.config();

app.use(express.static(path.join(__dirname, 'public')));

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.CLIENT_SECRET,
    baseURL: `https://web2-lab1-kwjq.onrender.com/`,
    clientID: process.env.CLIENT_ID,
    issuerBaseURL: `https://${process.env.ISSUER_BASE_URL}`
};

app.use(auth(config));

app.listen(port, () => {
    console.log(`Listening on https://web2-lab1-kwjq.onrender.com/`);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, "public/main.html"));
});

app.get('/create-ticket', (req, res) => {
    res.sendFile(path.join(__dirname, "public/ticket.html"));
});

app.get('/ticket/:uuid', (req, res) => {
    res.cookie("uuid", req.params.uuid, { httpOnly: false });
    if (!req.oidc.isAuthenticated()) {
        return res.oidc.login({
            returnTo: "/authorize"
        });
    }

    res.sendFile(path.join(__dirname, "public/data.html"));
});

app.get('/user', (req, res) => {
    if (!req.oidc.isAuthenticated()) {
        return res.oidc.login({
            returnTo: "/user"
        });
    }

    res.send(JSON.stringify(req.oidc.user));
});

app.get("/authorize", (req, res) => {
    res.sendFile(path.join(__dirname, "public/authorize.html"));
})
