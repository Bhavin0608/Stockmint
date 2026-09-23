import Category from "../models/Category.js";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";

export const createCategory = async ({
  name,
  slug,
  description,
}) => {
  const normalizedName = name.trim();
  const normalizedSlug = slug.trim().toLowerCase();

  const existingCategory = await Category.findOne({
    $or: [
      { name: normalizedName },
      { slug: normalizedSlug },
    ],
  });

  if (existingCategory) {
    throw new ApiError(409, "Category already exists");
  }

  const category = await Category.create({
    name: normalizedName,
    slug: normalizedSlug,
    description: description?.trim() || "",
  });

  return category;
};

export const getCategories = async () => {
  const categories = await Category.find({
    isActive: true,
  }).sort({
    name: 1,
  });

  return categories;
};

export const getCategoryById = async (categoryId) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
};

export const updateCategory = async (categoryId, updates) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  const allowedFields = [
    "name",
    "slug",
    "description",
    "isActive",
  ];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      category[field] = typeof updates[field] === "string" ? updates[field].trim() : updates[field];
    }
  }

  const duplicate = await Category.findOne({
    _id: { $ne: categoryId },
    $or: [
      { name: category.name },
      { slug: category.slug },
    ],
  });

  if (duplicate) {
    throw new ApiError(409, "Category already exists");
  }

  await category.save();

  return category;
};

export const deleteCategory = async (categoryId) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  category.isActive = false; // Mark the category as inactive instead of deleting it, soft delete

  await category.save();

  return category;
};