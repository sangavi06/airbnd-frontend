// routes/place.js

const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middlewares/user');

const {
  addPlace,
  getPlaces,
  updatePlace,
  singlePlace,
  userPlaces,
  searchPlaces,
  addReview,  // Add review controller import
} = require('../controllers/placeController');

// Existing routes
router.route('/').get(getPlaces);

// Protected routes (user must be logged in)
router.route('/add-places').post(isLoggedIn, addPlace);
router.route('/user-places').get(isLoggedIn, userPlaces);
router.route('/update-place').put(isLoggedIn, updatePlace);
router.route('/add-review/:placeId').post(isLoggedIn, addReview);  // New route for adding reviews

// Not Protected routes but sequence should not be interfered with above routes
router.route('/:id').get(singlePlace);
router.route('/search/:key').get(searchPlaces);

module.exports = router;
