#!/usr/bin/env python3
"""Exportaciones P1. No conecta SQL ni genera datos/resultados del laboratorio.
Dependencias Python: python-docx, openpyxl, reportlab. Use versiones registradas en I6.
Las versiones previas deben preservarse antes de ejecutar sobre salidas existentes.
"""
from pathlib import Path
from copy import deepcopy
from xml.sax.saxutils import escape
import csv, json, re, hashlib, subprocess, shutil, argparse
from docx import Document
from docx.shared import Inches, Pt
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.opc.constants import RELATIONSHIP_TYPE as RT
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.worksheet.table import Table as XLTable, TableStyleInfo
from openpyxl.utils import get_column_letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

BASE=Path(__file__).resolve().parents[1]
OUT=BASE/'03_Evidencias/resultados/I6'
TEMPLATE=BASE/'01_Informe/Plantilla_UdeO_v2.docx'

def load_csv(path):
    with path.open(encoding='utf-8-sig', newline='') as f: return list(csv.reader(f))

def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()

def inline_docx(p, text):
    for part in re.split(r'(\*\*.*?\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`)',text):
        link=re.fullmatch(r'\[([^\]]+)\]\(([^)]+)\)',part)
        if link:
            h=OxmlElement('w:hyperlink'); h.set(qn('r:id'), p.part.relate_to(link[2],RT.HYPERLINK,is_external=True))
            r=OxmlElement('w:r');pr=OxmlElement('w:rPr');color=OxmlElement('w:color');color.set(qn('w:val'),'145A75');pr.append(color);r.append(pr)
            t=OxmlElement('w:t');t.text=link[1];r.append(t);h.append(r);p._p.append(h)
        else:
            run=p.add_run(part.strip('*`') if part.startswith(('**','`')) else part)
            if part.startswith('**'):run.bold=True

def md_blocks(text):
    lines=text.splitlines();i=0
    while i<len(lines):
        line=lines[i]
        if not line.strip():i+=1;continue
        if line.startswith('|'):
            rows=[]
            while i<len(lines) and lines[i].startswith('|'):
                cells=[c.strip() for c in lines[i].strip('|').split('|')]
                if not all(re.fullmatch(r':?-+:?',c) for c in cells):rows.append(cells)
                i+=1
            yield 'table',rows;continue
        if line.startswith('#'):
            yield 'h'+str(len(line)-len(line.lstrip('#'))),line.lstrip('# ').strip();i+=1;continue
        acc=[line];i+=1
        while i<len(lines) and lines[i].strip() and not lines[i].startswith(('#','|','- ')):
            acc.append(lines[i]);i+=1
        yield 'p',' '.join(acc)

def markdown_docx(doc,text):
    for kind,value in md_blocks(text):
        if kind=='table':
            table=doc.add_table(rows=0,cols=len(value[0]));table.autofit=True
            for ri,row in enumerate(value):
                cells=table.add_row().cells
                for cell,txt in zip(cells,row):
                    inline_docx(cell.paragraphs[0],txt)
                    for par in cell.paragraphs:
                        par.paragraph_format.space_after=Pt(3)
                        par.alignment=WD_ALIGN_PARAGRAPH.LEFT
                        for run in par.runs:run.font.size=Pt(10.5);run.bold=ri==0 or run.bold
                pr=table.rows[-1]._tr.get_or_add_trPr();pr.append(OxmlElement('w:cantSplit'))
                if ri==0:pr.append(OxmlElement('w:tblHeader'))
            doc.add_paragraph().paragraph_format.space_after=Pt(0)
        else:
            p=doc.add_paragraph(style=next(s for s in doc.styles if s.style_id==('Heading1' if kind.startswith('h') else 'Normal')))
            inline_docx(p,value)
            if value.startswith('Tabla '):p.paragraph_format.keep_with_next=True

def base_docx():
    doc=Document(TEMPLATE)
    for elem in list(doc._element.body):
        if elem.tag!=qn('w:sectPr'):doc._element.body.remove(elem)
    for section in doc.sections:
        section.page_width=Inches(8.5);section.page_height=Inches(11)
        section.top_margin=section.bottom_margin=section.left_margin=section.right_margin=Inches(1)
        footer=section.footer.paragraphs[0];footer.text='P1 · revisión humana pendiente · '
        fld=OxmlElement('w:fldSimple');fld.set(qn('w:instr'),'PAGE');footer._p.append(fld)
        footer.alignment=WD_ALIGN_PARAGRAPH.CENTER
        for r in footer.runs:r.font.size=Pt(9)
    doc.core_properties.author='P1 · Anthony Samuel Ordoñez Son; asistencia técnica Codex'
    doc.core_properties.title='P1 · reconstrucción y evaluación forense'
    return doc

def xlsx(source, target, fields):
    rows=load_csv(source);wb=Workbook();raw=wb.active;raw.title='Datos';raw.append(rows[0])
    for row in rows[1:]:
        raw.append(row)
        for c in raw[raw.max_row]:c.data_type='s'
    table=XLTable(displayName='DatosP1',ref=raw.dimensions);table.tableStyleInfo=TableStyleInfo(name='TableStyleMedium2',showRowStripes=True);raw.add_table(table)
    raw.freeze_panes='B2';raw.sheet_view.zoomScale=70
    view=wb.create_sheet('Lectura');view.append(['fila_fuente']+fields)
    ids=[rows[0].index(f) for f in fields]
    for n,row in enumerate(rows[1:],2):view.append([n]+[row[j] for j in ids])
    view.freeze_panes='C2';view.auto_filter.ref=view.dimensions
    meta=wb.create_sheet('Procedencia');meta.append(['Campo','Valor'])
    for r in [('Fuente editable',str(source.relative_to(BASE))),('SHA-256 CSV',sha(source)),('Registros',len(rows)-1),('Alcance','Datos reproduce todas las celdas CSV como texto; vacíos preservados. Lectura es selección de columnas con fila fuente.'),('Validación','Técnica I6. Revisión humana y traspasos pendientes.'),('Advertencia','Resultados de SQL sintético no autentican el incidente. E-29 sigue pendiente sin imagen.'),('Impresión','Usar Lectura; Datos permite filtro y lectura de todas las columnas. No imprimir todas las columnas en una sola página.')]:meta.append(r)
    for ws in wb:
        ws.sheet_properties.pageSetUpPr.fitToPage=True;ws.page_setup.orientation='landscape';ws.page_setup.paperSize=ws.PAPERSIZE_A3
        ws.page_setup.fitToWidth=1;ws.page_setup.fitToHeight=0;ws.print_title_rows='1:1';ws.print_options.horizontalCentered=True
        ws.oddFooter.center.text='P1 · revisión humana pendiente · &P / &N'
        for c in ws[1]:c.fill=PatternFill('solid',fgColor='163D4B');c.font=Font(name='Calibri',size=11,color='FFFFFF',bold=True)
        for col in ws.columns:
            vals=[len(str(c.value or '')) for c in list(col)[:20]]
            ws.column_dimensions[col[0].column_letter].width=(min(65,max(18,max(vals))) if ws==raw else (10 if col[0].value=='fila_fuente' else 34 if ws==view else 90))
        for row in list(ws.rows)[1:]:
            for c in row:
                c.alignment=Alignment(vertical='top',wrap_text=True);c.font=Font(name='Calibri',size=11)
                if isinstance(c.value,str) and (BASE/c.value).is_file():
                    c.hyperlink='../'+c.value;c.font=Font(name='Calibri',size=11,color='145A75',underline='single')
            ws.row_dimensions[row[0].row].height= min(330,max(48,20*max((len(str(c.value or ''))//int(ws.column_dimensions[c.column_letter].width)+1) for c in row)))
        ws.print_area=ws.dimensions
    meta.sheet_properties.pageSetUpPr.fitToPage=True
    wb.save(target)

# ReportLab uses an installed font with Spanish, arrows and stable metrics.
font=subprocess.check_output(['fc-match','-f','%{file}','DejaVu Serif'],text=True)
font_b=subprocess.check_output(['fc-match','-f','%{file}','DejaVu Serif:style=Bold'],text=True)
pdfmetrics.registerFont(TTFont('P1',font));pdfmetrics.registerFont(TTFont('P1B',font_b));pdfmetrics.registerFontFamily('P1',normal='P1',bold='P1B',italic='P1',boldItalic='P1B')
styles=getSampleStyleSheet()
for name in ['Normal','BodyText','Heading1','Heading2','Title']:
    styles[name].fontName='P1B' if name.startswith('Heading') or name=='Title' else 'P1'
styles['Normal'].fontSize=10.5;styles['Normal'].leading=14;styles['Normal'].spaceAfter=7
styles['Heading1'].fontSize=15;styles['Heading1'].leading=19
styles['Heading2'].fontSize=12;styles['Heading2'].leading=16
styles.add(ParagraphStyle(name='TinyP1',fontName='P1',fontSize=8.5,leading=11,spaceAfter=5,splitLongWords=True))

def rich(s):
    s=escape(s)
    s=re.sub(r'\*\*(.*?)\*\*',r'<b>\1</b>',s);s=re.sub(r'`([^`]+)`',r'\1',s)
    s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',r'<link href="\2" color="#145A75">\1</link>',s)
    return s

def para(s,style='Normal'):return Paragraph(rich(s),styles[style])

def pdf_blocks(text):
    story=[]
    for kind,val in md_blocks(text):
        if kind=='table':
            # Vertical record layout keeps long source/criterion columns readable.
            for row in val[1:]:
                for head,txt in zip(val[0],row):story.append(para('**'+head+':** '+txt))
                story.append(Spacer(1,8))
        elif kind.startswith('h'):story.append(para(val,'Heading1' if kind in ('h1','h2') else 'Heading2'))
        else:story.append(para(val))
    return story

def footer(c,doc):
    c.setFont('P1',8);c.setFillColor(colors.HexColor('#34525D'));c.drawString(48,30,'P1 · paquete propio · revisión humana pendiente');c.drawRightString(doc.pagesize[0]-48,30,str(doc.page))

def pdf_doc(path,story):
    SimpleDocTemplate(str(path),pagesize=(612,792),leftMargin=54,rightMargin=54,topMargin=48,bottomMargin=48,title=path.stem,author='P1; asistencia técnica Codex').build(story,onFirstPage=footer,onLaterPages=footer)

def papers():
    text=(BASE/'03_Evidencias/Papeles_P1_v1.md').read_text();parts=re.split(r'(?=^## PT-\d+)',text,flags=re.M)
    toc={str(n):'—' for n in range(20,26)}
    import pymupdf as fitz
    target=BASE/'03_Evidencias/Papeles_Trabajo_P1_v1.pdf'
    for _ in range(3):
        story=[para('Papeles de trabajo de P1','Title'),para('PT-20–PT-25 · versión 1 · I6'),para('Índice de lectura','Heading1')]
        for n in range(20,26):story.append(para(f'PT-{n} · página {toc[str(n)]}'))
        story+=[para('Solo aportes de P1. No se recibieron PT de P2/P3. Papeles_Trabajo.pdf consolidado permanece pendiente; no se reemplazan sus conclusiones.'),PageBreak()]
        story+=pdf_blocks(parts[0]);story.append(PageBreak())
        for block in parts[1:]:story+=pdf_blocks(block);story.append(PageBreak())
        story.pop();pdf_doc(target,story)
        with fitz.open(target) as d:
            toc={str(n):next(i+1 for i,p in enumerate(d) if re.search(r'^PT-'+str(n)+r' · (?:E-|alerta)',p.get_text(),re.M)) for n in range(20,26)}
    with fitz.open(target) as d:
        d.set_toc([[1,'Índice',1],[1,'Procedencia y método',2]]+[[1,'PT-'+str(n),toc[str(n)]] for n in range(20,26)])
        # Clickable index and return link, independent of the paragraph renderer.
        for n in range(20,26):
            rects=d[0].search_for(f'PT-{n} · página')
            if rects:d[0].insert_link({'kind':fitz.LINK_GOTO,'from':rects[0],'page':toc[str(n)]-1})
        d.save(str(target)+'.tmp',garbage=3,deflate=True)
    Path(str(target)+'.tmp').replace(target)
    return toc

def presentation():
    data=json.loads((BASE/'06_Comite/Presentacion_P1_v1.json').read_text());path=BASE/'06_Comite/Presentacion_P1_v1.pdf'
    from reportlab.pdfgen.canvas import Canvas
    c=Canvas(str(path),pagesize=(960,540));c.setTitle('P1 · defensa de auditoría · fragmento propio')
    for n,slide in enumerate(data['diapositivas'],1):
        c.setFillColor(colors.HexColor('#F6F4ED'));c.rect(0,0,960,540,fill=1,stroke=0)
        c.setFillColor(colors.HexColor('#163D4B'));c.rect(0,526,960,14,fill=1,stroke=0)
        c.setFont('P1',12);c.drawString(46,490,slide['tiempo']);c.setFont('P1B',27);c.drawString(46,443,slide['titulo'])
        y=388
        for point in slide['puntos']:
            par=Paragraph('• '+escape(point),ParagraphStyle('Slide',fontName='P1',fontSize=19,leading=27,textColor=colors.HexColor('#163D4B')))
            w,h=par.wrap(855,400);par.drawOn(c,46,y-h);y-=h+17
        par=Paragraph(escape(slide['fuentes']),ParagraphStyle('Source',fontName='P1',fontSize=10,leading=14,textColor=colors.HexColor('#34525D')));w,h=par.wrap(860,60);par.drawOn(c,46,48-h)
        c.setFont('P1',9);c.drawString(46,15,'Solo P1 · coordinación propuesta · revisión humana y ensayo pendientes');c.drawRightString(915,15,f'{n} / 6');c.showPage()
    c.save()

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    xlsx(BASE/'03_Evidencias/Indice_evidencias_v1.csv',BASE/'03_Evidencias/indice_evidencias.xlsx',['evidencia_id','tipo','prueba_vinculada','papel_trabajo_vinculado','ruta_artefacto','limitaciones'])
    xlsx(BASE/'03_Evidencias/Programa_pruebas_P1_v1.csv',BASE/'03_Evidencias/Programa_pruebas_P1_v1.xlsx',['prueba','consulta','evidencia','papel_destinatario','resultado_observado','limitaciones'])
    xlsx(BASE/'03_Evidencias/Cronologia_investigada_v1.csv',BASE/'03_Evidencias/Cronologia_investigada_v1.xlsx',['evento_id','hora_reportada_local','fuente_reportada','evento','cuenta','limite'])
    doc=base_docx();markdown_docx(doc,(BASE/'01_Informe/Seccion_forense_P1_v1.md').read_text());doc.save(BASE/'01_Informe/Seccion_forense_P1_v1.docx')
    # Preserve v1 and v2 intact; integrate only P1 into an explicitly partial team draft.
    doc=Document(TEMPLATE)
    for para_ in list(doc.paragraphs):
        if para_.text.startswith('Responsable: P1. '):
            para_.text='Contenido de P1 recibido localmente e incorporado en el anexo siguiente. Revisión humana pendiente.'
        elif para_.text.startswith('Responsable: P1 y P3.'):
            para_.text='Evaluación y propuestas de P1 incorporadas; BIA, RTO/RPO y revisión de P3 pendientes.'
    doc.add_page_break();doc.add_paragraph('Aporte propio de P1 · integración parcial',style=next(s for s in doc.styles if s.style_id=='Heading1'))
    doc.add_paragraph('Faltan productos terminados de P2/P3. Este borrador no es Informe_Final ni acredita traspasos, firmas o aprobación académica.')
    markdown_docx(doc,(BASE/'01_Informe/Seccion_forense_P1_v1.md').read_text());doc.save(BASE/'01_Informe/Informe_equipo_parcial_P1_v1.docx')
    toc=papers();presentation()
    pdf_doc(BASE/'07_Referencias/Fuentes_P1_v1.pdf',pdf_blocks((BASE/'07_Referencias/Fuentes_P1_v1.md').read_text()))
    story=[para('Declaración y registro de uso de IA','Title'),para('Codex · registros IA-001–IA-013. Ninguna verificación automática equivale a validación humana. Campos de revisión y aprendizaje del estudiante permanecen pendientes.')]
    rows=load_csv(BASE/'07_Referencias/Registro_uso_IA_v1.csv')
    for row in rows[1:]:
        story+=[para(row[0],'Heading1')]
        for head,val in zip(rows[0][1:],row[1:]):story.append(para('**'+head.replace('_',' ')+':** '+val))
    story+=pdf_blocks((BASE/'07_Referencias/Prompt_I6_v1.md').read_text())
    pdf_doc(BASE/'07_Referencias/Uso_IA.pdf',story)
    # A compact printable chronology is a direct view, separate from the complete XLSX.
    rows=load_csv(BASE/'03_Evidencias/Cronologia_investigada_v1.csv');idx={s:i for i,s in enumerate(rows[0])}
    story=[para('Cronología reportada · P1','Title'),para('13 eventos del Proyecto p. 4. UTC−6 es referencia; reloj original y normalización no comprobados. No es un registro exhaustivo ni prueba causal.')]
    for row in rows[1:]:
        story.append(para(row[idx['evento_id']]+' · '+row[idx['hora_reportada_local']],'Heading2'))
        story.append(para(row[idx['evento']]));story.append(para('Fuente: '+row[idx['fuente_reportada']]+' · '+row[idx['evidencia']]+' · cuenta: '+(row[idx['cuenta']] or 'desconocida'),'TinyP1'))
    pdf_doc(BASE/'03_Evidencias/Cronologia_investigada_v1.pdf',story)
    (OUT/'Indice_PT_paginas.json').write_text(json.dumps(toc,indent=2)+'\n')
    print('Generados 3 XLSX, 2 DOCX y 5 PDF; exportar DOCX con LibreOffice y verificar salidas.')

if __name__=='__main__':main()
