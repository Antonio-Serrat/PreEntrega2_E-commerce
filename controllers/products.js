
const path = require('path');
const productModel = require('../models/product')

module.exports = {
    
    // get all produts
    get: async (req, res) => {
        try {
            const products = await productModel.getAll()
            if(!products) {
                 res.status(404).send({ error: 'Hubo un inconveniente al tratar de recuperar todos los prodcutos, trate nuevamente en unos minutos.' })
            }else {
                 res.status(200).send(products)
            }
        } catch (error) {
            res.status(500).send({
                error: 'Problema al intentar obtener todos los productos',
                description: error
            })
        }
    },
   
    // get product by id
    getById: async (req, res) => {
       try {
           const product = await productModel.getById(req.params.id)
           if(!product) {
                res.status(404).send({ error: 'El producto no existe o el id es erroeo' })
            }else {
                res.status(200).send(product)
            } 
       } catch (error) {
           res.status(500).send({
               error: 'Problema al tratar de obtener el producto',
               description: error
           })
       }
    },

    // add new product
    post: async (req, res) => {
        try {
            const { name, price, description, code, stock } = req.body;
            const createdDate = Date.now()
            const thumbnail = path.join("static/img/" + req.file.filename)
            const id = await productModel.save(name, createdDate, price + "$", description, code, stock, thumbnail);
            if(!id) {
                res.status(404).send({ error: 'El producto no existe o el id es erroeo' })
            } else{
                res.status(201).send({ success: 'Producto creado con exito', idProd: id })
            }
        } catch (error) {
            res.status(500).send({
                error: 'Problema al tratar de agregar un nuevo prodcuto',
                description: error
            })
        }
    },

    // update product by id
    put: async (req, res) => {
        try {
            const newProduct = {}
            const { name, price, description, code, stock } = req.body;
            const thumbnail = path.join("static/img/" + req.file.filename)
            newProduct.updatedDate = Date.now()
            newProduct.name = name
            newProduct.description = description
            newProduct.code = code
            newProduct.thumbnail = thumbnail
            newProduct.price = price +'$'
            newProduct.stock = stock
            await productModel.updateById(req.params.id, newProduct)
            res.status(200).send({ success: 'Producto actualizado' })

        } catch (error) {
            res.status(500).send({
                error: 'Problema al tratar de actualizar el producto',
                description: error
            })
        }
    },

    // delete product by id
    deleteProductById: async (req, res) => {
        try {
            const deleted = await productModel.deleteById(req.params.id)
            if(!deleted) {
                res.status(404).send({ error: 'No se encontro el producto' })
            } else{
                res.status(200).send({ success: 'Producto eliminado con exito' })
            }
        } catch (error) {
            res.status(500).send({
                error: 'Problema al tratar de eliminar el producto',
                description: error
            })
        }
    }
}
