import connection from "../database/connectionDb.js";

function index(req, res, next) {
  const query = `SELECT * FROM movies`;
  connection.query(query, (err, results) => {
    if (err) return next(err);
    return res.json({
      results,
    });
  });
}

function show(req, res, next) {
  next();
}

export default {
  index,
  show,
};
