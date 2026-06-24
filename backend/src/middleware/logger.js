function logger(req, res, next) {
    // We attach an event listener to the response ('res').
    // This code block won't run until the route handler calls res.json() and finishes.
    res.on('finish', () => {
        console.log("-----------------------------")
        console.log(`HTTP Method: ${req.method}`)
        console.log(`Request url: ${req.url}`)
        console.log(`Timestamp: ${new Date().toISOString()}`)
        console.log("Response status code:", res.statusCode)
        if (res.statusCode >= 400) {
            console.log("Error response body:", res.error || "No error details") // Log error details if available
        }
        console.log("-----------------------------\n")
    })
    // We immediately call next() so the request can travel down to the routes
    next()
}

module.exports = logger