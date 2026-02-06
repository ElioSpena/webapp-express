export default function routeNotFound(err, req, res, next) {
  res.status(404);
  return res.json({
    error: "NOT FOUND",
    message: "Route Not Found",
  });
}
