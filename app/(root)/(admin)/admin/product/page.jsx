


"use client";

import React, { useCallback, useMemo } from "react";
import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import EditAction from "@/components/Application/Admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { DT_PRODUCT_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";

import {
  ADMIN_PRODUCT_SHOW,
  ADMIN_PRODUCT_ADD,
  ADMIN_PRODUCT_EDIT,
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
} from "@/routes/AdminPanelRoute";

import Link from "next/link";
import { FiPlus } from "react-icons/fi";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_PRODUCT_SHOW, label: "Products" },
];

export default function ShowProduct() {
  /* ================= TABLE COLUMNS ================= */
  const columns = useMemo(() => {
    return columnConfig(DT_PRODUCT_COLUMN);
  }, []);

  /* ================= ROW ACTIONS ================= */
  const action = useCallback((row, deleteType, handleDelete) => {
    const id = row?.original?._id;
    if (!id) return null;

    return [
      <EditAction
        key={`edit-${id}`}
        href={ADMIN_PRODUCT_EDIT(id)}
      />,
      <DeleteAction
        key={`delete-${id}`}
        handleDelete={handleDelete}
        row={row}
        deleteType={deleteType}
      />,
    ];
  }, []);

  /* ================= UI ================= */
  return (
    <div>
      <BreadCrumb breadcrumbData={breadCrumbData} />

      <Card className="pt-3 rounded shadow-sm">
        <CardHeader className="py-3 px-4 border-b">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold text-xl">Show Products</h4>

            <Button asChild>
              <Link
                href={ADMIN_PRODUCT_ADD}
                className="flex items-center gap-2"
              >
                <FiPlus size={16} />
                New Product
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <DatatableWrapper
            queryKey="product-data"
            fetchUrl="/api/product"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/product/export"
            deleteEndpoint="/api/product/delete"
            deleteType="SD"
            trashview={`${ADMIN_TRASH}?trashof=product`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
}