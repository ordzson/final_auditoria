#!/usr/bin/env python3
"""Verifica los bytes del paquete portable. No usa SQL, red ni dependencias."""
from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parent
manifest=json.loads((root/'manifest-paquete.json').read_text(encoding='utf-8'))
errors=[]
for r in manifest['archivos']:
 p=root/r['ruta']
 if not p.is_file() or p.stat().st_size!=r['bytes'] or hashlib.sha256(p.read_bytes()).hexdigest()!=r['sha256']:errors.append(r['ruta'])
print(json.dumps({'archivos':len(manifest['archivos']),'discrepancias':errors},ensure_ascii=False))
raise SystemExit(bool(errors))
