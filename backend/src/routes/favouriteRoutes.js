const express = require('express');
const router = express.Router();
const favouriteController = require('../controllers/favouriteController');
const authenticate = require('../middleware/authMiddleware');

// All favourite routes require authentication
router.use(authenticate);

router.get('/', favouriteController.getFavourites);
router.post('/', favouriteController.addFavourite);
router.delete('/:propertyId', favouriteController.removeFavourite);

module.exports = router;
