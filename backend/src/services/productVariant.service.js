import mongoose from "mongoose";
import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";

export const createVariant = async ({
  productId,
  sku,
  attributes,
  price,
  compareAtPrice,
}) => {
  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findOne({
    _id: productId,
    status: "active",
  });

  if (!product) {
    const error = new Error("Active product not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    compareAtPrice !== undefined &&
    compareAtPrice !== null &&
    Number(compareAtPrice) < Number(price)
  ) {
    const error = new Error(
      "Compare-at price cannot be lower than price"
    );
    error.statusCode = 400;
    throw error;
  }

  const normalizedSku = sku.trim().toUpperCase();

  const existingVariant = await ProductVariant.findOne({
    sku: normalizedSku,
  });

  if (existingVariant) {
    const error = new Error("SKU already exists");
    error.statusCode = 409;
    throw error;
  }

  const variant = await ProductVariant.create({
    productId,
    sku: normalizedSku,
    attributes: attributes || {},
    price,
    compareAtPrice:
      compareAtPrice ?? null,
  });

  return variant;
};

export const getProductVariants = async (productId) => {
  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findOne({
    _id: productId,
    status: "active",
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const variants = await ProductVariant.find({
    productId,
    isActive: true,
  }).sort({
    createdAt: 1,
  });

  return variants;
};

export const getVariantById = async (productId, variantId) => {
  if (
    !mongoose.isValidObjectId(productId) ||
    !mongoose.isValidObjectId(variantId)
  ) {
    const error = new Error("Invalid product or variant ID");
    error.statusCode = 400;
    throw error;
  }

  const variant = await ProductVariant.findOne({
    _id: variantId,
    productId,
    isActive: true,
  });

  if (!variant) {
    const error = new Error("Variant not found");
    error.statusCode = 404;
    throw error;
  }

  return variant;
};

export const updateVariant = async (
  productId,
  variantId,
  updates
) => {
  if (
    !mongoose.isValidObjectId(productId) ||
    !mongoose.isValidObjectId(variantId)
  ) {
    const error = new Error("Invalid product or variant ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findOne({
    _id: productId,
    status: "active",
  });

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const variant = await ProductVariant.findOne({
    _id: variantId,
    productId,
  });

  if (!variant) {
    const error = new Error("Variant not found");
    error.statusCode = 404;
    throw error;
  }

  if (updates.sku !== undefined) {
    const normalizedSku = updates.sku.trim().toUpperCase();

    const existingVariant = await ProductVariant.findOne({
      sku: normalizedSku,
      _id: { $ne: variantId },
    });

    if (existingVariant) {
      const error = new Error("SKU already exists");
      error.statusCode = 409;
      throw error;
    }

    variant.sku = normalizedSku;
  }

  if (updates.attributes !== undefined) {
    if (
        typeof updates.attributes !== "object" ||
        updates.attributes === null ||
        Array.isArray(updates.attributes)
    ) {
        const error = new Error("Invalid attributes");
        error.statusCode = 400;
        throw error;
    }

    for (const [key, value] of Object.entries(updates.attributes)) {
        if (value === null) {
            variant.attributes.delete(key);
        } else {
            variant.attributes.set(key, String(value));
        }
    }
  }

  if (updates.price !== undefined) {
    if (Number(updates.price) < 0) {
      const error = new Error("Price cannot be negative");
      error.statusCode = 400;
      throw error;
    }

    variant.price = updates.price;
  }

  if (updates.compareAtPrice !== undefined) {
    if (
      updates.compareAtPrice !== null &&
      Number(updates.compareAtPrice) < 0
    ) {
      const error = new Error(
        "Compare-at price cannot be negative"
      );
      error.statusCode = 400;
      throw error;
    }

    variant.compareAtPrice = updates.compareAtPrice;
  }

  if (
    variant.compareAtPrice !== null &&
    variant.compareAtPrice !== undefined &&
    Number(variant.compareAtPrice) < Number(variant.price)
  ) {
    const error = new Error(
      "Compare-at price cannot be lower than price"
    );
    error.statusCode = 400;
    throw error;
  }

  if (updates.isActive !== undefined) {
    variant.isActive = updates.isActive;
  }

  await variant.save();

  return variant;
};

export const deleteVariant = async (productId, variantId) => {
  if (
    !mongoose.isValidObjectId(productId) ||
    !mongoose.isValidObjectId(variantId)
  ) {
    const error = new Error("Invalid product or variant ID");
    error.statusCode = 400;
    throw error;
  }

  const variant = await ProductVariant.findOne({
    _id: variantId,
    productId,
  });

  if (!variant) {
    const error = new Error("Variant not found");
    error.statusCode = 404;
    throw error;
  }

  variant.isActive = false;

  await variant.save();

  return variant;
};