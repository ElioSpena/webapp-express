import express from "express";
import moviesController from "../controllers/moviesController.js";

const moviesRouter = express.Router();

//INDEX
moviesRouter.get("/", moviesController.index);

//SHOW
moviesRouter.get("/:id", moviesController.show);

export default moviesRouter;
