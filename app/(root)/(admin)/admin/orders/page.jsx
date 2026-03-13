"use client";

import React, { useCallback, useMemo } from "react";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import ViewAction from "@/components/Application/Admin/ViewAction";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { DT_ORDER_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";

import {
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
  ADMIN_ORDER_DETAILS,
} from "@/routes/AdminPanelRoute";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: "", label: "Orders" },
];

const ShowOrder = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_ORDER_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <ViewAction
        key="view"
        href={ADMIN_ORDER_DETAILS(row.original._id)}
      />,
      <DeleteAction
        key="delete"
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
        <CardHeader className="pt-3 px-3 border-b pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Orders</h4>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <DatatableWrapper
            queryKey="order-data"
            fetchUrl="/api/order"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/order/export"
            deleteEndpoint="/api/order/delete"
            deleteType="SD"
            trashview={`${ADMIN_TRASH}?trashof=order`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowOrder;