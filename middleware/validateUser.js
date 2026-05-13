const users = require("../models/userData").users
function validateUserId(req, res, next) {
  try {
    const user = users.find((u) => u.userId === Number(req.params.id))
    if (!user){
      res.status(400)
      throw new Error("Invalid id parameter.")
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
      throw new Error("Missing required fields: firstName, lastName, userRole.")
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