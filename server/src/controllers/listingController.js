import Joi from 'joi';

import { Listing } from '../models/Listing.js';

// Validation schema for creating a listing
const createListingSchema = Joi.object({
  title: Joi.string().required(),

  description: Joi.string().optional(),

  price: Joi.number().min(0).required(),

  category: Joi.string()
    .valid('textbooks', 'electronics', 'furniture', 'clothing', 'other')
    .default('other'),

  condition: Joi.string()
    .valid('new', 'like-new', 'used', 'worn')
    .default('used'),

  status: Joi.string()
    .valid('active', 'sold', 'removed')
    .default('active'),

  seller: Joi.string().optional()
});

// Validation schema for updating a listing
const updateListingSchema = Joi.object({
  title: Joi.string(),

  description: Joi.string(),

  price: Joi.number().min(0),

  category: Joi.string()
    .valid('textbooks', 'electronics', 'furniture', 'clothing', 'other'),

  condition: Joi.string()
    .valid('new', 'like-new', 'used', 'worn'),

  status: Joi.string()
    .valid('active', 'sold', 'removed'),

  seller: Joi.string()
}).min(1);


// GET /api/listings
export async function getAllListings(req, res, next) {
  try {
    const { includeRemoved } = req.query;

    const filter = {};

    // By default, don't show removed listings
    if (includeRemoved !== 'true') {
      filter.status = { $ne: 'removed' };
    }

const listings = await Listing.find(filter).populate('seller', 'name email');
    res.status(200).json(listings);
  } catch (err) {
    next(err);
  }
}


// GET /api/listings/:id
export async function getListing(req, res, next) {
  try {
const listing = await Listing.findById(req.params.id)
  .populate('seller', 'name email');
    if (!listing) {
      return res.status(404).json({
        message: 'Listing not found'
      });
    }

    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
}


// POST /api/listings
export async function createListing(req, res, next) {
  try {
    const { error, value } = createListingSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const listing = await Listing.create(value);

    res.status(201).json(listing);
  } catch (err) {
    next(err);
  }
}


// PATCH /api/listings/:id
export async function updateListing(req, res, next) {
  try {
    const { error, value } = updateListingSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        message: error.details[0].message
      });
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      value,
      {
        new: true,
        runValidators: true
      }
    );

    if (!listing) {
      return res.status(404).json({
        message: 'Listing not found'
      });
    }

    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
}


// DELETE /api/listings/:id
export async function deleteListing(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: 'Listing not found'
      });
    }

    listing.status = 'removed';

    await listing.save();

    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
}

export async function markListingAsSold(req, res, next) {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        message: 'Listing not found'
      });
    }

    listing.status = 'sold';

    await listing.save();

    res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
}