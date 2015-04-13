import Checkit from 'checkit';

export function signup(nameExists, emailExists) {
    return new Checkit({
        name: ['minLength:10', 'maxLength:60', nameExists],
        email: ['required', 'email', emailExists],
        password: 'minLength:6'
    });
}

export function login() {
    return new Checkit({
        identity: {
            rule: 'required',
            message: 'You must provide an email address or username'
        },
        password: 'required'
    });
}
