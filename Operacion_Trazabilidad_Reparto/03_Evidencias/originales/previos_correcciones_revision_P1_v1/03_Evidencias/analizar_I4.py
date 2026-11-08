#!/usr/bin/env python3
"""I4: cotejos y cálculos sobre archivos existentes, sin conexión SQL ni secretos.

Ejecutar desde cualquier directorio: python3 ruta/a/analizar_I4.py
No modifica entradas ni genera datos del caso. Salidas derivadas en resultados/I4.
"""
import csv
import hashlib
import io
import json
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
OUT = BASE / '03_Evidencias/resultados/I4'
NULL = '\\N'


def rows(path):
    with (BASE / path).open(encoding='utf-8', newline='') as f:
        return list(csv.DictReader(f))


def digest(path):
    return hashlib.sha256((BASE / path).read_bytes()).hexdigest()


def save(name, data):
    (OUT / name).write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


def write_csv(path, data):
    with path.open('w', encoding='utf-8', newline='') as f:
        w = csv.DictWriter(f, fieldnames=list(data[0]), lineterminator='\n')
        w.writeheader()
        w.writerows(data)


def main():
    OUT.mkdir(exist_ok=True)
    now = datetime.now(timezone.utc).isoformat()
    # Se coteja la instantánea PREVIA a I4; el registro vigente se amplía al cerrar.
    checks = []
    for registry, key in [
        ('03_Evidencias/hashes_documentales_v1.csv', 'ruta_desde_Operacion_Trazabilidad_Reparto'),
        ('03_Evidencias/originales/previos_I4/03_Evidencias/hashes_sha256_v1.csv', 'ruta')]:
        for r in rows(registry):
            p = r[key]
            # Los documentos editados en I4 se cotejan con su copia previa preservada.
            backup = '03_Evidencias/originales/previos_I4/' + p
            actual_path = backup if (BASE / backup).is_file() else p
            h = digest(actual_path)
            checks.append(dict(registro=registry, ruta=p, archivo_cotejado=actual_path,
                               esperado=r['sha256'], observado=h, coincide=h == r['sha256']))
    manifest = json.loads((BASE / '04_SQL/datos/v2/Manifest_datos_v2.json').read_text())
    expected = dict(manifest['sha256_csv_y_soportes'])
    expected.update(manifest['sha256_scripts'])
    expected['04_SQL/01_esquema.sql'] = manifest['sha256_esquema']
    expected['03_Evidencias/Supuestos_P1_v1.csv'] = manifest['sha256_supuestos']
    for p, h in expected.items():
        checks.append(dict(registro='Manifest_datos_v2.json', ruta=p, archivo_cotejado=p,
                           esperado=h, observado=digest(p), coincide=digest(p) == h))
    assert all(c['coincide'] for c in checks), 'Discrepancia de entrada: detener análisis'
    save('Verificacion_entradas_I4_v1.json', dict(fecha_utc=now, metodo='Python hashlib.sha256',
         nota='Registro previo preservado; los documentos actualizados se cotejan contra esa copia. Sin SQL.',
         comprobaciones=len(checks), todas_coinciden=True, detalle=checks))

    q = {f'Q-{i:02}': rows(f'03_Evidencias/resultados/Q-{i:02}.csv') for i in range(1, 13)}
    executions = rows('03_Evidencias/resultados/Ejecuciones_v1.csv')
    for e in executions:
        assert digest(e['archivo']) == e['sha256_csv']
        assert digest('04_SQL/datos/v2/Manifest_datos_v2.json') == e['sha256_manifest']
        assert digest('04_SQL/Permisos_bitacora.sql' if e['consulta'] == 'Q-S01' else
                      '04_SQL/Analisis_Auditoria.sql') == e['sha256_archivo_sql']
        assert e['corte'] == '2026-10-15T23:59:59-06:00'
    for name, data in q.items():
        e = next(e for e in executions if e['consulta'] == name)
        assert len(data) == int(e['filas'])
        assert digest(f'03_Evidencias/resultados/{name}.csv') == e['sha256_csv']

    events = q['Q-12']
    assert len(events) == 13
    assert all(e['HoraOriginal'] == NULL and e['ZonaOriginal'] == NULL and
               e['DesfaseSegundos'] == NULL and e['RelojVerificado'] == '0' for e in events)
    times = {e['EventoID']: datetime.fromisoformat(e['HoraReportadaLocal']) for e in events}
    chrono = []
    for i, e in enumerate(events):
        delta = (times[e['EventoID']] - times[events[i-1]['EventoID']]).total_seconds()/60 if i else None
        if i:
            assert delta == float(e['MinutosDesdeAnterior'])
        chrono.append(dict(
            evento_id=e['EventoID'], hora_reportada_local=e['HoraReportadaLocal'],
            zona_referencia='UTC-06:00 (Proyecto p.4; S-03)',
            hora_original='', zona_original='', desfase_comprobado_segundos='',
            hora_normalizada_comprobada='',
            representacion_referencia=e['HoraReportadaLocal'] + '-06:00',
            fuente_reportada=e['Fuente'], fuente_id=e['FuenteID'],
            documento='00_Material_del_curso/Proyecto_Operacion_Trazabilidad_Auditoria_Sistemas.pdf',
            pagina=4, evento=e['Descripcion'],
            cuenta='' if e['CuentaReportada'] == NULL else e['CuentaReportada'], activo=e['Activo'],
            evidencia='' if e['ReferenciaExpediente'] == NULL else e['ReferenciaExpediente'],
            evidencia_transcripcion='E-23', consulta='Q-12',
            fiabilidad='baja para corroboración forense; alta para fidelidad de transcripción cotejada',
            motivo_fiabilidad='Resumen único; sin originales, reloj verificado ni fuente independiente. Hash identifica PDF/CSV.',
            certeza='indicio reportado; no hecho técnico autenticado',
            minutos_desde_anterior='' if delta is None else int(delta),
            limite='Intervalo entre marcas reportadas; no acredita continuidad de logs, duración del evento ni inacción.',
            desconocidos='Originales/relojes/custodia original; ' +
                         ('persona tras la cuenta' if e['CuentaReportada'] != NULL else 'cuenta y persona'),
            corte='2026-10-15T23:59:59-06:00'))
    write_csv(BASE / '03_Evidencias/Cronologia_investigada_v1.csv', chrono)
    pairs = [('remoto_a_alerta', 'EVT-02', 'EVT-08'), ('alerta_a_caida', 'EVT-08', 'EVT-09'),
             ('caida_a_solicitud_DR', 'EVT-09', 'EVT-10'), ('caida_a_consulta', 'EVT-09', 'EVT-11'),
             ('caida_a_escritura', 'EVT-09', 'EVT-12'), ('consulta_a_escritura', 'EVT-11', 'EVT-12'),
             ('caida_a_solicitud_conciliacion', 'EVT-09', 'EVT-13'),
             ('ordenes_a_despliegue', 'EVT-06', 'EVT-07'), ('lectura_a_flujo', 'EVT-04', 'EVT-05')]
    intervals = [dict(tramo=n, desde=a, hasta=b, minutos=(times[b]-times[a]).total_seconds()/60,
                      base='horas reportadas; no normalización comprobada') for n,a,b in pairs]
    sensitivity=[]
    for a,b in [('EVT-04','EVT-05'), ('EVT-06','EVT-07'), ('EVT-08','EVT-09'), ('EVT-09','EVT-11')]:
        gap=(times[b]-times[a]).total_seconds()/60
        for bound in [5,10,15]:
            same = next(e for e in events if e['EventoID']==a)['FuenteID'] == next(e for e in events if e['EventoID']==b)['FuenteID']
            for shared in [False,True] if same else [False]:
                error=0 if shared else 2*bound
                sensitivity.append(dict(desde=a,hasta=b,escenario='HIPOTETICO',
                    desfase_por_reloj_mas_menos_minutos=bound,
                    modelo='offset común constante (solo si mismo reloj)' if shared else 'offsets independientes',
                    intervalo_minimo=gap-error,intervalo_maximo=gap+error,
                    invierte_posible=gap-error<0,empate_posible=gap-error<=0<=gap+error))
    write_csv(OUT/'Sensibilidad_relojes_I4_v1.csv',sensitivity)
    save('Intervalos_I4_v1.json', dict(intervalos=intervals,
         formula='hora_reportada = hora_real + offset; delta_real = delta_reportada - (offset_B-offset_A)',
         incertidumbre_real='Sin cota verificable; ±5/10/15 min son ejercicios, no estimaciones ni intervalos de confianza.',
         primera_accion_alerta=None, asignacion_alerta=None,cierre_alerta=None))

    source = rows('04_SQL/datos/v2/HistorialOrdenes.csv')
    window = [r for r in source if '2026-10-14T02:17:00' <= r['FechaHora'] <= '2026-10-14T03:42:00']
    assert len(window) == len(q['Q-07']) == 216
    assert {r['CambioID'] for r in window} == {r['CambioID'] for r in q['Q-07']}
    # Cotejo de todos los campos comunes, no solo del conteo.
    indexed = {r['CambioID']:r for r in q['Q-07']}
    assert all(all(indexed[r['CambioID']][k] == v for k,v in r.items()) for r in window)
    ids={r['OrdenID'] for r in window}
    candidates={v for r in q['Q-08'] for v in r['Ordenes'].split(',')}
    save('Analisis_ordenes_I4_v1.json',dict(
        metodo='CSV/Counter/sets Python; cotejo de 216 filas y todos los campos comunes con HistorialOrdenes.csv. Sin SQL nuevo.',
        cambios=len(window),ordenes_distintas=len(ids),campos=dict(Counter(r['Campo'] for r in window)),
        marcas=dict(Counter(r['FechaHora'] for r in window)),
        desconocidos={k:sum(r[k]==NULL for r in window) for k in ['UsuarioID','SesionID','Via']},
        origen=dict(Counter(r['ClaseOrigen'] for r in window)),
        estados_sinteticos=sorted({(r['ValorAnterior'],r['ValorNuevo']) for r in window if r['Campo']=='Estado'}),
        grupos_candidatos=len(q['Q-08']),ordenes_en_grupos=len(candidates),
        interseccion_con_216=sorted(ids & candidates),
        facturacion_recibida=False,conciliacion_con_respaldo=False,perdida_monetaria=None,
        muestra=dict(CambioID=window[0]['CambioID'],OrdenID=window[0]['OrdenID'],
                     ClaseOrigen=window[0]['ClaseOrigen'],SupuestosAplicados=window[0]['SupuestosAplicados'])))

    # Serialización de un subconjunto determinista, no contenido del flujo E-04.
    clients=rows('04_SQL/datos/v2/Clientes.csv')
    fields=['ClienteID','Nombre','Departamento','Plan','FechaAlta','Estado','Clasificacion']
    sample=sorted(clients,key=lambda r:int(r['ClienteID']))[:31840]
    text=io.StringIO(newline='')
    writer=csv.DictWriter(text,fieldnames=fields,lineterminator='\n',quoting=csv.QUOTE_MINIMAL)
    writer.writeheader();writer.writerows({k:r[k] for k in fields} for r in sample)
    csv_bytes=text.getvalue().encode('utf-8')
    json_bytes=(''.join(json.dumps({k:None if r[k]==NULL else r[k] for k in fields},
                ensure_ascii=False,separators=(',',':'))+'\n' for r in sample)).encode('utf-8')
    volumes=[('1.6 GB decimal',1600000000),('1.6 GiB (alternativa de unidad)',1.6*2**30)]
    formats=[]
    for name, data in [('CSV UTF-8',csv_bytes),('JSON Lines UTF-8',json_bytes)]:
        formats.append(dict(formato=name,bytes=len(data),bytes_por_fila=len(data)/31840,
                            GB=len(data)/10**9,GiB=len(data)/2**30,sha256=hashlib.sha256(data).hexdigest(),
                            factores=[dict(unidad=u,volumen_bytes=v,volumen_dividido_serializado=v/len(data)) for u,v in volumes]))
    save('Volumen_31840_I4_v1.json',dict(
        muestra='Primeros 31,840 ClienteID sintéticos en orden numérico; no los registros leídos en producción.',
        campos=fields,formatos=formats,
        convenciones='UTF-8 sin BOM; LF; CSV coma/cabecera/QUOTE_MINIMAL, NULL literal \\N. JSONL compacto; claves en orden, IDs/campos no nulos como cadenas; NULL JSON null. Sin compresión ni red.',
        bytes_necesarios_por_registro=[dict(unidad=u,bytes_por_registro=v/31840) for u,v in volumes],
        escenarios_hipoteticos=[dict(bytes_por_registro=x,total_bytes=x*31840,GB=x*31840/10**9) for x in [1000,10000,50000]],
        limites='No se conoce esquema de producción, exportación, adjuntos, codificación, compresión, cifrado, repetición ni contenido del flujo. No se deriva tasa: 4 min entre marcas no es duración de transferencia. GB aproximado, bytes exactos ausentes.'))
    save('Comprobacion_archivos_I4_v1.json',dict(fecha_utc=now,
        conteos={k:len(v) for k,v in q.items()},registros_ejecucion_cotejados=len(executions),
        sql_ejecutado_en_I4=False,nota='Se reabrieron archivos y resultados históricos I2/I3; no se conectó ni se reconstruyó SQL Server.',
        todas_comprobaciones_aprobadas=True))
    print(json.dumps(dict(hashes=len(checks),eventos=len(events),ordenes=len(ids),formatos=formats),ensure_ascii=False,indent=2))


if __name__ == '__main__':
    main()
