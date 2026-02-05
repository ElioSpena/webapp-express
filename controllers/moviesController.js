import connection from "../database/connectionDb.js";

function index(req, res, next) {
  const moviesQuery = `SELECT * FROM movies`;
  connection.query(moviesQuery, (err, results) => {
    if (err) return next(err);
    return res.json({
      results,
    });
  });
}

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
