import slugify from "slugify";
import connection from "../database/connectionDb.js";
import { formatDate, createImagePath } from "../functions/utility.js";

//INDEX

function index(req, res, next) {
  const { search } = req.query;

  let movieQuery = `
  SELECT movies.*, CAST(AVG(reviews.vote) AS FLOAT) AS vote 
  FROM movies 
  LEFT JOIN reviews
  ON movies.id = reviews.movie_id  `;

  let params = [];

  if (search !== undefined) {
    movieQuery += ` WHERE movies.title LIKE ?  `;
    params.push(`%${search}%`);
  }

  movieQuery += ` GROUP BY movies.id`;

  connection.query(movieQuery, params, (err, results) => {
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
  const { slug } = req.params;

  const filteredQuery = `
  SELECT movies.*, CAST(AVG(reviews.vote) AS FLOAT) AS vote 
  FROM movies 
  LEFT JOIN reviews
  ON movies.id = reviews.movie_id
  WHERE movies.slug = ?
  GROUP BY movies.id
`;
  connection.query(filteredQuery, [slug], (err, filteredResults) => {
    if (err) return next(err);

    const movieResult = filteredResults[0];

    if (filteredResults.length === 0 || !movieResult.id) {
      res.status(404);
      return res.json({
        error: "NOT FOUND",
        message: "Il film non è stato trovato",
      });
    }

    const reviewsQuery = `SELECT * FROM reviews WHERE movie_id = ? `;

    connection.query(reviewsQuery, [movieResult.id], (err, reviewsResults) => {
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

//STORE REVIEWS

function storeReviews(req, res, next) {
  const { id } = req.params;
  const { name, vote, text } = req.body;

  if (
    vote < 0 ||
    vote > 5 ||
    name.length < 2 ||
    name.length > 20 ||
    text.length < 10 ||
    text.length > 500
  ) {
    res.status(400);
    return res.json({
      error: "BAD REQUEST",
      message: "richiesta non valida",
    });
  }

  const reviewQuery = `
  INSERT INTO reviews (movie_id, name, vote, text) VALUES (?, ?, ?, ?)`;

  connection.query(reviewQuery, [id, name, vote, text], (err) => {
    if (err) return next(err);
    res.status(201);
    res.json({
      message: "Recensione inviata",
    });
  });
}

//STORE MOVIES

function storeMovies(req, res, next) {
  const imageName = req.file.filename || null;
  const { title, director, genre, release_year, abstract } = req.body;
  const slug = slugify(title, {
    lower: true,
    strict: true,
  });

  const movieQuery = `INSERT INTO movies (title, director, genre, image, release_year, abstract, slug) VALUES (?, ?, ?, ?, ?, ?, ?)`;

  connection.query(
    movieQuery,
    [title, director, genre, imageName, release_year, abstract, slug],
    (err) => {
      if (err) return next(err);

      res.status(201);
      return res.json({
        message: "Film aggiunto!",
      });
    },
  );
}

export default {
  index,
  show,
  storeReviews,
  storeMovies,
};
