const { prisma } = require("../prismaClient")
async function validateUserId(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: Number(req.params.id)
      }
    })
    if (!user){
      res.status(400);
      throw new Error("Invalid id parameter.", { "userId": req.params.id });
    }

    next()
  } catch (err) {
    return next(err)
  }
}

function validateUserBody(req, res, next) {
  try {
    const { firstName, lastName, username, email, password, userRole } = req.body

    if (!firstName || !lastName || !username || !email || !password || !userRole) {
      res.status(400)
      const err = new Error("Missing required fields: firstName, lastName, username, email, password, userRole.")
      err.details = { "missingFields": [] }
      if (!firstName) err.details.missingFields.push("firstName")
      if (!lastName) err.details.missingFields.push("lastName")
      if (!username) err.details.missingFields.push("username")
      if (!email) err.details.missingFields.push("email")
      if (!password) err.details.missingFields.push("password")
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