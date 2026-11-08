#!/usr/bin/env python3
"""Servidor portátil de solo lectura. Python 3 estándar, sin dependencias."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
import argparse,functools
p=argparse.ArgumentParser();p.add_argument('--puerto',type=int,default=8765);args=p.parse_args()
root=Path(__file__).resolve().parent
class PortableHandler(SimpleHTTPRequestHandler):
    # Vite's final build uses absolute resource URLs. Serve its existing bytes
    # at those URLs too, keeping the document index at the package root.
    def translate_path(self,path):
        target=Path(super().translate_path(path))
        if not target.exists():
            relative=target.relative_to(root)
            asset=root/'06_Comite/simulacion_auditoria/dist'/relative
            if asset.exists():return str(asset)
        return str(target)
handler=functools.partial(PortableHandler,directory=str(root))
print(f'Abrir http://127.0.0.1:{args.puerto}/index.html · detener con Ctrl+C',flush=True)
ThreadingHTTPServer(('127.0.0.1',args.puerto),handler).serve_forever()
