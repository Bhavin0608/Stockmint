import { createAddress, getUserAddresses, getAddressById, updateAddress, deleteAddress } from "../services/address.service.js";

export const create = async (req, res, next) => {
  try {
    const address = await createAddress(
      req.user._id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const addresses = await getUserAddresses(req.user._id);

    return res.status(200).json({
      success: true,
      data: addresses,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const address = await getAddressById(
      req.user._id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const address = await updateAddress(
      req.user._id,
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Address updated successfully",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteAddress(
      req.user._id,
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};