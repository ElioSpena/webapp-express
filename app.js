import express from "express";
import connection from "./database/connectionDb.js";

const app = express();
const port = 3000;

app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
