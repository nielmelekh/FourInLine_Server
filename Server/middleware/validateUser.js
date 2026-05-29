const users = require("../models/userData").users
function validateUserId(req, res, next) {
  try {
    const user = users.find((u) => u.userId === Number(req.params.id))
    if (!user){
      res.status(400)
      const err = new Error("Invalid id parameter.")
      err.details = { "userId": req.params.id }
      throw err
    }

    next()
  } catch (err) {
    return next(err)
  }
}

function validateUserBody(req, res, next) {
  try {
    const { firstName, lastName, userRole } = req.body

    if (!firstName || !lastName || !userRole) {
      res.status(400)
      const err = new Error("Missing required fields: firstName, lastName, userRole.")
      err.details = { "missingFields": [] }
      if (!firstName) err.details.missingFields.push("firstName")
      if (!lastName) err.details.missingFields.push("lastName")
      if (!userRole) err.details.missingFields.push("userRole")
      throw err
    }

    next()
  } catch (err) {
    return next(err)
  }
}

module.exports = {
  validateUserId,
  validateUserBody
}