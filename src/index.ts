import http from "node:http";
//import fs from "node:fs";
import {Pool} from  'pg';


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'products',
    password: 'nestor',
    port: 5432,
  });

const server = http.createServer(async (req ,res) => {
    if(req.method === "GET" && req.url === "/") {
        //zona de parseo y manejo de datos de la consulta SQL


        //let Path = "./public/songs.json"; //en lugar de la ruta hay que JSON.stringify el array de la consulta SQL
        try {
            const result = await pool.query('SELECT * FROM articles');
            const data = JSON.stringify(result.rows);
            res.writeHead(200, {
              "Content-Type": "application/json",
              "Content-Length": data.length,
            });
            res.end(data); //se esta imprimiendo un JSON con los datos de la consulta SQL
          } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end("Internal Server Error");
          }
      }

      if (req.method === "POST" && req.url === "/articles") {
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          const data = JSON.parse(body);
      
          try {
           await pool.query('INSERT INTO articles (name, brand, stock) VALUES ($1, $2, $3)', [data['name'], data['brand'], data['stock']]);
            
            res.writeHead(201);
            res.end("SE INSERTÓ CORRECTAMENTE");
          } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end("Internal Server Error");
          }
        });
      }

      if (req.method === "PUT" && req.url && req.url === "/articles"){
        let body = '';
        req.on('data', chunk => {
          body += chunk.toString();
        });
        req.on('end', async () => {
          const data = JSON.parse(body);
          const id = data.id;
      
          
          try {
            await pool.query('UPDATE articles SET name = $1, brand = $2, stock = $3 WHERE id = $4', [data['name'], data['brand'], data['stock'], id]);
            
            res.writeHead(200);
            res.end("SE ACTUALIZÓ CORRECTAMENTE");
          } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end("Internal Server Error");
          }
        });
      }

    });

      

server.listen(5500, () =>
  console.log("Servidor ejecutándose en http://localhost:5500/")
);