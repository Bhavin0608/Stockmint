import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../services/product.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const create = async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    return new ApiResponse(201, product, "Product created successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      categoryId,
    } = req.query;

    const result = await getProducts({page, limit, categoryId,});
    return new ApiResponse(200, result, "Products fetched successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    return new ApiResponse(200, product, "Product fetched successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const product = await updateProduct(req.params.id, req.body);
    return new ApiResponse(200, product, "Product updated successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const product = await deleteProduct(req.params.id);
    return new ApiResponse(200, product, "Product archived successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};