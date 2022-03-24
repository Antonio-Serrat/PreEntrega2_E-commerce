const isAdmin = true

module.exports = (req, res, next) => {
  if (isAdmin) {
    return next()
  }
  
  if (req.method === "POST" || req.method === "PUT" || req.method === "DELETE") {
    return res.status(401).send({
      error: -1,
      description: "El usuario no tiene authorizacion"
    })
  }

  next()
}