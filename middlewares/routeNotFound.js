export default function routeNotFound(err, req, res, next) {
  res.status(404);
  console.log(err);

  return res.json({
    error: "NOT FOUND",
    message: "Route Not Found",
  });
}
