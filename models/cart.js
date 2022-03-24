const mongoose = require('mongoose')
class Cart {
    constructor() {
        const schema = new mongoose.Schema({
            createdDate: {type: Number, default: Date.now()},
            products: Object
        })
        this.model = mongoose.model("cart", schema)
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
            if (!cart[0]) {
                return false
            } else {
                return cart.products
            }
        } catch (error) {
            return error
        }
    }

    async addProductToCart(id, product) {
        try {
            const cart = await this.model.find({_id: id})
            const cartProducts = cart.products

            const validateProd = cartProducts.find(prodct => prodct.id === product.id)
            const indexProd = cartProducts.indexOf(validateProd)
            if (validateProd) {
                let cant = 1
                validateProd.cant = cant + 1
                cartProducts.splice(indexProd, 1, validateProd)
            } else {
                cart.products.push(product)
            }
            await this.model.findOneAndUpdate(
                {_id: id },
                { $set: cart }
            )

        } catch (error) {
            return error
        }
    }

    async addProductToNewCart(product) {
        try {
            let newCart= {
                createDate: Date.now(),
                products: [product]    
            }
            await this.model.create(newCart)
        } catch (error) {
            return error
        }
    }

    async deleteProductFromCart(idC, idP) {
        try {
            const cart = await this.model.find({_id: idC})
            if (!cart) {
                return false;
            }

            const allProducts = cart.products
            const product = allProducts.find(product => product.id == idP)
            if (!product) {
                return false
            }
            if (product.cant > 1) {
                product.cant = product.cant - 1
                const index = allProducts.indexOf(product)
                allProducts.splice(index, 1, product)
            } else {
                const index = allProducts.indexOf(product)
                allProducts.splice(index, 1)
            }
            await this.model.findOneAndUpdate(
                { _id: idC },
                { $set: cart} 
            )
            return true
        } catch (error) {
            return error
        }
    }
}




module.exports = new Cart()