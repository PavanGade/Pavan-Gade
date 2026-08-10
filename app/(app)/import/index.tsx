import * as DocumentPicker from 'expo-document-picker';
import { router } from 'expo-router';
import Papa from 'papaparse';
import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { Screen } from '@/components/layout/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
  evaluateImportRows,
  suggestColumnMapping,
  summarizeImport,
  type ColumnMapping,
  type ImportRowEvaluation,
  PROSPECT_IMPORT_FIELDS,
} from '@/features/import/csv-import';
import { useTheme } from '@/lib/theme';
import { useMockRepository } from '@/stores/mock-repository';

export default function ImportScreen() {
  const theme = useTheme();
  const prospects = useMockRepository((s) => s.prospects);
  const importProspects = useMockRepository((s) => s.importProspects);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [evaluated, setEvaluated] = useState<ImportRowEvaluation[] | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [importedCount, setImportedCount] = useState<number | null>(null);

  const summary = useMemo(() => (evaluated ? summarizeImport(evaluated) : null), [evaluated]);

  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['text/csv', 'text/comma-separated-values', 'application/vnd.ms-excel'],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setFileName(asset.name);
    setEvaluated(null);
    setImportedCount(null);

    const response = await fetch(asset.uri);
    const text = await response.text();
    const parsed = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    });
    const cols = parsed.meta.fields ?? [];
    setHeaders(cols);
    setRows(parsed.data);
    setMapping(suggestColumnMapping(cols));
  };

  const validate = () => {
    const existing = prospects.map((p) => ({
      email: p.email,
      phone: p.phone,
      full_name: p.full_name,
      company_name: p.company_name,
    }));
    setEvaluated(evaluateImportRows(rows, mapping, existing));
  };

  const commit = () => {
    if (!evaluated) return;
    const valid = evaluated
      .filter((r) => r.status === 'VALID' && r.normalized)
      .map((r) => r.normalized!);
    const count = importProspects(valid);
    setImportedCount(count);
  };

  return (
    <Screen>
      <Button title="Back" variant="ghost" size="sm" onPress={() => router.back()} />
      <Text style={[theme.typography.title, { color: theme.colors.text, marginVertical: 12 }]}>
        Import CSV
      </Text>
      <Text style={[theme.typography.body, { color: theme.colors.textSecondary, marginBottom: 16 }]}>
        Map columns, validate, review duplicates, then import. No fabricated contact data is created.
      </Text>
      <Button title={fileName ? `Replace file (${fileName})` : 'Upload CSV'} onPress={pickFile} />

      {headers.length > 0 ? (
        <Card style={{ marginTop: 16, gap: 10 }}>
          <Text style={[theme.typography.heading, { color: theme.colors.text }]}>Column mapping</Text>
          {PROSPECT_IMPORT_FIELDS.map((field) => (
            <View key={field}>
              <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>{field}</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                <Button
                  title="—"
                  size="sm"
                  variant={!mapping[field] ? 'primary' : 'secondary'}
                  onPress={() =>
                    setMapping((m) => {
                      const next = { ...m };
                      delete next[field];
                      return next;
                    })
                  }
                />
                {headers.map((h) => (
                  <Button
                    key={`${field}-${h}`}
                    title={h}
                    size="sm"
                    variant={mapping[field] === h ? 'primary' : 'secondary'}
                    onPress={() => setMapping((m) => ({ ...m, [field]: h }))}
                  />
                ))}
              </View>
            </View>
          ))}
          <Button title="Validate" onPress={validate} />
        </Card>
      ) : null}

      {summary ? (
        <Card style={{ marginTop: 16, gap: 6 }}>
          <Text style={{ color: theme.colors.text }}>Total: {summary.total}</Text>
          <Text style={{ color: theme.colors.success }}>Valid: {summary.valid}</Text>
          <Text style={{ color: theme.colors.warning }}>Duplicates: {summary.duplicates}</Text>
          <Text style={{ color: theme.colors.danger }}>Invalid: {summary.invalid}</Text>
          <Button title={`Import ${summary.valid} valid rows`} onPress={commit} />
        </Card>
      ) : null}

      {importedCount != null ? (
        <Card style={{ marginTop: 16 }}>
          <Text style={{ color: theme.colors.success }}>Imported {importedCount} prospects.</Text>
          <Button title="View prospects" style={{ marginTop: 10 }} onPress={() => router.push('/(app)/(tabs)/prospects')} />
        </Card>
      ) : null}
    </Screen>
  );
}
