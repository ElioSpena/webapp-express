import connection from "../database/connectionDb.js";

import { formatDate, createImagePath } from "../functions/utility.js";

//INDEX

function index(req, res, next) {
  const moviesQuery = `SELECT * FROM movies`;
  connection.query(moviesQuery, (err, results) => {
    if (err) return next(err);

    const movies = results.map((r) => {
      return {
        ...r,
        created_at: formatDate(r.created_at),
        updated_at: formatDate(r.updated_at),
        image: createImagePath(r.image),
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
    const result = filteredResults[0];

    const reviewsQuery = `SELECT * FROM reviews WHERE movie_id = ? `;

    connection.query(reviewsQuery, [id], (err, reviewsResults) => {
      if (err) return next(err);
      const filteredMovie = {
        ...filteredResults[0],
        created_at: formatDate(result.created_at),
        updated_at: formatDate(result.updated_at),
        image: `${process.env.SERVER_URL}/images/${result.image}`,
        reviews: reviewsResults,
      };
      return res.json(filteredMovie);
    });
  });
}

export default {
  index,
  show,
};
