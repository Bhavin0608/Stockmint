import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from "../services/category.service.js";

export const create = async (req, res, next) => {
  try {
    const category = await createCategory(req.body);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const categories = await getCategories();

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const category = await getCategoryById(req.params.id);

    return res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const category = await updateCategory(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const category = await deleteCategory(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Category deactivated successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};