function errorHandler(err, req, res, next) {
  console.error(err.message)

  if (res.statusCode === 400) {
  return res.json({
    success: false,
    data: null,
    error: {
        code: "VALIDATION_ERROR",
        message: err.message,
        details: {}
    }
  })
 }

  if (res.statusCode === 403) {
    return res.json({
        success: false,
        data: null,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to perform this action.",
          details: {}
        }
      });
  }
  if (res.statusCode === 404) {
    return res.json(
        { "success": false, "data": null, "error": {
            "code": "NOT_FOUND",
            "message": err.message,
            "details": err.details || {}
        }})
  }
  res.status(500).json({ "success": false, "data": null, "error": {
            "code": "INTERNAL_SERVER_ERROR",
            "message": "Internal Server Error",
            "details": {}
        }})
}

module.exports = errorHandler