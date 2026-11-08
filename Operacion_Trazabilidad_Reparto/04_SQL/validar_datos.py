#!/usr/bin/env python3
"""Valida los CSV P1 v1 releyendo archivos escritos, DDL y casos aprobados."""

from __future__ import annotations

import argparse
import csv
import hashlib
import importlib.util
import json
import re
import subprocess
import sys
import tempfile
from collections import Counter, defaultdict
from datetime import date, datetime, timezone
from decimal import Decimal, InvalidOperation
from pathlib import Path
from typing import Any


NULO = r"\N"
CSV_FILES = [
    "FuentesTiempo.csv", "Empleados.csv", "Usuarios.csv", "Sesiones.csv", "Privilegios.csv",
    "Clientes.csv", "Ordenes.csv", "HistorialOrdenes.csv", "CambiosSistema.csv",
    "ProgramacionBackups.csv", "Backups.csv", "PruebasRestauracion.csv", "BitacoraSQL.csv",
    "TransferenciasRed.csv", "Alertas.csv", "EventosExpediente.csv",
]
COUNTS = {
    "FuentesTiempo.csv": 18, "Empleados.csv": 114, "Usuarios.csv": 120, "Sesiones.csv": 3000,
    "Privilegios.csv": 13, "Clientes.csv": 85000, "Ordenes.csv": 3000,
    "HistorialOrdenes.csv": 276, "CambiosSistema.csv": 6, "ProgramacionBackups.csv": 9,
    "Backups.csv": 9, "PruebasRestauracion.csv": 1, "BitacoraSQL.csv": 142,
    "TransferenciasRed.csv": 73, "Alertas.csv": 6, "EventosExpediente.csv": 13,
}
PRIMARY_KEYS = {
    "FuentesTiempo.csv": "FuenteID", "Empleados.csv": "EmpleadoID", "Usuarios.csv": "UsuarioID",
    "Sesiones.csv": "SesionID", "Privilegios.csv": "AsignacionID", "Clientes.csv": "ClienteID",
    "Ordenes.csv": "OrdenID", "HistorialOrdenes.csv": "CambioID", "CambiosSistema.csv": "CambioSistemaID",
    "ProgramacionBackups.csv": "ProgramacionID", "Backups.csv": "BackupID",
    "PruebasRestauracion.csv": "PruebaID", "BitacoraSQL.csv": "EventoSQLID",
    "TransferenciasRed.csv": "FlujoID", "Alertas.csv": "AlertaID", "EventosExpediente.csv": "EventoID",
}
FOREIGN_KEYS = {
    "Usuarios.csv": [("EmpleadoID", "Empleados.csv", "EmpleadoID")],
    "Sesiones.csv": [("UsuarioID", "Usuarios.csv", "UsuarioID"), ("FuenteID", "FuentesTiempo.csv", "FuenteID")],
    "Privilegios.csv": [("UsuarioID", "Usuarios.csv", "UsuarioID"), ("FuenteID", "FuentesTiempo.csv", "FuenteID")],
    "Ordenes.csv": [("ClienteID", "Clientes.csv", "ClienteID")],
    "HistorialOrdenes.csv": [("OrdenID", "Ordenes.csv", "OrdenID"), ("UsuarioID", "Usuarios.csv", "UsuarioID"),
                             ("SesionID", "Sesiones.csv", "SesionID"), ("FuenteID", "FuentesTiempo.csv", "FuenteID")],
    "CambiosSistema.csv": [("FuenteID", "FuentesTiempo.csv", "FuenteID")],
    "Backups.csv": [("ProgramacionID", "ProgramacionBackups.csv", "ProgramacionID")],
    "PruebasRestauracion.csv": [("BackupID", "Backups.csv", "BackupID")],
    "BitacoraSQL.csv": [("UsuarioID", "Usuarios.csv", "UsuarioID"), ("FuenteID", "FuentesTiempo.csv", "FuenteID")],
    "TransferenciasRed.csv": [("FuenteID", "FuentesTiempo.csv", "FuenteID")],
    "Alertas.csv": [("FuenteID", "FuentesTiempo.csv", "FuenteID")],
    "EventosExpediente.csv": [("FuenteID", "FuentesTiempo.csv", "FuenteID")],
}

EXPECTED_HEADERS = {
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


class Checks:
    def __init__(self) -> None:
        self.items: list[dict[str, Any]] = []

    def add(self, name: str, observed: Any, expected: Any, passed: bool) -> None:
        self.items.append({
            "nombre": name,
            "observado": observed,
            "esperado": expected,
            "estado": "aprobado" if passed else "fallido",
        })


def parse_schema(path: Path) -> dict[str, list[dict[str, Any]]]:
    text = path.read_text(encoding="utf-8")
    tables: dict[str, list[dict[str, Any]]] = {}
    table_re = re.compile(r"CREATE TABLE dbo\.(\w+)\s*\((.*?)\n\);", re.S | re.I)
    column_re = re.compile(r"^\s*(?:\[([^\]]+)\]|([A-Za-z_][\w]*))\s+([A-Za-z][A-Za-z0-9]*)(?:\(([^)]*)\))?(.*)$")
    for match in table_re.finditer(text):
        table_name, body = match.group(1), match.group(2)
        columns: list[dict[str, Any]] = []
        for line in body.splitlines():
            parsed = column_re.match(line)
            if not parsed:
                continue
            name = parsed.group(1) or parsed.group(2)
            sql_type = parsed.group(3).lower()
            args = parsed.group(4)
            tail = parsed.group(5)
            length = None
            precision = None
            scale = None
            if args:
                if sql_type in ("decimal", "numeric"):
                    parts = [int(part.strip()) for part in args.split(",")]
                    precision, scale = parts[0], parts[1] if len(parts) > 1 else 0
                elif args.strip().isdigit():
                    length = int(args.strip())
            columns.append({"name": name, "type": sql_type, "length": length,
                            "precision": precision, "scale": scale,
                            "not_null": "NOT NULL" in tail.upper()})
        tables[table_name] = columns
    return tables


def read_csv(path: Path, headers: list[str]) -> tuple[list[dict[str, str]], list[str]]:
    issues: list[str] = []
    if not path.is_file():
        return [], [f"archivo ausente: {path.name}"]
    raw = path.read_bytes()
    if raw.startswith(b"\xef\xbb\xbf"):
        issues.append("contiene BOM UTF-8")
    if b"\r" in raw:
        issues.append("contiene fin de línea CR; se requiere LF")
    if not raw.endswith(b"\n"):
        issues.append("no termina en LF")
    try:
        decoded = raw.decode("utf-8")
    except UnicodeDecodeError as exc:
        return [], issues + [f"UTF-8 inválido: {exc}"]
    try:
        reader = csv.DictReader(decoded.splitlines(), dialect="excel")
        actual = reader.fieldnames or []
        if actual != headers:
            issues.append(f"encabezado {actual!r}, esperado {headers!r}")
        rows = []
        for row_num, row in enumerate(reader, start=2):
            if None in row:
                issues.append(f"fila {row_num}: columnas excedentes")
            if any(value is None for value in row.values()):
                issues.append(f"fila {row_num}: columnas faltantes")
            rows.append({key: value if value is not None else "" for key, value in row.items() if key is not None})
        return rows, issues
    except csv.Error as exc:
        return [], issues + [f"CSV inválido: {exc}"]


def parse_cell(value: str, column: dict[str, Any], table: str, row_num: int) -> str | None:
    name, kind = column["name"], column["type"]
    if value == NULO:
        if column["not_null"]:
            raise ValueError(f"{table} fila {row_num} {name}: nulo en columna NOT NULL")
        return None
    if value == "":
        raise ValueError(f"{table} fila {row_num} {name}: cadena vacía; use {NULO} para nulo")
    if kind in ("varchar", "nvarchar", "char", "nchar"):
        if column["length"] and len(value.encode("utf-16-le")) // 2 > column["length"]:
            raise ValueError(f"{table} fila {row_num} {name}: excede longitud {column['length']}")
    elif kind == "bit":
        if value not in ("0", "1"):
            raise ValueError(f"{table} fila {row_num} {name}: bit debe ser 0 o 1")
    elif kind in ("int", "bigint"):
        if not re.fullmatch(r"-?\d+", value):
            raise ValueError(f"{table} fila {row_num} {name}: entero inválido {value!r}")
        number = int(value)
        low, high = (-(2**31), 2**31 - 1) if kind == "int" else (-(2**63), 2**63 - 1)
        if not low <= number <= high:
            raise ValueError(f"{table} fila {row_num} {name}: fuera de rango {kind}")
    elif kind in ("decimal", "numeric"):
        try:
            number = Decimal(value)
        except InvalidOperation as exc:
            raise ValueError(f"{table} fila {row_num} {name}: decimal inválido") from exc
        if not number.is_finite():
            raise ValueError(f"{table} fila {row_num} {name}: decimal no finito")
        exponent = max(0, -number.as_tuple().exponent)
        if column["scale"] is not None and exponent > column["scale"]:
            raise ValueError(f"{table} fila {row_num} {name}: excede escala {column['scale']}")
        if column["precision"] is not None and len(number.as_tuple().digits) > column["precision"]:
            raise ValueError(f"{table} fila {row_num} {name}: excede precisión {column['precision']}")
    elif kind == "date":
        try:
            parsed = date.fromisoformat(value)
        except ValueError as exc:
            raise ValueError(f"{table} fila {row_num} {name}: fecha inválida") from exc
        if parsed.isoformat() != value:
            raise ValueError(f"{table} fila {row_num} {name}: formato debe ser YYYY-MM-DD")
    elif kind == "datetime2":
        try:
            parsed = datetime.strptime(value, "%Y-%m-%dT%H:%M:%S")
        except ValueError as exc:
            raise ValueError(f"{table} fila {row_num} {name}: fecha/hora local inválida") from exc
        if parsed.strftime("%Y-%m-%dT%H:%M:%S") != value:
            raise ValueError(f"{table} fila {row_num} {name}: formato datetime2 inválido")
    elif kind == "datetimeoffset":
        try:
            parsed = datetime.fromisoformat(value)
        except ValueError as exc:
            raise ValueError(f"{table} fila {row_num} {name}: fecha/hora con zona inválida") from exc
        if parsed.tzinfo is None or not re.fullmatch(r"\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}[+-]\d{2}:\d{2}", value):
            raise ValueError(f"{table} fila {row_num} {name}: se requiere zona y segundos")
    else:
        raise ValueError(f"tipo SQL no reconocido: {kind} para {table}.{name}")
    return value


def validate_checks(filename: str, row: dict[str, str]) -> list[str]:
    errors: list[str] = []
    def val(key: str) -> str | None:
        return None if row.get(key) == NULO else row.get(key)
    def intv(key: str) -> int | None:
        x = val(key)
        return None if x is None else int(x)
    def dt(key: str) -> datetime | None:
        x = val(key)
        if x is None:
            return None
        return datetime.fromisoformat(x)
    def bad(condition: bool, description: str) -> None:
        if condition:
            errors.append(description)

    if val("ClaseOrigen") not in ("laboratorio", "reproduccion_expediente"):
        errors.append("CHECK ClaseOrigen")
    if filename == "Empleados.csv":
        bad(val("Relacion") not in ("Interno", "Externo"), "CHECK Relacion")
        if val("FechaBaja") and date.fromisoformat(val("FechaBaja")) < date.fromisoformat(row["FechaIngreso"]):
            errors.append("CHECK FechaBaja >= FechaIngreso")
    elif filename == "Usuarios.csv":
        bad(val("TipoCuenta") not in ("Personal", "Externa", "Compartida", "Servicio"), "CHECK TipoCuenta")
        bad(val("Estado") not in ("Activa", "Deshabilitada"), "CHECK Estado")
        if val("UltimaRecertificacion") and date.fromisoformat(val("UltimaRecertificacion")) < date.fromisoformat(row["FechaCreacion"]):
            errors.append("CHECK UltimaRecertificacion >= FechaCreacion")
    elif filename == "Sesiones.csv":
        bad(val("Metodo") not in ("Clave", "Clave+MFA"), "CHECK Metodo")
        bad(val("Resultado") not in ("Exitoso", "Rechazado"), "CHECK Resultado")
    elif filename == "Privilegios.csv":
        if val("Vence") and dt("Vence") < dt("FechaHora"):
            errors.append("CHECK Vence >= FechaHora")
    elif filename == "Ordenes.csv":
        bad(intv("VendedorID") is None or not 1 <= intv("VendedorID") <= 120, "CHECK VendedorID 1..120")
        bad(intv("Sucursal") is None or not 1 <= intv("Sucursal") <= 18, "CHECK Sucursal 1..18")
        bad(val("Estado") not in ("Pendiente", "Confirmada", "Cancelada"), "CHECK Estado")
        bad(val("Moneda") != "GTQ", "CHECK Moneda=GTQ")
        bad(Decimal(row["Monto"]) < 0, "CHECK Monto >= 0")
    elif filename == "HistorialOrdenes.csv":
        bad(val("Campo") not in ("Monto", "Estado"), "CHECK Campo")
    elif filename == "ProgramacionBackups.csv":
        bad(val("Tipo") != "Completo", "CHECK Tipo=Completo")
    elif filename == "Backups.csv":
        bad(val("Tipo") != "Completo", "CHECK Tipo=Completo")
        bad(val("Estado") not in ("Completado", "Fallido"), "CHECK Estado")
        bad(Decimal(row["TamanoGiB"]) < 0, "CHECK TamanoGiB >= 0")
        if dt("Fin") < dt("Inicio"):
            errors.append("CHECK Fin >= Inicio")
    elif filename == "PruebasRestauracion.csv":
        bad(val("Resultado") not in ("Satisfactoria", "Fallida"), "CHECK Resultado")
        bad(intv("MinutosRestauracion") < 0, "CHECK MinutosRestauracion >= 0")
    elif filename == "BitacoraSQL.csv":
        bad(val("Accion") != "SELECT", "CHECK Accion=SELECT")
        bad(intv("Filas") < 0, "CHECK Filas >= 0")
    elif filename == "TransferenciasRed.csv":
        if intv("Puerto") is not None:
            bad(not 1 <= intv("Puerto") <= 65535, "CHECK Puerto 1..65535")
        if intv("BytesEnviados") is not None:
            bad(intv("BytesEnviados") < 0, "CHECK BytesEnviados >= 0")
        if val("InicioUTC") and val("FinUTC") and dt("FinUTC") < dt("InicioUTC"):
            errors.append("CHECK FinUTC >= InicioUTC")
    elif filename == "Alertas.csv":
        report = dt("HoraReportadaLocal")
        if val("PrimeraAccion") and dt("PrimeraAccion") < report:
            errors.append("CHECK PrimeraAccion >= HoraReportadaLocal")
        if val("FechaCierre") and dt("FechaCierre") < report:
            errors.append("CHECK FechaCierre >= HoraReportadaLocal")
    elif filename == "EventosExpediente.csv":
        bad(intv("PaginaPDF") is None or intv("PaginaPDF") <= 0, "CHECK PaginaPDF > 0")
    return errors


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def tree_hashes(root: Path) -> dict[str, str]:
    return {p.relative_to(root).as_posix(): sha(p) for p in sorted(root.rglob("*")) if p.is_file()}


def import_generator(path: Path):
    spec = importlib.util.spec_from_file_location("p1_generator_for_validation", path)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"no se pudo cargar el generador: {path}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def check_semantics(data_dir: Path, rows: dict[str, list[dict[str, str]]], checks: Checks) -> None:
    def add(name: str, observed: Any, expected: Any, condition: bool) -> None:
        checks.add(name, observed, expected, condition)
    def by_id(filename: str, field: str) -> dict[str, dict[str, str]]:
        return {r[field]: r for r in rows.get(filename, [])}
    def value(row: dict[str, str], key: str) -> str | None:
        x = row.get(key)
        return None if x == NULO else x

    users = rows.get("Usuarios.csv", [])
    user_ids = {int(r["UsuarioID"]): r for r in users}
    employees = {int(r["EmpleadoID"]): r for r in rows.get("Empleados.csv", [])}
    sessions = rows.get("Sesiones.csv", [])
    orders = rows.get("Ordenes.csv", [])
    histories = rows.get("HistorialOrdenes.csv", [])
    sources = rows.get("FuentesTiempo.csv", [])

    active_departed = [uid for uid in range(33, 39) if uid in user_ids and user_ids[uid]["Estado"] == "Activa" and employees.get(uid, {}).get("FechaBaja") != NULO]
    disabled_departed = [uid for uid in range(39, 43) if uid in user_ids and user_ids[uid]["Estado"] == "Deshabilitada" and employees.get(uid, {}).get("FechaBaja") != NULO]
    add("Casos de baja: seis activas y cuatro deshabilitadas", {"activas": len(active_departed), "deshabilitadas": len(disabled_departed)}, {"activas": 6, "deshabilitadas": 4}, len(active_departed) == 6 and len(disabled_departed) == 4)
    privileged = [r for r in users if r["EsPrivilegiada"] == "1"]
    groups = {
        "privilegiadas_ids_1_8_sin_mfa": sum(int(r["UsuarioID"]) in range(1, 9) and r["MFAHabilitado"] == "0" for r in privileged),
        "compartidas_9_12_con_mfa": sum(int(r["UsuarioID"]) in range(9, 13) and r["TipoCuenta"] == "Compartida" and r["MFAHabilitado"] == "1" for r in privileged),
        "recertificacion_vencida_13_15": sum(int(r["UsuarioID"]) in range(13, 16) and r["UltimaRecertificacion"] == "2026-03-01" for r in privileged),
        "recertificacion_ausente_16_18": sum(int(r["UsuarioID"]) in range(16, 19) and r["UltimaRecertificacion"] == NULO for r in privileged),
        "privilegiadas_19_30_vigentes": sum(int(r["UsuarioID"]) in range(19, 31) and r["UltimaRecertificacion"] == "2026-10-01" for r in privileged),
    }
    add("Grupos de cuentas privilegiadas sin solapamiento", groups,
        {"privilegiadas_ids_1_8_sin_mfa": 8, "compartidas_9_12_con_mfa": 4,
         "recertificacion_vencida_13_15": 3, "recertificacion_ausente_16_18": 3,
         "privilegiadas_19_30_vigentes": 12}, sum(groups.values()) == 30 and len(privileged) == 30)

    excluded_sessions = [r for r in sessions if int(r["UsuarioID"]) in range(33, 43)]
    add("Sin sesiones de cuentas dadas de baja 33–42", len(excluded_sessions), 0, not excluded_sessions)
    eligible = list(range(1, 33)) + list(range(43, 121))
    reference_counts: dict[int, tuple[int, int]] = {}
    for uid in eligible:
        qualifying = [r for r in sessions if int(r["UsuarioID"]) == uid and "2026-10-07" <= r["HoraReportadaLocal"][:10] <= "2026-10-13"]
        distinct_days = len({r["HoraReportadaLocal"][:10] for r in qualifying})
        reference_counts[uid] = (len(qualifying), distinct_days)
    coverage_failures = {uid: counts for uid, counts in reference_counts.items() if counts[0] < 5 or counts[1] < 3}
    add("Cobertura habitual por cuenta elegible", {"cuentas": len(reference_counts), "faltantes": coverage_failures},
        "110 cuentas; cada una ≥5 sesiones en ≥3 días", len(reference_counts) == 110 and not coverage_failures)
    special_sessions = {
        (1, "2026-10-14T02:17:00"),
        (44, "2026-10-14T02:10:00"),
        (44, "2026-10-15T04:10:00"),
    }
    actual_special = {(int(r["UsuarioID"]), r["HoraReportadaLocal"]) for r in sessions
                      if (int(r["UsuarioID"]), r["HoraReportadaLocal"]) in special_sessions}
    add("Tres sesiones fuera del patrón habitual documentado", sorted(actual_special), sorted(special_sessions), actual_special == special_sessions)
    night_accounts = all(any(int(r["UsuarioID"]) == uid and r["HoraReportadaLocal"].endswith(f"T{hour:02d}:00:00") for r in sessions)
                         for uid in (31, 32) for hour in ((2, 3) if uid in (31, 32) else ()))
    # Cuenta de servicio y soporte tienen sus franjas habituales 02:00/03:00 en todos los siete días.
    night_accounts = night_accounts and all(
        sum(int(r["UsuarioID"]) == uid and r["HoraReportadaLocal"][:10] == f"2026-10-{day:02d}" and r["HoraReportadaLocal"][11:13] in ("02", "03") for r in sessions) == 2
        for uid in (31, 32) for day in range(7, 14)
    )
    add("Turnos nocturnos legítimos de servicio y soporte", night_accounts, True, night_accounts)
    e02_session = [r for r in sessions if r["ReferenciaExpediente"] == "E-02"]
    e02_unknown_ok = len(e02_session) == 1 and all(e02_session[0].get(k) == NULO for k in ("HoraOriginal", "ZonaOriginal", "IPOrigen", "Dispositivo"))
    add("Sesión E-02 conserva desconocidos", {"filas": len(e02_session), "campos_nulos": e02_unknown_ok}, "una fila; hora/zona original, IP y dispositivo nulos", e02_unknown_ok)

    window = [r for r in histories if r["FechaHora"] == "2026-10-14T02:42:00"]
    affected_orders = {r["OrdenID"] for r in window}
    counts_by_field = Counter(r["Campo"] for r in window)
    controls = [r for r in histories if r not in window]
    add("E-05: 216 órdenes y cambios distintos en ventana", {"cambios": len(window), "ordenes_distintas": len(affected_orders)},
        {"cambios": 216, "ordenes_distintas": 216}, len(window) == 216 and len(affected_orders) == 216)
    add("E-05: composición de cambios", dict(counts_by_field), {"Monto": 144, "Estado": 72}, counts_by_field == Counter({"Monto": 144, "Estado": 72}))
    controls_in_window = [r["FechaHora"] for r in controls if "2026-10-14T02:17:00" <= r["FechaHora"] <= "2026-10-14T03:42:00"]
    add("60 controles de historial fuera de ventana", {"filas": len(controls), "dentro": controls_in_window},
        {"filas": 60, "dentro": []}, len(controls) == 60 and not controls_in_window)
    order_by_id = {r["OrdenID"]: r for r in orders}
    last_change_issues = []
    for record in histories:
        current = order_by_id.get(record["OrdenID"])
        if not current:
            last_change_issues.append(record["OrdenID"])
        elif record["Campo"] == "Estado" and current["Estado"] != record["ValorNuevo"]:
            last_change_issues.append(record["OrdenID"])
        elif record["Campo"] == "Monto" and Decimal(current["Monto"]) != Decimal(record["ValorNuevo"]):
            last_change_issues.append(record["OrdenID"])
    add("Valor actual de cada orden coincide con su cambio", last_change_issues, [], not last_change_issues)

    dup_groups: dict[tuple[str, str, str, str, str], list[str]] = defaultdict(list)
    for row in orders:
        if row["Estado"] == "Cancelada":
            continue
        created = row["FechaCreacion"][:16]
        key = (row["ClienteID"], created, row["Plan"], row["Monto"], row["Canal"])
        dup_groups[key].append(row["OrdenID"])
    qualifying = [members for members in dup_groups.values() if len(members) > 1]
    candidate_exact = len(qualifying) == 10 and all(len(members) == 2 for members in qualifying)
    add("Regla de duplicidad: diez grupos candidatos de dos", {"grupos": len(qualifying), "tamanos": sorted(map(len, qualifying))},
        {"grupos": 10, "tamanos": [2] * 10}, candidate_exact)
    # Pares legítimos reservados: IDs 1021–1040, cada pareja coincide salvo Plan.
    similar_ok = all(orders[i - 1]["ClienteID"] == orders[i]["ClienteID"] and
                     orders[i - 1]["FechaCreacion"] == orders[i]["FechaCreacion"] and
                     orders[i - 1]["Monto"] == orders[i]["Monto"] and
                     orders[i - 1]["Canal"] == orders[i]["Canal"] and
                     orders[i - 1]["Plan"] != orders[i]["Plan"]
                     for i in range(1021, 1041, 2))
    add("Diez pares similares legítimos excluidos por Plan", similar_ok, True, similar_ok)

    sql = rows.get("BitacoraSQL.csv", [])
    report_sql = [r for r in sql if r["FuenteID"] == "CURSO_SQL" and r["Filas"] == "31840"]
    control_sql = [r for r in sql if r["ClaseOrigen"] == "laboratorio" and r["Filas"] == "20000"]
    normal_sql = [r for r in sql if r["ClaseOrigen"] == "laboratorio" and r["FechaHora"][:10] <= "2026-10-13"]
    sql_unknowns_ok = len(report_sql) == 1 and all(report_sql[0][k] == NULO for k in ("UsuarioID", "Aplicacion", "IPOrigen"))
    add("SQL: 31,840 reproducido una vez y sin atribución", {"filas": len(report_sql), "desconocidos_nulos": sql_unknowns_ok}, "una; usuario/aplicación/IP nulos", sql_unknowns_ok)
    add("SQL: control sintético separado", len(control_sql), 1, len(control_sql) == 1 and control_sql[0]["UsuarioID"] == "43")
    add("SQL: observaciones normales", len(normal_sql), 140, len(normal_sql) == 140)

    flows = rows.get("TransferenciasRed.csv", [])
    reported_flow = [r for r in flows if r["FuenteID"] == "CURSO_RED" and r["VolumenReportado"] == "~1.6 GB"]
    exact_control = [r for r in flows if r["BytesEnviados"] == "1200000000"]
    normal_flows = [r for r in flows if r["ClaseOrigen"] == "laboratorio" and r["HoraReportadaLocal"][:10] <= "2026-10-13"]
    red_nulls_ok = len(reported_flow) == 1 and all(reported_flow[0][k] == NULO for k in
        ("InicioUTC", "FinUTC", "IPOrigen", "IPDestino", "Puerto", "Protocolo", "BytesEnviados", "ClasificacionDestino"))
    add("Red: ~1.6 GB reproducido sin convertir a bytes", {"filas": len(reported_flow), "detalles_nulos": red_nulls_ok}, "una; bytes/IP/puerto/protocolo/UTC/clasificación nulos", red_nulls_ok)
    add("Red: control exacto sintético separado", len(exact_control), 1, len(exact_control) == 1)
    add("Red: observaciones normales", len(normal_flows), 70, len(normal_flows) == 70)

    programs = rows.get("ProgramacionBackups.csv", [])
    backups = rows.get("Backups.csv", [])
    restores = rows.get("PruebasRestauracion.csv", [])
    no_day15 = all(r["Inicio"][:10] != "2026-10-15" for r in backups)
    backup_ok = len(programs) == 9 and len(backups) == 9 and no_day15
    add("Respaldos: nueve programaciones, ocho ejecuciones de octubre y una histórica; sin día 15",
        {"programaciones": len(programs), "ejecuciones": len(backups), "sin_dia_15": no_day15},
        {"programaciones": 9, "ejecuciones": 9, "sin_dia_15": True}, backup_ok)
    restore_ok = len(restores) == 1 and restores[0]["BackupID"] == "1" and restores[0]["Fecha"] == "2026-07-01T10:00:00" and backups[0]["Inicio"].startswith("2026-06-30")
    add("Restauración histórica ficticia ligada al respaldo de junio", restore_ok,
        "backup 1 del 30-jun; registro 1-jul", restore_ok)

    events = rows.get("EventosExpediente.csv", [])
    expected_events = [
        ("EVT-01", "2026-10-12T16:15:00", "CURSO_PROVEEDOR", NULO),
        ("EVT-02", "2026-10-14T02:17:00", "CURSO_VPN", "E-02"),
        ("EVT-03", "2026-10-14T02:26:00", "CURSO_IDENTIDAD", NULO),
        ("EVT-04", "2026-10-14T02:31:00", "CURSO_SQL", "E-03"),
        ("EVT-05", "2026-10-14T02:35:00", "CURSO_RED", "E-04"),
        ("EVT-06", "2026-10-14T02:42:00", "CURSO_CRM", "E-05"),
        ("EVT-07", "2026-10-14T03:02:00", "CURSO_CAMBIOS", "E-06"),
        ("EVT-08", "2026-10-14T03:18:00", "CURSO_SEGURIDAD", "E-07"),
        ("EVT-09", "2026-10-14T03:42:00", "CURSO_CRM", NULO),
        ("EVT-10", "2026-10-14T04:05:00", "CURSO_TI", NULO),
        ("EVT-11", "2026-10-14T08:57:00", "CURSO_CRM", NULO),
        ("EVT-12", "2026-10-14T09:37:00", "CURSO_CRM", NULO),
        ("EVT-13", "2026-10-14T11:15:00", "CURSO_FINANZAS", NULO),
    ]
    actual_events = [(r["EventoID"], r["HoraReportadaLocal"], r["FuenteID"], r["ReferenciaExpediente"]) for r in events]
    event_unknowns = all(r["HoraOriginal"] == NULO and r["ZonaOriginal"] == NULO and r["DesfaseSegundos"] == NULO and
                         ((r["EventoID"] == "EVT-02" and r["CuentaReportada"] == "ext_ops_04") or
                          (r["EventoID"] != "EVT-02" and r["CuentaReportada"] == NULO)) for r in events)
    add("13 eventos, orden, horas, fuentes y referencias", actual_events, expected_events, actual_events == expected_events)
    add("Eventos: hora/zona/desfase originales desconocidos; atribución limitada a EVT-02", event_unknowns, True, event_unknowns)
    course_zero = [r["FuenteID"] for r in sources if r["FuenteID"].startswith("CURSO_") and r["DesfaseSegundos"] == "0"]
    add("Fuentes CURSO no declaran desfase cero", course_zero, [], not course_zero)

    # Atribuciones y vacíos de los otros registros reproducidos.
    elevation = [r for r in rows.get("Privilegios.csv", []) if r["AsignacionID"] == "13"]
    elevation_ok = len(elevation) == 1 and all(elevation[0][k] == NULO for k in ("UsuarioID", "Rol", "AsignadoPor", "Ticket", "Vence", "ReferenciaExpediente"))
    add("Elevación reportada conserva cuenta/rol/asignador/ticket/vencimiento desconocidos", elevation_ok, True, elevation_ok)
    incident_history = [r for r in histories if r["ReferenciaExpediente"] == "E-05"]
    history_unknowns = len(incident_history) == 216 and all(r[k] == NULO for r in incident_history for k in ("UsuarioID", "SesionID", "Via"))
    add("E-05 conserva usuario, sesión y vía desconocidos", history_unknowns, True, history_unknowns)
    deployment = [r for r in rows.get("CambiosSistema.csv", []) if r["CambioSistemaID"] == "6"]
    deploy_unknowns = len(deployment) == 1 and all(deployment[0][k] == NULO for k in
        ("Ticket", "Version", "SolicitadoPor", "AprobadoPor", "FechaAprobacion", "EjecutadoPor", "EvidenciaPruebas", "HashArtefacto"))
    add("E-06 conserva detalles no aportados como nulos", deploy_unknowns, True, deploy_unknowns)
    critical = [r for r in rows.get("Alertas.csv", []) if r["ReferenciaExpediente"] == "E-07"]
    alert_unknowns = len(critical) == 1 and all(critical[0][k] == NULO for k in ("FechaHoraUTC", "AsignadoA", "PrimeraAccion", "FechaCierre", "NotaCierre"))
    add("E-07 conserva marcas de atención y cierre desconocidas", alert_unknowns, True, alert_unknowns)

    supports = sorted((data_dir / "soportes_sinteticos").glob("Pruebas_Cambio_*.md"))
    support_ok = len(supports) == 4 and all(p.read_text(encoding="utf-8").splitlines()[0] ==
        "Registro sintético de pruebas declaradas; no acredita pruebas ejecutadas sobre software real" for p in supports)
    add("Cuatro soportes declarativos con advertencia obligatoria", len(supports), 4, support_ok)
    changes = rows.get("CambiosSistema.csv", [])
    evidence_rows = [r for r in changes if r["EvidenciaPruebas"] != NULO]
    expected_evidence = [f"04_SQL/datos/v1/soportes_sinteticos/Pruebas_Cambio_{i:02d}.md" for i in range(1, 5)]
    evidence_paths_ok = [r["EvidenciaPruebas"] for r in evidence_rows] == expected_evidence and all(
        (data_dir / "soportes_sinteticos" / Path(r["EvidenciaPruebas"]).name).is_file() for r in evidence_rows)
    add("EvidenciaPruebas apunta a los cuatro soportes entregados", [r["EvidenciaPruebas"] for r in evidence_rows], expected_evidence, evidence_paths_ok)


def run_validation(data_dir: Path, schema_path: Path, seed: int = 1410,
                   include_reproducibility: bool = True, include_refusal: bool = True,
                   write_report: bool = True) -> list[dict[str, Any]]:
    checks = Checks()
    data_dir = data_dir.resolve()
    schema_path = schema_path.resolve()
    try:
        schema = parse_schema(schema_path)
        schema_ok = set(schema) == {name[:-4] for name in CSV_FILES}
        checks.add("DDL contiene las 16 tablas esperadas", sorted(schema), sorted(name[:-4] for name in CSV_FILES), schema_ok)
    except Exception as exc:
        schema = {}
        checks.add("Lectura/parseo del DDL", str(exc), "DDL legible", False)

    rows: dict[str, list[dict[str, str]]] = {}
    schema_errors: list[str] = []
    row_counts: dict[str, int] = {}
    for filename in CSV_FILES:
        table = filename[:-4]
        file_rows, issues = read_csv(data_dir / filename, EXPECTED_HEADERS[filename])
        rows[filename] = file_rows
        row_counts[filename] = len(file_rows)
        checks.add(f"Archivo, encabezado y formato: {filename}", {"filas": len(file_rows), "errores": issues[:8]},
                   {"filas": COUNTS[filename], "encabezado": EXPECTED_HEADERS[filename], "UTF-8 sin BOM/LF": True},
                   not issues and len(file_rows) == COUNTS[filename])
        ddl_columns = [column["name"] for column in schema.get(table, [])]
        if ddl_columns != EXPECTED_HEADERS[filename]:
            schema_errors.append(f"{table}: DDL={ddl_columns!r}; CSV={EXPECTED_HEADERS[filename]!r}")
    checks.add("Encabezados CSV coinciden con columnas y orden del DDL", schema_errors, [], not schema_errors)
    checks.add("Total de filas de las 16 tablas", sum(row_counts.values()), 91800, sum(row_counts.values()) == 91800)

    type_errors: list[str] = []
    check_errors: list[str] = []
    for filename in CSV_FILES:
        table = filename[:-4]
        columns = schema.get(table, [])
        for row_num, row in enumerate(rows.get(filename, []), start=2):
            for column in columns:
                try:
                    parse_cell(row.get(column["name"], ""), column, table, row_num)
                except (ValueError, OverflowError) as exc:
                    if len(type_errors) < 80:
                        type_errors.append(str(exc))
            try:
                for err in validate_checks(filename, row):
                    if len(check_errors) < 80:
                        check_errors.append(f"{table} fila {row_num}: {err}")
            except (ValueError, InvalidOperation, TypeError) as exc:
                if len(check_errors) < 80:
                    check_errors.append(f"{table} fila {row_num}: {exc}")
    checks.add("Tipos, nulabilidad, longitudes, bits, montos, fechas y límites SQL", type_errors[:20], "cero errores", not type_errors)
    checks.add("Restricciones CHECK del esquema", check_errors[:20], "cero errores", not check_errors)

    pk_errors: list[str] = []
    key_sets: dict[tuple[str, str], set[str]] = {}
    for filename, field in PRIMARY_KEYS.items():
        values = [r.get(field, "") for r in rows.get(filename, [])]
        duplicate_values = [key for key, count in Counter(values).items() if count > 1]
        if len(values) != len(set(values)) or any(v in ("", NULO) for v in values):
            pk_errors.append(f"{filename}.{field}: duplicados/nulos {duplicate_values[:5]}")
        key_sets[(filename, field)] = set(values)
    fk_errors: list[str] = []
    for filename, foreign_keys in FOREIGN_KEYS.items():
        for field, parent_file, parent_key in foreign_keys:
            parent_values = key_sets.get((parent_file, parent_key), set())
            for row_num, row in enumerate(rows.get(filename, []), start=2):
                v = row.get(field, NULO)
                if v != NULO and v not in parent_values:
                    if len(fk_errors) < 30:
                        fk_errors.append(f"{filename} fila {row_num} {field}={v!r} sin padre")
    checks.add("Claves primarias únicas y no nulas", pk_errors, "cero duplicados o nulos", not pk_errors)
    checks.add("Claves foráneas no nulas apuntan a filas existentes", fk_errors, "cero referencias huérfanas", not fk_errors)

    try:
        check_semantics(data_dir, rows, checks)
    except Exception as exc:
        checks.add("Comprobaciones de casos aprobados", f"excepción: {type(exc).__name__}: {exc}", "todas ejecutadas", False)

    generator_path = schema_path.parent / "02_generar_datos.py"
    if include_reproducibility:
        try:
            generator = import_generator(generator_path)
            with tempfile.TemporaryDirectory(prefix="p1_repro_a_") as temp_a, tempfile.TemporaryDirectory(prefix="p1_repro_b_") as temp_b:
                out_a = Path(temp_a) / "datos"
                out_b = Path(temp_b) / "datos"
                generator.build_dataset(out_a, seed)
                generator.build_dataset(out_b, seed)
                compare_paths = CSV_FILES + [f"soportes_sinteticos/Pruebas_Cambio_{i:02d}.md" for i in range(1, 5)]
                different = [rel for rel in compare_paths if (out_a / rel).read_bytes() != (out_b / rel).read_bytes()]
                checks.add("Reproducibilidad: dos generaciones independientes de CSV y soportes",
                           {"archivos_comparados": len(compare_paths), "diferencias": different},
                           {"archivos_comparados": 20, "diferencias": []}, not different)
        except Exception as exc:
            checks.add("Reproducibilidad: dos generaciones independientes de CSV y soportes",
                       f"excepción: {type(exc).__name__}: {exc}", "20 archivos idénticos", False)
    else:
        checks.add("Reproducibilidad: dos generaciones independientes de CSV y soportes", "omitida en modo interno", "ejecución externa", True)

    if include_refusal:
        try:
            before = tree_hashes(data_dir)
            result = subprocess.run([sys.executable, str(generator_path), "--salida", str(data_dir), "--semilla", str(seed)],
                                    cwd=schema_path.parent.parent, capture_output=True, text=True, timeout=30)
            after = tree_hashes(data_dir)
            refusal_ok = result.returncode != 0 and before == after
            checks.add("Segundo intento de generación en carpeta existente se rechaza sin cambiar hashes",
                       {"codigo_salida": result.returncode, "hashes_iguales": before == after,
                        "mensaje": (result.stderr or result.stdout).strip()[:400]},
                       {"codigo_salida": "distinto de cero", "hashes_iguales": True}, refusal_ok)
        except Exception as exc:
            checks.add("Segundo intento de generación en carpeta existente se rechaza sin cambiar hashes",
                       f"excepción: {type(exc).__name__}: {exc}", "rechazo y hashes idénticos", False)
    else:
        checks.add("Segundo intento de generación en carpeta existente se rechaza sin cambiar hashes", "omitida en modo interno", "ejecución externa", True)

    if write_report:
        report = {
            "version": "v1",
            "momento_validacion_utc": datetime.now(timezone.utc).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
            "alcance": "Inspección de archivos locales, contrato DDL y reproducibilidad; no incluye SQL Server ni Q-01–Q-12.",
            "datos": str(data_dir),
            "esquema": str(schema_path),
            "comprobaciones": checks.items,
            "resumen": {
                "aprobadas": sum(item["estado"] == "aprobado" for item in checks.items),
                "fallidas": sum(item["estado"] == "fallido" for item in checks.items),
                "estado": "aprobado" if all(item["estado"] == "aprobado" for item in checks.items) else "fallido",
            },
        }
        (data_dir / "Validacion_generacion_v1.json").write_text(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8", newline="\n")
    return checks.items


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--datos", required=True, help="Carpeta que contiene los CSV")
    parser.add_argument("--esquema", required=True, help="Ruta a 01_esquema.sql")
    parser.add_argument("--semilla", type=int, default=1410)
    args = parser.parse_args()
    data_dir = Path(args.datos).expanduser().resolve()
    schema_path = Path(args.esquema).expanduser().resolve()
    items = run_validation(data_dir, schema_path, seed=args.semilla)
    failed = [item for item in items if item["estado"] != "aprobado"]
    passed = len(items) - len(failed)
    print(f"Validación: {passed} aprobadas, {len(failed)} fallidas.")
    print(f"Comprobante: {data_dir / 'Validacion_generacion_v1.json'}")
    if failed:
        for item in failed:
            print(f"FALLÓ: {item['nombre']} — observado={item['observado']}; esperado={item['esperado']}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
