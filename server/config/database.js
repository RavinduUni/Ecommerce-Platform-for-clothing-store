import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Database connection logic
        mongoose.connection.on('connected', () => {
            console.log('Database connected successfully');
        });

        let mongodbURI = process.env.MONGODB_URI;
        const projectName = 'software Security project'; 

        if (!mongodbURI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        if (mongodbURI.endsWith('/')) {
            mongodbURI = mongodbURI.slice(0, -1);
        }

        await mongoose.connect(`${mongodbURI}/${encodeURIComponent(projectName)}`);
    } catch (error) {
        console.error('Database connection failed:', error);
    }
}

export default connectDB;