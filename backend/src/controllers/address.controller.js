import { createAddress, getUserAddresses, getAddressById, updateAddress, deleteAddress } from "../services/address.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const create = async (req, res, next) => {
  try {
    const address = await createAddress(req.user._id, req.body);
    return new ApiResponse(201, address, "Address created successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const addresses = await getUserAddresses(req.user._id);
    return new ApiResponse(200, addresses, "Addresses retrieved successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const address = await getAddressById(req.user._id, req.params.id);
    return new ApiResponse(200, address, "Address retrieved successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const address = await updateAddress(req.user._id, req.params.id, req.body);
    return new ApiResponse(200, address, "Address updated successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    await deleteAddress(req.user._id, req.params.id);
    return new ApiResponse(200, null, "Address deleted successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};