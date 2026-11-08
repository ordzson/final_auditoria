#!/usr/bin/env python3
"""Comprueba copias, contenido exportado, fuentes intactas y referencias locales de la edición docente."""
from pathlib import Path
import csv,datetime as dt,hashlib,json,re,unicodedata
from urllib.parse import unquote
import pymupdf as fitz
from openpyxl import load_workbook

BASE=Path(__file__).resolve().parents[1]
REV=BASE/'03_Evidencias/resultados/Revision_legibilidad_docente_v1'
DEST=BASE/'entregables'
checks=[]
def check(name,ok,detail=None):
    checks.append({'comprobacion':name,'aprobada':bool(ok),'detalle':detail})
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def rows(p):
    with p.open(encoding='utf-8-sig',newline='') as f:return list(csv.reader(f))
def normalize(s):return re.sub(r'\s+','',unicodedata.normalize('NFC',s)).replace('\u00ad','')
def md_visible(s):
    s=re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',s)
    return s.replace('**','').replace('`','').lstrip('# ')
def pdf_text(p):
    with fitz.open(p) as d:
        return '\n'.join(re.sub(r'Investigación del incidente · revisión pendiente ·\s*\d+','',page.get_text()) for page in d)

manifest=json.loads((DEST/'manifest_copias.json').read_text())
check('Doce documentos identificados',len(manifest['archivos'])==12)
for item in manifest['archivos']:
    p=DEST/item['archivo'];source=BASE/item['original']
    check('Copia exacta: '+p.name,p.read_bytes()==source.read_bytes() and sha(p)==item['sha256'] and p.stat().st_size==item['bytes'])
    if p.suffix=='.pdf':
        with fitz.open(p) as d:
            check('PDF abierto y sin páginas vacías: '+p.name,all(page.get_text().strip() for page in d),len(d))
            outside=[]
            for i,page in enumerate(d):
                for block in page.get_text('blocks'):
                    if block[0]<-1 or block[1]<-1 or block[2]>page.rect.width+1 or block[3]>page.rect.height+1:outside.append(i+1)
            check('Texto dentro de página: '+p.name,not outside,outside)

for source,pdf in [('01_Informe/Seccion_forense_P1_v1.md','Seccion_forense_P1_v1.pdf'),('03_Evidencias/Papeles_P1_v1.md','Papeles_Trabajo_P1_v1.pdf'),('07_Referencias/Fuentes_P1_v1.md','Fuentes_P1_v1.pdf')]:
    actual=normalize(pdf_text(DEST/pdf));missing=[]
    for line in (BASE/source).read_text().splitlines():
        if not line.strip() or line.startswith('|') or line.startswith('- '):continue
        visible=normalize(md_visible(line))
        if visible not in actual:missing.append(line[:120])
    check('Texto completo del editable: '+pdf,not missing,missing)
# The complete individual analysis must also be included in the partial team PDF.
individual=pdf_text(DEST/'Seccion_forense_P1_v1.pdf')
partial=normalize(pdf_text(DEST/'Informe_equipo_parcial_P1_v1.pdf'))
missing=[]
for line in (BASE/'01_Informe/Seccion_forense_P1_v1.md').read_text().splitlines():
    if line.strip() and not line.startswith('|') and normalize(md_visible(line)) not in partial:missing.append(line[:100])
check('Análisis completo en informe parcial',not missing,missing)
check('Claves de trabajo retiradas del informe principal',not re.search(r'\b(?:P[123]|I[1-6]|H-[ABC]|B1-[12]|CR-I4-\d+)\b',individual))
for phrase in ['2,058,909','5,115,483','777.11','312.78','216','144','72','315','355','no concluyentes']:
    check('Dato o límite conservado: '+phrase,phrase in individual)

for csv_name,xlsx_name in [('Indice_evidencias_v1','indice_evidencias'),('Programa_pruebas_P1_v1','Programa_pruebas_P1_v1'),('Cronologia_investigada_v1','Cronologia_investigada_v1')]:
    p=DEST/(xlsx_name+'.xlsx');w=load_workbook(p)
    check('Vista inicial descriptiva: '+xlsx_name,w.active.title=='Lectura' and 'Cómo leer' in w.sheetnames and 'Referencias' in w.sheetnames)
    actual=[[str(c or '') for c in row] for row in w['Datos'].values]
    expected=rows(BASE/'03_Evidencias'/(csv_name+'.csv'))
    check('Todos los datos técnicos conservados: '+xlsx_name,actual==expected,{'filas':len(expected)-1,'columnas':len(expected[0])})
    broken=[]
    for ws in w:
        for row in ws:
            for cell in row:
                if cell.hyperlink and cell.hyperlink.target:
                    target=(p.parent/unquote(cell.hyperlink.target)).resolve()
                    if not target.is_file():broken.append(str(target))
    check('Enlaces locales válidos: '+xlsx_name,not broken,broken)
    printed=REV/'vistas_lectura'/(xlsx_name+'.pdf')
    if printed.exists():
        text=normalize(pdf_text(printed));missing=[]
        for row in w['Lectura'].values:
            for value in row:
                if value and normalize(str(value)) not in text:missing.append(str(value)[:120])
        check('Vista de impresión sin texto perdido: '+xlsx_name,not missing,missing)
    else:check('Vista de impresión disponible: '+xlsx_name,False)

with fitz.open(DEST/'Papeles_Trabajo_P1_v1.pdf') as d:
    toc=d.get_toc();links=d[0].get_links()
    check('Índice enlazado a seis papeles',len(links)==6 and len(toc)==8)
    check('Destinos del índice correctos',all('PT-'+str(20+i) in d[l['page']].get_text() for i,l in enumerate(links)))
slides=json.loads((BASE/'06_Comite/Presentacion_P1_v1.json').read_text())['diapositivas']
with fitz.open(DEST/'Presentacion_P1_v1.pdf') as d:
    check('Seis diapositivas completas',len(d)==6 and all(all(normalize(point) in normalize(page.get_text()) for point in slide['puntos']) for page,slide in zip(d,slides)))
old=REV/'previos/07_Referencias/Uso_IA.pdf'
with fitz.open(old) as before,fitz.open(DEST/'Uso_IA.pdf') as after:
    start=len(after)-len(before)
    check('Registro histórico de IA conservado literalmente',start>0 and all(a.get_text()==after[start+i].get_text() for i,a in enumerate(before)))
old_rows=rows(REV/'previos/07_Referencias/Registro_uso_IA_v1.csv');new_rows=rows(BASE/'07_Referencias/Registro_uso_IA_v1.csv')
check('Trece entradas previas de IA intactas y nueva edición registrada',new_rows[:-1]==old_rows and new_rows[-1][0]=='IA-014')
prior=rows(REV/'previos/05_Plan/Acciones_P1_0_72h_v1.csv');current=rows(DEST/'Acciones_P1_0_72h_v1.csv')
check('Once acciones con los mismos plazos y prioridades',len(current)==12 and all(a[prior[0].index('plazo_horas_desde_T0')]==b[current[0].index('Plazo máximo propuesto en horas')] and a[prior[0].index('prioridad_provisional')]==b[current[0].index('Prioridad provisional')] for a,b in zip(prior[1:],current[1:])))
check('Responsable de verificación en todas las acciones',all(row[current[0].index('Responsable de verificación propuesto')] for row in current[1:]))
for p in [DEST/'LEEME.md',DEST/'Guion_defensa_P1_v1.md',DEST/'Borradores_hallazgos_P1_v1.md']:
    broken=[]
    for ref in re.findall(r'\[[^\]]+\]\(([^)]+)\)',p.read_text()):
        if not ref.startswith(('http:','https:')) and not (p.parent/unquote(ref)).is_file():broken.append(ref)
    check('Referencias de documento válidas: '+p.name,not broken,broken)
preserved=json.loads((REV/'Entradas_preservadas.json').read_text())['archivos']
check('Copias previas conservadas',all(sha(REV/'previos'/x['ruta'])==x['sha256'] for x in preserved),len(preserved))
registered=rows(REV/'previos/03_Evidencias/hashes_sha256_v1.csv');header=registered[0];immutable=[]
for row in registered[1:]:
    rel=row[header.index('ruta')]
    if rel.startswith('04_SQL/datos/v2/') and (BASE/rel).is_file():immutable.append(sha(BASE/rel)==row[header.index('sha256')])
check('Datos ficticios de origen sin cambios',bool(immutable) and all(immutable),len(immutable))
result={'fecha_utc':dt.datetime.now(dt.timezone.utc).isoformat(),'alcance':'Verificación documental automática de la edición docente; no valida hechos del incidente ni acredita revisión humana.','comprobaciones':checks,'aprobadas':sum(x['aprobada'] for x in checks),'total':len(checks)}
(REV/'Verificacion_documental.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
failures=[x for x in checks if not x['aprobada']]
print(json.dumps({'aprobadas':result['aprobadas'],'total':result['total'],'fallos':failures},ensure_ascii=False,indent=2))
raise SystemExit(bool(failures))
