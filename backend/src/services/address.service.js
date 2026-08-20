import Address from "../models/Address.js";
import mongoose from "mongoose";

export const createAddress = async (userId, addressData) => {
  const {
    label,
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    isDefault,
  } = addressData;

  // If this is the first/default address,
  // remove default status from existing addresses.
  if (isDefault === true) {
    await Address.updateMany(
      {
        userId,
        isDefault: true,
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );
  }

  const address = await Address.create({
    userId,
    label,
    fullName,
    phone,
    addressLine1,
    addressLine2,
    city,
    state,
    postalCode,
    country,
    isDefault: isDefault ?? false,
  });

  return address;
};

export const getUserAddresses = async (userId) => {
  const addresses = await Address.find({
    userId,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });

  return addresses;
};

export const getAddressById = async (userId, addressId) => {
  if (!mongoose.isValidObjectId(addressId)) {
    const error = new Error("Invalid address ID");
    error.statusCode = 400;
    throw error;
  }
  
  const address = await Address.findOne({
    _id: addressId,
    userId,
  });

  if (!address) {
    const error = new Error("Address not found");
    error.statusCode = 404;
    throw error;
  }

  return address;
};