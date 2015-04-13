import mongoose from 'mongoose';
import co from 'co';
import Checkit from 'checkit';

export function isUnique (model, field) {

    return co.wrap(function*(value) {
        const num = yield mongoose.model(model)
            .find({[field]: value})
            .count();
        if (num) {
            throw new Checkit.ValidationError("The " + field + " field is already in use")
        }
    });
};


