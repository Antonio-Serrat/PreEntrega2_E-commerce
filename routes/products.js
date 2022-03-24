const express = require('express')
const controller = require('../controllers/products');
const { Router } = express;
const router = Router()
const upload = require('../middlewares/file');


router.get("/",controller.get)
router.get("/:id",controller.getById)
router.post("/", upload.single("thumbnail"), controller.post)
router.put("/:id", upload.single("thumbnail"), controller.put)
router.delete("/:id",controller.deleteProductById)

module.exports = router;
