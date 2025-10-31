import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;

if (!URI) {
  throw new Error("Enter mongoDbURI in the process.env.local");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connectToDb() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(URI!)
      .then((m) => m);
  }
  cached.conn = await cached.promise;

  global.mongoose = cached;
  return cached.conn;
}
