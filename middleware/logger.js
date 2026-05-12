function logger(req, res) {
    console.log(`HTTP Method: ${req.method}`)
    console.log(`Request url: ${req.url}`)
    console.log(`Timestamp: ${new Date().toISOString()}`)
    console.log("Response status code:", res.statusCode)
    console.log("Response body:", res.body)
}