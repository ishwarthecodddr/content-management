import mongoose, { Schema, models } from "mongoose";
const LinkSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// In dev/hot-reload environments (e.g., Next.js), the file can be evaluated multiple times.
// Use the already-compiled model if it exists, otherwise compile it.
const Link = models.Link || mongoose.model("Link", LinkSchema);

export default Link;
