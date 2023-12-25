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
        //zona de parseo de la consulta SQL


        //let Path = "./public/songs.json"; //en lugar de la ruta hay que JSON.stringify el array de la consulta SQL
        try {
            const result = await pool.query('SELECT * FROM articles');
            const data = JSON.stringify(result.rows);
            res.writeHead(200, {
              "Content-Type": "application/json",
              "Content-Length": data.length,
            });
            res.end(data);
          } catch (err) {
            console.error(err);
            res.writeHead(500);
            res.end("Internal Server Error");
          }

        //termina zona de parseo de la consulta SQL

        //luego de haber parseado, hay que hacer un res.end con el JSON.stringify del array de la consulta SQL
        //fs.readFile(Path, (err, data) => {
        //if (err) {
        //console.error(err);
        //res.writeHead(500);
        //res.end("Internal Server Error");
        //} else {
        //res.writeHead(200, {
          //"Content-Type": "application/json",
          //"Content-Length": data.length,
        // });
        //res.end(data);
      }
    });
    //return;
    //}
//});  

server.listen(5500, () =>
  console.log("Servidor ejecutándose en http://localhost:5500/")
);