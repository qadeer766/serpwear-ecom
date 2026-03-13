import { NextResponse } from "next/server";

// --------------------------------------
// NORMALIZED API RESPONSE
// --------------------------------------
export const response = (success, statusCode, message, data = {}) => {
  return NextResponse.json(
    { success, message, data },
    { status: statusCode }
  );
};

// --------------------------------------
// ERROR HANDLER
// --------------------------------------
export const catchError = (error, customMessage = "") => {
  console.error("❌ Server Error:", error);

  // Mongo duplicate key error
  if (error?.code === 11000) {
    const duplicateField = Object.keys(error.keyPattern || {}).join(", ");
    return response(
      false,
      409,
      `Duplicate value for: ${duplicateField}. Field must be unique.`
    );
  }

  return response(
    false,
    error?.statusCode || 500,
    customMessage || "Internal Server Error"
  );
};

// --------------------------------------
// OTP GENERATOR
// --------------------------------------
export const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// --------------------------------------
// DYNAMIC COLUMN CONFIG
// --------------------------------------
export const columnConfig = (
  column = [],
  isCreatedAt = false,
  isUpdatedAt = false,
  isDeletedAt = false
) => {
  const newColumn = [...column];

  const baseDateRender = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString();
  };

  const createDateColumn = (key, header) => ({
    accessorKey: key,
    header,
    Cell: ({ cell }) => baseDateRender(cell.getValue()),
  });

  if (isCreatedAt) {
    newColumn.push(createDateColumn("createdAt", "Created At"));
  }

  if (isUpdatedAt) {
    newColumn.push(createDateColumn("updatedAt", "Updated At"));
  }

  if (isDeletedAt) {
    newColumn.push(createDateColumn("deletedAt", "Deleted At"));
  }

  return newColumn;
};


export const statusBadge = (status) => {
  const statusColorConfig = {
    pending: 'bg-blue-500',
    processing: 'bg-yellow-500',
    shipped: 'bg-cyan-500',
    delivered: 'bg-green-500',
    cancelled: 'bg-red-500',
    unverified: 'bg-orange-500'

  }
  return <span className={`${statusColorConfig[status]} capitalize px-3 py-1 rounded-full text-xs`}>{status}</span>
}