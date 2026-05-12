function errorHandler(err, req, res, next) {
  console.error(err.message)
  if (res.statusCode === 404) {
    return res.json(
        { "success": false, "data": null, "error": {
            "code": err.statusCode,
            "message": err.message,
            "details": err.details || {}
        }})
  }
  res.status(500).json({ "success": false, "data": null, "error": {
            "code": "500",
            "message": "Internal Server Error",
            "details": {}
        }})
}

module.exports = errorHandler
