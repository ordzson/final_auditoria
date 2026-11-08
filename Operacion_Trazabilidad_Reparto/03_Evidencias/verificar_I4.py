#!/usr/bin/env python3
"""Comprobación local de entregables I4; sin SQL, red, credenciales ni mutación de entradas."""
import csv
import hashlib
import json
import re
from datetime import datetime, timezone
from pathlib import Path

BASE = Path(__file__).resolve().parents[1]
OUT = BASE / '03_Evidencias/resultados/I4'


def read_csv(relative):
    with (BASE / relative).open(encoding='utf-8', newline='') as f:
        return list(csv.DictReader(f))


def main():
    checks=[]

    def check(name, result):
        checks.append(dict(comprobacion=name, aprobado=bool(result)))

    paths=['03_Evidencias/Papeles_P1_v1.md','03_Evidencias/Cronologia_investigada_v1.csv',
           '01_Informe/Seccion_forense_P1_v1.md','03_Evidencias/Mapa_causal_P1_v1.dot',
           '03_Evidencias/Mapa_causal_P1_v1.svg','03_Evidencias/Borradores_hallazgos_P1_v1.md',
           '05_Plan/Acciones_P1_0_72h_v1.csv']
    check('Siete archivos requeridos (seis entregables; mapa DOT/SVG)', all((BASE/p).stat().st_size>0 for p in paths))
    papers=(BASE/paths[0]).read_text()
    for n in range(20,26):
        block=papers.split(f'## PT-{n} ·',1)[1].split('\n## ',1)[0]
        check(f'PT-{n} campos C y conclusión limitada',all(s in block for s in [
            '**Objetivo.**','**Vínculos.**','**Fuente / fecha / custodio.**',
            '**Procedimiento ejecutado / muestra.**','**Resultado y límites.**',
            '**Conclusión.**','No concluyente']))
    chrono=read_csv(paths[1]);check('13 eventos únicos EVT-01–13',
        [e['evento_id'] for e in chrono]==[f'EVT-{i:02}' for i in range(1,14)])
    check('Originales, zona y normalización no inventados', all(not e[k] for e in chrono for k in [
        'hora_original','zona_original','desfase_comprobado_segundos','hora_normalizada_comprobada']))
    check('Identidad solo en EVT-02',[(e['evento_id'],e['cuenta']) for e in chrono if e['cuenta']]==[('EVT-02','ext_ops_04')])
    check('Fiabilidad y límites por evento',all(e['fiabilidad'] and e['motivo_fiabilidad'] and e['limite'] for e in chrono))
    actions=read_csv(paths[-1]);check('11 acciones y dos horizontes',len(actions)==11 and {a['horizonte'] for a in actions}=={'0–24 h','24–72 h'})
    check('Campos de acción completos',all(all(v for v in a.values()) for a in actions))
    check('Plazos en rango y no ejecutadas',all(int(a['plazo_horas_desde_T0'])<= (24 if a['horizonte']=='0–24 h' else 72)
         and a['estado'].startswith('Propuesta no ejecutada') for a in actions))
    ids={a['accion_id'] for a in actions}
    check('Dependencias A-I4 existentes',all(x in ids for a in actions for x in re.findall(r'A-I4-\d{2}',a['dependencias'])))
    drafts=(BASE/paths[-2]).read_text()
    for n in [1,2]:
        block=drafts.split(f'## B1-{n} ·')[1].split('\n## ',1)[0]
        check(f'B1-{n} campos D',all(f'| {v} |' in block for v in ['Condición','Criterio','Causa','Efecto / riesgo','Evidencia','Recomendación','Prioridad']))
    check('Dos causas distintas explícitas', 'Hipótesis organizativa' in drafts and 'Hipótesis técnica' in drafts)
    check('Sección ~cuatro páginas: rango editorial 1,600–2,200 palabras',1600<=len((BASE/paths[2]).read_text().split())<=2200)
    for name in paths+[ '07_Referencias/Fuentes_P1_v1.md']:
        if not name.endswith('.md'):
            continue
        for target in re.findall(r'\]\(([^)]+)\)',(BASE/name).read_text()):
            if not target.startswith(('https://','http://','#')):
                check(f'Enlace local {name} → {target}',((BASE/name).parent/target).exists())
    entries=json.loads((OUT/'Verificacion_entradas_I4_v1.json').read_text())
    check('305 cotejos SHA-256 de entradas',entries['comprobaciones']==305 and all(r['coincide'] for r in entries['detalle']))
    for folder in ['I2_I3_cierre','I2_I3_repeticion','I2_I3_verificacion_cierre']:
        d=json.loads((BASE/f'03_Evidencias/resultados/{folder}/Validacion_laboratorio_v1.json').read_text())
        check(f'Histórico {folder}: 95 comprobaciones aprobadas (sin SQL nuevo)',len(d['comprobaciones'])==95 and all(c['aprobado'] for c in d['comprobaciones']))
    prior=json.loads((BASE/'03_Evidencias/resultados/Comparacion_reconstruccion.json').read_text())
    check('15 CSV reconstrucción idénticos: cotejo actual de archivos',len(prior['comparaciones'])==15 and all(
        hashlib.sha256((BASE/f"03_Evidencias/resultados/I2_I3_repeticion/{r['archivo']}").read_bytes()).hexdigest()==r['sha256_reconstruccion']
        ==hashlib.sha256((BASE/f"03_Evidencias/resultados/I2_I3_cierre/{r['archivo']}").read_bytes()).hexdigest() for r in prior['comparaciones']))
    order=json.loads((OUT/'Analisis_ordenes_I4_v1.json').read_text())
    check('216 órdenes, campos y atribución desconocida',order['cambios']==order['ordenes_distintas']==216 and order['campos']=={'Monto':144,'Estado':72}
          and set(order['desconocidos'].values())=={216} and order['perdida_monetaria'] is None and not order['interseccion_con_216'])
    index=read_csv('03_Evidencias/Indice_evidencias_v1.csv')
    previous=read_csv('03_Evidencias/originales/previos_I4/03_Evidencias/Indice_evidencias_v1.csv')
    check('Sin nuevas E para derivados I4; E-29 sigue pendiente sin artefacto',
          set(r['evidencia_id'] for r in index)==set(r['evidencia_id'] for r in previous)=={f'E-{i:02}' for i in range(1,29)})
    check('Hashes individuales del índice vigentes',all(not r['ruta_artefacto'] or
          hashlib.sha256((BASE/r['ruta_artefacto']).read_bytes()).hexdigest()==r['sha256_artefacto'] for r in index))
    # El registro SHA final se coteja desde el cierre; no se crea autorreferencia al actualizar este informe.
    d=dict(fecha_utc=datetime.now(timezone.utc).isoformat(),sql_nuevo=False,
           alcance='Archivos, estructura, trazabilidad y comprobantes históricos; no revisión humana ni aprobación académica.',
           total=len(checks),aprobadas=sum(c['aprobado'] for c in checks),comprobaciones=checks)
    (OUT/'Validacion_entregables_I4_v1.json').write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({k:d[k] for k in ['total','aprobadas','sql_nuevo']},ensure_ascii=False))
    for c in checks:
        if not c['aprobado']:
            print(c)
    assert all(c['aprobado'] for c in checks)


if __name__=='__main__':
    main()
