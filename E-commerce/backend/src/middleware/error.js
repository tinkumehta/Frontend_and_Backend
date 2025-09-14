const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;

    // log to console for dev
    console.log(err);
    
    // mongoose bad objectId
    if (err.name === 'CastError') {
        const message = 'Resource not found'
        error = {message, statusCode : 404}
    }
}