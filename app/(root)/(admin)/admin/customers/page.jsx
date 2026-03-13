"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_CUSTOMERS_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import { ADMIN_DASHBOARD, ADMIN_TRASH } from "@/routes/AdminPanelRoute";

import React, { useCallback, useMemo } from "react";

const breadCrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: "Home",
  },
  {
    href: "",
    label: "Customers",
  },
];

const ShowCustomer = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_CUSTOMERS_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
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
        <CardHeader className="pt-3 px-3 border-b pb-2">
          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Customers</h4>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <DatatableWrapper
            queryKey="customer-data"
            fetchUrl="/api/customers"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/customers/export"
            deleteEndpoint="/api/customers/delete"
            deleteType="SD"
            trashview={`${ADMIN_TRASH}?trashof=customers`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCustomer;