import { createVariant, getProductVariants, getVariantById, updateVariant, deleteVariant } from "../services/productVariant.service.js";

export const variantcreate = async (req, res, next) => {
  try {
    const variant = await createVariant({
      productId: req.params.productId,
      ...req.body,
    });

    return res.status(201).json({
      success: true,
      message: "Product variant created successfully",
      data: variant,
    });
  } catch (error) {
    next(error);
  }
};

export const variantgetAll = async (req, res, next) => {
  try {
    const variants = await getProductVariants(
      req.params.productId
    );

    return res.status(200).json({
      success: true,
      data: variants,
    });
  } catch (error) {
    next(error);
  }
};

export const variantgetOne = async (req, res, next) => {
  try {
    const variant = await getVariantById(
      req.params.productId,
      req.params.variantId
    );

    return res.status(200).json({
      success: true,
      data: variant,
    });
  } catch (error) {
    next(error);
  }
};

export const variantupdate = async (req, res, next) => {
  try {
    const variant = await updateVariant(
      req.params.productId,
      req.params.variantId,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Product variant updated successfully",
      data: variant,
    });
  } catch (error) {
    next(error);
  }
};

export const variantremove = async (req, res, next) => {
  try {
    const variant = await deleteVariant(
      req.params.productId,
      req.params.variantId
    );

    return res.status(200).json({
      success: true,
      message: "Product variant deactivated successfully",
      data: variant,
    });
  } catch (error) {
    next(error);
  }
};