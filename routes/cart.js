const express = require('express');
const { Router } = express;
const router = Router()
const controller = require('../controllers/cart')


router.post("/", controller.post)
router.get("/:id/productos",controller.getProducts)
router.post("/:id/productos/:id_prod", controller.postProductToExistCart)
router.post("/:id/productos", controller.postProductToNewCart)
router.delete("/:id/productos/:id_prod",controller.deleteProductFromCart)
router.delete("/:id",controller.delete)


module.exports = router;
