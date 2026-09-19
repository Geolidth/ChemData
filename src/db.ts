import mongoose from "mongoose";

const uri = "mongodb+srv://myyouz74:chemdata@chemdata.khyr995.mongodb.net/?appName=ChemData";

export async function connectDB() :Promise<void> {
  try {
    await mongoose.connect(uri);
    console.log("MongoDB kapcsolódás sikeres!");
  } catch (error) {
    console.error("Hiba történt a MongoDB kapcsolódás során:", error);
    throw error;
  }
}