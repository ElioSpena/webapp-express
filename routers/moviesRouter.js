import express from "express";
import moviesController from "../controllers/moviesController.js";
import upload from "../middlewares/handleImageUpload.js";

const moviesRouter = express.Router();

//INDEX
moviesRouter.get("/", moviesController.index);

//SHOW
moviesRouter.get("/:slug", moviesController.show);

//STORE REVIEWS
moviesRouter.post("/:id/reviews", moviesController.storeReviews);

//STORE MOVIES
moviesRouter.post("/", upload.single("image"), moviesController.storeMovies);

export default moviesRouter;
