import passport from 'koa-passport';
import User from '../models/User';

export function* login() {

    const ctx = this;

    yield passport.authenticate("local", function*(err, user, info){

        if(err) {
            throw err;
        }
        if (user === false) {
            ctx.status = 400;
            ctx.body = "Invalid credentials";
        } else {
            yield ctx.login(user);
            ctx.body = user;
        }

    });

}

const exists = (field) => {

    return function*() {

        const value = this.request.query[field].trim();
        if (!value) {
            this.throw(400, "No value provided");
        }
        const doesExist = yield User
            .find({[field]: this.request.query[field]})
            .count();

        this.body = {exists: Boolean(doesExist)};
    };

};

export const nameExists = exists("name");
export const emailExists = exists("email");

export function* signup() {

    const user = yield new User(this.request.body)
        .save();

    yield this.login(user);
    this.status = 200;
    this.body = user;

}


export function* getUser() {
    const user = yield User
        .findOne()
        .where("name", this.params.name)
        .exec();

    if (!user) {
        this.throw(404, "No user found");
    }

    this.body = yield getPosts(this.request.query.page,
                               this.request.query.orderBy,
                               () =>
                               {
                                   return Post.find({ author: user._id });
                               });

}
