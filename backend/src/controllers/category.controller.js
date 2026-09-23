import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../services/category.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const create = async (req, res, next) => {
  try {
    const category = await createCategory(req.body);
    return new ApiResponse(201, category, "Category created successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const categories = await getCategories();
    return new ApiResponse(200, categories, "Categories retrieved successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);
    return new ApiResponse(200, category, "Category retrieved successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const category = await updateCategory(req.params.id, req.body);
    return new ApiResponse(200, category, "Category updated successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const category = await deleteCategory(req.params.id);
    return new ApiResponse(200, category, "Category deactivated successfully").send(res);
  } 
  catch (error) {
    next(error);
  }
};