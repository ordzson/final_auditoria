import { canon } from '../data/canon';
import type { CellValue } from '../data/documents';

export type QueryRow = { sourceId: string; values: CellValue[] };
export type QueryResult = { columns: string[]; rows: QueryRow[]; table: string };
type DataRow = { sourceId: string; cells: Record<string, CellValue> };
type Table = { columns: string[]; rows: DataRow[] };

export const querySchema: Record<string, string[]> = {
  registros: ['fecha', 'hora', 'sistema', 'cuenta', 'detalle', 'referencia'],
  soportes: ['tipo', 'resumen', 'archivo', 'sha256', 'referencia'],
};

function tables(): Record<string, Table> {
  return {
    registros: { columns: querySchema.registros, rows: canon.events.map((event) => ({
      sourceId: event.id,
      cells: { fecha: event.reportedAt.slice(0, 10), hora: event.reportedAt.slice(11, 16), sistema: event.systemLabel,
        cuenta: event.account, detalle: event.description, referencia: event.id },
    })) },
    soportes: { columns: querySchema.soportes, rows: canon.evidenceSummaries.map((source) => ({
      sourceId: source.id,
      cells: { tipo: source.type, resumen: source.summary, archivo: source.artifactPath, sha256: source.sha256, referencia: source.id },
    })) },
  };
}

type Token = { kind: 'word' | 'string' | 'number' | 'symbol'; value: string };

function tokenize(sql: string): Token[] {
  const tokens: Token[] = [];
  let rest = sql.trim();
  while (rest) {
    const comment = rest.match(/^--[^\n]*(?:\n|$)/);
    const whitespace = rest.match(/^\s+/);
    if (comment || whitespace) { rest = rest.slice((comment ?? whitespace)![0].length); continue; }
    const quoted = rest.match(/^'((?:[^']|'')*)'/);
    const word = rest.match(/^[a-z_][a-z_0-9]*/i);
    const number = rest.match(/^\d+/);
    const symbol = rest.match(/^(>=|<=|<>|!=|[=><*,;()])/);
    if (quoted) tokens.push({ kind: 'string', value: quoted[1].replaceAll("''", "'") });
    else if (word) tokens.push({ kind: 'word', value: word[0].toLowerCase() });
    else if (number) tokens.push({ kind: 'number', value: number[0] });
    else if (symbol) tokens.push({ kind: 'symbol', value: symbol[0] });
    else throw new Error(`No se reconoce «${rest.slice(0, 18)}». Usa los nombres de columna del explorador.`);
    rest = rest.slice((quoted ?? word ?? number ?? symbol)![0].length).trimStart();
    if (tokens.length > 500) throw new Error('La consulta es demasiado larga. Divide la búsqueda en dos consultas.');
  }
  return tokens;
}

// Deliberately bounded SELECT interpreter: queries really filter the local canon,
// without eval, remote connections, fabricated rows, or pretending to run T-SQL.
export function runQuery(sql: string): QueryResult {
  if (sql.length > 8000) throw new Error('La consulta supera los 8.000 caracteres. Reduce la búsqueda.');
  const tokens = tokenize(sql);
  let position = 0;
  const peek = () => tokens[position]?.value;
  const take = (value: string) => { if (peek() === value) { position++; return true; } return false; };
  const expect = (value: string) => { if (!take(value)) throw new Error(`Se esperaba ${value.toUpperCase()}. Revisa la sintaxis o carga una consulta de ejemplo.`); };
  const identifier = () => {
    const token = tokens[position++];
    if (token?.kind !== 'word') throw new Error('Falta un nombre de tabla o columna. Consulta el explorador de la izquierda.');
    return token.value;
  };
  if (peek() !== 'select') throw new Error('Esta copia admite consultas SELECT de solo lectura. Prueba SELECT * FROM registros;');
  expect('select');
  let limit = take('top') ? Number(tokens[position++]?.value) : Infinity;
  if (!Number.isInteger(limit) && limit !== Infinity) throw new Error('TOP necesita un número entero.');
  const selected: string[] = [];
  if (take('*')) selected.push('*');
  else { selected.push(identifier()); while (take(',')) selected.push(identifier()); }
  expect('from');
  const tableName = identifier();
  const table = tables()[tableName];
  if (!table) throw new Error(`La tabla «${tableName}» no está en esta copia. Disponibles: registros y soportes.`);
  const column = () => {
    const name = identifier();
    if (!table.columns.includes(name)) throw new Error(`La columna «${name}» no existe en ${tableName}. Disponibles: ${table.columns.join(', ')}.`);
    return name;
  };
  const columns = selected[0] === '*' ? table.columns : selected;
  for (const name of columns) if (!table.columns.includes(name)) throw new Error(`La columna «${name}» no existe en ${tableName}. Disponibles: ${table.columns.join(', ')}.`);
  type Predicate = (row: DataRow) => boolean;
  function comparison(): Predicate {
    if (take('(')) { const predicate = disjunction(); expect(')'); return predicate; }
    const name = column();
    if (take('is')) {
      const negate = take('not'); expect('null');
      return (row) => negate ? row.cells[name] !== null : row.cells[name] === null;
    }
    const operator = tokens[position++]?.value;
    if (!['=', '!=', '<>', '>', '<', '>=', '<=', 'like'].includes(operator ?? '')) throw new Error('Usa =, <>, >, <, >=, <=, LIKE o IS NULL en el filtro.');
    const literal = tokens[position++];
    if (!literal || !['string', 'number'].includes(literal.kind)) throw new Error("Los textos del filtro van entre comillas simples: sistema = 'SQL Server'. Para campos ausentes usa IS NULL.");
    const value = literal.kind === 'number' ? Number(literal.value) : literal.value.toLocaleLowerCase();
    const pattern = operator === 'like'
      ? new RegExp(`^${String(value).split('').map((char) => char === '%' ? '.*' : char === '_' ? '.' : char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('')}$`, 'iu') : null;
    return (row) => {
      if (row.cells[name] === null) return false;
      const cell = typeof row.cells[name] === 'string' ? String(row.cells[name]).toLocaleLowerCase() : row.cells[name]!;
      if (pattern) return pattern.test(String(cell));
      if (operator === '=') return cell === value;
      if (operator === '!=' || operator === '<>') return cell !== value;
      if (operator === '>') return cell > value;
      if (operator === '<') return cell < value;
      if (operator === '>=') return cell >= value;
      return cell <= value;
    };
  }
  function conjunction(): Predicate {
    let predicate = comparison();
    while (take('and')) { const left = predicate; const right = comparison(); predicate = (row) => left(row) && right(row); }
    return predicate;
  }
  function disjunction(): Predicate {
    let predicate = conjunction();
    while (take('or')) { const left = predicate; const right = conjunction(); predicate = (row) => left(row) || right(row); }
    return predicate;
  }
  let rows = table.rows;
  if (take('where')) rows = rows.filter(disjunction());
  if (take('order')) {
    expect('by');
    const ordering: { name: string; direction: number }[] = [];
    do { const name = column(); const direction = take('desc') ? -1 : (take('asc'), 1); ordering.push({ name, direction }); } while (take(','));
    rows = [...rows].sort((a, b) => {
      for (const { name, direction } of ordering) {
        const left = a.cells[name]; const right = b.cells[name];
        const compared = left === right ? 0 : left === null ? -1 : right === null ? 1 : String(left).localeCompare(String(right));
        if (compared) return compared * direction;
      }
      return 0;
    });
  }
  if (take('limit')) {
    const token = tokens[position++];
    if (token?.kind !== 'number') throw new Error('LIMIT necesita un número entero.');
    limit = Math.min(limit, Number(token.value));
  }
  take(';');
  if (position !== tokens.length) throw new Error('Esta consola admite un SELECT por ejecución: WHERE, AND/OR, LIKE, IS NULL, ORDER BY, TOP y LIMIT. No admite JOIN ni funciones de SQL Server.');
  return { columns, rows: rows.slice(0, limit).map((row) => ({ sourceId: row.sourceId, values: columns.map((name) => row.cells[name]) })), table: tableName };
}

export const queryExamples = [
  { label: 'Lecturas SQL', sql: "SELECT hora, sistema, cuenta, detalle\nFROM registros\nWHERE sistema = 'SQL Server'\nORDER BY fecha, hora;" },
  { label: 'Seguir el tráfico', sql: "SELECT hora, sistema, cuenta, detalle\nFROM registros\nWHERE sistema = 'SQL Server'\n   OR sistema = 'Monitoreo de red'\nORDER BY fecha, hora;" },
  { label: 'Seguir la cuenta', sql: "SELECT hora, sistema, cuenta, detalle\nFROM registros\nWHERE cuenta = 'ext_ops_04'\nORDER BY fecha, hora;" },
  { label: 'Archivos ausentes', sql: 'SELECT tipo, archivo, sha256\nFROM soportes\nWHERE archivo IS NULL;' },
];
