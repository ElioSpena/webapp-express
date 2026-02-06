export default function routeNotFound(req, res, next) {
  res.status(404);
  return res.json({
    error: "NOT FOUND",
    message: "Route not found",
  });
}
