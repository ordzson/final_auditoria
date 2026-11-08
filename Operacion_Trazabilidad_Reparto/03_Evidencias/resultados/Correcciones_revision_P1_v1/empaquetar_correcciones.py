#!/usr/bin/env python3
"""Crea ZIP v2 desde ZIP I6, conserva el juego y comprueba hashes/HTTP local."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
from html.parser import HTMLParser
import copy,csv,datetime as dt,hashlib,json,socket,subprocess,sys,tempfile,time,urllib.request

R=Path(__file__).resolve().parents[3]
O=Path(__file__).resolve().parent
OLD=R/'06_Comite/Paquete_portatil_P1_v1.zip'
NEW=R/'06_Comite/Paquete_portatil_P1_v2.zip'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def save(p,obj):p.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n')
class Links(HTMLParser):
 def __init__(self):super().__init__();self.paths=[]
 def handle_starttag(self,tag,attrs):
  if tag=='a':self.paths.extend(v for k,v in attrs if k=='href')
def main():
 assert not NEW.exists(), 'No sobrescribir un paquete v2 existente'
 entry=json.loads((O/'Entradas_y_preservacion.json').read_text())
 for x in entry['entradas_que_no_deben_cambiar']:assert sha(R/x['ruta'])==x['sha256'],x['ruta']
 # Solo entradas autorizadas, copias previas y comprobantes; nunca juego actual.
 paths={R/x['ruta'] for x in entry['archivos_preservados'] if x['ruta']!='03_Evidencias/hashes_sha256_v1.csv'}
 paths.add(R/'03_Evidencias/Borradores_hallazgos_P1_v1.md')
 paths.add(R/'04_SQL/verificar_Q06_v2.py')
 for folder in [R/'03_Evidencias/originales/previos_correcciones_revision_P1_v1',R/'03_Evidencias/resultados/Revision_independiente_P1',O]:
  paths.update(p for p in folder.rglob('*') if p.is_file() and '__pycache__' not in p.parts and p.name not in ['manifest.json','Verificacion_paquete_v2.json','integridad_correcciones.json','servidor_paquete_v2.log'])
 paths={p for p in paths if not p.name.startswith('.env') and p.suffix!='.pyc'}
 assert not any('simulacion_auditoria' in p.relative_to(R).parts for p in paths)
 now=dt.datetime.now(dt.timezone.utc).isoformat()
 manifest={'fecha_utc':now,'alcance':'RI-P1-01/03/04 y dependencias; RI-P1-02 se conserva. I6 histórico, sin revisión del juego ni aprobación humana.','archivos':[{'ruta':str(p.relative_to(R)),'bytes':p.stat().st_size,'sha256':sha(p)} for p in sorted(paths)]}
 save(O/'manifest.json',manifest);paths.add(O/'manifest.json')
 replacements={str(p.relative_to(R)):p for p in paths}
 with ZipFile(OLD) as src:
  assert src.testzip() is None
  previous=json.loads(src.read('P1/manifest-paquete.json'))
  items={x['ruta']:x for x in previous['archivos']}
  for rel,p in replacements.items():items[rel]={'ruta':rel,'bytes':p.stat().st_size,'sha256':sha(p)}
  internal={'fecha_utc':now,'alcance':'Paquete P1 v2: ZIP I6 con correcciones autorizadas; juego conservado byte a byte del ZIP v1 y excluido de revisión.','excluidos':'Registro SHA global y comprobantes externos de este ZIP para evitar autorreferencia. I4/I5/I6 son históricos; ver README de correcciones.','archivos':[items[k] for k in sorted(items)]}
  pending=NEW.with_suffix('.zip.tmp');assert not pending.exists()
  with ZipFile(pending,'w',ZIP_DEFLATED,compresslevel=6) as dst:
   for x in src.infolist():
    assert not x.filename.startswith('/') and '..' not in Path(x.filename).parts
    if x.filename=='P1/manifest-paquete.json' or x.filename.removeprefix('P1/') in replacements:continue
    dst.writestr(copy.copy(x),src.read(x.filename))
   for rel,p in sorted(replacements.items()):dst.write(p,'P1/'+rel)
   dst.writestr('P1/manifest-paquete.json',(json.dumps(internal,ensure_ascii=False,indent=2)+'\n').encode())
  with ZipFile(pending) as dst:
   assert dst.testzip() is None
   assert len(dst.namelist())==len(set(dst.namelist()))==len(items)+1
   bad=[rel for rel,x in items.items() if len(dst.read('P1/'+rel))!=x['bytes'] or hashlib.sha256(dst.read('P1/'+rel)).hexdigest()!=x['sha256']]
   assert not bad
   game=[x.filename for x in src.infolist() if x.filename.startswith('P1/06_Comite/simulacion_auditoria/')]
   assert all(dst.read(n)==src.read(n) for n in game)
   with tempfile.TemporaryDirectory(prefix='p1-paquete-v2-') as tmp:
    dst.extractall(tmp);root=Path(tmp)/'P1'
    verify=subprocess.run([sys.executable,str(root/'verificar_paquete_P1.py')],capture_output=True,text=True,check=True)
    parser=Links();parser.feed((root/'index.html').read_text())
    with socket.socket() as probe:probe.bind(('127.0.0.1',0));port=probe.getsockname()[1]
    with (O/'servidor_paquete_v2.log').open('w') as log:
     server=subprocess.Popen([sys.executable,str(root/'servir_P1.py'),'--puerto',str(port)],stdout=log,stderr=log)
     try:
      for _ in range(50):
       try:
        with urllib.request.urlopen(f'http://127.0.0.1:{port}/index.html',timeout=1) as response:response.read()
        break
       except OSError:time.sleep(.1)
      links=[]
      for rel in parser.paths:
       if '/dist/' in rel:continue
       with urllib.request.urlopen(f'http://127.0.0.1:{port}/'+rel,timeout=10) as response:
        links.append({'ruta':rel,'estado':response.status,'bytes':len(response.read())})
      assert links and all(x['estado']==200 for x in links)
     finally:server.terminate();server.wait(timeout=5)
 pending.replace(NEW);checksum=sha(NEW);Path(str(NEW)+'.sha256').write_text(checksum+'  '+NEW.name+'\n')
 # The server log is external, generated by opening this archive; do not include it.
 result={'fecha_utc':dt.datetime.now(dt.timezone.utc).isoformat(),'zip':str(NEW.relative_to(R)),'bytes':NEW.stat().st_size,'sha256':checksum,'archivos_verificados':len(items),'miembros':len(items)+1,'crc_aprobado':True,'discrepancias':bad,'extraccion_y_verificador':json.loads(verify.stdout),'enlaces_documentales':links,'juego_bytes_identicos_al_ZIP_I6':len(game),'juego_revisado_o_ejecutado':False,'zip_v1_conservado':True,'revision_humana':'Pendiente'}
 save(O/'Verificacion_paquete_v2.json',result)
 reg=R/'03_Evidencias/hashes_sha256_v1.csv'
 with reg.open(encoding='utf-8-sig',newline='') as f:reader=csv.DictReader(f);fields=reader.fieldnames;registered={x['ruta']:x for x in reader}
 current=paths|{NEW,Path(str(NEW)+'.sha256'),O/'Verificacion_paquete_v2.json'}
 for p in current:
  rel=str(p.relative_to(R));h=sha(p)
  if rel not in registered or registered[rel]['sha256']!=h:
   registered[rel]={'ruta':rel,'sha256':h,'bytes':str(p.stat().st_size),'calculado_en_utc':now,'metodo':'Python hashlib.sha256','origen':'Correcciones RI-P1-01/03/04; versión previa conservada. No cambia registro IA ni concede revisión humana. Ver resultados/Correcciones_revision_P1_v1/README.md.'}
 with reg.open('w',encoding='utf-8',newline='') as f:writer=csv.DictWriter(f,fieldnames=fields);writer.writeheader();writer.writerows(registered[k] for k in sorted(registered))
 assert all(sha(p)==registered[str(p.relative_to(R))]['sha256'] for p in current)
 assert all(sha(R/x['ruta'])==x['sha256'] for x in entry['entradas_que_no_deben_cambiar'])
 docs=json.loads((O/'Verificacion_documentos.json').read_text())
 save(O/'integridad_correcciones.json',{'fecha_utc':dt.datetime.now(dt.timezone.utc).isoformat(),'manifest_sha256':sha(O/'manifest.json'),'registro_sha256':sha(reg),'zip_sha256':checksum,'archivos_correccion':len(manifest['archivos']),'archivos_actualizados_o_registrados':len(current),'comprobaciones_documentales':docs['total'],'documentales_aprobadas':docs['aprobadas'],'SQL_Q06_controles':10,'zip_archivos':len(items),'IA_y_datos_v2_conservados':True,'cierres_I6_y_ZIP_v1_conservados':True,'juego_revision_excluida':True,'sin_nuevo_98_de_98':True,'integracion_equipo':False,'aprobacion_academica':False})
 print(json.dumps({'zip':str(NEW),'archivos':len(items),'discrepancias':bad,'enlaces_HTTP':len(links),'juego_conservado_sin_revision':len(game)},ensure_ascii=False))
if __name__=='__main__':main()
