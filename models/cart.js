const mongoose = require('mongoose')
const productModel = require('./product')
class Cart {
    constructor() {
        const schema = new mongoose.Schema({
            createdDate: {type: Number, default: Date.now()},
            products: Array     
        })
        this.model = mongoose.model("carts", schema)
    }

    async save() {
        let carrito = {
            createDate: Date.now(),
            products: []
        }
        try {
            const cart = await this.model.create(carrito)
            return cart.id;
        } catch (error) {
            return error;
        }
    }

    async deleteCartById(id) {
        try {
            const cart = await this.model.find({_id: id})
            if (cart[0]) {
                await this.model.deleteOne({_id: id})
                return true
            } else {
                return false
            }

        } catch (error) {
            return error
        }
    }

    async getProductsFromCart(id) {
        try {
            const cart = await this.model.find({_id: id})
            console.log(cart)
            if (!cart[0]) {
                return false
            } else {
                return cart
            }
        } catch (error) {
            return error
        }
    }

    async addProductToCart(id, prodId) {
        try {
            const product = await productModel.getById(req.params.idProd)
            if(!product){
                return false;
            }
            const cart = await this.model.find({_id: id})
            const cartProducts = cart[0].products
            const validateProd = cartProducts.find(prodct => prodct.productId === prodId)
            const indexProd = cartProducts.indexOf(validateProd)
            if (validateProd) {
                validateProd.cantidad += 1
                cartProducts.splice(indexProd, 1, validateProd)
            } else {
                cartProducts.push({productId: prodId, cantidad: 1})
            }
            console.log(cart[0])
            await this.model.findOneAndUpdate(
                { _id: id },
                { $set: cart[0] }
            )
            return true;

        } catch (error) {
            console.log(error)
            return false
        }
    }

    async addProductToNewCart() {
        try {
            const product = await productModel.getById(req.params.id)
            if(!product){
                return {error:false, added:false}
            }
            let newCart= {
                createDate: Date.now(),
                products: [{productId: product.id}]    
            }
            const cart = await this.model.create(newCart)
            return {error:false, added:true, cartId:cart.id}
        } catch (error) {
            console.log(error)
            return {error:true}
        }
    }

    async deleteProductFromCart(idC, idP) {
        try {
            const cart= await this.model.find({_id: idC})
            if (!cart[0]) {
                return false;
            }

            const allProducts = cart[0].products
            const product = allProducts.find(product => product.productId == idP)
            if (!product) {
                return false
            }
            if (product.cantidad > 1) {
                product.cantidad -=  1
                const index = allProducts.indexOf(product)
                allProducts.splice(index, 1, product)
            } else {
                const index = allProducts.indexOf(product)
                allProducts.splice(index, 1)
            }
            await this.model.findOneAndUpdate(
                { _id: idC },
                { $set: cart[0] } 
            )
            return true
        } catch (error) {
            return error
        }
    }
}




module.exports = new Cart()