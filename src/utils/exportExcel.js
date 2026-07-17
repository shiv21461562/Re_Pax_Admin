import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const exportRegistrationExcel = (registrations) => {
  // Prepare data with proper formatting
  const excelData = registrations.map((item, index) => ({
    "S.No": index + 1,
    "Full Name": item.full_name || "",
    Company: item.company_name || "",
    Designation: item.designation || "",
    Email: item.email || "",
    Phone: item.phone || "",
    City: item.city || "",
    Country: item.country || "",
    "GST Number": item.gst_number || "",
    "Registration Date": item.created_at
      ? new Date(item.created_at).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  // Set column widths for better readability
  const columnWidths = [
    { wch: 8 }, // S.No
    { wch: 25 }, // Full Name
    { wch: 30 }, // Company
    { wch: 25 }, // Designation
    { wch: 30 }, // Email
    { wch: 18 }, // Phone
    { wch: 20 }, // City
    { wch: 20 }, // Country
    { wch: 18 }, // GST Number
    { wch: 22 }, // Registration Date
  ];
  worksheet["!cols"] = columnWidths;

  // Apply alignment and styling
  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  // Set alignment for all cells
  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) continue;

      if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {};

      // Header row (first row) styling
      if (R === range.s.r) {
        worksheet[cellAddress].s = {
          font: { bold: true, color: { rgb: "FFFFFF" }, sz: 11 },
          fill: { fgColor: { rgb: "4472C4" } },
          alignment: {
            horizontal: "center",
            vertical: "center",
            wrapText: true,
          },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        };
      } else {
        // Data rows styling
        worksheet[cellAddress].s = {
          alignment: {
            horizontal: C === 0 ? "center" : "left",
            vertical: "center",
            wrapText: true,
          },
          border: {
            top: { style: "thin", color: { rgb: "D0D0D0" } },
            bottom: { style: "thin", color: { rgb: "D0D0D0" } },
            left: { style: "thin", color: { rgb: "D0D0D0" } },
            right: { style: "thin", color: { rgb: "D0D0D0" } },
          },
        };
      }
    }
  }

  // Freeze the header row
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registrations");

  // Generate Excel file with better quality
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    bookSST: false,
    cellStyles: true,
  });

  const fileData = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  // Add timestamp to filename
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(fileData, `Registrations_${timestamp}.xlsx`);
};
