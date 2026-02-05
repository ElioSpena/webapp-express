export default function handleError(req, res) {
  res.status(500);
  return res.json({
    error: "SERVER ERROR",
    message: "Internal server error",
  });
}
