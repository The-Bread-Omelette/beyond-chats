import { body, param } from 'express-validator';

export const createArticleValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('url')
    .trim()
    .notEmpty()
    .withMessage('URL is required')
    .isURL()
    .withMessage('Must be a valid URL'),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Excerpt must not exceed 500 characters'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ max: 50000 })
    .withMessage('Content must not exceed 50000 characters')
];

export const updateArticleValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid article ID'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  
  body('url')
    .optional()
    .trim()
    .isURL()
    .withMessage('Must be a valid URL'),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Excerpt must not exceed 500 characters')
];

export const articleIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid article ID')
];