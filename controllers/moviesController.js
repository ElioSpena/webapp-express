import connection from "../database/connectionDb.js";
import { DateTime } from "luxon";

//INDEX

function index(req, res, next) {
  const moviesQuery = `SELECT * FROM movies`;
  connection.query(moviesQuery, (err, results) => {
    if (err) return next(err);

    const movies = results.map((r) => {
      const date = r.created_at;
      const update = r.updateDate_at;
      const formattedDate = DateTime.fromObject(date);
      const formattedupdate = DateTime.fromObject(update);
      return {
        ...r,
        created_at: formattedDate.toLocaleString(),
        updated_at: formattedupdate.toLocaleString(),
        image: `${process.env.SERVER_URL}/images/${r.image}`,
      };
    });
    return res.json(movies);
  });
}

//SHOW

function show(req, res, next) {
  const id = req.params.id;
  const filteredQuery = `
  SELECT * 
  FROM movies 
  WHERE id = ? 
`;
  connection.query(filteredQuery, [id], (err, filteredResults) => {
    if (err) return next(err);

    const reviewsQuery = `SELECT * FROM reviews WHERE movie_id = ? `;

    connection.query(reviewsQuery, [id], (err, reviewsResults) => {
      if (err) return next(err);
      return res.json({
        movie: filteredResults[0],
        reviews: reviewsResults,
      });
    });
  });
}

export default {
  index,
  show,
};
