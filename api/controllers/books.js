const mongoose = require('mongoose');

const Book = require('../models/book')

exports.books_get_all = (req, res, next) => {
    Book.find()
    .select('name author _id bookImage')
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            books: docs.map(doc => {
                return{
                    name: doc.name,
                    author: doc.author,
                    bookImage: doc.bookImage,
                    _id: doc._id,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/books/' + doc._id 
                    }
                }
            })
        };
        // if(docs.length >= 0){
            res.status(200).json(response);
        // } else{
        //     res.status(404).json({
        //         message: 'Brak danych'
        //     });
        // }
        
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.books_add_book = (req, res, next) => {
    
    const book = new Book({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        author: req.body.author,
        bookImage: req.file.path
    });
    book
    .save()
    .then(result => {
        console.log(result);
        res.status(201).json({
            message: 'Stworzno rekord ksiazki',
            createdBook: {
                name: result.name,
                author: result.author,
                _id: result._id,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/books/' + result._id
                }
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
    
}

exports.books_patch_book = (req, res, next) => {
    const id = req.params.bookId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Book.update({_id: id}, { $set: updateOps })
    .exec()
    .then(result => {
        res.status(200).json({
            message: 'Ksiazka zaktualizowana',
            request: {
                type: 'GET',
                url: 'http://localhost:3000/books/' + id
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
}

exports.books_delete_book = (req, res, next) => {
    const id = req.params.bookId;
    Book.remove({_id: id})
    .exec()
    .then(result =>{
        res.status(200).json({
            message: 'Produkt usuniety',
            request: {
                type: 'POST',
                url: 'http://localhost:3000/books',
                body: {name: 'String', author: 'Number'}
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

exports.books_get_one = (req, res, next) => {
    const id = req.params.bookId;
    Book.findById(id)
    .select('name author _id bookImage')
    .exec()
    .then(doc =>{
        console.log("z bazy danych", doc);
        if(doc){
            res.status(200).json({
                book: doc,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/books/' + doc._id
                }
            });
        } else{
            res.status(404).json({message: 'Nie znaleziono nic powiazanego z podanym ID'});
        }
        
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    });
    
}