import express from "express";
import moviesController from "../controllers/moviesController.js";

const moviesRouter = express.Router();

//INDEX
moviesRouter.get("/", moviesController.index);

//SHOW
moviesRouter.get("/:slug", moviesController.show);

//STORE REVIEWS
moviesRouter.post("/:id/reviews", moviesController.storeReviews);

export default moviesRouter;
 