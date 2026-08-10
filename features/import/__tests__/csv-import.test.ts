import {
  evaluateImportRows,
  mapCsvRow,
  suggestColumnMapping,
  summarizeImport,
} from '@/features/import/csv-import';

describe('csv import', () => {
  it('suggests column mapping from common headers', () => {
    const mapping = suggestColumnMapping(['Full Name', 'Email Address', 'Mobile', 'Company']);
    expect(mapping.full_name).toBe('Full Name');
    expect(mapping.email).toBe('Email Address');
    expect(mapping.phone).toBe('Mobile');
    expect(mapping.company).toBe('Company');
  });

  it('requires a name', () => {
    const result = mapCsvRow({ Email: 'a@example.com' }, { email: 'Email' });
    expect(result.normalized).toBeNull();
    expect(result.error).toMatch(/name/i);
  });

  it('detects email duplicates against existing records', () => {
    const rows = [
      { Name: 'Ada Lovelace', Email: 'ada@example.com', Company: 'Analytical' },
      { Name: 'Ada Clone', Email: 'ada@example.com', Company: 'Other' },
    ];
    const mapping = { full_name: 'Name', email: 'Email', company: 'Company' } as const;
    const evaluated = evaluateImportRows(rows, mapping, [
      { full_name: 'Existing', email: 'ada@example.com', phone: null, company_name: 'X' },
    ]);
    expect(evaluated[0]?.status).toBe('DUPLICATE');
    expect(evaluated[1]?.status).toBe('DUPLICATE');
    const summary = summarizeImport(evaluated);
    expect(summary.duplicates).toBe(2);
  });

  it('accepts valid unique rows', () => {
    const evaluated = evaluateImportRows(
      [{ Name: 'Grace Hopper', Email: 'grace@example.com', Company: 'Navy' }],
      { full_name: 'Name', email: 'Email', company: 'Company' },
      [],
    );
    expect(evaluated[0]?.status).toBe('VALID');
    expect(summarizeImport(evaluated).valid).toBe(1);
  });
});
