"""Adapta una copia del documento aportado, conservando la portada y su imagen."""
from copy import deepcopy
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import argparse
import xml.etree.ElementTree as ET

W = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
NS = {"w": W}
ET.register_namespace("w", W)


def tag(name):
    return f"{{{W}}}{name}"


def child(parent, name, **attrs):
    return ET.SubElement(parent, tag(name), {tag(k): str(v) for k, v in attrs.items()})


def paragraph(text, style=None, page_break=False):
    p = ET.Element(tag("p"))
    if style:
        child(child(p, "pPr"), "pStyle", val=style)
    r = child(p, "r")
    if page_break:
        child(r, "br", type="page")
    else:
        child(r, "t").text = text
    return p


def main():
    parser = argparse.ArgumentParser()
    here = Path(__file__).resolve().parent
    parser.add_argument("--origen", type=Path, default=here.parent / "03_Evidencias/originales/documentos/Plantilla_referencia_UdeO_recibida_v1.docx")
    parser.add_argument("--salida", type=Path, default=here / "Plantilla_UdeO_v1.docx")
    args = parser.parse_args()
    if args.salida.exists():
        parser.error("La salida existe; conservarla y usar un nombre de versión nuevo.")

    with ZipFile(args.origen) as source:
        document = ET.fromstring(source.read("word/document.xml"))
        body = document.find("w:body", NS)
        original_paragraphs = body.findall("w:p", NS)
        # El párrafo 11 del original ya contiene un salto de página.
        # Se conserva la portada y se añade un único salto a continuación.
        cover = [deepcopy(p) for p in original_paragraphs[:10]]
        replacements = {
            "Preguntas básicas sobre redes neuronales convolucionales": "Operación Trazabilidad: informe de auditoría de sistemas",
            "Anthony Samuel Ordoñez Son 2401002033": "[Integrantes del equipo y carnés pendientes de confirmar]",
            "Inteligencia Artificial": "Auditoría de Sistemas",
            "Ing. Franz Polanco": "Ing. Herman Ávila",
            "26 de octubre de 2026": "[Fecha de entrega pendiente de confirmar]",
        }
        for p in cover:
            texts = p.findall(".//w:t", NS)
            current = "".join(t.text or "" for t in texts)
            if current in replacements and texts:
                texts[0].text = replacements[current]
                for t in texts[1:]:
                    t.text = ""
        section = deepcopy(body.find("w:sectPr", NS))
        body.clear()
        body.extend(cover)
        body.append(paragraph("", page_break=True))
        body.append(paragraph("Plantilla de trabajo del equipo", "Heading1"))
        body.append(paragraph("Se adaptó una copia del documento de referencia aportado por P1. El contenido académico anterior se retiró de esta copia. La fuente recibida se conserva por separado. Esta plantilla no contiene resultados de auditoría ni acredita la revisión humana."))
        for title, owner, prompt in [
            ("Resumen ejecutivo", "P3", "Decisiones, riesgos prioritarios y límites, máximo una página."),
            ("Alcance y metodología", "P2", "Encargo, período acordado, exclusiones, criterios e independencia."),
            ("Arquitectura, riesgos y controles", "P2", "Diagramas y matrices, con referencias a sus anexos."),
            ("Reconstrucción del incidente", "P1", "Cronología, fuentes, hora reportada y relojes originales desconocidos."),
            ("Hipótesis y análisis forense", "P1", "Alternativas, transferencia, órdenes, causa y límites de las pruebas."),
            ("Respuesta y continuidad", "P1 y P3", "Respuesta documentada, preservación y objetivos de continuidad efectivamente recibidos."),
            ("Terceros, privacidad e inteligencia artificial", "P3", "Criterios y fuentes verificados por el responsable."),
            ("Hallazgos y plan de acción", "P3, con aportes del equipo", "Hallazgos consolidados, acciones, responsables, plazos y comprobación."),
            ("Referencias y anexos", "P2 integra", "Citas y referencias APA 7; evidencias, consultas y registro de IA trazables."),
        ]:
            body.append(paragraph(title, "Heading1"))
            body.append(paragraph(f"Responsable: {owner}. [Completar: {prompt} ]"))
        body.append(paragraph("Tabla N. [Título de la tabla]", "Caption"))
        body.append(paragraph("[Insertar tabla y su fuente. Los valores pendientes se conservan identificados.]"))
        size = section.find("w:pgSz", NS)
        size.attrib.update({tag("w"): "12240", tag("h"): "15840"})
        margins = section.find("w:pgMar", NS)
        for side in ("top", "bottom", "left", "right"):
            margins.set(tag(side), "1440")
        body.append(section)

        styles = ET.fromstring(source.read("word/styles.xml"))
        for style_id in ("Normal", "Heading1", "Caption"):
            style = next((s for s in styles.findall("w:style", NS) if s.get(tag("styleId")) == style_id), None)
            if style is None:
                style = child(styles, "style", type="paragraph", styleId=style_id)
                child(style, "name", val=style_id)
            for old in list(style):
                if old.tag in (tag("rPr"), tag("pPr")):
                    style.remove(old)
            ppr = child(style, "pPr")
            child(ppr, "spacing", line="276", lineRule="auto", after="120")
            child(ppr, "jc", val="left" if style_id != "Normal" else "both")
            if style_id == "Heading1":
                child(ppr, "keepNext")
            rpr = child(style, "rPr")
            child(rpr, "rFonts", ascii="Times New Roman", hAnsi="Times New Roman", cs="Times New Roman", eastAsia="Times New Roman")
            child(rpr, "sz", val="26" if style_id == "Heading1" else "24")
            child(rpr, "szCs", val="26" if style_id == "Heading1" else "24")
            child(rpr, "color", val="000000")
            if style_id == "Heading1":
                child(rpr, "b")

        # El documento derivado no necesita prefijos de compatibilidad del editor original.
        for root in (document, styles):
            for item in root.iter():
                for key in list(item.attrib):
                    if key.endswith("}Ignorable"):
                        del item.attrib[key]
        replacement_parts = {
            "word/document.xml": ET.tostring(document, encoding="utf-8", xml_declaration=True),
            "word/styles.xml": ET.tostring(styles, encoding="utf-8", xml_declaration=True),
        }
        with ZipFile(args.salida, "w", ZIP_DEFLATED) as target:
            for info in source.infolist():
                if info.filename == "docProps/core.xml":
                    root = ET.fromstring(source.read(info.filename))
                    for field in root:
                        if field.tag.endswith(("}creator", "}lastModifiedBy")):
                            field.text = "Equipo de auditoría; identificación pendiente"
                        elif field.tag.endswith("}title"):
                            field.text = "Operación Trazabilidad: plantilla de trabajo"
                    target.writestr(info, ET.tostring(root, encoding="utf-8", xml_declaration=True))
                else:
                    target.writestr(info, replacement_parts.get(info.filename, source.read(info.filename)))
    print(args.salida)


if __name__ == "__main__":
    main()
