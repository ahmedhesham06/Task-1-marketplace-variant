import { Router } from 'express';

import {
  getAllListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  markListingAsSold
} from '../controllers/listingController.js';

const router = Router();

// GET /api/listings
router.get('/', getAllListings);

// GET /api/listings/:id
router.get('/:id', getListing);

// POST /api/listings
router.post('/', createListing);

// PATCH /api/listings/:id
router.patch('/:id', updateListing);

// DELETE /api/listings/:id
router.delete('/:id', deleteListing);

// PATCH /api/listings/:id/sold
router.patch('/:id/sold', markListingAsSold);

export default router;