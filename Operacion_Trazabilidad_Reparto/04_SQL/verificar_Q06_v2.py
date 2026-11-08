#!/usr/bin/env python3
"""Repite solo Q-06 y prueba etiquetas con CTE de control, sin modificar tablas.

Usa el SQL Server y auditor_lectura existentes mediante laboratorio.py. No crea
bases, usuarios ni datos persistentes. Rechaza una salida ya existente.
"""
import argparse
import csv
import datetime as dt
import hashlib
import json
import re
from pathlib import Path
import laboratorio as lab

ROOT = Path(__file__).resolve().parent.parent


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def query_body(text):
    match = re.search(r'-- Q-06 [^\n]*\n(.*?)(?=-- Q-07 )', text, re.S)
    if not match:
        raise ValueError('No se encontró exactamente el bloque Q-06')
    return match.group(1).rstrip()


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--base', default='RedNova_P1_Lab_v2')
    p.add_argument('--salida', required=True, help='Carpeta nueva de comprobantes')
    args = p.parse_args()
    if not re.fullmatch(r'RedNova_P1_[A-Za-z0-9_]+', args.base):
        p.error('Nombre de base no permitido')
    out = Path(args.salida).resolve()
    if not out.is_relative_to((ROOT / '03_Evidencias/resultados').resolve()):
        p.error('La salida debe estar en 03_Evidencias/resultados')
    out.mkdir(parents=True, exist_ok=False)
    sql = ROOT / '04_SQL/Analisis_Auditoria.sql'
    body = query_body(sql.read_text())
    identity = lab.query(
        "SELECT ORIGINAL_LOGIN() AS Login, USER_NAME() AS Usuario, DB_NAME() AS Base, "
        "CAST(SERVERPROPERTY('ProductVersion') AS varchar(40)) AS Motor", args.base, True)[0]
    assert identity['Login'] == identity['Usuario'] == 'auditor_lectura'
    before = lab.query('SELECT * FROM dbo.TransferenciasRed ORDER BY FlujoID', args.base, True)
    executed_at = lab.now()
    actual = lab.query(body, args.base, True, lab.PARAM)
    again = lab.query(body, args.base, True, lab.PARAM)
    assert actual == again
    lab.csvout(out / 'Q-06.csv', actual)
    previous = ROOT / '03_Evidencias/resultados/Q-06.csv'
    assert sha(out / 'Q-06.csv') == sha(previous), 'La muestra vigente cambió: revisar antes de promoverla'

    # Solo valores efímeros en una CTE; no se insertan en el laboratorio.
    normal = 'sin clasificación; volumen dentro del umbral'
    cases = [
        ('sin_clasificacion_normal', None, 5, 100, 100, normal),
        ('sin_clasificacion_exactamente_3x', None, 5, 100, 300, normal),
        ('sin_clasificacion_supera', None, 5, 100, 301, 'supera 3x'),
        ('clasificado_supera', 'control autorizado', 5, 100, 301, 'supera 3x'),
        ('clasificado_normal_excluido', 'control autorizado', 5, 100, 100, None),
        ('clasificado_exactamente_3x_excluido', 'control autorizado', 5, 100, 300, None),
        ('bytes_desconocidos', 'control autorizado', 5, 100, None, 'no evaluable'),
        ('dias_insuficientes', 'control autorizado', 2, 100, 100, 'no evaluable'),
        ('referencia_sin_bytes', 'control autorizado', 5, None, 100, 'no evaluable'),
        ('sin_referencia', 'control autorizado', 0, None, 100, 'no evaluable'),
    ]
    values = []
    expected = []
    literal = lambda x: 'NULL' if x is None else str(x)
    for i, (name, classification, days, reference, amount, label) in enumerate(cases, 1):
        origin, destination = f'192.0.2.{i}', f'203.0.113.{i}'
        for day in range(days):
            values.append(f"({i * 100 + day},'2026-10-{7 + day:02}T10:00:00','{origin}','{destination}',443,'TCP',{literal(reference)},N'referencia de control')")
        flow_id = 10000 + i
        cls = 'NULL' if classification is None else "N'" + classification + "'"
        values.append(f"({flow_id},'2026-10-14T10:00:00','{origin}','{destination}',443,'TCP',{literal(amount)},{cls})")
        expected.append({'escenario': name, 'FlujoID': flow_id, 'esperado': label})
    fixture = (
        'WITH RedControl AS (SELECT FlujoID, CAST(Hora AS datetime2(0)) AS HoraReportadaLocal, '
        'IPOrigen, IPDestino, Puerto, Protocolo, CAST(Bytes AS bigint) AS BytesEnviados, '
        'ClasificacionDestino FROM (VALUES\n' + ',\n'.join(values) +
        '\n) v(FlujoID,Hora,IPOrigen,IPDestino,Puerto,Protocolo,Bytes,ClasificacionDestino)),\n' +
        body.removeprefix('WITH ').replace('dbo.TransferenciasRed', 'RedControl'))
    (out / 'Escenarios_Q06.sql').write_text(
        '-- HIPOTETICO: CTE de control de etiquetas; no datos del incidente ni INSERT.\n' +
        lab.PARAM + fixture + '\n')
    test_rows = lab.query(fixture, args.base, True, lab.PARAM)
    selected = {x['FlujoID']: x['Evaluacion'] for x in test_rows}
    assert len(selected) == len(test_rows)
    assert set(selected) <= {x['FlujoID'] for x in expected}
    for x in expected:
        x['observado'] = selected.get(x['FlujoID'])
        x['aprobado'] = x['observado'] == x['esperado']
    assert all(x['aprobado'] for x in expected)
    after = lab.query('SELECT * FROM dbo.TransferenciasRed ORDER BY FlujoID', args.base, True)
    assert before == after
    lab.dump(out / 'Escenarios_Q06.json', {'hipoteticos': True, 'controles': expected, 'resultados_sql': test_rows})
    lab.dump(out / 'Comprobacion_Q06.json', {
        'inicio_utc': executed_at, 'fin_utc': lab.now(), 'conexion': identity,
        'datos': 'v2 existentes; no regenerados', 'filas': len(actual),
        'repeticion_identica': actual == again, 'csv_identico_al_previo': True,
        'sha256_csv': sha(out / 'Q-06.csv'), 'sha256_sql': sha(sql),
        'sha256_consulta': hashlib.sha256((lab.PARAM + body).encode()).hexdigest(),
        'sha256_script': sha(Path(__file__)), 'controles_aprobados': sum(x['aprobado'] for x in expected),
        'controles_total': len(expected), 'filas_red_antes_y_despues': len(before),
        'red_sin_cambios': before == after, 'alcance': 'Solo SELECT; no reconstrucción, carga ni restauración.',
        'revision_humana': 'Pendiente',
    })
    print(json.dumps({'filas': len(actual), 'csv_identico_al_previo': True,
                      'controles': len(expected), 'todos_aprobados': True,
                      'red_sin_cambios': before == after}, ensure_ascii=False))


if __name__ == '__main__':
    main()
