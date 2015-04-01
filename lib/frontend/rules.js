
export const Signup = {
    name: ['minLength:10', 'maxLength:60'],
    email: ['required', 'email'],
    password: 'minLength:6'
}


export const Login = {
    identity: {
        rule: 'required',
        message: 'You must provide an email address or username'
    },
    password: 'required'
}
