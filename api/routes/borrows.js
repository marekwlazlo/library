const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const BorrowsControleler = require('../controllers/borrows');

router.get('/', checkAuth, BorrowsControleler.borrows_get_all);

router.get('/:borrowId', checkAuth, BorrowsControleler.borrows_get_one);

router.delete('/:borrowId', checkAuth, BorrowsControleler.borrows_delete_borrow);

router.post('/', checkAuth, BorrowsControleler.borrows_create_borrow);

module.exports = router;