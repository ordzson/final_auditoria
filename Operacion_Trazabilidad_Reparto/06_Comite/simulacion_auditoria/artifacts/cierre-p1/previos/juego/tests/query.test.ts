import { describe, expect, it } from 'vitest';
import { canon } from '../src/data/canon';
import { queryExamples, runQuery } from '../src/investigation/query';

describe('consultas locales sobre el expediente', () => {
  it('ejecuta los ejemplos sobre datos del canon, con referencias preservadas', () => {
    for (const example of queryExamples) expect(runQuery(example.sql).rows.length).toBeGreaterThan(0);
    const result = runQuery(queryExamples[0].sql);
    expect(result.rows).toEqual([{ sourceId: 'EVT-04', values: ['02:31', 'SQL Server', null, canon.events.find((event) => event.id === 'EVT-04')!.description] }]);
  });

  it('la cuenta remota no se atribuye a lecturas cuyo usuario no se aportó', () => {
    expect(runQuery(queryExamples[2].sql).rows.map((row) => row.sourceId)).toEqual(['EVT-02']);
    expect(runQuery("SELECT * FROM registros WHERE sistema = 'SQL Server' AND cuenta = 'ext_ops_04'").rows).toEqual([]);
  });

  it('conserva NULL y no fabrica hashes ni archivos', () => {
    const result = runQuery('SELECT archivo, sha256 FROM soportes WHERE archivo IS NULL AND sha256 IS NULL');
    expect(result.rows).toHaveLength(canon.evidenceSummaries.length);
    expect(result.rows.every((row) => row.values.every((value) => value === null))).toBe(true);
    expect(runQuery('SELECT * FROM soportes WHERE archivo IS NOT NULL').rows).toEqual([]);
    expect(runQuery("SELECT * FROM soportes WHERE archivo = 'NULL'").rows).toEqual([]);
  });

  it('respeta AND antes de OR y los paréntesis', () => {
    const sql = "SELECT sistema FROM registros WHERE sistema = 'VPN' OR sistema = 'CRM' AND hora < '03:00'";
    expect(runQuery(sql).rows.map((row) => row.sourceId)).toEqual(['EVT-02', 'EVT-06']);
    expect(runQuery("SELECT * FROM registros WHERE (sistema = 'VPN' OR sistema = 'CRM') AND hora > '03:00'").rows.map((row) => row.sourceId)).toEqual(['EVT-09', 'EVT-11', 'EVT-12']);
  });

  it('filtra LIKE con comodines SQL y trata los metacaracteres como texto', () => {
    expect(runQuery("SELECT * FROM registros WHERE sistema LIKE '%SQL%'").rows.map((row) => row.sourceId)).toEqual(['EVT-04']);
    expect(runQuery("SELECT * FROM registros WHERE cuenta LIKE 'ext_ops_0_'").rows.map((row) => row.sourceId)).toEqual(['EVT-02']);
    expect(runQuery("SELECT * FROM registros WHERE detalle LIKE '%.*%'").rows).toEqual([]);
    expect(runQuery("SELECT * FROM registros WHERE detalle LIKE '%don''t%'").rows).toEqual([]);
  });

  it('ordena por fecha y hora, limita resultados y admite comentarios', () => {
    expect(runQuery('-- Copia local\nSELECT TOP 2 hora FROM registros ORDER BY fecha DESC, hora DESC;').rows.map((row) => row.sourceId)).toEqual(['EVT-13', 'EVT-12']);
    expect(runQuery('SELECT hora FROM registros ORDER BY fecha, hora LIMIT 1').rows.map((row) => row.sourceId)).toEqual(['EVT-01']);
    expect(runQuery('SELECT TOP 0 * FROM registros').rows).toEqual([]);
  });

  it.each([
    'DELETE FROM registros', 'UPDATE registros SET cuenta = 1',
    'SELECT * FROM clientes', 'SELECT usuario FROM registros',
    'SELECT * FROM registros; SELECT * FROM soportes',
    'SELECT * FROM registros JOIN soportes',
    "SELECT * FROM registros WHERE sistema = SQL", 'SELECT * FROM registros LIMIT nope',
    'SELECT * FROM registros WHERE (hora = \'02:17\'',
  ])('rechaza consultas fuera del subconjunto sin mutar el expediente: %s', (sql) => {
    const original = JSON.stringify(canon);
    expect(() => runQuery(sql)).toThrow();
    expect(JSON.stringify(canon)).toBe(original);
  });
});
