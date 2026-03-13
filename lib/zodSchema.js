import { z } from "zod";

const numberField = z.preprocess((val) => {
  if (typeof val === "string") {
    const parsed = Number(val);
    return isNaN(parsed) ? val : parsed;
  }
  return val;
}, z.number().nonnegative("Value must be 0 or greater"));

export const zSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(64, "Password must be less than 64 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),

  otp: z.string().regex(/^\d{6}$/, {
    message: "OTP must be a 6-digit number",
  }),

  _id: z.string().min(3, "_id is required"),

  alt: z.string().min(3, "Alt is required"),

  title: z.string().min(3, "Title is required"),

  slug: z.string().min(3, "Slug is required."),

  category: z.string().min(3, "Category is required."),

  mrp: numberField,

  sellingPrice: numberField,

  discountPercentage: numberField,

  description: z.string().min(3, "Description is required."),

  media: z.array(z.string()).min(1, "At least one media is required"),

  product: z.string().min(3, "Product is required."),

  color: z.string().min(3, "Color is required"),

  size: z.string().min(1, "Size is required"),

  sku: z.string().min(3, "Sku is required"),

  code: z.string().min(3, "Code is required"),

  minShoppingAmount: numberField,
  amount: numberField,

  validity: z.coerce.date({
    required_error: "Validity date is required",
  }),
  userId: z.string().min(3, 'User id is required.'),
  rating: numberField,
  review: z.string().min(3, 'Review is required.'),
  code: z.string().min(3, 'Coupon code is required.'),
  phone: z.string().min(10, 'Phone number is required.' ),
  country: z.string().min(3, 'Country is required.'),
  state: z.string().min(3, 'State is required.'),
  city: z.string().min(3, 'City is required.'),
  pincode: z.string().min(3, 'Pincode is required.'),
  landmark: z.string().min(3, 'Landmark is required.'),
  ordernot: z.string().min(3, 'ordernot is required.').optional(),
  address:  z.string().min(3, 'Address is required.'),
});