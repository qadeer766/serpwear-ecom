import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Chip } from "@mui/material";
import dayjs from "dayjs";
import userIcon from "@/public/assets/images/user.png";

// ------------------------------
// CATEGORY COLUMNS
// ------------------------------
export const DT_CATEGORY_COLUMN = [
  { accessorKey: "name", header: "Category Name" },
  { accessorKey: "slug", header: "Slug" },
];

// ------------------------------
// PRODUCT COLUMNS
// ------------------------------
export const DT_PRODUCT_COLUMN = [
  { accessorKey: "name", header: "Product Name" },
  { accessorKey: "slug", header: "Slug" },
  { accessorKey: "category", header: "Category" },
  { accessorKey: "mrp", header: "MRP" },
  { accessorKey: "sellingPrice", header: "Selling Price" },
  { accessorKey: "discountPercentage", header: "Discount %" },
];

// ------------------------------
// PRODUCT VARIANT COLUMNS
// ------------------------------
export const DT_PRODUCT_VARIANT_COLUMN = [
  { accessorKey: "product", header: "Product Name" },
  { accessorKey: "color", header: "Color" },
  { accessorKey: "size", header: "Size" },
  { accessorKey: "sku", header: "SKU" },
  { accessorKey: "mrp", header: "MRP" },
  { accessorKey: "sellingPrice", header: "Selling Price" },
  { accessorKey: "discountPercentage", header: "Discount %" },
];

// ------------------------------
// COUPON COLUMNS
// ------------------------------
export const DT_COUPON_COLUMN = [
  { accessorKey: "code", header: "Code" },
  { accessorKey: "discountPercentage", header: "Discount %" },
  { accessorKey: "minShoppingAmount", header: "Min. Shopping Amount" },
  {
    accessorKey: "validity",
    header: "Validity",
    Cell: ({ cell }) => {
      const value = cell.getValue();
      if (!value) return "-";

      const isExpired = new Date() > new Date(value);

      return (
        <Chip
          size="small"
          color={isExpired ? "error" : "success"}
          label={dayjs(value).format("DD/MM/YYYY")}
        />
      );
    },
  },
];

// ------------------------------
// CUSTOMER COLUMNS
// ------------------------------
export const DT_CUSTOMERS_COLUMN = [
  {
    accessorKey: "avatar",
    header: "Avatar",
    Cell: ({ cell }) => {
      const value = cell.getValue();

      return (
        <Avatar>
          <AvatarImage src={value?.url || userIcon.src} />
          <AvatarFallback>
            {value?.url ? "" : "U"}
          </AvatarFallback>
        </Avatar>
      );
    },
  },
  { accessorKey: "name", header: "Name" },
  { accessorKey: "phone", header: "Phone" },
  { accessorKey: "address", header: "Address" },
  {
    accessorKey: "isEmailVerified",
    header: "Verified",
    Cell: ({ cell }) =>
      cell.getValue() ? (
        <Chip size="small" color="success" label="Verified" />
      ) : (
        <Chip size="small" color="error" label="Not Verified" />
      ),
  },
];

// ------------------------------
// REVIEW COLUMNS
// ------------------------------
export const DT_REVIEW_COLUMN = [
  { accessorKey: "product", header: "Product" },
  { accessorKey: "user", header: "User" },
  { accessorKey: "title", header: "Title" },
  { accessorKey: "rating", header: "Rating" },
  { accessorKey: "review", header: "Review" },
];

// ------------------------------
// ORDER COLUMNS
// ------------------------------

export const DT_ORDER_COLUMN = [
  { accessorKey: "order_id", header: "Order Id" },
  { accessorKey: "payment_id", header: "Payment Id" },
   { accessorKey: "name", header: "Name" },
   { accessorKey: "email", header: "Email" },
   { accessorKey: "phone", header: "Phone" },
   { accessorKey: "country", header: "Country" },
   { accessorKey: "state", header: "State" },
   { accessorKey: "city", header: "City" },
   { accessorKey: "pincode", header: "Pincode" },
   { accessorKey: "totalItem", header: "Total Item" , 
    Cell: ({renderedCellValue, row}) => (<span>{row?.original.products?.length || 0}</span>)
   },
   { accessorKey: "subtotal", header: "Subtotal" },
   { accessorKey: "discount", header: "Discount" , 
     Cell: ({renderedCellValue}) => (<span>{Math.round(renderedCellValue)}</span>)
   },
   { accessorKey: "couponDiscount", header: "Coupon Discount" },
   { accessorKey: "totalAmount", header: "Total Amount" },
   { accessorKey: "status", header: "Status" },
  
  
];