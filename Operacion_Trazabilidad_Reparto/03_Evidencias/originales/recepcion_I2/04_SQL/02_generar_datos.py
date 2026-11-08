#!/usr/bin/env python3
"""Genera los CSV sintéticos P1 v1 sin sobrescribir conjuntos existentes."""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import random
import shutil
import sys
import tempfile
from datetime import date, datetime, time, timedelta, timezone
from decimal import Decimal
from pathlib import Path
from typing import Iterable, Mapping


VERSION_GENERADOR = "1.0.0"
NULO = r"\N"
PROJECT_ROOT = Path(__file__).resolve().parent.parent
SQL_DIR = PROJECT_ROOT / "04_SQL"
SOPORTES = [f"Pruebas_Cambio_{i:02d}.md" for i in range(1, 5)]

HEADERS: dict[str, list[str]] = {
    "FuentesTiempo.csv": "FuenteID,Nombre,ZonaOriginal,DesfaseSegundos,Metodo,Verificado,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "Empleados.csv": "EmpleadoID,Nombre,Area,Relacion,Empresa,FechaIngreso,FechaBaja,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "Usuarios.csv": "UsuarioID,NombreUsuario,EmpleadoID,TipoCuenta,Sistema,EsPrivilegiada,MFAHabilitado,Estado,FechaCreacion,UltimaRecertificacion,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "Sesiones.csv": "SesionID,UsuarioID,FuenteID,HoraReportadaLocal,HoraOriginal,ZonaOriginal,IPOrigen,Dispositivo,Metodo,Resultado,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "Privilegios.csv": "AsignacionID,UsuarioID,Rol,Sistema,FechaHora,AsignadoPor,Ticket,Vence,FuenteID,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "Clientes.csv": "ClienteID,Nombre,Departamento,Plan,FechaAlta,Estado,Clasificacion,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "Ordenes.csv": "OrdenID,ClienteID,VendedorID,Sucursal,FechaCreacion,Estado,Plan,Monto,Moneda,Canal,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "HistorialOrdenes.csv": "CambioID,OrdenID,FechaHora,UsuarioID,SesionID,Campo,ValorAnterior,ValorNuevo,Via,FuenteID,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "CambiosSistema.csv": "CambioSistemaID,Ticket,Sistema,Version,SolicitadoPor,AprobadoPor,FechaAprobacion,FechaHoraDespliegue,EjecutadoPor,EvidenciaPruebas,HashArtefacto,FuenteID,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "ProgramacionBackups.csv": "ProgramacionID,BaseDatos,Tipo,HoraProgramada,Destino,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "Backups.csv": "BackupID,ProgramacionID,BaseDatos,Tipo,Inicio,Fin,TamanoGiB,Estado,ChecksumDeclarado,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "PruebasRestauracion.csv": "PruebaID,BackupID,Fecha,Resultado,MinutosRestauracion,Responsable,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "BitacoraSQL.csv": "EventoSQLID,FechaHora,UsuarioID,Objeto,Accion,Filas,Aplicacion,IPOrigen,FuenteID,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "TransferenciasRed.csv": "FlujoID,HoraReportadaLocal,InicioUTC,FinUTC,IPOrigen,IPDestino,Puerto,Protocolo,BytesEnviados,VolumenReportado,ClasificacionDestino,FuenteID,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "Alertas.csv": "AlertaID,HoraReportadaLocal,FechaHoraUTC,Severidad,Regla,Activo,Estado,AsignadoA,PrimeraAccion,FechaCierre,NotaCierre,FuenteID,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
    "EventosExpediente.csv": "EventoID,HoraReportadaLocal,FuenteID,Descripcion,CuentaReportada,Activo,PaginaPDF,HoraOriginal,ZonaOriginal,DesfaseSegundos,ClaseOrigen,ReferenciaExpediente,SupuestosAplicados".split(","),
}

PARAMETROS = {
    "version": "v1",
    "semilla": 1410,
    "clientes": 85000,
    "ordenes": 3000,
    "usuarios": 120,
    "sesiones": 3000,
    "referencia_horaria": "UTC-06:00",
    "corte": "2026-10-15T23:59:59-06:00",
    "ordenes_desde": "2026-04-01",
    "ordenes_hasta": "2026-10-15",
    "sesiones_desde": "2026-09-16",
    "sesiones_hasta": "2026-10-15",
    "referencia_habitual_desde": "2026-10-07",
    "referencia_habitual_hasta": "2026-10-13",
}

EXPECTED_COUNTS = {
    "FuentesTiempo.csv": 18,
    "Empleados.csv": 114,
    "Usuarios.csv": 120,
    "Sesiones.csv": 3000,
    "Privilegios.csv": 13,
    "Clientes.csv": 85000,
    "Ordenes.csv": 3000,
    "HistorialOrdenes.csv": 276,
    "CambiosSistema.csv": 6,
    "ProgramacionBackups.csv": 9,
    "Backups.csv": 9,
    "PruebasRestauracion.csv": 1,
    "BitacoraSQL.csv": 142,
    "TransferenciasRed.csv": 73,
    "Alertas.csv": 6,
    "EventosExpediente.csv": 13,
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def utc_now() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def fmt_date(value: date) -> str:
    return value.isoformat()


def fmt_local(value: datetime) -> str:
    return value.strftime("%Y-%m-%dT%H:%M:%S")


def fmt_offset(value: datetime, offset: str) -> str:
    return f"{fmt_local(value)}{offset}"


def utc_from_local(value: datetime) -> str:
    return fmt_offset(value + timedelta(hours=6), "+00:00")


def assumptions(*extra: str) -> str:
    items = ["S-03", "S-09", "S-P1-PER", *extra]
    return ";".join(dict.fromkeys(items))


def write_csv(path: Path, filename: str, rows: Iterable[Mapping[str, object]]) -> None:
    with (path / filename).open("w", encoding="utf-8", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=HEADERS[filename], lineterminator="\n", extrasaction="raise")
        writer.writeheader()
        writer.writerows(rows)


def user_name(user_id: int) -> str:
    if user_id == 1:
        return "ext_ops_04"
    if 2 <= user_id <= 8:
        return f"lab_priv_nomfa_{user_id:02d}"
    if 9 <= user_id <= 12:
        return f"lab_admin_comp_{user_id - 8:02d}"
    if 13 <= user_id <= 15:
        return f"lab_priv_sinrec_{user_id - 12:02d}"
    if 16 <= user_id <= 18:
        return f"lab_priv_sinrec_{user_id - 12:02d}"
    if user_id == 19:
        return "admin_bitacora_lab"
    if 20 <= user_id <= 30:
        return f"lab_priv_ok_{user_id - 18:02d}"
    if user_id == 31:
        return "svc_respaldo_lab"
    if user_id == 32:
        return "soporte_noche_lab"
    if 33 <= user_id <= 42:
        return f"lab_baja_{user_id - 32:02d}"
    if user_id == 43:
        return "lab_sql_diurno"
    if user_id == 44:
        return "lab_operacion_diurna"
    if user_id == 45:
        return "control_bitacora_lab"
    if user_id == 46:
        return "lab_sql_control"
    return f"lab_usuario_{user_id:03d}"


def user_row(user_id: int) -> dict[str, object]:
    personal_defaults = {
        "UsuarioID": user_id,
        "NombreUsuario": user_name(user_id),
        "EmpleadoID": user_id,
        "TipoCuenta": "Personal",
        "Sistema": "Identidad",
        "EsPrivilegiada": "0",
        "MFAHabilitado": "1",
        "Estado": "Activa",
        "FechaCreacion": "2025-01-01",
        "UltimaRecertificacion": "2026-10-01",
        "ClaseOrigen": "laboratorio",
        "ReferenciaExpediente": NULO,
        "SupuestosAplicados": assumptions("S-P1-ACC"),
    }
    if user_id == 1:
        personal_defaults.update({"EmpleadoID": NULO, "TipoCuenta": "Externa", "EsPrivilegiada": "1", "MFAHabilitado": "0", "ReferenciaExpediente": "E-02"})
    elif 2 <= user_id <= 8:
        personal_defaults.update({"EsPrivilegiada": "1", "MFAHabilitado": "0"})
    elif 9 <= user_id <= 12:
        personal_defaults.update({"EmpleadoID": NULO, "TipoCuenta": "Compartida", "EsPrivilegiada": "1"})
    elif 13 <= user_id <= 15:
        personal_defaults.update({"EsPrivilegiada": "1", "UltimaRecertificacion": "2026-03-01"})
    elif 16 <= user_id <= 18:
        personal_defaults.update({"EsPrivilegiada": "1", "UltimaRecertificacion": NULO})
    elif 19 <= user_id <= 30:
        personal_defaults.update({"EsPrivilegiada": "1"})
    elif user_id == 31:
        personal_defaults.update({"EmpleadoID": NULO, "TipoCuenta": "Servicio", "MFAHabilitado": "0"})
    elif 39 <= user_id <= 42:
        personal_defaults.update({"Estado": "Deshabilitada"})
    if user_id in (19, 43, 45, 46):
        personal_defaults["Sistema"] = "SQLServer"
    return personal_defaults


def rows_fuentes() -> Iterable[dict[str, object]]:
    course = [
        ("CURSO_PROVEEDOR", "Proveedor"), ("CURSO_VPN", "VPN"),
        ("CURSO_IDENTIDAD", "Identidad"), ("CURSO_SQL", "SQLServer"),
        ("CURSO_RED", "Red"), ("CURSO_CRM", "CRM"),
        ("CURSO_CAMBIOS", "Cambios"), ("CURSO_SEGURIDAD", "Seguridad"),
        ("CURSO_TI", "TI"), ("CURSO_FINANZAS", "Finanzas"),
    ]
    lab = [
        ("LAB_VPN", "VPN sintética"), ("LAB_IDENTIDAD", "Identidad sintética"),
        ("LAB_SQL", "SQL sintético"), ("LAB_RED", "Red sintética"),
        ("LAB_CRM", "CRM sintético"), ("LAB_BACKUPS", "Respaldos sintéticos"),
        ("LAB_SIEM", "SIEM sintético"), ("LAB_CAMBIOS", "Cambios sintéticos"),
    ]
    for source_id, name in course:
        yield {"FuenteID": source_id, "Nombre": name, "ZonaOriginal": NULO,
               "DesfaseSegundos": NULO, "Metodo": "Hora reportada por el expediente; reloj original no verificado",
               "Verificado": "0", "ClaseOrigen": "reproduccion_expediente",
               "ReferenciaExpediente": NULO, "SupuestosAplicados": "S-03"}
    for source_id, name in lab:
        yield {"FuenteID": source_id, "Nombre": name, "ZonaOriginal": "-06:00",
               "DesfaseSegundos": "0", "Metodo": "Consistencia interna del generador; no es medición de reloj real",
               "Verificado": "1", "ClaseOrigen": "laboratorio",
               "ReferenciaExpediente": NULO, "SupuestosAplicados": assumptions()}


def rows_empleados() -> Iterable[dict[str, object]]:
    omitted = {1, 9, 10, 11, 12, 31}
    for user_id in range(1, 121):
        if user_id in omitted:
            continue
        yield {
            "EmpleadoID": user_id,
            "Nombre": f"Persona_LAB_{user_id:03d}",
            "Area": "Operaciones_LAB",
            "Relacion": "Interno",
            "Empresa": "RedNova_LAB.example",
            "FechaIngreso": "2025-01-01",
            "FechaBaja": "2026-09-10" if 33 <= user_id <= 42 else NULO,
            "ClaseOrigen": "laboratorio", "ReferenciaExpediente": NULO,
            "SupuestosAplicados": assumptions("S-P1-ACC"),
        }


def rows_sesiones() -> Iterable[dict[str, object]]:
    eligible = list(range(1, 33)) + list(range(43, 121))
    reference_days = [date(2026, 10, d) for d in range(7, 14)]
    other_days = [date(2026, 9, 16) + timedelta(days=i) for i in range(30)
                  if not date(2026, 9, 16) + timedelta(days=i) in reference_days]
    sessions: list[tuple[datetime, int, int, str, str, str]] = []
    order = 0
    for day in reference_days:
        for uid in eligible:
            hours = (2, 3) if uid in (31, 32) else (9, 14)
            for hour in hours:
                order += 1
                sessions.append((datetime.combine(day, time(hour)), uid, order, "laboratorio", NULO, "LAB_VPN"))
    additional = 0
    for day in other_days:
        for index, uid in enumerate(eligible):
            if additional >= 1457:
                break
            hour = (2, 3)[index % 2] if uid in (31, 32) else (9, 14)[index % 2]
            seconds = 1 + (additional % 59)
            order += 1
            sessions.append((datetime.combine(day, time(hour, 0, seconds)), uid, order,
                             "laboratorio", NULO, "LAB_VPN"))
            additional += 1
        if additional >= 1457:
            break
    for dt in (datetime(2026, 10, 14, 2, 10), datetime(2026, 10, 15, 4, 10)):
        order += 1
        sessions.append((dt, 44, order, "laboratorio", NULO, "LAB_VPN"))
    order += 1
    sessions.append((datetime(2026, 10, 14, 2, 17), 1, order, "reproduccion_expediente", "E-02", "CURSO_VPN"))
    sessions.sort(key=lambda item: (item[0], item[1], item[2]))
    for session_id, (reported, uid, _, source_class, ref, source_id) in enumerate(sessions, start=1):
        lab = source_class == "laboratorio"
        yield {
            "SesionID": session_id, "UsuarioID": uid, "FuenteID": source_id,
            "HoraReportadaLocal": fmt_local(reported),
            "HoraOriginal": fmt_offset(reported, "-06:00") if lab else NULO,
            "ZonaOriginal": "-06:00" if lab else NULO,
            "IPOrigen": "198.51.100.10" if lab else NULO,
            "Dispositivo": "Equipo_LAB" if lab else NULO,
            "Metodo": "Clave+MFA" if user_row(uid)["MFAHabilitado"] == "1" else "Clave",
            "Resultado": "Exitoso", "ClaseOrigen": source_class,
            "ReferenciaExpediente": ref,
            "SupuestosAplicados": "S-03" if not lab else assumptions("S-P1-NOR" if uid == 44 and reported.hour in (2, 4) else "S-P1-ACC"),
        }


def rows_privilegios() -> Iterable[dict[str, object]]:
    for assignment_id in range(1, 13):
        uid = assignment_id + 1 if assignment_id <= 6 else assignment_id + 12
        has_ticket = assignment_id >= 4
        has_expiry = assignment_id not in (4, 5, 6)
        yield {
            "AsignacionID": assignment_id, "UsuarioID": uid, "Rol": "Operador_LAB",
            "Sistema": "Identidad", "FechaHora": "2026-10-10T10:00:00",
            "AsignadoPor": "administrador_LAB",
            "Ticket": f"LAB-PRIV-{assignment_id:03d}" if has_ticket else NULO,
            "Vence": "2026-10-20T10:00:00" if has_expiry else NULO,
            "FuenteID": "LAB_IDENTIDAD", "ClaseOrigen": "laboratorio",
            "ReferenciaExpediente": NULO, "SupuestosAplicados": assumptions("S-P1-ACC"),
        }
    yield {
        "AsignacionID": 13, "UsuarioID": NULO, "Rol": NULO, "Sistema": "Identidad",
        "FechaHora": "2026-10-14T02:26:00", "AsignadoPor": NULO, "Ticket": NULO,
        "Vence": NULO, "FuenteID": "CURSO_IDENTIDAD", "ClaseOrigen": "reproduccion_expediente",
        "ReferenciaExpediente": NULO, "SupuestosAplicados": "S-03",
    }


def rows_clientes(rng: random.Random) -> Iterable[dict[str, object]]:
    departamentos = ["Guatemala", "Escuintla", "Sacatepequez", "Quetzaltenango"]
    plans = ["Plan_A", "Plan_B", "Plan_C"]
    for client_id in range(1, 85001):
        yield {
            "ClienteID": client_id, "Nombre": f"Cliente_LAB_{client_id:06d}",
            "Departamento": rng.choice(departamentos), "Plan": rng.choice(plans),
            "FechaAlta": "2025-01-01", "Estado": "Activa", "Clasificacion": NULO,
            "ClaseOrigen": "laboratorio", "ReferenciaExpediente": NULO,
            "SupuestosAplicados": assumptions(),
        }


def rows_ordenes(rng: random.Random) -> Iterable[dict[str, object]]:
    for oid in range(1, 3001):
        created = datetime(2026, 4, 1) + timedelta(minutes=oid * 90)
        state, plan, amount, client_id = "Confirmada", "Plan_A", Decimal("199.00"), rng.randint(1, 85000)
        if oid <= 144:
            state, amount = "Pendiente", Decimal("220.00")
        elif oid <= 216:
            amount = Decimal("200.00")
        elif oid <= 276:
            amount = Decimal("110.00")
        if 1001 <= oid <= 1020:
            group = (oid - 1001) // 2 + 1
            client_id = 60000 + group
            created = datetime(2026, 10, 9, 10, group)
            state, plan, amount = "Confirmada", "Plan_A", Decimal("199.00")
        elif 1021 <= oid <= 1040:
            group = (oid - 1021) // 2 + 1
            member = (oid - 1021) % 2
            client_id = 60010 + group
            created = datetime(2026, 10, 9, 10, group)
            state, plan, amount = "Confirmada", "Plan_B" if member else "Plan_A", Decimal("199.00")
        yield {
            "OrdenID": oid, "ClienteID": client_id, "VendedorID": 1 + ((oid - 1) % 120),
            "Sucursal": 1 + ((oid - 1) % 18), "FechaCreacion": fmt_local(created),
            "Estado": state, "Plan": plan, "Monto": f"{amount:.2f}", "Moneda": "GTQ",
            "Canal": "Web", "ClaseOrigen": "laboratorio", "ReferenciaExpediente": NULO,
            "SupuestosAplicados": assumptions("S-P1-ORD"),
        }


def rows_historial() -> Iterable[dict[str, object]]:
    for change_id in range(1, 277):
        if change_id <= 144:
            field, old, new = "Monto", "200.00", "220.00"
            dt, ref, extra = datetime(2026, 10, 14, 2, 42), "E-05", ("S-P1-ORD",)
            uid, sid, via = NULO, NULO, NULO
        elif change_id <= 216:
            field, old, new = "Estado", "Pendiente", "Confirmada"
            dt, ref, extra = datetime(2026, 10, 14, 2, 42), "E-05", ("S-P1-ORD",)
            uid, sid, via = NULO, NULO, NULO
        else:
            field, old, new = "Monto", "100.00", "110.00"
            day = 7 + ((change_id - 217) % 7)
            dt, ref, extra = datetime(2026, 10, day, 10), NULO, ("S-P1-ORD",)
            uid, sid, via = 47, NULO, "CRM"
        yield {
            "CambioID": change_id, "OrdenID": change_id, "FechaHora": fmt_local(dt),
            "UsuarioID": uid, "SesionID": sid, "Campo": field, "ValorAnterior": old,
            "ValorNuevo": new, "Via": via, "FuenteID": "LAB_CRM", "ClaseOrigen": "laboratorio",
            "ReferenciaExpediente": ref, "SupuestosAplicados": assumptions(*extra),
        }


def rows_cambios_sistema() -> Iterable[dict[str, object]]:
    for change_id in range(1, 6):
        day = 6 + change_id
        approved = change_id != 4
        evidence = f"04_SQL/datos/v1/soportes_sinteticos/Pruebas_Cambio_{change_id:02d}.md" if change_id <= 4 else NULO
        yield {
            "CambioSistemaID": change_id,
            "Ticket": f"LAB-CAMBIO-{change_id:03d}", "Sistema": "Integracion_LAB",
            "Version": f"lab-{change_id}", "SolicitadoPor": "solicitante_LAB",
            "AprobadoPor": "aprobador_LAB" if approved else NULO,
            "FechaAprobacion": f"2026-10-{day:02d}T10:00:00" if approved else NULO,
            "FechaHoraDespliegue": f"2026-10-{day:02d}T11:00:00",
            "EjecutadoPor": "desplegador_LAB", "EvidenciaPruebas": evidence,
            "HashArtefacto": NULO, "FuenteID": "LAB_CAMBIOS", "ClaseOrigen": "laboratorio",
            "ReferenciaExpediente": NULO, "SupuestosAplicados": assumptions("S-P1-CAS"),
        }
    yield {
        "CambioSistemaID": 6, "Ticket": NULO, "Sistema": "Integracion", "Version": NULO,
        "SolicitadoPor": NULO, "AprobadoPor": NULO, "FechaAprobacion": NULO,
        "FechaHoraDespliegue": "2026-10-14T03:02:00", "EjecutadoPor": NULO,
        "EvidenciaPruebas": NULO, "HashArtefacto": NULO, "FuenteID": "CURSO_CAMBIOS",
        "ClaseOrigen": "reproduccion_expediente", "ReferenciaExpediente": "E-06",
        "SupuestosAplicados": "S-03",
    }


def rows_programacion() -> Iterable[dict[str, object]]:
    for program_id, day in enumerate(range(7, 16), start=1):
        yield {
            "ProgramacionID": program_id, "BaseDatos": "CRM_LAB", "Tipo": "Completo",
            "HoraProgramada": f"2026-10-{day:02d}T00:30:00",
            "Destino": "backup-lab.example/CRM_LAB", "ClaseOrigen": "laboratorio",
            "ReferenciaExpediente": "E-08", "SupuestosAplicados": assumptions("S-04"),
        }


def rows_backups() -> Iterable[dict[str, object]]:
    sizes = [Decimal("8.000"), Decimal("8.100"), Decimal("8.200"), Decimal("8.300"),
             Decimal("8.000"), Decimal("8.100"), Decimal("8.200"), Decimal("3.200")]
    historic = datetime(2026, 6, 30, 0, 30)
    yield {
        "BackupID": 1, "ProgramacionID": NULO, "BaseDatos": "CRM_LAB", "Tipo": "Completo",
        "Inicio": fmt_local(historic), "Fin": fmt_local(historic + timedelta(minutes=30)),
        "TamanoGiB": "8.000", "Estado": "Completado", "ChecksumDeclarado": "1",
        "ClaseOrigen": "laboratorio", "ReferenciaExpediente": "E-08",
        "SupuestosAplicados": assumptions("S-04"),
    }
    for backup_id, day in enumerate(range(7, 15), start=2):
        start = datetime(2026, 10, day, 0, 30)
        yield {
            "BackupID": backup_id, "ProgramacionID": backup_id - 1, "BaseDatos": "CRM_LAB",
            "Tipo": "Completo", "Inicio": fmt_local(start), "Fin": fmt_local(start + timedelta(minutes=30)),
            "TamanoGiB": f"{sizes[backup_id - 2]:.3f}", "Estado": "Completado", "ChecksumDeclarado": "1",
            "ClaseOrigen": "laboratorio", "ReferenciaExpediente": "E-08",
            "SupuestosAplicados": assumptions("S-04"),
        }


def rows_restauracion() -> Iterable[dict[str, object]]:
    yield {
        "PruebaID": 1, "BackupID": 1, "Fecha": "2026-07-01T10:00:00",
        "Resultado": "Satisfactoria", "MinutosRestauracion": 45,
        "Responsable": "responsable_restauracion_LAB", "ClaseOrigen": "laboratorio",
        "ReferenciaExpediente": "E-08", "SupuestosAplicados": assumptions("S-04"),
    }


def rows_bitacora() -> Iterable[dict[str, object]]:
    records: list[dict[str, object]] = []
    for day in range(7, 14):
        for uid in (43, 46):
            for j in range(10):
                dt = datetime(2026, 10, day, 9, j)
                records.append({
                    "FechaHora": fmt_local(dt), "UsuarioID": uid, "Objeto": "Clientes", "Accion": "SELECT",
                    "Filas": 100 * (j + 1), "Aplicacion": "Analitica_LAB", "IPOrigen": "192.0.2.10",
                    "FuenteID": "LAB_SQL", "ClaseOrigen": "laboratorio", "ReferenciaExpediente": NULO,
                    "SupuestosAplicados": assumptions("S-P1-NOR"),
                })
    records.extend([
        {"FechaHora": "2026-10-14T02:29:00", "UsuarioID": 43, "Objeto": "Clientes", "Accion": "SELECT",
         "Filas": 20000, "Aplicacion": "Analitica_LAB", "IPOrigen": "192.0.2.10", "FuenteID": "LAB_SQL",
         "ClaseOrigen": "laboratorio", "ReferenciaExpediente": NULO,
         "SupuestosAplicados": assumptions("S-P1-NOR")},
        {"FechaHora": "2026-10-14T02:31:00", "UsuarioID": NULO, "Objeto": "Clientes", "Accion": "SELECT",
         "Filas": 31840, "Aplicacion": NULO, "IPOrigen": NULO, "FuenteID": "CURSO_SQL",
         "ClaseOrigen": "reproduccion_expediente", "ReferenciaExpediente": "E-03", "SupuestosAplicados": "S-03"},
    ])
    records.sort(key=lambda r: r["FechaHora"])
    for event_id, row in enumerate(records, start=1):
        row["EventoSQLID"] = event_id
        yield row


def rows_red() -> Iterable[dict[str, object]]:
    records: list[dict[str, object]] = []
    for day in range(7, 14):
        for source in ("192.0.2.10", "192.0.2.20"):
            for j in range(5):
                local = datetime(2026, 10, day, 10, j)
                records.append({
                    "HoraReportadaLocal": fmt_local(local), "InicioUTC": utc_from_local(local),
                    "FinUTC": utc_from_local(local + timedelta(seconds=10)), "IPOrigen": source,
                    "IPDestino": "203.0.113.10", "Puerto": 443, "Protocolo": "TCP",
                    "BytesEnviados": 1000000 * (j + 1), "VolumenReportado": NULO,
                    "ClasificacionDestino": "operacion_autorizada_sintetica", "FuenteID": "LAB_RED",
                    "ClaseOrigen": "laboratorio", "ReferenciaExpediente": NULO,
                    "SupuestosAplicados": assumptions("S-P1-NOR"),
                })
    local = datetime(2026, 10, 14, 2, 34)
    records.append({
        "HoraReportadaLocal": fmt_local(local), "InicioUTC": utc_from_local(local),
        "FinUTC": utc_from_local(local + timedelta(seconds=10)), "IPOrigen": "192.0.2.10",
        "IPDestino": "203.0.113.10", "Puerto": 443, "Protocolo": "TCP",
        "BytesEnviados": 1200000000, "VolumenReportado": NULO,
        "ClasificacionDestino": "operacion_autorizada_sintetica", "FuenteID": "LAB_RED",
        "ClaseOrigen": "laboratorio", "ReferenciaExpediente": NULO,
        "SupuestosAplicados": assumptions("S-P1-NOR"),
    })
    local = datetime(2026, 10, 14, 5)
    records.append({
        "HoraReportadaLocal": fmt_local(local), "InicioUTC": utc_from_local(local),
        "FinUTC": utc_from_local(local + timedelta(seconds=10)), "IPOrigen": "192.0.2.20",
        "IPDestino": "203.0.113.99", "Puerto": 443, "Protocolo": "TCP",
        "BytesEnviados": 2000000, "VolumenReportado": NULO, "ClasificacionDestino": NULO,
        "FuenteID": "LAB_RED", "ClaseOrigen": "laboratorio", "ReferenciaExpediente": NULO,
        "SupuestosAplicados": assumptions("S-P1-NOR"),
    })
    records.append({
        "HoraReportadaLocal": "2026-10-14T02:35:00", "InicioUTC": NULO, "FinUTC": NULO,
        "IPOrigen": NULO, "IPDestino": NULO, "Puerto": NULO, "Protocolo": NULO,
        "BytesEnviados": NULO, "VolumenReportado": "~1.6 GB", "ClasificacionDestino": NULO,
        "FuenteID": "CURSO_RED", "ClaseOrigen": "reproduccion_expediente", "ReferenciaExpediente": "E-04",
        "SupuestosAplicados": "S-03",
    })
    records.sort(key=lambda r: r["HoraReportadaLocal"])
    for flow_id, row in enumerate(records, start=1):
        row["FlujoID"] = flow_id
        yield row


def rows_alertas() -> Iterable[dict[str, object]]:
    for alert_id, day in enumerate(range(7, 12), start=1):
        local = datetime(2026, 10, day, 10)
        yield {
            "AlertaID": alert_id, "HoraReportadaLocal": fmt_local(local), "FechaHoraUTC": utc_from_local(local),
            "Severidad": "Critica", "Regla": "Control_sintetico", "Activo": "CRM_LAB",
            "Estado": "Abierta" if alert_id == 5 else "Cerrada",
            "AsignadoA": NULO if alert_id == 3 else "equipo_seguridad_LAB",
            "PrimeraAccion": NULO if alert_id == 4 else fmt_local(local + timedelta(minutes=5)),
            "FechaCierre": NULO if alert_id == 5 else fmt_local(local + timedelta(minutes=30)),
            "NotaCierre": NULO if alert_id == 5 else "Cierre ficticio de control",
            "FuenteID": "LAB_SIEM", "ClaseOrigen": "laboratorio", "ReferenciaExpediente": NULO,
            "SupuestosAplicados": assumptions("S-P1-CAS"),
        }
    local = datetime(2026, 10, 14, 3, 18)
    yield {
        "AlertaID": 6, "HoraReportadaLocal": fmt_local(local), "FechaHoraUTC": NULO,
        "Severidad": "Critica", "Regla": "Alerta crítica reportada; regla no aportada",
        "Activo": "No aportado", "Estado": "Sin_documentar", "AsignadoA": NULO,
        "PrimeraAccion": NULO, "FechaCierre": NULO, "NotaCierre": NULO,
        "FuenteID": "CURSO_SEGURIDAD", "ClaseOrigen": "reproduccion_expediente",
        "ReferenciaExpediente": "E-07", "SupuestosAplicados": "S-03",
    }


EVENTOS = [
    ("EVT-01", "2026-10-12T16:15:00", "CURSO_PROVEEDOR", "Proveedor solicita renovación de acceso privilegiado a una API; autorización pendiente.", NULO, "API", NULO),
    ("EVT-02", "2026-10-14T02:17:00", "CURSO_VPN", "Inicio de sesión remoto de cuenta ext_ops_04 sin MFA.", "ext_ops_04", "VPN", "E-02"),
    ("EVT-03", "2026-10-14T02:26:00", "CURSO_IDENTIDAD", "Servicio de identidad registra elevación de privilegios.", NULO, "Identidad", NULO),
    ("EVT-04", "2026-10-14T02:31:00", "CURSO_SQL", "SQL Server registra lectura de 31,840 registros de clientes.", NULO, "SQLServer", "E-03"),
    ("EVT-05", "2026-10-14T02:35:00", "CURSO_RED", "Monitoreo identifica transferencia de ~1.6 GB hacia destino externo no clasificado.", NULO, "Red", "E-04"),
    ("EVT-06", "2026-10-14T02:42:00", "CURSO_CRM", "CRM registra cambios en 216 órdenes comerciales.", NULO, "CRM", "E-05"),
    ("EVT-07", "2026-10-14T03:02:00", "CURSO_CAMBIOS", "Se ejecuta despliegue de versión nueva del servicio de integración.", NULO, "Integracion", "E-06"),
    ("EVT-08", "2026-10-14T03:18:00", "CURSO_SEGURIDAD", "Sistema de seguridad emite alerta crítica sobre actividad sospechosa.", NULO, "Seguridad", "E-07"),
    ("EVT-09", "2026-10-14T03:42:00", "CURSO_CRM", "CRM deja de estar disponible; archivos aparentemente cifrados.", NULO, "CRM", NULO),
    ("EVT-10", "2026-10-14T04:05:00", "CURSO_TI", "TI solicita activar recuperación ante desastres.", NULO, "TI", NULO),
    ("EVT-11", "2026-10-14T08:57:00", "CURSO_CRM", "CRM retorna en modo solo consulta.", NULO, "CRM", NULO),
    ("EVT-12", "2026-10-14T09:37:00", "CURSO_CRM", "Se restablecen operaciones de escritura.", NULO, "CRM", NULO),
    ("EVT-13", "2026-10-14T11:15:00", "CURSO_FINANZAS", "Finanzas solicita conciliación de órdenes y facturación.", NULO, "Finanzas", NULO),
]


def rows_eventos() -> Iterable[dict[str, object]]:
    for event_id, reported, source_id, description, account, asset, ref in EVENTOS:
        yield {
            "EventoID": event_id, "HoraReportadaLocal": reported, "FuenteID": source_id,
            "Descripcion": description, "CuentaReportada": account, "Activo": asset, "PaginaPDF": 4,
            "HoraOriginal": NULO, "ZonaOriginal": NULO, "DesfaseSegundos": NULO,
            "ClaseOrigen": "reproduccion_expediente", "ReferenciaExpediente": ref,
            "SupuestosAplicados": "S-03",
        }


def support_text(index: int) -> str:
    first = "Registro sintético de pruebas declaradas; no acredita pruebas ejecutadas sobre software real"
    return (
        f"{first}\n\n"
        f"Identificador sintético: Pruebas_Cambio_{index:02d}.md\n"
        f"Cambio de laboratorio: LAB-CAMBIO-{index:03d}\n"
        "Contenido: declaración ficticia para comprobar la presencia de un documento asociado al cambio.\n"
        "No contiene capturas, firmas, aprobación humana ni evidencia de pruebas reales.\n"
    )


DICTIONARY = """# Diccionario de campos sintéticos P1 v1

Todos los CSV son datos de laboratorio. `\\N` es el único marcador de nulo. Los importes están en GTQ y se escriben con dos decimales; `TamanoGiB` está en GiB con tres decimales; `BytesEnviados` está en bytes enteros; los desfases están en segundos. Las horas sin zona son horas reportadas locales de referencia UTC−06:00, no una comprobación de los relojes del incidente. Los campos desconocidos del expediente permanecen nulos.

| Tabla | Columnas inventadas o derivadas para el laboratorio | Campos que reproducen el resumen | Unidades y límites |
|---|---|---|---|
| FuentesTiempo | Nombre, ZonaOriginal, DesfaseSegundos, Metodo, Verificado, ClaseOrigen, SupuestosAplicados | Nombre/fuente curso, con zona y desfase desconocidos; las fuentes LAB declaran el reloj interno del generador | Desfase en segundos; fuentes CURSO no verificadas |
| Empleados | Todos los campos y 114 personas seudónimas | Ninguno; no representan la plantilla real | Fechas ISO |
| Usuarios | TipoCuenta, sistema, MFA, estado, empleado, fechas y nombres salvo la etiqueta `ext_ops_04` | Solo el identificador de cuenta `ext_ops_04` en UsuarioID 1 (E-02); sus atributos son supuestos | Bits 0/1; fechas ISO |
| Sesiones | Todas las observaciones LAB, IP y dispositivo sintéticos, método y resultado | La fila E-02 reproduce cuenta y hora reportada; IP, dispositivo, hora y zona originales nulos | Fecha/hora local; IP de documentación sintética |
| Privilegios | Doce asignaciones completas o parcialmente ficticias | La elevación E-02 conserva únicamente hora reportada y fuente; cuenta, rol, asignador, ticket y vencimiento nulos | Fecha/hora local |
| Clientes | Las 85,000 etiquetas, departamentos, planes, fechas, estado y campos de origen | Ninguno; son clientes de laboratorio, no personas reales | IDs enteros |
| Ordenes | Todas las filas, clientes elegidos, vendedores, sucursales, importes, planes, fechas, canal y estado | 216 órdenes representan el conteo de E-05; valores de campos inventados | GTQ, dos decimales; fecha/hora local |
| HistorialOrdenes | 216 detalles anterior/nuevo y 60 cambios normales con usuario/vía sintéticos | E-05 aporta el conteo de 216 y hora reportada; no aporta autor, sesión, vía ni valores de cambios | Importes en GTQ; hora local |
| CambiosSistema | IDs 1–5 y todos sus atributos LAB, soportes declarativos | E-06 aporta sistema Integracion y hora 03:02; los detalles ausentes siguen nulos | Versión/ticket ficticios; hash de artefacto nulo |
| ProgramacionBackups | Programación diaria de laboratorio, base y destino | La ventana y periodicidad corresponden a S-04, no son historial del incidente | Fecha/hora local |
| Backups | Todos los registros, tamaños y checksum declarado ficticio | La referencia temporal/cuantidades son decisiones de S-04; no es un backup ejecutado | GiB, tres decimales |
| PruebasRestauracion | Todos los campos del registro histórico ficticio | Registro de julio conforme a S-04; no es restauración ejecutada durante esta tarea | Minutos enteros |
| BitacoraSQL | 140 controles normales y lectura sintética de 20,000; campos de las filas LAB | E-03 reproduce una lectura de 31,840 a las 02:31; usuario, aplicación e IP nulos | Filas enteras |
| TransferenciasRed | 70 flujos normales y controles LAB; campos del control de 1,200,000,000 bytes | E-04 conserva `~1.6 GB`; bytes exactos, IPs, puerto, protocolo, UTC y contenido nulos | Bytes enteros solo para LAB |
| Alertas | Cinco controles LAB, marcas y responsables ficticios | E-07 conserva hora reportada, severidad y descripción asociada; marcas de atención/cierre nulas | Fecha/hora local y UTC según columna |
| EventosExpediente | IDs EVT, etiquetas de activo, página 4 y procedencia técnica | 13 horas reportadas, fuentes, descripciones y referencias transcritas del resumen; solo EVT-02 atribuye `ext_ops_04` | Hora local; originales, zona y desfase nulos |

Los nombres `admin_bitacora_lab` y `control_bitacora_lab` solo reservan identidades modeladas. Este conjunto no prueba permisos efectivos de SQL Server. Los soportes de despliegue son declaraciones ficticias, no pruebas ejecutadas.
"""


def write_json(path: Path, filename: str, data: object) -> None:
    with (path / filename).open("w", encoding="utf-8", newline="\n") as stream:
        json.dump(data, stream, ensure_ascii=False, indent=2, sort_keys=True)
        stream.write("\n")


def build_dataset(destination: Path, seed: int) -> None:
    """Escribe artefactos sin validar ni publicar; destino debe estar vacío/no existir."""
    if destination.exists():
        raise FileExistsError(f"La ruta de salida ya existe; se conserva sin cambios: {destination}")
    destination.mkdir(parents=True)
    (destination / "soportes_sinteticos").mkdir()
    for index, name in enumerate(SOPORTES, start=1):
        (destination / "soportes_sinteticos" / name).write_text(support_text(index), encoding="utf-8", newline="\n")
    (destination / "Diccionario_campos_sinteticos_v1.md").write_text(DICTIONARY, encoding="utf-8", newline="\n")

    rng = random.Random(seed)
    writers = {
        "FuentesTiempo.csv": rows_fuentes(),
        "Empleados.csv": rows_empleados(),
        "Usuarios.csv": (user_row(i) for i in range(1, 121)),
        "Sesiones.csv": rows_sesiones(),
        "Privilegios.csv": rows_privilegios(),
        "Clientes.csv": rows_clientes(rng),
        "Ordenes.csv": rows_ordenes(rng),
        "HistorialOrdenes.csv": rows_historial(),
        "CambiosSistema.csv": rows_cambios_sistema(),
        "ProgramacionBackups.csv": rows_programacion(),
        "Backups.csv": rows_backups(),
        "PruebasRestauracion.csv": rows_restauracion(),
        "BitacoraSQL.csv": rows_bitacora(),
        "TransferenciasRed.csv": rows_red(),
        "Alertas.csv": rows_alertas(),
        "EventosExpediente.csv": rows_eventos(),
    }
    for filename, rows in writers.items():
        write_csv(destination, filename, rows)

    generated_at = utc_now()
    data_hashes: dict[str, str] = {}
    for filename in [*HEADERS, *[f"soportes_sinteticos/{name}" for name in SOPORTES]]:
        data_hashes[f"04_SQL/datos/v1/{filename}"] = sha256(destination / filename)
    script_hashes = {
        "04_SQL/02_generar_datos.py": sha256(SQL_DIR / "02_generar_datos.py"),
        "04_SQL/validar_datos.py": sha256(SQL_DIR / "validar_datos.py"),
    }
    manifest = {
        "version_datos": "v1",
        "version_generador": VERSION_GENERADOR,
        "python_version": sys.version.split()[0],
        "momento_generacion_utc": generated_at,
        "semilla": seed,
        "corte": PARAMETROS["corte"],
        "parametros_aprobados": {**PARAMETROS, "semilla": seed},
        "cantidades_por_archivo": EXPECTED_COUNTS,
        "total_filas": sum(EXPECTED_COUNTS.values()),
        "sha256_esquema": sha256(SQL_DIR / "01_esquema.sql"),
        "sha256_supuestos": sha256(PROJECT_ROOT / "03_Evidencias" / "Supuestos_P1_v1.csv"),
        "sha256_csv_y_soportes": data_hashes,
        "sha256_scripts": script_hashes,
        "nota": "Hashes identifican los archivos usados; no autentican sistemas ni datos del incidente.",
    }
    write_json(destination, "Manifest_datos_v1.json", manifest)
    write_ai_record(destination, generated_at, [])


def write_ai_record(destination: Path, generated_at: str, checks: list[dict[str, object]]) -> None:
    check_lines = "\n".join(
        f"- {item.get('nombre')}: {item.get('estado')}; observado={item.get('observado')}; esperado={item.get('esperado')}"
        for item in checks
    ) or "- Validación aún no registrada en este archivo."
    record = f"""# Registro de generación asistida por IA — P1 v1

- Herramienta: Codex (asistente de programación de OpenAI).
- Encargo: implementar y ejecutar el generador y validador sintético P1 v1 con semilla {1410}.
- Archivos de referencia usados: `04_SQL/Instrucciones_generacion_datos_P1_v1.md`, `04_SQL/01_esquema.sql`, `03_Evidencias/Supuestos_P1_v1.csv` y `03_Evidencias/Metodo_evidencia_y_laboratorio_v1.md`.
- Artefactos producidos: dos scripts Python, 16 CSV, cuatro soportes declarativos, manifiesto, diccionario y comprobante de validación.
- Generación registrada (UTC): {generated_at}. Este momento no se usa para construir filas de negocio.
- Comprobaciones efectivamente ejecutadas por `validar_datos.py` antes de publicar:
{check_lines}
- Alcance: validación de archivos locales y reproducibilidad. No se cargó SQL Server, no se ejecutaron Q-01–Q-12 ni pruebas de permisos.
- Revisión humana de P1: pendiente.
- Revisión de P2/P3: pendiente; no se afirma su aprobación.
"""
    (destination / "Registro_generacion_IA_v1.md").write_text(record, encoding="utf-8", newline="\n")


def validate_staging(destination: Path, seed: int) -> list[dict[str, object]]:
    sys.path.insert(0, str(SQL_DIR))
    try:
        import validar_datos

        return validar_datos.run_validation(
            data_dir=destination,
            schema_path=SQL_DIR / "01_esquema.sql",
            seed=seed,
            include_reproducibility=True,
            include_refusal=True,
            write_report=True,
        )
    finally:
        try:
            sys.path.remove(str(SQL_DIR))
        except ValueError:
            pass


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--salida", required=True, help="Carpeta destino; debe no existir")
    parser.add_argument("--semilla", type=int, default=1410)
    args = parser.parse_args()
    destination = Path(args.salida).expanduser().resolve()
    if destination.exists():
        parser.error(f"La ruta de salida ya existe; no se sobrescribe: {destination}")
    destination.parent.mkdir(parents=True, exist_ok=True)
    try:
        with tempfile.TemporaryDirectory(prefix="datos_p1_v1_", dir=destination.parent) as temp_parent:
            staged = Path(temp_parent) / destination.name
            build_dataset(staged, args.semilla)
            checks = validate_staging(staged, args.semilla)
            failures = [check for check in checks if check.get("estado") != "aprobado"]
            if failures:
                print(f"Validación fallida; no se publicó {destination}", file=sys.stderr)
                return 1
            generated_at = json.loads((staged / "Manifest_datos_v1.json").read_text(encoding="utf-8"))["momento_generacion_utc"]
            write_ai_record(staged, generated_at, checks)
            if destination.exists():
                raise FileExistsError(f"La ruta apareció durante la generación; no se sobrescribe: {destination}")
            staged.rename(destination)
    except (OSError, ValueError, csv.Error) as exc:
        print(f"Error de generación: {exc}", file=sys.stderr)
        return 1
    print(f"Conjunto validado y publicado: {destination}")
    print(f"Filas: {sum(EXPECTED_COUNTS.values()):,}; semilla: {args.semilla}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
