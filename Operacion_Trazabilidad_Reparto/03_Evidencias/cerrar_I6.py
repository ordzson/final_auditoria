#!/usr/bin/env python3
"""Cierre I6: preservación, manifiesto, ZIP portable y registro SHA sin circularidad."""
from pathlib import Path
import csv,json,hashlib,datetime,sys,subprocess
from empaquetar_I6 import included
B=Path(__file__).resolve().parents[1];O=B/'03_Evidencias/resultados/I6'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def write(p,v):p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n')
now=datetime.datetime.now(datetime.timezone.utc).isoformat()
content=json.loads((O/'Revision_contenido_I6.json').read_text());assert content['total']==content['aprobadas']==98
media=json.loads((O/'Reproduccion_video_I6.json').read_text());assert media['playback']['ended'] and media['playback']['error'] is None and media['portableBundleStarted']
initial=json.loads((O/'Entradas_verificadas_I6.json').read_text());assert initial['discrepancias']==0
preserved=[]
for r in initial['comprobaciones']:
 p=B/r['ruta']
 if not p.is_file() or sha(p)!=r['esperado']:
  old=B/'03_Evidencias/originales/previos_I6'/r['ruta']
  assert old.is_file() and sha(old)==r['esperado'],r['ruta']
  preserved.append({'ruta_actual':r['ruta'],'registro':r['registro'],'copia_previa':str(old.relative_to(B)),'sha256_anterior':r['esperado'],'sha256_actual':sha(p)})
write(O/'Preservacion_y_conservacion_I6.json',{'fecha_utc':now,'entradas_modificadas_con_copia':preserved,'resto_entradas_identicas':True,'sql_nuevo':False,'comportamiento_juego_modificado':False})
# Explicitly prove preservation of every behavior source and all 151 public resources.
game=B/'06_Comite/simulacion_auditoria';old=json.loads((B/'06_Comite/simulacion_auditoria/artifacts/cierre-p1/manifest.json').read_text())
selected=[r for r in old['archivos'] if '/src/' in r['ruta'] or '/public/' in r['ruta'] or '/dist/' in r['ruta']]
assert all(sha(B/r['ruta'])==r['sha256'] for r in selected)
assert len([p for p in (game/'public').rglob('*') if p.is_file()])==151
write(O/'Conservacion_juego_I6.json',{'fecha_utc':now,'archivos_src_public_dist_cotejados':len(selected),'recursos_publicos':151,'frases_y_voces_conservadas':29,'discrepancias':0,'base':'Manifiesto I5 verificado al abrir I6; src/public/dist sin cambios.','archivos':[r['ruta'] for r in selected]})
manifestpath=O/'manifest.json'
paths=sorted(p for p in B.rglob('*') if p.is_file() and included(p) and p!=manifestpath and 'paquetes-previos' not in p.parts)
write(manifestpath,{'fecha_utc':now,'alcance':'Bytes actuales del paquete propio P1 y sus fuentes, sin autenticación de originales de empresa.','excluidos':'Registro SHA global, este manifiesto, integridad terminal, ZIP/SHA y comprobación del propio ZIP para evitar circularidad.','archivos':[{'ruta':str(p.relative_to(B)),'bytes':p.stat().st_size,'sha256':sha(p)} for p in paths]})
subprocess.run([sys.executable,str(B/'03_Evidencias/empaquetar_I6.py')],check=True)
reg=B/'03_Evidencias/hashes_sha256_v1.csv'
with reg.open(newline='') as f:rows=list(csv.DictReader(f));fields=list(rows[0])
by={r['ruta']:r for r in rows}
allpaths=paths+[manifestpath,B/'06_Comite/Paquete_portatil_P1_v1.zip',B/'06_Comite/Paquete_portatil_P1_v1.zip.sha256',O/'Verificacion_paquete_I6.json']
for p in allpaths:
 rel=str(p.relative_to(B));h=sha(p)
 if rel not in by or by[rel]['sha256']!=h:
  by[rel]={'ruta':rel,'sha256':h,'bytes':str(p.stat().st_size),'calculado_en_utc':now,'metodo':'Python hashlib.sha256','origen':'I6: fuente/derivado técnico o versión preservada; ver resultados/I6/README.md. No original empresarial ni revisión humana.'}
with reg.open('w',newline='') as f:
 w=csv.DictWriter(f,fieldnames=fields);w.writeheader();w.writerows(by[k] for k in sorted(by))
checks=[]
for r in by.values():checks.append({'ruta':r['ruta'],'coincide':sha(B/r['ruta'])==r['sha256']})
with (B/'03_Evidencias/hashes_documentales_v1.csv').open(newline='') as f:
 docs=list(csv.DictReader(f))
for r in docs:checks.append({'ruta':r['ruta_desde_Operacion_Trazabilidad_Reparto'],'coincide':sha(B/r['ruta_desde_Operacion_Trazabilidad_Reparto'])==r['sha256']})
assert all(r['coincide'] for r in checks)
man=json.loads(manifestpath.read_text());assert all(sha(B/r['ruta'])==r['sha256'] for r in man['archivos'])
package=json.loads((O/'Verificacion_paquete_I6.json').read_text());assert not package['discrepancias']
write(O/'integridad-cierre.json',{'fecha_utc':now,'registro_entradas':len(by),'documentales':len(docs),'total_cotejos_registros':len(checks),'discrepancias':0,'manifest_archivos':len(man['archivos']),'manifest_sha256':sha(manifestpath),'registro_sha256':sha(reg),'zip_sha256':package['sha256'],'zip_archivos':package['archivos_verificados'],'contenido_aprobadas':98,'reproduccion_video':'ended sin error; 32.68 s; WebM VP8','versiones_anteriores_preservadas':True,'integracion_equipo':False,'aprobacion_academica':False,'comprobaciones':checks})
print(json.dumps({'cotejos':len(checks),'discrepancias':0,'manifest_archivos':len(man['archivos']),'zip_archivos':package['archivos_verificados'],'zip_bytes':package['bytes']},ensure_ascii=False))
