import mongoose from "mongoose";

export async function connect() {
    try {
        mongoose.connect(process.env.MONGO_URI!);
        const connection = mongoose.connection;

        connection.on('connected', () => {
            console.log('MongoDB connected successfully');
        })
        connection.on('error', (err) => {
            console.log('MongoDB connection error please make sure db is up or running:', err);
            process.exit();
        });
    } catch (error) {
        console.log('something went to wrong in connecting db');
        console.log(error);

    }
}