import mongoose from 'mongoose';

export default function connect() {
    const connectionString = 'mongodb://' + (process.env.DB_HOST || 'localhost') + '/' + process.env.DB_NAME;

    mongoose.connect(connectionString);
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
}


