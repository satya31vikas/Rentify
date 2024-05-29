import express from 'express';
import { getProperties, createProperty, updateProperty, uploadImage, likeProperty, dislikeProperty, deleteProperty } from '../controllers/propertyController.js';
import protectRoute from '../middlewares/authHandler.js';
import parser from '../utils/imageUpload.js'

const propertyRoutes = express.Router();

propertyRoutes.route('/').get(getProperties);
propertyRoutes.route('/create').post(protectRoute, createProperty);
propertyRoutes.route('/:id').put(protectRoute, updateProperty);
propertyRoutes.route('/uploadimage/:id').put(protectRoute,parser.single('image'),uploadImage);
propertyRoutes.route('/like/:id').put(protectRoute, likeProperty);
propertyRoutes.route('/dislike/:id').put(protectRoute, dislikeProperty);
propertyRoutes.route('/:id').delete(protectRoute, deleteProperty);

export default propertyRoutes;