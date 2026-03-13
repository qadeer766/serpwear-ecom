

"use client";

import React, { useCallback, useMemo } from "react";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import EditAction from "@/components/Application/Admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_PRODUCT_VARIANT_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import {
  ADMIN_DASHBOARD,
  ADMIN_PRODUCT_VARIANT_SHOW,
  ADMIN_PRODUCT_VARIANT_ADD,
  ADMIN_PRODUCT_VARIANT_EDIT,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_VARIANT_SHOW, label: "Product Variants" },
];

export default function ShowProductVariant() {
  // Memoize columns configuration to avoid re-renders
  const columns = useMemo(() => columnConfig(DT_PRODUCT_VARIANT_COLUMN), []);

  // Define actions (Edit & Delete)
  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <EditAction
        key={`edit-${row.original._id}`}
        href={ADMIN_PRODUCT_VARIANT_EDIT(row.original._id)}
      />,
      <DeleteAction
        key={`delete-${row.original._id}`}
        handleDelete={handleDelete}
        row={row}
        deleteType={deleteType}
      />,
    ];
  }, []);

  return (
    <div>
      <BreadCrumb breadcrumbData={breadCrumbData} />

      <Card className="pt-3 rounded shadow-sm">
        <CardHeader className="py-2 px-3 border-b">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl">Product Variants</h4>

            {/* Add New Product Variant Button */}
            <Button asChild className="flex items-center gap-2">
              <Link href={ADMIN_PRODUCT_VARIANT_ADD}>
                <FiPlus />
                Add Variant
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          {/* DataTable Wrapper for Product Variants */}
          <DatatableWrapper
            queryKey="product-variant-data"
            fetchUrl="/api/product-variant"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/product-variant/export"
            deleteEndpoint="/api/product-variant/delete"
            deleteType="SD" // Soft delete
            trashview={`${ADMIN_TRASH}?trashof=product-variant`}
            createAction={action} // Row action buttons (Edit & Delete)
          />
        </CardContent>
      </Card>
    </div>
  );
}