import Category from "../models/Category.js";
import mongoose from "mongoose";

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
    const error = new Error("Category already exists");
    error.statusCode = 409;
    throw error;
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
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  return category;
};

export const updateCategory = async (categoryId, updates) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
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
    const error = new Error("Category already exists");
    error.statusCode = 409;
    throw error;
  }

  await category.save();

  return category;
};

export const deleteCategory = async (categoryId) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    const error = new Error("Category not found");
    error.statusCode = 404;
    throw error;
  }

  category.isActive = false; // Mark the category as inactive instead of deleting it, soft delete

  await category.save();

  return category;
};