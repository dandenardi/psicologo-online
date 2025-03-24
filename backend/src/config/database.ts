import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error(err);
    process.exit(1); // Encerra o processo caso não consiga conectar
  }
};

export default connectDB;
