const express = require("express");
const { Pool } = require("pg");
const QRCode = require("qrcode");
const dotenv = require("dotenv");
const { auth: jwtAuth } = require("express-oauth2-jwt-bearer");


dotenv.config();
const app = express();

const jwtCheck = jwtAuth({
    audience: `${process.env.AUDIENCE}`,
    issuerBaseURL: `https://${process.env.ISSUER_BASE_URL}/`,
    tokenSigningAlg: 'RS256'
});

const pool = new Pool({
    connectionString: process.env.DB_URL,
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: 5432,
    ssl: true
});

app.use(express.json());

app.listen(8000, () => {
    console.log(`Listening on https://web2-lab1-api.onrender.com`);
})

app.post("/generate-ticket", jwtCheck, async (req, res) => {
    const { vatin, firstName, lastName } = req.body;

    if (!vatin || !firstName || !lastName) {
        return res.status(400).send({ error: "Missing required parameters: vatin, firstName, lastName" })
    }

    const ticketCount = await pool.query(
        'SELECT COUNT(*) as count FROM tickets WHERE vatin = $1',
        [vatin]
    );

    if (parseInt(ticketCount.rows[0].count) >= 3) {
        return res.status(400).send({ error: 'Maximum tickets reached for this vatin' });
    }

    await pool.query(
        'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"'
    )

    const result = await pool.query(
        'INSERT INTO tickets (uuid, vatin, "firstName", "lastName", "timeCreated") VALUES (uuid_generate_v4(), $1, $2, $3, NOW()) RETURNING uuid',
        [vatin, firstName, lastName]
    );

    const url = `https://web2-lab1-lcu4.onrender.com/ticket/${result.rows[0].uuid}`;
    const qrCodeImage = await QRCode.toDataURL(url);

    res.status(200).send({ qrCode: qrCodeImage });
})

app.get("/ticket-count", jwtCheck, async (req, res) => {
    try {
        const result = await pool.query('SELECT COUNT(*) as count FROM tickets');
        const ticketCount = result.rows[0].count;

        res.status(200).send({ count: ticketCount });
    }
    catch (error) {
        res.status(400).send({ error: error })
    }
});

app.get("/ticket/:uuid", jwtCheck, async (req, res) => {
    const { uuid } = req.params;

    const data = await pool.query(
        'SELECT vatin, "firstName", "lastName", "timeCreated" FROM tickets WHERE uuid = $1',
        [uuid]
    )

    const vatin = data.rows[0].vatin;
    const firstName = data.rows[0].firstName;
    const lastName = data.rows[0].lastName;
    const timeCreated = data.rows[0].timeCreated;

    res.status(200).send({
        vatin: vatin,
        firstName: firstName,
        lastName: lastName,
        timeCreated: timeCreated
    })
})

app.get("/token", async (req, res) => {
    try {
        const response = await fetch(`https://${process.env.ISSUER_BASE_URL}/oauth/token`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        audience: process.env.AUDIENCE,
                        grant_type: 'client_credentials'
                    }
                )
            }
        );

        const data = await response.json();

        res.status(200).send({ token: data.access_token });
    }
    catch (error) {
        res.status(400).send({ error: error })
        throw new Error("Error while fetching token");
    }
})
