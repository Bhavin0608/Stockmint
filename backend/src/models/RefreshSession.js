import mongoose from "mongoose";

const refreshSessionSchema = new mongoose.Schema(
  {
    userId: { // this is user specific refresh session, so we need to link it to the user model
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    tokenHash: {
      type: String,
      required: true,
      unique: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically remove expired refresh sessions.
// it uses the TTL(Time to live) index feature of MongoDB, which will automatically delete documents after the specified time has passed.
// here field are expiresAt and expireAfterSeconds: 0 means that the document will be removed as soon as the expiresAt time is reached. also sort in acending order of expiresAt field, so that the oldest document is removed first.
refreshSessionSchema.index({ expiresAt: 1 },{ expireAfterSeconds: 0 });

const RefreshSession = mongoose.model(
  "RefreshSession",
  refreshSessionSchema
);

export default RefreshSession;