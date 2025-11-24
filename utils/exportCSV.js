import fs from "fs";
import path from "path";
import { createObjectCsvWriter } from "csv-writer";

export const ensureExportPath = (p) => {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
};

export const exportPaymentsCSV = async (rows, filename = null) => {
  const exportDir = process.env.CSV_EXPORT_PATH || "./exports";
  ensureExportPath(exportDir);

  const file = filename || `payments_${Date.now()}.csv`;
  const full = path.join(exportDir, file);

  const csvWriter = createObjectCsvWriter({
    path: full,
    header: [
      { id: "roomNumber", title: "Room" },
      { id: "tenantName", title: "Tenant" },
      { id: "month", title: "Month" },
      { id: "amount", title: "Amount" },
      { id: "paidOn", title: "Paid On" },
      { id: "razorpayPaymentId", title: "Payment ID" },
    ],
  });

  await csvWriter.writeRecords(rows);
  return full;
};
