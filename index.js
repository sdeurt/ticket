// imports
const express = require("express");
const bodyParser = require("body-parser");
const { Client } = require("pg");
require('dotenv').config();

// declarations

const app = express();
const port = 8000;
const client = new Client({
    user: process.env.DB_USERNAME,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME, 
    password: process.env.DB_PASSWORD,
    port: 5432,
});

client.connect();

// for parsing application/json
app.use(bodyParser.json());

// Add headers before the routes are defined
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

    // Request methods you wish to allow
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers you wish to allow
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", true);

    // Pass to next layer of middleware
    next();
});

// const structure = fs.readFileSync('./sql/structure.sql').toString();
// const data = fs.readFileSync('./sql/data.sql').toString();
// console.log(structure);
// client.query(data);

// routes
/*app.get('/api/ticket', (req, res) =>
{
    res.send('Hello World!')
})
*/

/**
 * Return all ticket
 */
app.get("/api/ticket", async (req, res) => {
    try {
        const data = await client.query("SELECT * FROM ticket ORDER BY id");

        res.status(200).json({
            message: "list tickets",
            data: {post :data.rows},
            status: "success",
        });
    } catch (err) {
        console.log(err.stack);
        res.status(500).json({
            message: err.stack,
            data: {post :data.rows},
            status: "fail",
        });
    }
});

/**
 * Return by id
 */
app.get("/api/ticket/:id", async (req, res) => {
    console.log(req.params);
    const id = req.params.id;

    try {
        const data = await client.query("SELECT * FROM ticket where id = $1", [id]);

        if (data.rowCount == 0) {
            res.status(404).json({
                status: "fail",
                message: "Aucun ticket trouvé avec cet ID",
                data: {post :data.rows},
            });
        } else {
            res.status(200).json({
                status: "success",
                message: "list ticket",
                data: {post :data.rows},
            });
        }

        /* res.json(data.rows);
                res.status(200).json({
                    message:'list tickets',
                    data:data.rows,
                    status:'success'
                });
                */
    } catch (err) {
        //console.log(err.stack);
        res.status(500).json({
            message: "not valid",
            data:{post :data.rows} ,
            status: "fail",
        });
    }
});

/**
 * Add  and return it
 */
app.post("/api/ticket", async (req, res) => {
    console.log(req.body);

    try {
        const message = req.body.message;

        const data = await client.query(
            "INSERT INTO ticket (message) VALUES ($1) RETURNING *", [message]
        );

        res.status(201).json({
            message: "created ticket",
            data: data.rows,
            status: "success",
        });
    } catch (err) {
        console.log(err.stack);

        res.status(400).json({
            message: "not valid",
            data:{ post: data.rows} ,
            status: "fail",
        });
    }n
});

/**
 * Delete  and return true if succesfull
 */
app.delete("/api/ticket/:id", async (req, res) => {
    console.log(req.params);
    const id = req.params.id;

    const data = await client.query(
        "DELETE FROM ticket WHERE id = $1 RETURNING *", [id]
        
    );
    console.log(data);
    if (data.rowCount === 1) {
        res.status(200).json({
            message: "deleted ticket",
            data: null,
            status: "success",
        });
    } else {
        res.status(404).json({
            message: "ticket does not exists",
            data: null,
            status: "fail",
        });
    }
});

/**
 * Update and return true if successfull
 */
app.put("/api/ticket", async (req, res) => {
    console.log(req.params);
    const id = req.body.id;
    const message = req.body.message;
    const done = req.body.done;

    const data = await client.query("UPDATE ticket SET message = $2, done = $3 WHERE id = $1 RETURNING*", [id,message, done]);
    

    if (data.rowCount === 1) {

        res.status(201).json({
            id, message, done: true,
            message: "ticket modified",
            data: null,
            status: "success",
        });
       
    } else {
        res.status(304).json({
            id, message, done: false,
            message: "ticket not modified",
            data: null,
            status: "fail",
        });
    }
});

/*app.get('/ticket/:id', function(req, res) {
    // Récupération de l'ID du ticket à partir de l'URL de la requête
    const ticketId = req.params.id;
  
    // Construction de la requête SQL pour récupérer le ticket correspondant à l'ID spécifié
    const sql = `SELECT * FROM ticket WHERE id = ${connection.escape(ticketId)}`;
  
    // Exécution de la requête SQL
    connection.query(sql, function(error, results) {
      if (error) {
        // Gestion de l'erreur
        console.error(error);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du ticket.' });
      } else {
        if (results.length > 0) {
          // Si le ticket est trouvé, nous le formattons et le renvoyons dans la réponse
          const ticket = formatTicket(results[0]);
          res.json(ticket);
        } else {
          // Si aucun ticket n'est trouvé, nous renvoyons un code d'erreur HTTP 404 Not Found
          res.status(404).json({ error: 'Aucun ticket trouvé avec cet ID.' });
        }
      }
    });
  });
  
  // Fonction pour formatter le ticket récupéré de la base de données avant de le renvoyer dans la réponse
  function formatTicket(ticketData) {
    // pour formater le ticket ici...
  }
  */

// ecoute le port 8000
app.listen(port, () => {
    console.log(`Example app listening on port http://localhost:${port}`);
});
