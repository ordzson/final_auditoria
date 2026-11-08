#!/usr/bin/env python3
"""Empaqueta fuentes/entregables P1, conserva rutas y verifica cada miembro del ZIP."""
from pathlib import Path
from zipfile import ZipFile,ZIP_DEFLATED
import json,hashlib,datetime,shutil,csv,subprocess,sys
B=Path(__file__).resolve().parents[1];O=B/'03_Evidencias/resultados/I6'
Z=B/'06_Comite/Paquete_portatil_P1_v1.zip'
EXACT={'03_Evidencias/hashes_sha256_v1.csv','03_Evidencias/resultados/I6/integridad-cierre.json','03_Evidencias/resultados/I6/Verificacion_paquete_I6.json','03_Evidencias/resultados/I6/paquete.log','06_Comite/Paquete_portatil_P1_v1.zip','06_Comite/Paquete_portatil_P1_v1.zip.sha256'}
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def included(p):
 r=p.relative_to(B);s=r.as_posix()
 if s in EXACT or p.suffix=='.pyc' or any(x in r.parts for x in ['node_modules','__pycache__','.git','.aws','.codex','.agents','.cache']):return False
 if p.name.startswith('.env') and p.name!='.env.example':return False
 game='06_Comite/simulacion_auditoria/'
 if s.startswith(game+'artifacts/'):
  tail=s[len(game+'artifacts/'):]
  if tail.startswith('cierre-p1/'):
   if any(('trazas' in x or x in ['baseline-test-results','historico-test-results']) for x in r.parts) or p.stat().st_size>8*1024*1024:return False
  elif not tail.startswith(('entrega/','I6/')):return False
 return True

def main():
 if Z.exists():
  old=O/'paquetes-previos';old.mkdir(exist_ok=True);shutil.copy2(Z,old/(datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S')+'.zip'))
 files=sorted(p for p in B.rglob('*') if p.is_file() and included(p) and 'paquetes-previos' not in p.parts)
 manifest={'fecha_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'alcance':'Paquete propio P1; revisión humana/integración/ensayo pendientes. No incluye credenciales, cachés, bases ni trazas voluminosas.','excluidos':'Registro SHA global e integridad terminal externos al ZIP para evitar circularidad; ZIP y resultados de su propia comprobación también externos. El manifiesto se excluye a sí mismo.','archivos':[{'ruta':str(p.relative_to(B)),'bytes':p.stat().st_size,'sha256':sha(p)} for p in files]}
 data=(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n').encode()
 with ZipFile(Z,'w',ZIP_DEFLATED,compresslevel=6) as z:
  for p in files:z.write(p,'P1/'+p.relative_to(B).as_posix())
  z.writestr('P1/manifest-paquete.json',data)
 with ZipFile(Z) as z:
  assert z.testzip() is None
  discrepancies=[r['ruta'] for r in manifest['archivos'] if hashlib.sha256(z.read('P1/'+r['ruta'])).hexdigest()!=r['sha256']]
  assert not discrepancies
  extract=Path('/tmp/i6-paquete-extraido')
  if extract.exists():shutil.rmtree(extract)
  z.extractall(extract)
 result=subprocess.run([sys.executable,str(extract/'P1/verificar_paquete_P1.py')],capture_output=True,text=True,check=True)
 checksum=sha(Z);Path(str(Z)+'.sha256').write_text(checksum+'  '+Z.name+'\n')
 summary={'fecha_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'zip':str(Z.relative_to(B)),'bytes':Z.stat().st_size,'sha256':checksum,'archivos_verificados':len(files),'miembros_zip':len(files)+1,'discrepancias':discrepancies,'zip_crc':'aprobado','extraccion_y_verificador':result.stdout.strip(),'incluye_credenciales':False,'integracion_equipo':False}
 (O/'Verificacion_paquete_I6.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2)+'\n');print(json.dumps(summary,ensure_ascii=False))
if __name__=='__main__':main()
