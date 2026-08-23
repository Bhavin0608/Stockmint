import mongoose from "mongoose";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const createProduct = async ({
  categoryId,
  name,
  slug,
  description,
  brand,
  status,
  images,
}) => {
  if (!mongoose.isValidObjectId(categoryId)) {
    const error = new Error("Invalid category ID");
    error.statusCode = 400;
    throw error;
  }

  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
  });

  if (!category) {
    const error = new Error("Active category not found");
    error.statusCode = 404;
    throw error;
  }

  const normalizedName = name.trim();
  const normalizedSlug = slug.trim().toLowerCase();

  const existingProduct = await Product.findOne({
    slug: normalizedSlug,
  });

  if (existingProduct) {
    const error = new Error("Product slug already exists");
    error.statusCode = 409;
    throw error;
  }

  const product = await Product.create({
    categoryId,
    name: normalizedName,
    slug: normalizedSlug,
    description: description?.trim() || "",
    brand: brand?.trim() || "",
    status: status || "draft",
    images: images || [],
  });

  return product;
};

export const getProducts = async ({
  page = 1,
  limit = 10,
  categoryId,
}) => {
  const parsedPage = Math.max(Number(page) || 1, 1);
  const parsedLimit = Math.min(
    Math.max(Number(limit) || 10, 1),
    100
  );

  const filter = {
    status: "active",
  };

  if (categoryId) {
    if (!mongoose.isValidObjectId(categoryId)) {
      const error = new Error("Invalid category ID");
      error.statusCode = 400;
      throw error;
    }

    filter.categoryId = categoryId;
  }

  const skip = (parsedPage - 1) * parsedLimit;

  // Use Promise.all to fetch products and total count concurrently, no data is dependent on the other, so we can fetch them in parallel to improve performance.
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate("categoryId", "name slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parsedLimit),

    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      page: parsedPage,
      limit: parsedLimit,
      total,
      totalPages: Math.ceil(total / parsedLimit),
    },
  };
};

export const getProductById = async (productId) => {
  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findOne({
    _id: productId,
    status: "active",
  }).populate("categoryId", "name slug");

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return product;
};

export const updateProduct = async (productId, updates) => {
  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const allowedFields = [
    "name",
    "slug",
    "description",
    "brand",
    "status",
  ];

  for (const field of allowedFields) {
    if (updates[field] !== undefined) {
      product[field] =
        typeof updates[field] === "string"
          ? updates[field].trim()
          : updates[field];
    }
  }

  if (updates.categoryId !== undefined) {
    if (!mongoose.isValidObjectId(updates.categoryId)) {
      const error = new Error("Invalid category ID");
      error.statusCode = 400;
      throw error;
    }

    const category = await Category.findOne({
      _id: updates.categoryId,
      isActive: true,
    });

    if (!category) {
      const error = new Error("Active category not found");
      error.statusCode = 404;
      throw error;
    }

    product.categoryId = updates.categoryId;
  }

  if (updates.slug !== undefined) {
    const existingProduct = await Product.findOne({
      slug: product.slug,
      _id: { $ne: productId },
    });

    if (existingProduct) {
      const error = new Error("Product slug already exists");
      error.statusCode = 409;
      throw error;
    }
  }

  await product.save();

  return product;
};

export const deleteProduct = async (productId) => {
  if (!mongoose.isValidObjectId(productId)) {
    const error = new Error("Invalid product ID");
    error.statusCode = 400;
    throw error;
  }

  const product = await Product.findById(productId);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  product.status = "archived";

  await product.save();

  return product;
};