from pathlib import Path
import os,subprocess,json,time,urllib.request
T=Path('/tmp/revision_p1');out={};env=dict(os.environ);env['DCONF_BACKEND']='memory';env['XDG_RUNTIME_DIR']=str(T/'runtime');Path(env['XDG_RUNTIME_DIR']).mkdir(exist_ok=True,mode=0o700)
for ext,target in [('docx','pdf'),('xlsx','xlsx')]:
 cmd=['libreoffice','-env:UserInstallation=file:///tmp/revision_p1/perfil-runtime-'+ext,'--headless','--convert-to',target,'--outdir',str(T/'reapertura/salida')]+[str(p) for p in (T/'reapertura/entrada').glob('*.'+ext)]
 try:
  r=subprocess.run(cmd,capture_output=True,text=True,env=env,timeout=55);out[ext]={'comando':cmd,'codigo':r.returncode,'stdout':r.stdout,'stderr':r.stderr}
 except subprocess.TimeoutExpired as e:out[ext]={'timeout':True,'comando':cmd}
(T/'libreoffice.json').write_text(json.dumps(out,ensure_ascii=False,indent=2))
log=(T/'servidor.log').open('w');p=subprocess.Popen(['python3',str(T/'extraido/P1/servir_P1.py'),'--puerto','8876'],stdout=log,stderr=log)
try:
 for i in range(30):
  try:urllib.request.urlopen('http://127.0.0.1:8876/index.html',timeout=1);break
  except OSError:time.sleep(.1)
 r=subprocess.run(['pnpm','exec','node',str(T/'runtime.mjs')],cwd='/home/ordson/final auditoria/final_auditoria/Operacion_Trazabilidad_Reparto/06_Comite/simulacion_auditoria',capture_output=True,text=True,timeout=55);(T/'navegador.log').write_text(r.stdout+'\n'+r.stderr);print('navegador',r.returncode,r.stdout,r.stderr[:1000]);print('libreoffice',json.dumps(out,ensure_ascii=False))
finally:p.terminate();p.wait(timeout=5);log.close()
