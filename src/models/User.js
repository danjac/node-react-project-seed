import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {checkit} from './middleware';
import {isUnique} from './validators';
import * as validators from '../../app/validators';

const Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;


const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        set: (p) => bcrypt.hashSync(p, 10)
    },
    totalScore: {
        type: Number,
        default: 0
    },
    votes: Array,
    created: {
        type: Date,
        default: Date.now
    }
});


const signupValidator = validators.signup(isUnique('User', 'name'),
                                          isUnique('User', 'email'));

userSchema.plugin(checkit, {validator: signupValidator});

userSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.statics.authenticate = function* (identity, password) {

    const user = yield this
        .findOne()
        .or([
            {name: identity},
            {email: identity}
        ])
        .exec();

    if (user && user.checkPassword(password)) {
        return user;

    }
    return null;
};

// scrub password from returned value
userSchema.set('toJSON', {
    transform: (doc, ret, options) => {
        delete ret.password;
    }
});

export default mongoose.model('User', userSchema);
