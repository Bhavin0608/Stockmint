import { createVariant, getProductVariants, getVariantById, updateVariant, deleteVariant } from "../services/productVariant.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const variantcreate = async (req, res, next) => {
  try {
    const variant = await createVariant({productId: req.params.productId, ...req.body,});
    return new ApiResponse(201, variant, "Product variant created successfully").send(res);
  }
  catch (error) {
    next(error);
  }
};

export const variantgetAll = async (req, res, next) => {
  try {
    const variants = await getProductVariants(req.params.productId);
    return new ApiResponse(200, variants, "Product variants fetched successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const variantgetOne = async (req, res, next) => {
  try {
    const variant = await getVariantById(req.params.productId, req.params.variantId);
    return new ApiResponse(200, variant, "Product variant fetched successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const variantupdate = async (req, res, next) => {
  try {
    const variant = await updateVariant(req.params.productId, req.params.variantId, req.body);
    return new ApiResponse(200, variant, "Product variant updated successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const variantremove = async (req, res, next) => {
  try {
    const variant = await deleteVariant(req.params.productId, req.params.variantId);
    return new ApiResponse(200, variant, "Product variant deactivated successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};