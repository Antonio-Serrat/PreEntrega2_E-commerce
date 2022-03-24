
const cartModule = require('../models/cart')
const productModel = require('../models/product')

module.exports =  {

    // Create new Cart
    post: async (req, res) => {
        try {
            const id_cart = await cartModule.save()
            res.status(201).send({ succes: 'Carrito creado', id: id_cart })
        } catch (e) {
            res.status(400).send({
                error: 'Problema al intentar crear un nuevo carrito ',
                desrciption: e
            })
        }
    },

    
    // Get Products from Cart
    getProducts: async (req, res) => {
        try {
            const products = await cartModule.getProductsFromCart(req.params.id)
            !products ? res.status(404).send({ error: 'El carrito no existe o el id es erroneo' })
                : res.status(200).send(products)
        } catch (error) {
            res.status(400).send({
                error: 'Problema al intentar listar los productos el carrito ',
                desrciption: error
            })
        }
    },

    // Add a product to cart
    postProductToExistCart: async (req, res) => {
        try {
            const product = await productModel.getById(req.params.id_prod)
            console.log(product)
            !product ? res.status(404).send({ error: 'El id de producto no existe' })
                : await cartModule.addProductToCart(req.params.id, product)
                res.status(200).send({ success: 'Se agrego con exito el nuevo producto al carrito' })
        } catch (error) {
            res.status(500).send({
                error: 'Problema al intentar agregar el producto al carrito ',
                desrciption: error
            })
        }
    },
    
    // Create a cart with a product
    postProductToNewCart: async (req, res) => {
        try {
            const product = await productModel.getById(req.params.id)
            !product ? res.status(404).send({ error: 'El id de producto no existe' })
                : await cartModule.addProductToNewCart(product)
            res.status(200).send({ success: 'Se agrego con exito el nuevo producto al carrito' })
        } catch (error) {
            res.status(500).send({
                error: 'Problema al intentar agregar el producto al carrito ',
                desrciption: error
            })
        }
    },

    // Delete product from cart
    deleteProductFromCart: async (req, res) => {
        try {
            const deleted = await cartModule.deleteProductFromCart(req.params.id, req.params.id_prod)
            !deleted ? res.status(404).send({ error: 'El id del carrito o del producto no existe' })
            : res.status(200).send({ success: 'Se elimino el producto del carrito con exito' })
        } catch (error) {
            res.status(500).send({
                error: 'Problema al intentar eliminar el producto del carrito ',
                desrciption: error
            })
        }
    },
    
    // Delete Cart by ID
    delete: async (req, res) => {
        try {
            const deleted = await cartModule.deleteCartById(req.params.id)
            !deleted ? res.status(404).send({ error: 'El carrito no existe' })
                : res.status(201).send({ succes: 'Carrito eliminado' })
        } catch (e) {
            res.status(400).send({
                error: 'Problema al intentar eliminar el carrito ',
                desrciption: e
            })
        }
    }
}
