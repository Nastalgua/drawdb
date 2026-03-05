import { describe, it, expect } from "vitest";
import { generateSampleData } from "./generateSampleData";
import { DB } from "../data/constants";

describe("generateSampleData", () => {
  it("returns empty string when diagram has no tables", () => {
    const result = generateSampleData({ tables: [], references: [] });
    expect(result).toBe("");
  });

  it("skips tables with no fields", () => {
    const diagram = {
      tables: [{ id: "t1", name: "empty_table", fields: [] }],
      references: [],
      database: DB.MYSQL,
    };
    const result = generateSampleData(diagram);
    expect(result).toBe("");
  });

  it("skips tables with only auto-increment primary key", () => {
    const diagram = {
      tables: [
        {
          id: "t1",
          name: "id_only",
          fields: [
            {
              id: "f1",
              name: "id",
              type: "INT",
              primary: true,
              increment: true,
            },
          ],
        },
      ],
      references: [],
      database: DB.MYSQL,
    };
    const result = generateSampleData(diagram);
    expect(result).toBe("");
  });

  it("generates INSERT statements for table with VARCHAR and INT fields", () => {
    const diagram = {
      tables: [
        {
          id: "t1",
          name: "users",
          fields: [
            { id: "f1", name: "id", type: "INT", primary: true, increment: true },
            { id: "f2", name: "name", type: "VARCHAR", primary: false },
          ],
        },
      ],
      references: [],
      database: DB.MYSQL,
    };
    const result = generateSampleData(diagram);
    expect(result).toContain("INSERT INTO `users`");
    expect(result).toContain("`name`");
    expect(result).not.toContain("`id`");
    expect(result).toMatch(/'Sample 1'/);
    expect(result.split("INSERT INTO").length - 1).toBe(5);
  });

  it("generates correct number of rows with custom rowCount option", () => {
    const diagram = {
      tables: [
        {
          id: "t1",
          name: "products",
          fields: [{ id: "f1", name: "title", type: "VARCHAR" }],
        },
      ],
      references: [],
      database: DB.MYSQL,
    };
    const result = generateSampleData(diagram, { rowCount: 3 });
    expect(result.split("INSERT INTO").length - 1).toBe(3);
  });

  it("generates correct values for BOOLEAN type", () => {
    const diagram = {
      tables: [
        {
          id: "t1",
          name: "flags",
          fields: [{ id: "f1", name: "active", type: "BOOLEAN" }],
        },
      ],
      references: [],
      database: DB.MYSQL,
    };
    const result = generateSampleData(diagram, { rowCount: 2 });
    expect(result).toContain("1");
    expect(result).toContain("0");
  });

  it("generates correct values for ENUM type", () => {
    const diagram = {
      tables: [
        {
          id: "t1",
          name: "statuses",
          fields: [
            {
              id: "f1",
              name: "status",
              type: "ENUM",
              values: ["pending", "active", "done"],
            },
          ],
        },
      ],
      references: [],
      database: DB.MYSQL,
    };
    const result = generateSampleData(diagram, { rowCount: 3 });
    expect(result).toContain("'pending'");
    expect(result).toContain("'active'");
    expect(result).toContain("'done'");
  });

  it("orders tables by FK dependency (parent before child)", () => {
    const parentTable = {
      id: "parent",
      name: "parent_table",
      fields: [{ id: "pf1", name: "id", type: "INT", primary: true }],
    };
    const childTable = {
      id: "child",
      name: "child_table",
      fields: [
        { id: "cf1", name: "id", type: "INT", primary: true },
        { id: "cf2", name: "parent_id", type: "INT", primary: false },
      ],
    };
    const diagram = {
      tables: [childTable, parentTable],
      references: [
        {
          startTableId: "child",
          endTableId: "parent",
          startFieldId: "cf2",
          endFieldId: "pf1",
        },
      ],
      database: DB.MYSQL,
    };
    const result = generateSampleData(diagram);
    const parentPos = result.indexOf("`parent_table`");
    const childPos = result.indexOf("`child_table`");
    expect(parentPos).toBeLessThan(childPos);
  });

  it("accepts relationships as alias for references", () => {
    const diagram = {
      tables: [
        {
          id: "t1",
          name: "items",
          fields: [{ id: "f1", name: "name", type: "VARCHAR" }],
        },
      ],
      relationships: [],
      database: DB.MYSQL,
    };
    const result = generateSampleData(diagram);
    expect(result).toContain("INSERT INTO `items`");
  });

  it("generates valid SQL for DATE type", () => {
    const diagram = {
      tables: [
        {
          id: "t1",
          name: "events",
          fields: [{ id: "f1", name: "event_date", type: "DATE" }],
        },
      ],
      references: [],
      database: DB.MYSQL,
    };
    const result = generateSampleData(diagram, { rowCount: 1 });
    expect(result).toMatch(/'2024-\d{2}-\d{2}'/);
  });

  it("uses default database when not specified", () => {
    const diagram = {
      tables: [
        {
          id: "t1",
          name: "generic",
          fields: [{ id: "f1", name: "value", type: "VARCHAR" }],
        },
      ],
      references: [],
    };
    const result = generateSampleData(diagram);
    expect(result).toContain("INSERT INTO `generic`");
  });
});
