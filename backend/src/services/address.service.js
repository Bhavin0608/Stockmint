import Address from "../models/Address.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

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
    throw new ApiError(400, "Invalid address ID");
  }

  const address = await Address.findOne({
    _id: addressId,
    userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  return address;
};

export const updateAddress = async (userId, addressId, updates) => {
  if (!mongoose.isValidObjectId(addressId)) {
    throw new ApiError(400, "Invalid address ID");
  }

  const address = await Address.findOne({
    _id: addressId,
    userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  const allowedFields = [
    "label",
    "fullName",
    "phone",
    "addressLine1",
    "addressLine2",
    "city",
    "state",
    "postalCode",
    "country",
  ];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      address[field] = updates[field];
    }
  }

  if (updates.isDefault === true) {
    await Address.updateMany(
      {
        userId,
        _id: { $ne: addressId },
        isDefault: true,
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );

    address.isDefault = true;
  }

  if (updates.isDefault === false) {
    address.isDefault = false;
  }

  await address.save();

  return address;
};

export const deleteAddress = async (userId, addressId) => {
  if (!mongoose.isValidObjectId(addressId)) {
    throw new ApiError(400, "Invalid address ID");
  }

  const address = await Address.findOne({
    _id: addressId,
    userId,
  });

  if (!address) {
    throw new ApiError(404, "Address not found");
  }

  const wasDefault = address.isDefault;

  await Address.deleteOne({
    _id: addressId,
    userId,
  });

  // If the deleted address was the default,
  // promote the newest remaining address.
  if (wasDefault) {
    const nextDefault = await Address.findOne({
      userId,
    }).sort({
      createdAt: -1,
    });

    if (nextDefault) {
      nextDefault.isDefault = true;
      await nextDefault.save();
    }
  }
};