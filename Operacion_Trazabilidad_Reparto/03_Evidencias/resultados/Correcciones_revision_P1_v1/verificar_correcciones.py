from pathlib import Path
import json,csv,hashlib,re,sys,datetime,unicodedata
from docx import Document
from openpyxl import load_workbook
import pymupdf as fitz
from PIL import Image,ImageDraw
R=Path(__file__).resolve().parents[3];O=R/'03_Evidencias/resultados/Correcciones_revision_P1_v1';B=R/'03_Evidencias/originales/previos_correcciones_revision_P1_v1';checks=[]
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def check(name,ok,detail=None):
 checks.append({'comprobacion':name,'aprobado':bool(ok),'detalle':detail})
 if not ok:raise AssertionError((name,detail))
def norm(s):return re.sub(r'\s+','',unicodedata.normalize('NFKC',s)).replace('\u00ad','')
def plain(s):return re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',s).replace('**','').replace('`','')
def rows(p):return list(csv.DictReader(p.open(encoding='utf-8-sig',newline='')))
entry=json.loads((O/'Entradas_y_preservacion.json').read_text());oldreg={r['ruta']:r['sha256'] for r in rows(B/'03_Evidencias/hashes_sha256_v1.csv')}
for x in entry['archivos_preservados']:
 check('Copia previa '+x['ruta'],sha(R/x['copia'])==x['sha256'])
 if x['ruta'] in oldreg:check('Entrada coincidente con registro previo '+x['ruta'],x['sha256']==oldreg[x['ruta']])
for x in entry['entradas_que_no_deben_cambiar']:check('Entrada conservada '+x['ruta'],sha(R/x['ruta'])==x['sha256'])
md=(R/'01_Informe/Seccion_forense_P1_v1.md').read_text();old=(B/'01_Informe/Seccion_forense_P1_v1.md').read_text();oldtxt='Confirmar: asignación histórica, acceso al dispositivo, tokens y acciones concordantes.';newtxt='Apoyaría atribuir el uso: asignación histórica, dispositivo, tokens y acciones concordantes. Uso indebido: contrastar autorizaciones vigentes y demostrar qué acciones las excedieron. La intención se evalúa aparte.'
check('Único cambio MD en H-B',md==old.replace(oldtxt,newtxt))
fragments=[]
for line in md.splitlines():
 s=line.strip()
 if not s or re.match(r'^\|[\s:|\-]+\|$',s):continue
 s=re.sub(r'^#+\s+','',plain(s))
 fragments.extend(c.strip() for c in s.strip('|').split('|')) if s.startswith('|') else fragments.append(s)
render=O/'render';render.mkdir(exist_ok=True);pdfsummary=[]
for name in ['Seccion_forense_P1_v1','Informe_equipo_parcial_P1_v1']:
 d=Document(R/'01_Informe'/f'{name}.docx');txt=''.join(e.text or '' for e in d._element.body.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'));oldD=Document(B/'01_Informe'/f'{name}.docx');oldT=''.join(e.text or '' for e in oldD._element.body.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'));check('DOCX solo criterio H-B '+name,txt==oldT.replace(oldtxt,newtxt));check('DOCX cubre MD '+name,all(norm(s) in norm(txt) for s in fragments),len(fragments))
for rel in ['01_Informe/Seccion_forense_P1_v1.pdf','01_Informe/Informe_equipo_parcial_P1_v1.pdf','03_Evidencias/Papeles_Trabajo_P1_v1.pdf']:
 p=R/rel;d=fitz.open(p);txt=''.join(pg.get_text(clip=fitz.Rect(0,0,pg.rect.width,pg.rect.height-62)) for pg in d);bounds=[];thumbs=[]
 for i,pg in enumerate(d):
  bounds.extend((i+1,w[4]) for w in pg.get_text('words') if w[0]<0 or w[1]<0 or w[2]>pg.rect.width+.5 or w[3]>pg.rect.height+.5)
  pix=pg.get_pixmap(matrix=fitz.Matrix(.75,.75));im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples);im.thumbnail((400,530));thumbs.append(im)
 check('PDF sin palabras fuera de página '+p.name,not bounds,bounds)
 if rel.startswith('01_Informe'):check('PDF cubre MD '+p.name,all(norm(s) in norm(txt) for s in fragments),len(fragments))
 else:
  check('PT conserva índice de seis enlaces',len(d[0].get_links())==6 and all(0<=l.get('page',-1)<len(d) for l in d[0].get_links()))
  check('PT incluye comprobación posterior Q-06',norm('diez escenarios CTE de control') in norm(txt))
 grid=Image.new('RGB',(1260,560*((len(thumbs)+2)//3)),'#ccc');draw=ImageDraw.Draw(grid)
 for i,im in enumerate(thumbs):x=i%3*420;y=i//3*560;grid.paste(im,(x+10,y+20));draw.text((x+10,y+3),str(i+1),fill='black')
 grid.save(render/(p.stem+'.png'));pdfsummary.append({'ruta':rel,'paginas':len(d),'sha256':sha(p)})
for stem,src in [('indice_evidencias','Indice_evidencias_v1'),('Programa_pruebas_P1_v1','Programa_pruebas_P1_v1')]:
 p=R/f'03_Evidencias/{stem}.xlsx';w=load_workbook(p);expect=list(csv.reader((R/f'03_Evidencias/{src}.csv').open(encoding='utf-8-sig',newline='')));actual=[[str(c) if c is not None else '' for c in row] for row in w['Datos'].values];check('XLSX cubre CSV '+stem,expect==actual,{'filas':len(actual)-1,'columnas':len(actual[0])});check('XLSX hash de procedencia '+stem,w['Procedencia']['B3'].value==sha(R/f'03_Evidencias/{src}.csv'));check('XLSX distingue comprobación posterior '+stem,'posterior a I6' in w['Procedencia']['B6'].value);check('XLSX vínculos existentes '+stem,all((p.parent/c.hyperlink.target).resolve().is_file() for s in w for row in s for c in row if c.hyperlink and c.hyperlink.target))
for x in rows(R/'03_Evidencias/Indice_evidencias_v1.csv'):
 if x['ruta_artefacto']:check('Índice hash '+x['ruta_artefacto'],sha(R/x['ruta_artefacto'])==x['sha256_artefacto'])
q=json.loads((O/'SQL_Q06/Comprobacion_Q06.json').read_text());check('Q-06 versión SQL ejecutada',sha(R/'04_SQL/Analisis_Auditoria.sql')==q['sha256_sql']);check('Q-06 script identificado',sha(R/'04_SQL/verificar_Q06_v2.py')==q['sha256_script']);check('Diez escenarios aprobados',q['controles_aprobados']==q['controles_total']==10)
PARAM="DECLARE @corte datetime2(0)='2026-10-15T23:59:59', @ref datetime2(0)='2026-10-07', @finref datetime2(0)='2026-10-14';\n"
exe=rows(R/'03_Evidencias/resultados/Ejecuciones_v1.csv');previous=rows(B/'03_Evidencias/resultados/Ejecuciones_v1.csv');check('Trece entradas de ejecución',len(exe)==13)
for x,prev in zip(exe,previous):
 sqlfile=R/x['archivo_sql'];check('Versión SQL de '+x['consulta'],sha(sqlfile)==x['sha256_archivo_sql']);check('Resultado de '+x['consulta'],sha(R/x['archivo'])==x['sha256_csv']);check('Manifest v2 de '+x['consulta'],sha(R/'04_SQL/datos/v2/Manifest_datos_v2.json')==x['sha256_manifest'])
 if x['consulta']=='Q-S01':h=sha(sqlfile)
 elif x['consulta']=='Q-06':
  body=re.search(r'-- Q-06 [^\n]*\n(.*?)(?=-- Q-07 )',sqlfile.read_text(),re.S)[1].rstrip();h=hashlib.sha256((PARAM+body).encode()).hexdigest()
 else:
  blocks=re.split(r'-- Q-(\d\d) ',sqlfile.read_text())[1:];i=blocks.index(x['consulta'][2:]);body='\n'.join(blocks[i+1].splitlines()[1:]);h=hashlib.sha256((PARAM+body).encode()).hexdigest()
 check('Hash de sentencia de '+x['consulta'],h==x['sha256_consulta'])
 if x['consulta']!='Q-06':check('Registro histórico sin alterar '+x['consulta'],all(x[k]==v for k,v in prev.items()))
check('B1-1 localizador estable','E-22/Q-11, AlertaID=6 (cuarto registro de datos)' in (R/'03_Evidencias/Borradores_hallazgos_P1_v1.md').read_text())
summary={'fecha_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'total':len(checks),'aprobadas':sum(x['aprobado'] for x in checks),'alcance':'Solo correcciones y dependencias; no reemplaza 98/98 I6; revisión humana pendiente.','pdf':pdfsummary,'comprobaciones':checks};(O/'Verificacion_documentos.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in summary.items() if k!='comprobaciones'},ensure_ascii=False))
