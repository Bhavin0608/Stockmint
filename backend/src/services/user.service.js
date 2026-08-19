import User from "../models/User.js";

export const updateUserProfile = async (userId, updates) => {
  const allowedUpdates = {};

  if (updates.name !== undefined) { // name is allowed to be updated only if it is provided in the updates object
    allowedUpdates.name = updates.name.trim();
  }
  // this will not work because this field is not in my models
  if (updates.phone !== undefined) { // phone number  is allowed 
    allowedUpdates.phone = updates.phone.trim();
  }
  // and futher we can add more fields to be updated in the future if needed.

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: allowedUpdates },
    {
      new: true, // because it return the updated document rather than the original one
      runValidators: true, // ensures that the updates adhere to the schema's validation rules
    }
  );

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
  };
};