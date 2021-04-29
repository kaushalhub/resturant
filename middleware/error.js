const ErrorResponse = require("../utilis/errorResponse");

const errorHandler = (err, req, res, next) => {

    let error = { ...err }

    error.message = err.message
    // Log for console to dev
    console.log(err);

    // Mongodb bad objectID error
    if(err.name === 'CastError') {
        const message = `Hotel not found of this id ${err.value}`; 
        error = new ErrorResponse(message, 404)
    }

    // Mongoose duplicate key
    if(err.code === 11000) {
        const message = 'Duplicate field entered!'
        error = new ErrorResponse(message, 400)
    }

    // mongoose validation error
    if(err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message)
        error = new ErrorResponse(message, 400)
    }

    // mongoose objectId formate
    if(err.name === 'ObjectId'.length >= 15) {
        const message = 'UnFormated ObjectId'
        error = new ErrorResponse(message, 404);
    }

    res.status(error.statusCode || 500).json({ success : false , error : error.message || 'Server Error' })
};

module.exports = errorHandler;