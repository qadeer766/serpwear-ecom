export const WEBSITE_HOME = "/";

export const WEBSITE_LOGIN = "/auth/login";
export const WEBSITE_REGISTER = "/auth/register";
export const WEBSITE_RESETPASSWORD = "/auth/reset-password";

/* USER ROUTES */

export const USER_DASHBOARD = "/my-account";
export const USER_PROFILE = "/profile";
export const USER_ORDERS = "/orders";


/* SHOP */

export const WEBSITE_SHOP = "/shop";

export const WEBSITE_PRODUCT_DETAILS = (slug) =>
  slug ? `/product/${slug}` : "/product";

/* CART */

export const WEBSITE_CART = "/cart";
export const WEBSITE_CHECKOUT = "/checkout";

/* ORDER */

export const WEBSITE_ORDER_DETAILS = (orderId) =>
  `/order-details/${orderId}`;

export const WEBSITE_ORDER_SUCCESS = "/order-success";

