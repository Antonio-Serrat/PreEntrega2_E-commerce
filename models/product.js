const mongoose = require('mongoose')

class Product {
    constructor() {
        const schema = new mongoose.Schema({
            name: String,
            description: String,
            thumbnail: String,
            code: String,
            price: String,
            stock: {type: Number, default: 0},
            createdDate: {type: Number, default: Date.now()},
            updatedDate : {type: Number, default: Date.now()}
        })
        this.model = mongoose.model("products", schema)
    }

    async save(name, createdDate, price, description, code, stock, thumbnail) {
        let producto = {
            createdDate: createdDate,
            name: name,
            description: description,
            code: code,
            thumbnail: thumbnail,
            price: price,
            stock: stock,
        }
        try {
            const product = await this.model.create(producto)
            return product.id;
        } catch (error) {
            return error;
        }
    }

    async getAll() {
        try {
            const products = await this.model.find()
            return products;
        } catch (error) {
            return error
        }
    }

    async getById(id) {
        try {
            const product = await this.model.find({_id:id})
            return product[0]
        } catch (error) {
            return error
        }
    }

    async deleteById(id) {
        try {
            const product = await this.model.find({_id:id})
            if (product[0]) {
                await this.model.deleteOne({_id:id})
                return true
            }
            else{
                return false
            }
        } catch (error) {
            return error
        }
    }

    async deleteAll() {
        try {
            await this.model.deleteAll()
            return
        } catch (error) {
            return error
        }
    }

    async updateById(id, newProduct) {
        try {
            await this.model.findOneAndUpdate(
                { _id: id },
                { $set: newProduct } 
            )
            return
        } catch (error) {
            return error
        }
    }
}


module.exports = new Product();