import express from 'express';
import { createCustomerReview, getCustomerReviews } from '../controllers/userReviewController.js';



const router = express.Router();


router.get('/view',getCustomerReviews)

router.post('/add',createCustomerReview)

export default router;