#!/usr/bin/env python3
"""Exporta la edición para el docente sin ejecutar SQL ni modificar los datos de laboratorio.
Usa las dependencias de requisitos_I6.txt. Conserva el historial de IA como anexo literal.
"""
from pathlib import Path
import csv, datetime as dt, hashlib, json, math, re, shutil, subprocess
from textwrap import wrap
import generar_I6 as g
import pymupdf as fitz
from docx import Document
from docx.shared import Pt
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter
from reportlab.platypus import PageBreak

BASE = Path(__file__).resolve().parents[1]
REV = BASE/'03_Evidencias/resultados/Revision_legibilidad_docente_v1'
DEST = BASE/'entregables'
NAMES = {'P1':'Anthony Samuel Ordoñez Son','P2':'María José Aldana Culajay','P3':'Luis Antonio Vicente Zapón'}
PAPERS = {
'PT-20':'Sesión remota y verificación de identidad',
'PT-21':'Aumento de permisos y lectura de clientes',
'PT-22':'Transferencia externa y comparación de tamaños',
'PT-23':'Cambios de órdenes, duplicidad y respaldos',
'PT-24':'Seguimiento de la alerta crítica',
'PT-25':'Integridad de registros y fiabilidad de horarios'}
QUERIES = dict(zip(['Q-'+f'{n:02}' for n in range(1,13)]+['Q-S01','V-LAB'],[
'Cuentas activas de personal desvinculado','Permisos y verificación adicional de identidad',
'Horarios de acceso por cuenta','Aumento de permisos','Volumen de lectura de clientes',
'Transferencias de red','Cambios de órdenes','Posibles órdenes duplicadas','Programación y prueba de respaldos',
'Instalaciones de nuevas versiones','Seguimiento de alertas','Secuencia de eventos reportados',
'Permisos para modificar registros','Comprobación de la base ficticia']))
EVIDENCE = dict(zip(['E-'+f'{n:02}' for n in range(1,29)],[
'Usuarios y permisos','Acceso remoto','Lectura masiva de clientes','Transferencia externa',
'Cambios de órdenes comerciales','Autorización de instalación de software','Alerta crítica de seguridad',
'Respaldos','Contrato del proveedor','Clasificación de una sesión por el asistente de IA',
'Registro de preparación del laboratorio',*[QUERIES[f'Q-{n:02}'] for n in range(1,13)],
'Permisos efectivos de usuarios ficticios','Validación y ejecución del laboratorio',
'Archivos ficticios recibidos y preservados','Código y consultas del laboratorio','Diccionario y relaciones de datos']))

def read_csv(p):
    with p.open(encoding='utf-8-sig',newline='') as f:
        reader=csv.DictReader(f);return reader.fieldnames,list(reader)

def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()

def human(s):
    replacements={
'R/C definitivos pendientes de P2':'evaluación definitiva de riesgos y controles pendiente de María José Aldana Culajay',
'R/C':'riesgos y controles','Pendiente de P2':'Pendiente de María José Aldana Culajay',
'S-P1-ACC':'supuesto de cuentas ficticias','S-P1-NOR':'patrón habitual supuesto',
'S-P1-UMB':'umbrales del ejercicio','S-P1-ORD':'campos y montos ficticios de órdenes',
'S-P1-CAS':'representación del resumen del caso','S-03':'referencia horaria de Guatemala',
'S-04':'supuesto de respaldos','sin MFA':'sin verificación adicional a la contraseña',
'MFA':'autenticación multifactor (verificación adicional a la contraseña)',
'NULL':'desconocido','login':'nombre de acceso','ticket':'registro de atención o autorización',
'CTE':'casos de prueba de la consulta','18 FK':'18 relaciones entre tablas',
'ejecutada_comprobada':'Ejecutada y comprobada en el laboratorio',
'UPDATE/DELETE':'modificar y eliminar registros','logs':'registros de actividad'}
    for a,b in replacements.items():s=s.replace(a,b)
    for code,name in sorted(NAMES.items()):s=re.sub(r'\b'+code+r'\b',name,s)
    for key,meaning in {'API':'interfaz de integración entre sistemas (API)',
        'CRM':'sistema comercial y de clientes (CRM)',
        'ERP':'sistema financiero y de facturación (ERP)',
        'DR':'recuperación ante desastres',
        'SIEM':'sistema de monitoreo de seguridad',
        'TI':'Tecnología de la información',
        'GB':'gigabytes',
        'GiB':'gibibytes (unidad binaria de tamaño)',
        'FK':'relaciones entre tablas'}.items():
        s=re.sub(r'\b'+key+r'\b',meaning,s)
    return (s.replace('recertificación','revisión de permisos')
        .replace('recertificaciones','revisiones de permisos')
        .replace('>3x','más de tres veces').replace('3x','tres veces')
        .replace('>=5','al menos cinco').replace('>25%','mayor de 25 %')
        .replace('nulo','dato no aportado'))

def link(cell,path):
    if path and (BASE/path).is_file():
        cell.hyperlink='../'+path
        cell.font=Font(name='Calibri',size=11,color='145A75',underline='single')

def format_sheet(ws,widths,header=1,technical=False):
    ws.sheet_view.zoomScale=90 if not technical else 70
    ws.freeze_panes=f'B{header+1}'
    ws.auto_filter.ref=f'A{header}:{get_column_letter(ws.max_column)}{ws.max_row}'
    for i,width in enumerate(widths,1):ws.column_dimensions[get_column_letter(i)].width=width
    for row in ws:
        for c in row:
            c.font=Font(name='Calibri',size=11)
            c.alignment=Alignment(vertical='top',wrap_text=True)
            # Every cell is literal text, including historical material beginning with '='.
            if isinstance(c.value,str):c.data_type='s'
        if row[0].row==header:
            for c in row:
                c.fill=PatternFill('solid',fgColor='163D4B');c.font=Font(name='Calibri',size=11,bold=True,color='FFFFFF')
            ws.row_dimensions[header].height=34
        elif row[0].row>header:
            lines=max(sum(max(1,len(wrap(line,max(12,int(widths[i]*0.90)))) ) for line in str(c.value or '').split('\n')) for i,c in enumerate(row))
            ws.row_dimensions[row[0].row].height=min(400,max(34,lines*16+10))
            if row[0].row%2:
                for c in row:c.fill=PatternFill('solid',fgColor='F1F5F6')
    ws.sheet_properties.pageSetUpPr.fitToPage=True
    ws.page_setup.orientation='landscape';ws.page_setup.paperSize=ws.PAPERSIZE_A3
    ws.page_setup.fitToWidth=1;ws.page_setup.fitToHeight=0
    ws.print_title_rows=f'{header}:{header}';ws.print_area=ws.dimensions
    ws.oddFooter.center.text='Investigación del incidente · revisión del estudiante pendiente · &P / &N'
    ws.sheet_properties.outlinePr.summaryRight=False


def workbook(kind,source,target):
    fields,rows=read_csv(source);wb=Workbook();view=wb.active;view.title='Lectura'
    refs=wb.create_sheet('Referencias');raw=wb.create_sheet('Datos');guide=wb.create_sheet('Cómo leer');meta=wb.create_sheet('Procedencia')
    raw.append(fields)
    for row in rows:raw.append([row[f] for f in fields])
    if kind=='indice':
        view.append(['Material examinado','Qué contiene o reporta','Procedencia y límite','Dónde revisarlo'])
        refs.append(['Material','Código de localización','Archivo del proyecto','Pruebas relacionadas','Papel de trabajo','Filas en Datos'])
        grouped={}
        for n,row in enumerate(rows,2):grouped.setdefault(row['evidencia_id'],[]).append((n,row))
        for code,items in grouped.items():
            row=items[0][1];name=EVIDENCE.get(code,human(row['tipo']))
            course=int(code.split('-')[1])<=10
            desc=row['senal_reportada_por_el_curso'] if course else ('Archivos que documentan '+name.lower()+'.')
            desc=human(desc)
            provenance='Resumen del curso; registros originales de RedNova no recibidos.' if course else 'Material del laboratorio ficticio; no autentica el incidente.'
            path=row['ruta_documento_fuente'] if course else row['ruta_artefacto']
            view.append([name,desc,provenance,('Proyecto, página '+row['pagina_documento_fuente']) if course else 'Abrir archivo principal'])
            link(view.cell(view.max_row,4),path)
            for n,r in items:
                refs.append([name,code,r['ruta_artefacto'] or r['ruta_documento_fuente'],r['prueba_vinculada'],r['papel_trabajo_vinculado'],n])
                link(refs.cell(refs.max_row,3),r['ruta_artefacto'] or r['ruta_documento_fuente'])
        widths=[30,54,48,42];rwidths=[30,20,65,27,20,18]
    elif kind=='programa':
        view.append(['Qué se prueba','Cómo se examinó','Resultado del laboratorio','Límite para concluir sobre RedNova','Archivo de resultado'])
        refs.append(['Tema','Prueba','Consulta','Evidencia','Papel o responsable','Criterio del ejercicio'])
        for r in rows:
            name=QUERIES[r['consulta']]
            view.append([name,human(r['procedimiento']),human(r['resultado_observado']).replace(r['consulta'],'de la consulta'),human(r['limitaciones']),'Abrir resultado'])
            link(view.cell(view.max_row,5),r['archivo_resultado'])
            refs.append([name,r['prueba'],r['consulta'],r['evidencia'],human(r['papel_destinatario']),human(r['criterio'])])
        widths=[28,44,35,42,20];rwidths=[35,15,16,28,45,60]
    else:
        view.append(['Fecha y hora reportadas','Qué ocurrió según el caso','Fuente que menciona el caso','Cuenta identificada','Qué falta comprobar'])
        refs.append(['Evento','Evidencia del curso','Consulta de transcripción','Papel de trabajo relacionado','Archivo fuente','Fila en Datos'])
        for n,r in enumerate(rows,2):
            event=human(r['evento']).replace('de cuenta ext_ops_04','de la cuenta remota identificada')
            account='Cuenta remota denominada ext_ops_04; persona desconocida' if r['cuenta'] else 'No identificada en el caso'
            sources={'VPN':'Servicio de acceso remoto','CRM':'Sistema comercial y de clientes','SQL Server':'Base de datos SQL Server','SQLServer':'Base de datos SQL Server','TI':'Tecnología de la información','API':'Interfaz de integración entre sistemas'}
            source_name=sources.get(r['fuente_reportada'],r['fuente_reportada'])
            event=event[0].upper()+event[1:]
            view.append([r['hora_reportada_local'].replace('T',' '),event,source_name,account,'Faltan registro original y reloj verificado. La proximidad temporal no demuestra causa ni falta de atención.'])
            code=r['evidencia'];paper={'E-02':'PT-20','E-03':'PT-21','E-04':'PT-22','E-05':'PT-23','E-07':'PT-24'}.get(code,'PT-25')
            refs.append([r['evento_id'],(EVIDENCE.get(code,'')+' ('+code+')') if code else 'Sin código específico del curso',r['consulta'],PAPERS[paper]+' ('+paper+')',r['documento'],n]);link(refs.cell(refs.max_row,5),r['documento'])
        widths=[25,49,25,30,43];rwidths=[18,40,25,54,65,18]
    format_sheet(view,widths);format_sheet(refs,rwidths)
    format_sheet(raw,[max(22,min(65,len(f)+8)) for f in fields],technical=True)
    for row in raw.iter_rows(min_row=2):
        for c in row:
            if isinstance(c.value,str):link(c,c.value)
    guide.append(['Elemento','Cómo interpretarlo'])
    for r in [
('Lectura','Vista principal en lenguaje descriptivo. Permite entender los resultados sin conocer claves internas.'),
('Referencias','Relaciona cada tema con códigos, archivos y filas. Los códigos sirven para localizar soporte.'),
('Datos','Transcripción íntegra del archivo CSV técnico: conserva encabezados, valores y campos vacíos. No es un segundo análisis.'),
('Procedencia','Identifica la fuente editable, su huella digital y los límites de esta edición.'),
('Tipos de material','El caso resume hechos reportados. El laboratorio usa datos inventados para probar métodos; no confirma el incidente.'),
('Campo vacío','Dato no aportado o relación pendiente. No significa cero ni ausencia demostrada.'),
('E / PT / T / Q','Entrada de evidencia / papel de trabajo / prueba / consulta a la base de datos. Los nombres completos están en Lectura.'),
('Cuenta remota','ext_ops_04 es el nombre de una cuenta del caso, no la identidad de una persona.'),
('MFA / VPN / API / CRM','Verificación adicional de identidad / acceso remoto / interfaz entre sistemas / sistema comercial y de clientes.'),
('CSV / SQL / JSON / SHA-256','Tabla de texto / lenguaje de consultas / formato estructurado de datos / huella digital para detectar cambios en archivos.'),
('P1 / P2 / P3','Anthony Samuel Ordoñez Son / María José Aldana Culajay / Luis Antonio Vicente Zapón. Son responsables de elaboración.'),
('I1 a I6 / S / R / C','Sesiones de preparación / supuesto del ejercicio / riesgo / control. No describen fases del ataque.'),
('S-P1-ACC / CAS / NOR / UMB / ORD','Supuestos de cuentas / representación del caso / patrón habitual / umbrales / campos y montos de órdenes.'),
('Revisión del estudiante','Pendiente. La edición y las comprobaciones automáticas no acreditan firma ni aceptación académica.'),
('Enlaces','Abrir junto con las carpetas del proyecto. Las rutas son relativas; no contienen registros originales de la empresa.')]:guide.append(r)
    format_sheet(guide,[28,115])
    meta.append(['Dato','Valor'])
    for r in [('Fuente editable',str(source.relative_to(BASE))),('Huella SHA-256 del archivo fuente',sha(source)),('Número de filas técnicas',len(rows)),('Edición','Vista descriptiva para el docente. Datos conserva las columnas y celdas de la fuente.'),('Fecha de exportación UTC',dt.datetime.now(dt.timezone.utc).isoformat()),('Límite','No se ejecutan consultas nuevas ni se agregan hechos del incidente.')]:meta.append(r)
    format_sheet(meta,[40,110]);link(meta['B2'],str(source.relative_to(BASE)))
    wb.active=0;wb.save(target)


def papers():
    text=(BASE/'03_Evidencias/Papeles_P1_v1.md').read_text()
    parts=re.split(r'(?=^## PT-\d+)',text,flags=re.M)
    target=BASE/'03_Evidencias/Papeles_Trabajo_P1_v1.pdf';toc={code:0 for code in PAPERS}
    for _ in range(3):
        story=[g.para('Papeles de trabajo: investigación del incidente','Title'),g.para('Guía de lectura','Heading1'),g.para('Cada papel presenta objetivo, material, procedimiento, resultado y conclusión. Los códigos al final permiten encontrar el soporte técnico.')]
        for code,name in PAPERS.items():story.append(g.para(f'{name} · {code} · página {toc[code] or "—"}'))
        story += [g.para('Son seis papeles individuales. La integración del equipo y la revisión del estudiante siguen pendientes.'),PageBreak()]
        story+=g.pdf_blocks(parts[0]);story.append(PageBreak())
        for part in parts[1:]:story+=g.pdf_blocks(part);story.append(PageBreak())
        g.pdf_doc(target,story[:-1])
        with fitz.open(target) as d:
            for code in PAPERS:
                toc[code]=next(i+1 for i,p in enumerate(d) if re.search(r'^'+code+r' ·',p.get_text(),re.M))
    with fitz.open(target) as d:
        d.set_toc([[1,'Guía de lectura',1],[1,'Procedencia y método',2]]+[[1,name,toc[code]] for code,name in PAPERS.items()])
        for code in PAPERS:
            for rect in d[0].search_for(code):d[0].insert_link({'kind':fitz.LINK_GOTO,'from':rect,'page':toc[code]-1})
        temp=target.with_suffix('.tmp.pdf');d.save(temp,garbage=3,deflate=True)
    temp.replace(target)
    (REV/'Indice_paginas.json').write_text(json.dumps(toc,indent=2)+'\n')


def documents():
    text=(BASE/'01_Informe/Seccion_forense_P1_v1.md').read_text()
    doc=g.base_docx();g.markdown_docx(doc,text)
    for s in doc.sections:
        for p in s.footer.paragraphs:
            for run in p.runs:
                run.text=run.text.replace('P1 · revisión humana pendiente','Investigación del incidente · revisión pendiente')
    doc.core_properties.title='Reconstrucción y evaluación del incidente de RedNova'
    doc.save(BASE/'01_Informe/Seccion_forense_P1_v1.docx')
    doc=Document(g.TEMPLATE)
    for p in doc.paragraphs:
        t=p.text
        if t.startswith(('Tabla N.','[Insertar tabla')):
            p._element.getparent().remove(p._element)
            continue
        for code,name in NAMES.items():
            if t.startswith(code+' · '+name):t=t.replace(code+' · ','',1)
        if t=='Plantilla de trabajo del equipo':t='Informe parcial del equipo: integración pendiente'
        elif t.startswith('Se adaptó una copia'):t='Este borrador incorpora el análisis del incidente. Las secciones de planeación, riesgos, terceros y continuidad siguen pendientes; no constituye el informe final de 12–18 páginas solicitado por el curso.'
        elif t.startswith('Responsable: P1 y P3.'):t='Las propuestas de investigación se incorporan al anexo. Faltan análisis de impacto al negocio, tiempo objetivo de recuperación, pérdida tolerable de datos y revisión de continuidad.'
        elif t.startswith('Responsable: P1.'):t='El análisis del incidente está incorporado al anexo siguiente. Revisión del estudiante pendiente.'
        t=human(t).replace('referencias APA 7','referencias según la séptima edición del estilo de la Asociación Estadounidense de Psicología').replace('registro de IA','registro de uso de inteligencia artificial')
        if t!=p.text:p.text=t
    for s in doc.sections:
        for p in list(s.header.paragraphs)+list(s.footer.paragraphs):
            for run in p.runs:run.text=human(run.text)
    doc.add_page_break()
    doc.add_paragraph('Anexo: investigación del incidente',style=next(s for s in doc.styles if s.style_id=='Heading1'))
    doc.add_paragraph('Aporte de Anthony Samuel Ordoñez Son. La integración y la revisión de los otros responsables siguen pendientes.')
    g.markdown_docx(doc,text);doc.save(BASE/'01_Informe/Informe_equipo_parcial_P1_v1.docx')


def ai_declaration():
    target=BASE/'07_Referencias/Uso_IA.pdf'
    cover=REV/'Declaracion_lectura.pdf'
    g.pdf_doc(cover,g.pdf_blocks((BASE/'07_Referencias/Declaracion_uso_IA_docente_v1.md').read_text()))
    # The previous PDF remains literal, including prompts and historical pending fields.
    old=REV/'previos/07_Referencias/Uso_IA.pdf'
    result=fitz.open()
    with fitz.open(cover) as d:result.insert_pdf(d)
    first_annex=len(result)+1
    with fitz.open(old) as d:result.insert_pdf(d)
    result.set_toc([[1,'Declaración y explicación para el docente',1],[1,'Registro histórico: entradas 1 a 13 e instrucciones',first_annex]])
    result.save(target,garbage=3,deflate=True);result.close()


def presentation():
    from reportlab.pdfgen.canvas import Canvas
    from reportlab.lib import colors
    from reportlab.lib.styles import ParagraphStyle
    from reportlab.platypus import Paragraph
    from xml.sax.saxutils import escape
    data=json.loads((BASE/'06_Comite/Presentacion_P1_v1.json').read_text())
    c=Canvas(str(BASE/'06_Comite/Presentacion_P1_v1.pdf'),pagesize=(960,540))
    c.setTitle('Investigación del incidente de RedNova: defensa individual')
    for n,slide in enumerate(data['diapositivas'],1):
        c.setFillColor(colors.HexColor('#F6F4ED'));c.rect(0,0,960,540,fill=1,stroke=0)
        c.setFillColor(colors.HexColor('#163D4B'));c.rect(0,526,960,14,fill=1,stroke=0)
        c.setFont('P1',12);c.drawString(46,490,slide['tiempo'])
        c.setFont('P1B',27);c.drawString(46,443,slide['titulo'])
        y=395
        for point in slide['puntos']:
            p=Paragraph('• '+escape(point),ParagraphStyle('point',fontName='P1',fontSize=19,leading=27,textColor=colors.HexColor('#163D4B')))
            _,height=p.wrap(855,400);p.drawOn(c,46,y-height);y-=height+17
        assert y>85,(slide['titulo'],y)
        p=Paragraph(escape(slide['fuentes']),ParagraphStyle('source',fontName='P1',fontSize=10,leading=14))
        _,height=p.wrap(860,60);p.drawOn(c,46,62-height)
        c.setFont('P1',9);c.drawString(46,15,'Anthony Samuel Ordoñez Son · Integración y ensayo del equipo pendientes')
        c.drawRightString(915,15,f'{n} / {len(data["diapositivas"])}');c.showPage()
    c.save()


def synchronize():
    sources=[
    ('01_Informe/Seccion_forense_P1_v1.pdf','Reconstrucción, explicaciones alternativas y límites.'),
    ('03_Evidencias/Papeles_Trabajo_P1_v1.pdf','Seis análisis con procedimientos y conclusiones.'),
    ('03_Evidencias/Cronologia_investigada_v1.xlsx','Trece eventos; comenzar en Lectura.'),
    ('03_Evidencias/indice_evidencias.xlsx','Materiales y procedencia; comenzar en Lectura.'),
    ('03_Evidencias/Programa_pruebas_P1_v1.xlsx','Método y resultados; comenzar en Lectura.'),
    ('03_Evidencias/Borradores_hallazgos_P1_v1.md','Observaciones sobre alertas y registros, aún no concluyentes.'),
    ('05_Plan/Acciones_P1_0_72h_v1.csv','Once propuestas; responsables, dependencias y cierre.'),
    ('06_Comite/Presentacion_P1_v1.pdf','Seis diapositivas para la defensa individual.'),
    ('06_Comite/Guion_defensa_P1_v1.md','Intervención, respuestas y práctica pendiente.'),
    ('07_Referencias/Fuentes_P1_v1.pdf','Fuentes, localizadores y aplicación.'),
    ('07_Referencias/Uso_IA.pdf','Explicación inicial y registro histórico sin alterar sus citas.'),
    ('01_Informe/Informe_equipo_parcial_P1_v1.pdf','Aporte del incidente y secciones del equipo pendientes.')]
    entries=[]
    for rel,description in sources:
        source=BASE/rel;target=DEST/source.name;shutil.copy2(source,target)
        entries.append({'archivo':target.name,'original':rel,'sha256':sha(source),'bytes':source.stat().st_size,'revisar':description})
    manifest={'fecha_utc':dt.datetime.now(dt.timezone.utc).isoformat(),
    'alcance':'Doce documentos en edición para lectura del docente. Las copias coinciden con sus fuentes actuales. No es la entrega completa del equipo; ZIP anteriores históricos.',
    'archivos':entries,'discrepancias':[]}
    (DEST/'manifest_copias.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
    print('Sincronizadas doce copias exactas y su manifiesto.')


def main():
    REV.mkdir(parents=True,exist_ok=True);DEST.mkdir(exist_ok=True)
    # Human-facing footers for this edition only; historical exporters stay unchanged.
    def footer(c,doc):
        c.setFont('P1',8);c.drawString(48,30,'Investigación del incidente · revisión del estudiante pendiente');c.drawRightString(doc.pagesize[0]-48,30,str(doc.page))
    g.footer=footer
    papers();documents()
    for kind,name,target in [('indice','Indice_evidencias_v1','indice_evidencias'),('programa','Programa_pruebas_P1_v1','Programa_pruebas_P1_v1'),('cronologia','Cronologia_investigada_v1','Cronologia_investigada_v1')]:
        workbook(kind,BASE/'03_Evidencias'/f'{name}.csv',BASE/'03_Evidencias'/f'{target}.xlsx')
    presentation()
    g.pdf_doc(BASE/'07_Referencias/Fuentes_P1_v1.pdf',g.pdf_blocks((BASE/'07_Referencias/Fuentes_P1_v1.md').read_text()))
    ai_declaration()
    print('Exportados papeles, fuentes, declaración, presentación, tres XLSX y dos DOCX. Convertir DOCX a PDF antes de sincronizar copias.')

if __name__=='__main__':
    import argparse
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--sincronizar',action='store_true',help='Copiar documentos ya exportados y actualizar el manifiesto, sin regenerar fuentes.')
    args=parser.parse_args()
    if args.sincronizar:synchronize()
    else:main()
