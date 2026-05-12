function logger(req, res, next) {
    // We attach an event listener to the response ('res').
    // This code block won't run until the route handler calls res.json() and finishes.
    res.on('finish', () => {
        console.log("-----------------------------")
        console.log(`HTTP Method: ${req.method}`)
        console.log(`Request url: ${req.url}`)
        console.log(`Timestamp: ${new Date().toISOString()}`)
        console.log("Response status code:", res.statusCode)
        console.log("-----------------------------\n")
    })
    // We immediately call next() so the request can travel down to the routes
    next()
}

module.exports = logger