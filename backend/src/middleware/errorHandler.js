function errorHandler(err, req, res, next) {
    console.error(err.message)
    // Determine the exact error code and message based on the status
    let errorCode = "INTERNAL_SERVER_ERROR";
    let errorMessage = "Internal Server Error";
    // Default to 500 if status code is still 200
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    if (statusCode === 400) {
        errorCode = "VALIDATION_ERROR";
        errorMessage = err.message;
    } else if (statusCode === 403) {
        errorCode = "FORBIDDEN";
        errorMessage = err.message;
    } else if (statusCode === 404) {
        errorCode = "NOT_FOUND";
        errorMessage = err.message;
    }

    // Build the error object
    const customErrorData = {
        code: errorCode,
        message: errorMessage,
        details: err.details || {}
    };

    // Attach it directly to the response object for the logger
    res.error = customErrorData;

    // Send the unified response to the client
    return res.status(statusCode).json({ 
        success: false, 
        data: null, 
        error: customErrorData 
    });
}

module.exports = errorHandler;