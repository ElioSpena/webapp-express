export default function handleError(err, req, res, next) {
  res.status(500);
  return res.json({
    error: "SERVER ERROR",
    message:
      process.env.ENVIROMENT === "dev" ? err.message : "Internal Server Error",
  });
}
