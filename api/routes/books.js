const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const BooksController = require('../controllers/books');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/')
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) =>{

if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null,true);
}else{
    cb(null,false)
}
};

const upload = multer({
    storage: storage, 
    limits:{
        fileSize: 1024 * 1024 * 10
    },
    fileFilter: fileFilter
});

const Book = require('../models/book');

router.get('/', BooksController.books_get_all);

router.post('/', checkAuth, upload.single('bookImage'),  BooksController.books_add_book);

router.patch('/:bookId', checkAuth, BooksController.books_patch_book);

router.delete('/:bookId', checkAuth, BooksController.books_delete_book);

router.get('/:bookId', BooksController.books_get_one);

module.exports = router;