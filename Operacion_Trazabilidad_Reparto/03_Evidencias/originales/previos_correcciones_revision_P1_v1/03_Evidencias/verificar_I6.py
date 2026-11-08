#!/usr/bin/env python3
"""Reabre fuentes/resultados/exportaciones sin SQL y guarda resultados propios de I6."""
from pathlib import Path
from collections import Counter
import csv,json,hashlib,re,unicodedata,datetime,math
from zipfile import ZipFile
from xml.etree import ElementTree as ET
from docx import Document
from openpyxl import load_workbook
import pymupdf as fitz
from PIL import Image,ImageDraw
B=Path(__file__).resolve().parents[1];O=B/'03_Evidencias/resultados/I6';checks=[]
def check(name,result,detail=None):checks.append(dict(comprobacion=name,aprobado=bool(result),detalle=detail))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def csvrows(p):
 with p.open(encoding='utf-8-sig',newline='') as f:return list(csv.DictReader(f))
def norm(s):return re.sub(r'\s+','',unicodedata.normalize('NFKC',s)).replace('\u00ad','')
def plain(s):return re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',s).replace('**','').replace('`','')
entry=json.loads((O/'Entradas_verificadas_I6.json').read_text());check('317 referencias y 492 del manifiesto al abrir I6',entry['cotejos_registros']==317 and entry['cotejos_manifest']==492 and entry['discrepancias']==0)
# Independently reopen every execution file and SQL; no statements are run.
exe=csvrows(B/'03_Evidencias/resultados/Ejecuciones_v1.csv')
for r in exe:
 f=B/r['archivo']; rows=csvrows(f)
 check('Reapertura '+r['consulta'],sha(f)==r['sha256_csv'] and len(rows)==int(r['filas']) and sha(B/('04_SQL/Permisos_bitacora.sql' if r['consulta']=='Q-S01' else '04_SQL/Analisis_Auditoria.sql'))==r['sha256_archivo_sql'] and sha(B/'04_SQL/datos/v2/Manifest_datos_v2.json')==r['sha256_manifest'])
check('13 ejecuciones, motor y conjunto',len(exe)==13 and all(r['motor']=='16.0.4305.5' and r['datos']=='v2' for r in exe))
for r in json.loads((B/'03_Evidencias/resultados/Comparacion_reconstruccion.json').read_text())['comparaciones']:
 check('Reproducción histórica cotejada '+r['archivo'],sha(B/('03_Evidencias/resultados/I2_I3_repeticion/'+r['archivo']))==r['sha256_reconstruccion']==sha(B/('03_Evidencias/resultados/I2_I3_cierre/'+r['archivo'])))
q=csvrows(B/'03_Evidencias/resultados/Q-07.csv');hist=csvrows(B/'04_SQL/datos/v2/HistorialOrdenes.csv');lookup={r['CambioID']:r for r in hist}
check('216 filas completas Q07 frente a fuente v2',len(q)==216 and len({r['OrdenID'] for r in q})==216 and all(all(v==lookup[r['CambioID']][k] for k,v in r.items() if k in lookup[r['CambioID']]) for r in q))
check('144/72 y atribuciones desconocidas',Counter(r['Campo'] for r in q)=={'Monto':144,'Estado':72} and all(r[k]=='\\N' for r in q for k in ['UsuarioID','SesionID','Via']))
q8=csvrows(B/'03_Evidencias/resultados/Q-08.csv');check('Diez grupos de duplicidad, sin solapamiento histórico',len(q8)==10 and not json.loads((B/'03_Evidencias/resultados/I4/Analisis_ordenes_I4_v1.json').read_text())['interseccion_con_216'])
chrono=csvrows(B/'03_Evidencias/Cronologia_investigada_v1.csv');byid={r['evento_id']:r for r in chrono}
check('13 eventos y solo una cuenta identificada',len(chrono)==13 and [(r['evento_id'],r['cuenta']) for r in chrono if r['cuenta']]==[('EVT-02','ext_ops_04')])
check('Relojes desconocidos sin imputación',all(not r[k] for r in chrono for k in ['hora_original','zona_original','desfase_comprobado_segundos','hora_normalizada_comprobada']))
for r in json.loads((B/'03_Evidencias/resultados/I4/Intervalos_I4_v1.json').read_text())['intervalos']:
 a=datetime.datetime.fromisoformat(byid[r['desde']]['hora_reportada_local']);b=datetime.datetime.fromisoformat(byid[r['hasta']]['hora_reportada_local']);check('Intervalo '+r['tramo'],(b-a).total_seconds()/60==r['minutos'])
# Recompute serializations in memory, never rewrite data or I4 results.
vol=json.loads((B/'03_Evidencias/resultados/I4/Volumen_31840_I4_v1.json').read_text())
import io
clients=sorted(csvrows(B/'04_SQL/datos/v2/Clientes.csv'),key=lambda r:int(r['ClienteID']))[:31840]
buf=io.StringIO(newline='');writer=csv.DictWriter(buf,fieldnames=vol['campos'],lineterminator='\n');writer.writeheader();writer.writerows({k:r[k] for k in vol['campos']} for r in clients)
data1=buf.getvalue().encode();data2=''.join(json.dumps({k:None if r[k]=='\\N' else r[k] for k in vol['campos']},ensure_ascii=False,separators=(',',':'))+'\n' for r in clients).encode()
check('Volumen CSV/JSONL recontado sin regenerar resultados',all(len(d)==v['bytes'] and hashlib.sha256(d).hexdigest()==v['sha256'] for d,v in zip([data1,data2],vol['formatos'])),[len(data1),len(data2)])
permissions=csvrows(B/'03_Evidencias/resultados/Q-S01.csv');check('PT25 contexto ficticio con capacidad de modificación',any(r['UsuarioBD']=='admin_bitacora_lab' and r['PuedeUpdate']==r['PuedeDelete']=='1' and r['LoginConexion']=='sa' for r in permissions))
index=csvrows(B/'03_Evidencias/Indice_evidencias_v1.csv');check('28 códigos E y 188 filas de índice, hashes individuales',len(index)==188 and {r['evidencia_id'] for r in index}=={f'E-{n:02}' for n in range(1,29)} and all(not r['ruta_artefacto'] or sha(B/r['ruta_artefacto'])==r['sha256_artefacto'] for r in index))
check('11 acciones propuestas, dos borradores no concluyentes',len(csvrows(B/'05_Plan/Acciones_P1_0_72h_v1.csv'))==11 and all(r['estado'].startswith('Propuesta no ejecutada') for r in csvrows(B/'05_Plan/Acciones_P1_0_72h_v1.csv')) and all(x in (B/'03_Evidencias/Borradores_hallazgos_P1_v1.md').read_text() for x in ['B1-1','B1-2','no concluyente']))
# Exact cell coverage, reopening source XLSX and the actual Calc round trip.
for stem,src in [('indice_evidencias','Indice_evidencias_v1'),('Programa_pruebas_P1_v1','Programa_pruebas_P1_v1'),('Cronologia_investigada_v1','Cronologia_investigada_v1')]:
 with (B/f'03_Evidencias/{src}.csv').open(encoding='utf-8-sig',newline='') as f:expected=list(csv.reader(f))
 for loc in [B/f'03_Evidencias/{stem}.xlsx',O/f'reapertura-xlsx/{stem}.xlsx']:
  w=load_workbook(loc);values=[[str(v) if v is not None else '' for v in row] for row in w['Datos'].values]
  check('XLSX idéntico a CSV '+str(loc.relative_to(B)),values==expected,{'filas':len(values)-1,'columnas':len(values[0])})
  check('XLSX vacíos y fórmulas seguras '+str(loc.relative_to(B)),not any(c.data_type=='f' for ws in w for row in ws for c in row))
  links=[(loc.parent/c.hyperlink.target).resolve().is_file() for ws in w for row in ws for c in row if c.hyperlink and c.hyperlink.target]
  check('XLSX enlaces locales '+str(loc.relative_to(B)),all(links),{'enlaces':len(links)})
 w=load_workbook(B/f'03_Evidencias/{stem}.xlsx');check('Filtros, paneles y lectura '+stem,bool(w['Datos'].freeze_panes and w['Lectura'].auto_filter.ref and w['Procedencia']['B3'].value==sha(B/f'03_Evidencias/{src}.csv')))
# Source sections and DOCX exact paragraph/cell coverage, including hyperlink text.
from generar_I6 import md_blocks
md=(B/'01_Informe/Seccion_forense_P1_v1.md').read_text()
for f in ['Seccion_forense_P1_v1','Informe_equipo_parcial_P1_v1']:
 p=B/f'01_Informe/{f}.docx';d=Document(p);text=norm(''.join(t.text or '' for t in d._element.body.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t')))
 fragments=[plain(v) for k,v in md_blocks(md) if k!='table']+[plain(c) for k,v in md_blocks(md) if k=='table' for row in v for c in row]
 missing=[v[:120] for v in fragments if norm(v) not in text]
 check('DOCX cubre todas las celdas/párrafos editables '+f,not missing,missing)
 if f=='Seccion_forense_P1_v1':
  check('DOCX geometría y estilos plantilla v2',d.sections[0].page_width==Document(B/'01_Informe/Plantilla_UdeO_v2.docx').sections[0].page_width and d.styles['Normal'].font.name=='Times New Roman' and d.styles['Normal'].font.size.pt==12 and all(round(float(getattr(d.sections[0],s).inches),3)==1 for s in ['top_margin','bottom_margin','left_margin','right_margin']))
# Open every delivered PDF, render all pages, inspect bounds and required content.
files=[B/x for x in ['01_Informe/Seccion_forense_P1_v1.pdf','01_Informe/Informe_equipo_parcial_P1_v1.pdf','03_Evidencias/Papeles_Trabajo_P1_v1.pdf','03_Evidencias/Cronologia_investigada_v1.pdf','06_Comite/Presentacion_P1_v1.pdf','07_Referencias/Fuentes_P1_v1.pdf','07_Referencias/Uso_IA.pdf','06_Comite/simulacion_auditoria/artifacts/entrega/libreta-respaldo.pdf']]
pdfresults=[];render=O/'render';render.mkdir(exist_ok=True)
for p in files:
 d=fitz.open(p);alltext='\n'.join(page.get_text(clip=fitz.Rect(0,0,page.rect.width,page.rect.height-62)) if p.name.startswith('Seccion_forense') else page.get_text() for page in d);bounds=[];thumbs=[];links=[]
 for i,page in enumerate(d):
  for word in page.get_text('words'):
   if word[0]<0 or word[1]<0 or word[2]>page.rect.width+.5 or word[3]>page.rect.height+.5:bounds.append({'pagina':i+1,'palabra':word[4]})
  pix=page.get_pixmap(matrix=fitz.Matrix(.7,.7));im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples);im.thumbnail((306,400));thumbs.append(im)
  for link in page.get_links():
   if link.get('kind')==fitz.LINK_GOTO:links.append(0<=link.get('page',-1)<len(d))
   elif link.get('kind') in [fitz.LINK_URI,fitz.LINK_LAUNCH,fitz.LINK_GOTOR]:
    target=link.get('uri',link.get('file',''))
    if target and not target.startswith(('http:','https:','mailto:')):links.append((p.parent/target).resolve().exists())
 check('PDF render y contenido '+p.name,all(len(page.get_text().strip())>25 for page in d) and not bounds,{'paginas':len(d),'fuera_pagina':bounds})
 check('PDF destinos de enlaces '+p.name,all(links),{'enlaces_locales':len(links)})
 if 'Seccion_forense' in p.name:
  fragments=[plain(v) for k,v in md_blocks(md) if k!='table']+[plain(c) for k,v in md_blocks(md) if k=='table' for row in v for c in row]
  missing=[v[:110] for v in fragments if norm(v) not in norm(alltext)]
  check('PDF sección cubre fuente editable',not missing,missing)
 if 'Papeles_Trabajo' in p.name:
  check('PDF PT20–25 y seis enlaces de índice',all(re.search(r'^PT-'+str(n)+r' · (?:E-|alerta)',alltext,re.M) for n in range(20,26)) and len(d[0].get_links())==6 and len(d.get_toc())==8)
 if p.name=='Presentacion_P1_v1.pdf':
  slides=json.loads((B/'06_Comite/Presentacion_P1_v1.json').read_text())['diapositivas'];check('PDF seis diapositivas con puntos de fuente',len(d)==6 and all(norm(pt) in norm(d[i].get_text()) for i,s in enumerate(slides) for pt in s['puntos']))
 if p.name=='libreta-respaldo.pdf':check('Libreta seis revisiones y respuestas legibles',len(d)==12 and all(f'AU-0{i}' in alltext for i in range(1,7)) and 'SIN_VINCULO_NI_CONTENIDO' in alltext and '¿Qué' in alltext)
 cols=min(4,len(thumbs));grid=Image.new('RGB',(cols*326,math.ceil(len(thumbs)/cols)*430),'#cccccc');draw=ImageDraw.Draw(grid)
 for i,im in enumerate(thumbs):x=i%cols*326;y=i//cols*430;grid.paste(im,(x+10,y+20));draw.text((x+10,y+4),str(i+1),fill='black')
 grid.save(render/(p.stem+'.png'));pdfresults.append({'archivo':str(p.relative_to(B)),'paginas':len(d),'sha256':sha(p)})
# Five spoken answers: predicted ranges, never claimed as a timed human rehearsal.
guion=(B/'06_Comite/Guion_defensa_P1_v1.md').read_text();answers=[]
for code,block in re.findall(r'### (01|02|03|06|07)\.(.*?)(?=\n### |\n## |\Z)',guion,re.S):
 answer=block.split('**Respuesta.**',1)[1].strip();n=len(answer.split());lo=n/150*60;hi=n/130*60;answers.append({'pregunta':code,'palabras':n,'segundos_previstos_150ppm':round(lo,1),'segundos_previstos_130ppm':round(hi,1),'ensayo_humano':False});check('Respuesta '+code+' prevista 30–45 s',lo>=30 and hi<=45)
check('Cinco preguntas y tres escenarios hipotéticos',len(answers)==5 and len(re.findall(r'\*\*Ejercicio hipotético [ABC]:',guion))==3)
(O/'Revision_contenido_I6.json').write_text(json.dumps({'fecha_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sql_nuevo':False,'total':len(checks),'aprobadas':sum(c['aprobado'] for c in checks),'comprobaciones':checks,'pdf':pdfresults,'respuestas':answers},ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'total':len(checks),'aprobadas':sum(c['aprobado'] for c in checks),'pdf':pdfresults,'respuestas':answers},ensure_ascii=False))
for c in checks:
 if not c['aprobado']:print('FALLO',c)
raise SystemExit(0 if all(c['aprobado'] for c in checks) else 1)
