import mongoose from "mongoose";
import Product from "../models/Product.js";
import ProductVariant from "../models/ProductVariant.js";
import { ApiError } from "../utils/ApiError.js";

export const createVariant = async ({
  productId,
  sku,
  attributes,
  price,
  compareAtPrice,
}) => {
  if (!mongoose.isValidObjectId(productId)) {
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findOne({
    _id: productId,
    status: "active",
  });

  if (!product) {
    throw new ApiError(404, "Active product not found");
  }

  if (compareAtPrice !== undefined && compareAtPrice !== null && Number(compareAtPrice) < Number(price)) {
    throw new ApiError(400, "Compare-at price cannot be lower than price");
  }

  const normalizedSku = sku.trim().toUpperCase();

  const existingVariant = await ProductVariant.findOne({sku: normalizedSku,});

  if (existingVariant) {
    throw new ApiError(409, "SKU already exists");
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
    throw new ApiError(400, "Invalid product ID");
  }

  const product = await Product.findOne({_id: productId, status: "active",});

  if (!product) {
    throw new ApiError(404, "Product not found");
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
    throw new ApiError(400, "Invalid product or variant ID");
  }

  const variant = await ProductVariant.findOne({
    _id: variantId,
    productId,
    isActive: true,
  });

  if (!variant) {
    throw new ApiError(404, "Variant not found");
  }

  return variant;
};

export const updateVariant = async (
  productId,
  variantId,
  updates
) => {
  if (!mongoose.isValidObjectId(productId) || !mongoose.isValidObjectId(variantId)) {
    throw new ApiError(400, "Invalid product or variant ID");
  }

  const product = await Product.findOne({
    _id: productId,
    status: "active",
  });

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  const variant = await ProductVariant.findOne({
    _id: variantId,
    productId,
  });

  if (!variant) {
    throw new ApiError(404, "Variant not found");
  }

  if (updates.sku !== undefined) {
    const normalizedSku = updates.sku.trim().toUpperCase();

    const existingVariant = await ProductVariant.findOne({
      sku: normalizedSku,
      _id: { $ne: variantId },
    });

    if (existingVariant) {
      throw new ApiError(409, "SKU already exists");
    }

    variant.sku = normalizedSku;
  }

  if (updates.attributes !== undefined) {
    if (
        typeof updates.attributes !== "object" ||
        updates.attributes === null ||
        Array.isArray(updates.attributes)
    ) {
        throw new ApiError(400, "Invalid attributes");
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
      throw new ApiError(400, "Price cannot be negative");
    }

    variant.price = updates.price;
  }

  if (updates.compareAtPrice !== undefined) {
    if (
      updates.compareAtPrice !== null &&
      Number(updates.compareAtPrice) < 0
    ) {
      throw new ApiError(400, "Compare-at price cannot be negative");
    }

    variant.compareAtPrice = updates.compareAtPrice;
  }

  if (
    variant.compareAtPrice !== null &&
    variant.compareAtPrice !== undefined &&
    Number(variant.compareAtPrice) < Number(variant.price)
  ) {
    throw new ApiError(400, "Compare-at price cannot be lower than price");
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
    throw new ApiError(400, "Invalid product or variant ID");
  }

  const variant = await ProductVariant.findOne({
    _id: variantId,
    productId,
  });

  if (!variant) {
    throw new ApiError(404, "Variant not found");
  }

  variant.isActive = false;

  await variant.save();

  return variant;
};