import {
  ADMIN_CATEGORY_ADD,
  ADMIN_CATEGORY_SHOW,
  ADMIN_COUPON_ADD,
  ADMIN_COUPON_SHOW,
  ADMIN_CUSTOMERS_SHOW,
  ADMIN_DASHBOARD,
  ADMIN_MEDIA_SHOW,
  ADMIN_ORDER_SHOW,
  ADMIN_PRODUCT_ADD,
  ADMIN_PRODUCT_SHOW,
  ADMIN_PRODUCT_VARIANT_ADD,
  ADMIN_PRODUCT_VARIANT_SHOW,
  ADMIN_REVIEW_SHOW,
} from "@/routes/AdminPanelRoute";

const searchData = [
  {
    id: 1,
    label: "Dashboard",
    description: "View website analytics and reports",
    url: ADMIN_DASHBOARD,
    keywords: ["dashboard", "overview", "analytics", "insights"],
  },

  // ------------------ Category ------------------
  {
    id: 2,
    label: "Categories",
    description: "Manage product categories",
    url: ADMIN_CATEGORY_SHOW,
    keywords: ["category", "categories", "product category"],
  },
  {
    id: 3,
    label: "Add Category",
    description: "Add a new product category",
    url: ADMIN_CATEGORY_ADD,
    keywords: ["add category", "new category", "create category"],
  },

  // ------------------ Product ------------------
  {
    id: 4,
    label: "Products",
    description: "Manage all product listings",
    url: ADMIN_PRODUCT_SHOW,
    keywords: ["products", "product list", "items"],
  },
  {
    id: 5,
    label: "Add Product",
    description: "Add a new product to the catalog",
    url: ADMIN_PRODUCT_ADD,
    keywords: ["add product", "new product", "create product"],
  },

  // ------------------ Product Variant ------------------
  {
    id: 6,
    label: "Product Variants",
    description: "Manage product variants",
    url: ADMIN_PRODUCT_VARIANT_SHOW,
    keywords: ["variants", "product variants", "sizes", "colors"],
  },
  {
    id: 7,
    label: "Add Product Variant",
    description: "Create a new product variant",
    url: ADMIN_PRODUCT_VARIANT_ADD,
    keywords: ["add variant", "new variant", "product variant"],
  },

  // ------------------ Coupon ------------------
  {
    id: 8,
    label: "Coupons",
    description: "Manage active discount coupons",
    url: ADMIN_COUPON_SHOW,
    keywords: ["coupons", "discount", "promo", "offers"],
  },
  {
    id: 9,
    label: "Add Coupon",
    description: "Create a new discount coupon",
    url: ADMIN_COUPON_ADD,
    keywords: ["add coupon", "new coupon", "promotion"],
  },

  // ------------------ Orders (placeholder)
  {
    id: 10,
    label: "Orders",
    description: "Manage customer orders",
    url: ADMIN_ORDER_SHOW, 
    keywords: ["orders", "sales", "purchases"],
  },

  // ------------------ Customers ------------------
  {
    id: 11,
    label: "Customers",
    description: "View and manage customer information",
    url: ADMIN_CUSTOMERS_SHOW,
    keywords: ["customers", "users", "buyers"],
  },

  // ------------------ Reviews ------------------
  {
    id: 12,
    label: "Rating & Review",
    description: "Manage customer reviews and feedback",
    url: ADMIN_REVIEW_SHOW,
    keywords: ["reviews", "ratings", "feedback", "comments"],
  },

  // ------------------ Media ------------------
  {
    id: 13,
    label: "Media Library",
    description: "Manage website media files",
    url: ADMIN_MEDIA_SHOW,
    keywords: ["media", "images", "videos", "gallery"],
  },
];

export default searchData;