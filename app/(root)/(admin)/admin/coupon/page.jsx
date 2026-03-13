"use client";

import BreadCrumb from "@/components/Application/Admin/BreadCrumb";
import DatatableWrapper from "@/components/Application/Admin/DatatableWrapper";
import DeleteAction from "@/components/Application/Admin/DeleteAction";
import EditAction from "@/components/Application/Admin/EditAction";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DT_COUPON_COLUMN } from "@/lib/column";
import { columnConfig } from "@/lib/helperFunction";
import {
  ADMIN_DASHBOARD,
  ADMIN_TRASH,
  ADMIN_COUPON_SHOW,
  ADMIN_COUPON_EDIT,
  ADMIN_COUPON_ADD,
} from "@/routes/AdminPanelRoute";
import Link from "next/link";
import React, { useCallback, useMemo } from "react";
import { FiPlus } from "react-icons/fi";

const breadCrumbData = [
  { href: ADMIN_DASHBOARD, label: "Home" },
  { href: ADMIN_COUPON_SHOW, label: "Coupons" },
];

const ShowCoupon = () => {
  const columns = useMemo(() => {
    return columnConfig(DT_COUPON_COLUMN);
  }, []);

  const action = useCallback((row, deleteType, handleDelete) => {
    return [
      <EditAction key="edit" href={ADMIN_COUPON_EDIT(row.original._id)} />,
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
            <h4 className="font-semibold">Show Coupons</h4>

            <Button asChild>
              <Link href={ADMIN_COUPON_ADD}>
                <FiPlus className="mr-1" />
                New Coupon
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <DatatableWrapper
            queryKey="coupon-data"
            fetchUrl="/api/coupon"
            initialPageSize={10}
            columnsConfig={columns}
            exportEndpoint="/api/coupon/export"
            deleteEndpoint="/api/coupon/delete"
            deleteType="SD"
            trashview={`${ADMIN_TRASH}?trashof=coupon`}
            createAction={action}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowCoupon;