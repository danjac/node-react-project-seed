import request from 'superagent';
import csrf from 'superagent-csrf';
import _ from 'lodash';
import Checkit from 'checkit';
import * as validators from './validators';


// csrf initialization
csrf(request);


const isUnique = (field, url) => {

    return (value) => {

        if (!value) {
            return false;
        }

        return new Promise((resolve, reject) => {
            request
            .get(url)
            .query({ [field]: value })
            .end((err, res) => {
                if (err) {
                  return reject(err);
                }
                if (res && res.body.exists) {
                    reject(new Checkit.ValidationError("The " + field + " field is already in use"));
                }
                resolve();
            });
        });
    };

};


const signupValidator = validators.signup(
        isUnique('name', '/api/isname'),
        isUnique('email', '/api/isemail')),
      loginValidator = validators.login();


export function signup(data) {
    return new Promise((resolve, reject) => {
        signupValidator
            .run(data)
            .then((clean) => {
                request
                    .post("/api/signup/")
                    .csrf()
                    .send(clean)
                    .end((err, res) => {
                        if (err) {
                            return reject(err);
                        }
                        if (res.badRequest) {
                            return reject(res.body);
                        }
                        resolve(res.body);
                      });
            })
            .catch(Checkit.Error, (err) => {
                return reject(err.toJSON());
            });
    });
}

export function login(data) {

    return new Promise((resolve, reject) => {
        loginValidator
            .run(data)
            .then((clean) => {
                request
                    .post('/api/login/')
                    .csrf()
                    .send(clean)
                    .end((err, res) => {
                        if (err) {
                            return reject();
                        }
                        resolve(res.body);

                    });
            })
            .catch(Checkit.Error, (err) => {
                reject(err.toJSON());
            });
    });

}

