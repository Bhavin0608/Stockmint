import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductVariant",
      required: true,
      index: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["active", "converted", "released", "expired"],
      default: "active",
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reservation = mongoose.model(
  "Reservation",
  reservationSchema
);

export default Reservation;