import Address from "../models/Address.js";

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