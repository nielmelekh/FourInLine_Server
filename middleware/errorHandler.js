function errorHandler(err, req, res, next) {
  console.error(err.message)
  if (err.message === "User not found") {
    return res.status(404).json({ data: null, error: err.message })
  }
  res.status(500).json({ data: null, error: "Internal Server Error" })
}

module.exports = errorHandler