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
  SELECT movies.*, CAST(AVG(reviews.vote) AS FLOAT) AS vote 
  FROM movies 
  LEFT JOIN reviews
  ON movies.id = reviews.movie_id
  WHERE movies.id = ?
  GROUP BY movies.id
`;
  connection.query(filteredQuery, [id], (err, filteredResults) => {
    if (err) return next(err);

    const movieResult = filteredResults[0];

    const reviewsQuery = `SELECT * FROM reviews WHERE movie_id = ? `;

    connection.query(reviewsQuery, [id], (err, reviewsResults) => {
      if (err) return next(err);

      const reviewsFormatted = reviewsResults.map((review) => {
        return {
          ...review,
          created_at: formatDate(review.created_at),
          updated_at: formatDate(review.updated_at),
        };
      });

      const filteredMovie = {
        ...filteredResults[0],
        created_at: formatDate(movieResult.created_at),
        updated_at: formatDate(movieResult.updated_at),
        image: createImagePath(movieResult.image),
        reviews: reviewsFormatted,
      };
      return res.json(filteredMovie);
    });
  });
}

export default {
  index,
  show,
};
