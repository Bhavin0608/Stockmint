import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from "../services/product.service.js";

export const create = async (req, res, next) => {
  try {
    const product = await createProduct(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
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

    const result = await getProducts({
      page,
      limit,
      categoryId,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const product = await updateProduct(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const product = await deleteProduct(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product archived successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};