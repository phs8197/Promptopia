import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    console.log("MongDB is already connected");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "share_prompt",
      useNewURIParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log("MongDB connected");
  } catch (error) {
    console.log(error);
  }
};
