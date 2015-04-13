import mongoose from 'mongoose';
import Checkit from 'checkit';


export function checkit (schema, options) {
    const validator = options.validator;
    if (!validator) {
        throw new Error("rules must be defined!");
    }
    schema.pre('validate', function(next) {
        validator
            .run(this.toObject())
            .then(() => next())
            .catch((err) => {
                next(err) // returning 'next()' causes an unhandled error 
            });
    });
};



