import express from "express";
import connection from "./database/connectionDb.js";
import handleError from "./middlewares/handleError.js";
import moviesRouter from "./routers/moviesRouter.js";

const app = express();
const port = 3000;

app.use("/movies", moviesRouter);

app.use(handleError);

app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
