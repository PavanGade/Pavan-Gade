import { describe, expect, it } from "vitest";
import { evaluateImportRows, suggestColumnMapping, summarizeImport } from "@/lib/import/csv";

describe("csv import", () => {
  it("suggests mappings from common headers", () => {
    const mapping = suggestColumnMapping(["Full Name", "Email Address", "Mobile", "Company"]);
    expect(mapping.fullName).toBe("Full Name");
    expect(mapping.email).toBe("Email Address");
    expect(mapping.phone).toBe("Mobile");
    expect(mapping.companyName).toBe("Company");
  });

  it("marks rows without identity fields as invalid", () => {
    const result = evaluateImportRows([{ Notes: "hello" }], { fullName: "Notes" });
    // name alone can be valid; empty email/phone without name should be invalid
    const empty = evaluateImportRows([{ Email: "" }], { email: "Email" });
    expect(empty.rows[0]?.status).toBe("invalid");
    expect(result.summary.totalRows).toBe(1);
  });

  it("detects duplicates by email", () => {
    const result = evaluateImportRows(
      [
        { Name: "Ada", Email: "ada@example.com", Company: "X" },
        { Name: "Ada 2", Email: "ada@example.com", Company: "Y" },
      ],
      { fullName: "Name", email: "Email", companyName: "Company" },
      [{ id: "existing", email: "ada@example.com", companyName: "Z" }],
    );

    expect(result.rows.every((row) => row.status === "duplicate")).toBe(true);
    expect(summarizeImport(result.rows).duplicateRows).toBe(2);
  });
});
