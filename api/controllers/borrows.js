const mongoose = require('mongoose');
const Borrow = require('../models/borrow');
const Book = require('../models/book');


exports.borrows_get_all =  (req, res, next) => {
    Borrow.find()
    .select('book quantity _id')
    .populate('book', 'name')
    .exec()
    .then(docs =>{
        res.status(200).json({
            count: docs.length,
            borrows: docs.map(doc =>{
                return {
                    _id: doc._id,
                    book: doc.book,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/borrows/' + doc._id
                    }
                }
            })
            
        });
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
}

exports.borrows_create_borrow = (req, res, next) => {
    Book.findById(req.body.bookId)
    .then(book =>{
        if(!book){
            return res.status(404).json({
                message: "Ksiazka nie znaleziona"
            });
        }
        const borrow = new Borrow({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            book: req.body.bookId
    
        });
        return borrow
        .save()
        
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Wypozyczenie zapisane',
            createdBorrow: {
                _id: result._id,
                book: result.book, 
                quantity: result.quantity
            },
            request: {
                type: 'GET',
                url: 'http://localhost:3000/borrows' + result._id
            }
        });
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
}

exports.borrows_get_one = (req, res, next) => {
    Borrow.findById(req.params.borrowId)
    .populate('book')
    .exec()
    .then(borrow =>{
        if(!borrow){
            return res.status(404).json({
                message: 'Wypozyczenie nie znalezione'
            });
        }
        res.status(200).json({
            borrow: borrow,
            request: {
                type: 'GET',
                url: 'http://localhost:3000/borrows'
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
}

exports.borrows_delete_borrow = (req, res, next) => {
    Borrow.remove({ _id: req.params.borrowId})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Wypozyczenie usuniete',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/borrows',
                body: { bookId: 'ID', quantity: 'Number' }
            }
        });
    })
    .catch(err =>{
        res.status(500).json({
            error: err
        });
    });
}