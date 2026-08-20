import { createAddress } from "../services/address.service.js";

export const create = async (req, res, next) => {
  try {
    const address = await createAddress(
      req.user._id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    next(error);
  }
};