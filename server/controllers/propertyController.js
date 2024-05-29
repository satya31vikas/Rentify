import Property from '../models/propertyModel.js';
import User from '../models/userModel.js';
import AsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import { deleteFile } from '../utils/imageUpload.js';

const generateToken = (id) => {
    const token = jwt.sign({id},process.env.JWT_SECRET);
    return token;
}

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
export const getProperties = AsyncHandler(async (req, res) => {
    const properties = await Property.find({});
    res.json(properties);
});


// @desc    post a property
// @route   POST /api/properties/create
// @access  Private
export const createProperty = AsyncHandler(async (req, res) => {
    const sellerEmail = req.user.email;
    const sellerPhone = req.user.phoneNumber;
    const { price, bhk, area, location, city, nearbyFacilities } = req.body;

    if(!price || !bhk || !area || !location || !city) {
        res.status(400);
        throw new Error('Please provide all necessary details');
    }

    const newProperty = await Property.create({
        sellerEmail, sellerPhone, 
        price, bhk, area, location, city,
        image: '', likes: 0,
        nearbyFacilities: nearbyFacilities ? nearbyFacilities : []
    });
    res.json(newProperty);
});

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private
export const updateProperty = AsyncHandler(async (req, res) => {
    const propertyId = req.params.id;

    const property = await Property.findById(propertyId);
    
    if(property.sellerEmail !== req.user.email) {
        res.status(401);
        throw new Error('You are not authorized to update this property');
    }

    const {price, bhk, area, location, city, nearbyFacilities } = req.body;

    if(!price || !bhk || !area || !location || !city) {
        res.status(400);
        throw new Error('Please provide all the details');
    }

    const updatedProperty = await Property.findByIdAndUpdate(propertyId, {
        price, bhk, area, location, city,
        nearbyFacilities: nearbyFacilities ? nearbyFacilities : []
    }, { new: true });

    res.json(updatedProperty);
});

// @desc    Upload property image
// @route   PUT /api/properties/uploadimage/:id
// @access  Private
export const uploadImage = AsyncHandler(async (req, res) => {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if(property.sellerEmail !== req.user.email) {
        res.status(401);
        throw new Error('You are not authorized to update this property');
    }

    if(!req.file) {
        res.status(400);
        throw new Error('No file uploaded');
    }

    const uploadedUrl = req.file.path;
    await deleteFile(property.image);
    const updatedProperty = await Property.findByIdAndUpdate(propertyId, {image: uploadedUrl}, { new: true });

    res.json(updatedProperty);
});

// @desc like a property
// @route PUT /api/properties/like/:id
// @access Private
export const likeProperty = AsyncHandler(async (req, res) => {
    const propertyId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);
    const liked = user.likedProperties;
    liked.push(propertyId);

    const updateUser = await User.findByIdAndUpdate(userId, {
        likedProperties:liked,
    }, {new: true});

    await Property.findByIdAndUpdate(propertyId, {likes: property.likes + 1});

    res.status(200).json({
        token: generateToken(userId),
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        email: updateUser.email,
        phoneNumber: updateUser.phoneNumber,
        profilePicture: updateUser.profilePicture,
        likedProperties: updateUser.likedProperties
    });
});

// @desc like a property
// @route PUT /api/properties/dislike/:id
// @access Private
export const dislikeProperty = AsyncHandler(async (req, res) => {
    const propertyId = req.params.id;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const property = await Property.findById(propertyId);
    const liked = user.likedProperties;
    const newLiked = liked.filter(id => id != propertyId);

    const updateUser = await User.findByIdAndUpdate(userId, {
        likedProperties: newLiked,
    }, {new: true});

    let prevLikes = property.likes;
    if(prevLikes === 0) {
        await Property.findByIdAndUpdate(propertyId, {likes: prevLikes});
    }else{
        await Property.findByIdAndUpdate(propertyId, {likes: prevLikes - 1});
    }

    res.status(200).json({
        token: generateToken(userId),
        firstName: updateUser.firstName,
        lastName: updateUser.lastName,
        email: updateUser.email,
        phoneNumber: updateUser.phoneNumber,
        profilePicture: updateUser.profilePicture,
        likedProperties: updateUser.likedProperties
    });
});

// @desc delete a property
// @route DELETE /api/properties/:id
// @access Private
export const deleteProperty = AsyncHandler(async (req, res) => {
    const propertyId = req.params.id;
    const property = await Property.findById(propertyId);

    if(property.sellerEmail !== req.user.email) {
        res.status(400);
        throw new Error('You are not authorized to delete this property');
    }

    await Property.findByIdAndDelete(propertyId);
    await deleteFile(property.image);
    res.json({message: 'Property deleted successfully'});
});