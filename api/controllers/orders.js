const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

exports.get_all_orders = (req, res, next) => {
    Order.find()
        .select('product quantity _id')
        .populate('product', 'name price')
        .exec()
        .then(docs => {
            res.status(200).json({
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            })
        })
        .catch(err => {
            res.status(500).json({ error: err })
        });
};

exports.create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if(!product) {
                return res.status(404).json({ message: "Product not found" })
            }
            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId,
            })
            return order
                .save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Created order successfully', 
                createdOrder: {
                    product: result.product,
                    quantity: result.quantity,
                    id: result._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + result._id
                    }
                }
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
};

exports.get_single_order = (req, res, next) => {
    Order.findById(req.params.orderId)
        .select('product quantity _id')
        .exec()
        .then(doc => {
            if(!doc) {
                return res.status(404).json({ message: "Order not found" });
            }
            res.status(200).json({
                order: {
                    _id: doc._id,
                    product: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                }
            })
    })
    .catch(err => {
        res.status(500).json({ error: err })
    });
};

exports.delete_order = (req, res, next) => {
    const id = req.params.productId;
    Order.deleteOne({_id: id})
        .exec()
        .then(result => {
           res.status(200).json({
            message: 'Order deleted',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/orders/',
                body: {
                    productId: 'ID',
                    quantity: 'Number'
                }
            }
           }) ;
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err})
        })
};