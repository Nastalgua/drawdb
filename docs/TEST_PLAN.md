# Test Plan: Delete All Fields & Generate Sample Data

## Q10: What scenarios would you like to test?

Consider reviews from teammates/CodeRabbit: edge cases (empty tables, auto-increment-only), accessibility, i18n, and error handling.

## Test Scenarios

### Feature 1: Delete All Fields

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 1 | Happy path | Table with multiple fields → click "..." → "Delete all fields" → all fields removed | High |
| 2 | Empty table | Table with no fields → "Delete all fields" button is disabled | High |
| 3 | Undo/Redo | After delete all → Undo restores fields and relationships → Redo clears again | High |
| 4 | Relationships removed | Table with relationships → delete all fields → relationships involving that table are removed | High |
| 5 | Read-only mode | In read-only mode → "Delete all fields" button is disabled | Medium |
| 6 | Single field | Table with one field → delete all → table has empty fields array | Medium |

### Feature 2: Generate Sample Data

| # | Scenario | Description | Priority |
|---|----------|-------------|----------|
| 1 | Basic generation | Diagram with tables → File → Export as → Sample data → SQL INSERT statements generated | High |
| 2 | Empty diagram | No tables → Sample data shows "No tables to generate sample data from" message | High |
| 3 | Various field types | Tables with INT, VARCHAR, DATE, BOOLEAN, ENUM → correct sample values per type | High |
| 4 | Auto-increment excluded | Table with auto-increment primary key → column omitted from INSERT | Medium |
| 5 | Custom row count | generateSampleData with rowCount option → correct number of rows | Medium |
| 6 | Table order (FK) | Tables with relationships → parent tables appear before children in output | Medium |
| 7 | Tables with no fields | Table with empty fields array → skipped in output | Medium |

### CodeRabbit / Teammate Review Considerations

- **Edge cases**: Empty tables, tables with only auto-increment PK, null/undefined handling
- **Accessibility**: "Delete all fields" should be keyboard-accessible and have clear labeling
- **i18n**: Verify translation keys exist for new strings
- **Error handling**: Sample data with invalid/missing field types should not crash

---

## Q11: How many unit tests were added? What do they check?

**11 unit tests** in `src/utils/generateSampleData.test.js`:

| Test | Component Checked |
|------|-------------------|
| Empty diagram | Returns empty string when no tables |
| Tables with no fields | Skips tables with empty fields array |
| Auto-increment only | Skips tables with only auto-increment PK |
| VARCHAR + INT | Generates correct INSERT for common types |
| Custom rowCount | Respects rowCount option |
| BOOLEAN type | Generates 0/1 values |
| ENUM type | Uses values from field.values |
| FK table order | Parents before children in output |
| relationships alias | Accepts `relationships` as well as `references` |
| DATE type | Generates valid date strings |
| Default database | Uses MySQL when database not specified |

---

## Q12: Which testing framework was used?

**Vitest** – Vite’s test runner, used for unit tests. It’s fast, compatible with Vite, and has a Jest-like API.

---

## Q13: How many E2E tests were added? What do they test?

**6 E2E tests** in `e2e/` using **Playwright**:

### Delete All Fields (3 tests)
- Delete all fields button appears in table "..." menu
- Delete all fields removes all fields from table
- Delete all fields is disabled when table has no fields

### Generate Sample Data (3 tests)
- Sample data option appears in File → Export as menu
- Sample data export generates SQL INSERT statements
- Empty diagram shows appropriate message when exporting sample data

**Setup**: Run `npx playwright install` before `npm run test:e2e`.
