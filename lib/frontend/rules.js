
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


export const NewPost = {
    title: ['minLength:6', 'maxLength:100'],
    url: [
        'required', 
        {
            rule: 'url',
            message: 'Please provide a valid URL'
        }
    ]
}



