"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import {
  DT_CATEGORY_COLUMN,
  DT_PRODUCT_COLUMN,
  DT_PRODUCT_VARIANT_COLUMN,
  DT_CUSTOMERS_COLUMN,
  DT_REVIEW_COLUMN,
  DT_COUPON_COLUMN,
  DT_ORDER_COLUMN,
} from "@/lib/column";

import { columnConfig } from "@/lib/helperFunction";
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute";

import { useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

// ------------------ TRASH CONFIG ------------------
const TRASH_CONFIG = {
  category: {
    title: "Category Trash",
    columns: DT_CATEGORY_COLUMN,
    fetchUrl: "/api/category",
    exportUrl: "/api/category/export",
    deleteUrl: "/api/category/delete",
  },
  product: {
    title: "Product Trash",
    columns: DT_PRODUCT_COLUMN,
    fetchUrl: "/api/product",
    exportUrl: "/api/product/export",
    deleteUrl: "/api/product/delete",
  },
  "product-variant": {
    title: "Product Variant Trash",
    columns: DT_PRODUCT_VARIANT_COLUMN,
    fetchUrl: "/api/product-variant",
    exportUrl: "/api/product-variant/export",
    deleteUrl: "/api/product-variant/delete",
  },
  coupon: {
    title: "Coupon Trash",
    columns: DT_COUPON_COLUMN,
    fetchUrl: "/api/coupon",
    exportUrl: "/api/coupon/export",
    deleteUrl: "/api/coupon/delete",
  },
  customers: {
    title: "Customers Trash",
    columns: DT_CUSTOMERS_COLUMN,
    fetchUrl: "/api/customer",
    exportUrl: "/api/customer/export",
    deleteUrl: "/api/customer/delete",
  },
  review: {
    title: "Review Trash",
    columns: DT_REVIEW_COLUMN,
    fetchUrl: "/api/review",
    exportUrl: "/api/review/export",
    deleteUrl: "/api/review/delete",
  },
   orders: {
    title: "Orders Trash",
    columns: DT_ORDER_COLUMN,
    fetchUrl: "/api/order",
    exportUrl: "/api/order/export",
    deleteUrl: "/api/order/delete",
  },
};

const Trash = () => {
  const searchParams = useSearchParams();
  const trashOf = searchParams.get("trashof");

  const config = TRASH_CONFIG[trashOf];

  if (!config) {
    return (
      <div className="p-6 text-center text-red-500 font-semibold">
        Invalid trash type.
      </div>
    );
  }

  // ✅ Dynamic breadcrumb
  const breadCrumbData = [
    { href: ADMIN_DASHBOARD, label: "Home" },
    { href: ADMIN_TRASH, label: "Trash" },
    { label: config.title },
  ];

  // ✅ Add DeletedAt column
  const columns = useMemo(() => {
    return columnConfig(config.columns, false, false, true);
  }, [config.columns]);

  // ✅ Only Delete Action in Trash
  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <DeleteAction
        key={`trash-${row.original._id}`}
        handleDelete={handleDelete}
        row={row}
        deleteType={deleteType}
      />,
    ];
  }, []);

  return (
    <div>
      <BreadCrumb breadCrumbData={breadCrumbData} />

      <Card className="pt-3 rounded shadow-sm">
        <CardHeader className="py-3 px-4 border-b">
          <h4 className="font-semibold text-lg">{config.title}</h4>
        </CardHeader>

        <CardContent className="pb-4">
          <DatatableWrapper
            queryKey={`${trashOf}-trash-data`}
            fetchUrl={config.fetchUrl}
            columnsConfig={columns}
            initialPageSize={10}
            exportEndpoint={config.exportUrl}
            deleteEndpoint={config.deleteUrl}
            deleteType="PD"
            createAction={action}
            trashview={ADMIN_TRASH}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Trash;