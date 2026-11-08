#!/usr/bin/env python3
"""I2/I3: Python estándar + sqlcmd del contenedor. No borra ni reutiliza bases."""
import argparse,csv,datetime as dt,decimal,hashlib,json,os,re,secrets,shutil,subprocess
from pathlib import Path
SQL=Path(__file__).resolve().parent
ROOT=SQL.parent
EV=ROOT/'03_Evidencias'
CONTAINER='p1-trazabilidad-sql2022'
CUT='2026-10-15T23:59:59-06:00'
ORDER=re.findall(r'CREATE TABLE dbo\.(\w+)',(SQL/'01_esquema.sql').read_text())
def now(): return dt.datetime.now(dt.timezone.utc).isoformat()
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def dump(p,o): p.write_text(json.dumps(o,ensure_ascii=False,indent=2)+'\n')
def run(sql,db='master',auditor=False):
    cmd=['docker','exec','-i']
    if auditor:
        password=(SQL/'.env.auditor').read_text().strip().split('=',1)[1]
        cmd+=['-e','SQLCMDPASSWORD='+password]
    cmd += [CONTAINER,'bash','-c',('' if auditor else 'export SQLCMDPASSWORD="$MSSQL_SA_PASSWORD"; ')+ 'f=$(mktemp); trap "rm -f \"$f\"" EXIT; cat > "$f"; /opt/mssql-tools18/bin/sqlcmd -i "$f" -x -S localhost -C -U '+('auditor_lectura' if auditor else 'sa')+' -d '+db+' -b -r1 -y0 -w65535 -f65001']
    p=subprocess.run(cmd,input='SET NOCOUNT ON; SET DATEFORMAT ymd;\n'+sql,text=True,capture_output=True)
    if p.returncode: raise RuntimeError((p.stdout+p.stderr)[:3500])
    return p.stdout.strip()
def query(sql,db,auditor=False,prefix='',suffix=''):
    sql=sql.strip().rstrip(';')
    raw=run(prefix+'\n'+sql+' FOR JSON PATH, INCLUDE_NULL_VALUES;\n'+suffix,db,auditor)
    return json.loads(''.join(raw.splitlines()) or '[]')
def csvout(path,rows):
    assert rows, 'Salida vacía: definir encabezado explícito antes de exportar'
    with path.open('w',newline='',encoding='utf-8') as f:
        w=csv.DictWriter(f,fieldnames=list(rows[0]),lineterminator='\n');w.writeheader()
        for r in rows: w.writerow({k:'\\N' if v is None else str(int(v)) if isinstance(v,bool) else v for k,v in r.items()})
def preserve():
    dest=EV/'originales'/'recepcion_I2'
    paths=[]
    for v in ('v1','v2'): paths+=list((SQL/'datos'/v).rglob('*'))
    paths += [SQL/n for n in ['01_esquema.sql','02_generar_datos.py','02_generar_datos_v2.py','validar_datos.py','validar_datos_v2.py','Diseno_laboratorio_v1.md']]
    paths += [EV/'Supuestos_P1_v1.csv',EV/'Programa_pruebas_P1_v1.csv',ROOT/'P1_Incidente_evidencia_simulacion/ESTADO_P1.md']
    records=[]
    for p in paths:
        if not p.is_file(): continue
        d=dest/p.relative_to(ROOT);d.parent.mkdir(parents=True,exist_ok=True)
        if d.exists():
            if p.name in ('Programa_pruebas_P1_v1.csv','ESTADO_P1.md'): continue
            assert sha(d)==sha(p),f'Copia preservada distinta: {d}'
        else: shutil.copy2(p,d)
        records.append({'ruta':str(p.relative_to(ROOT)),'copia':str(d.relative_to(ROOT)),'sha256':sha(p)})
    record=dest/'Preservacion.json'
    if not record.exists(): dump(record,{'fecha_copia_utc':now(),'metodo':'shutil.copy2; comparación SHA-256; no acredita recepción histórica ni traspaso humano','archivos':records})
    return records
PARAM="DECLARE @corte datetime2(0)='2026-10-15T23:59:59', @ref datetime2(0)='2026-10-07', @finref datetime2(0)='2026-10-14';\n"
def execute(db,out,build):
    assert re.fullmatch(r'RedNova_P1_[A-Za-z0-9_]+',db)
    out.mkdir(parents=True,exist_ok=False)
    started=now(); checks=[]
    def check(n,o,e):
        checks.append({'prueba':n,'observado':o,'esperado':e,'aprobado':o==e})
        if o!=e: dump(out/'Fallo.json',checks);raise AssertionError(n)
    m=json.loads((SQL/'datos/v2/Manifest_datos_v2.json').read_text())
    hashes=dict(m['sha256_csv_y_soportes']);hashes.update(m['sha256_scripts']);hashes['04_SQL/01_esquema.sql']=m['sha256_esquema'];hashes['03_Evidencias/Supuestos_P1_v1.csv']=m['sha256_supuestos']
    for p,h in hashes.items(): check('Archivo SHA256 '+p,sha(ROOT/p),h)
    preserve()
    engine=query("SELECT @@VERSION AS Motor,CAST(SERVERPROPERTY('ProductVersion') AS varchar(40)) AS Version",'master')[0]
    contract=query("SELECT t.name AS Tabla,SUM(p.rows) AS Filas FROM sys.tables t JOIN sys.partitions p ON p.object_id=t.object_id AND p.index_id IN (0,1) GROUP BY t.name ORDER BY t.name",'P1_Diseno_Contrato_v1')
    check('Contrato conservado 16 tablas vacías',[len(contract),sum(r['Filas'] for r in contract)],[16,0])
    if build:
        run((SQL/'00_preparar_base.sql').read_text().replace('$(BASE)',db))
        run((SQL/'01_esquema.sql').read_text(),db)
    meta=query("SELECT t.name AS Tabla,c.name AS Campo,ty.name AS Tipo,c.max_length AS Longitud,c.precision AS Precision,c.scale AS Escala,c.is_nullable AS Anulable,c.column_id AS Posicion FROM sys.tables t JOIN sys.columns c ON c.object_id=t.object_id JOIN sys.types ty ON ty.user_type_id=c.user_type_id ORDER BY t.name,c.column_id",db)
    dump(out/'Columnas_SQL.json',meta)
    for table in ORDER:
        cols=[c for c in meta if c['Tabla']==table]
        def typ(c):
            t=c['Tipo']; l=c['Longitud']
            return t+('('+str(l//2 if t=='nvarchar' else l)+')' if t in ('varchar','nvarchar','char') else '('+str(c['Precision'])+','+str(c['Escala'])+')' if t=='decimal' else '('+str(c['Escala'])+')' if t in ('datetime2','datetimeoffset') else '')
        with (SQL/'datos/v2'/f'{table}.csv').open() as f: source=list(csv.DictReader(f))
        if build:
            rows=[{k:None if v=='\\N' else v for k,v in r.items()} for r in source]
            names=','.join('['+c['Campo']+']' for c in cols)
            typed=','.join('['+c['Campo']+'] '+typ(c)+' '+"'$ .".replace(' ','')+c['Campo']+"'" for c in cols)
            for offset in range(0,len(rows),1000):
                payload=json.dumps(rows[offset:offset+1000],ensure_ascii=False,indent=1).replace("'","''")
                template='\n'.join(line for line in (SQL/'03_carga.sql').read_text().splitlines() if not line.startswith('--'))
                for k,v in {'TABLA':table,'COLUMNAS':names,'COLUMNAS_TIPADAS':typed,'JSON':payload}.items(): template=template.replace('$('+k+')',v)
                run(template,db)
            print('Cargada '+table,flush=True)
        actual=query('SELECT * FROM dbo.['+table+'] ORDER BY ['+cols[0]['Campo']+']',db)
        check('SQL cantidad '+table,len(actual),m['cantidades_por_archivo'][table+'.csv'])
        bykey={str(r[cols[0]['Campo']]):r for r in actual}
        errors=[]
        for r in source:
            a=bykey.get(r[cols[0]['Campo']])
            for c in cols:
                k=c['Campo'];v=r[k];av=a[k] if a else 'MISSING'
                if v=='\\N': ok=av is None
                elif c['Tipo'] in ('int','bigint','bit','decimal'): ok=decimal.Decimal(str(int(av) if isinstance(av,bool) else av))==decimal.Decimal(v)
                elif c['Tipo']=='datetimeoffset': ok=dt.datetime.fromisoformat(av)==dt.datetime.fromisoformat(v)
                else: ok=av==v
                if not ok: errors.append([r[cols[0]['Campo']],k,v,av])
        check('SQL todas las celdas vs CSV '+table,errors,[])
    if build:
        cred=SQL/'.env.auditor'
        exists=query("SELECT name FROM sys.server_principals WHERE name='auditor_lectura'",'master')
        if not exists:
            if not cred.exists():
                fd=os.open(cred,os.O_CREAT|os.O_EXCL|os.O_WRONLY,0o600)
                with os.fdopen(fd,'w') as f:f.write('AUDITOR_PASSWORD='+secrets.token_urlsafe(32)+'aA1!\n')
            pw=cred.read_text().strip().split('=',1)[1]
            run("CREATE LOGIN auditor_lectura WITH PASSWORD=N'"+pw+"', CHECK_POLICY=ON;")
        elif not cred.exists(): raise RuntimeError('Login auditor existente sin credencial local; no se sobrescribe')
        run((SQL/'04_usuario_lectura.sql').read_text().replace('$(BASE)',db),db)
    fk=query('SELECT COUNT(*) AS Cantidad FROM sys.foreign_keys WHERE is_disabled=0 AND is_not_trusted=0',db)[0]['Cantidad']
    check('SQL FK activas y confiables',fk,18)
    constraints=run('DBCC CHECKCONSTRAINTS WITH ALL_CONSTRAINTS;',db)
    check('SQL DBCC restricciones sin errores',constraints,'')
    verification=query((SQL/'verificar_laboratorio.sql').read_text(),db)
    for r in verification: check('SQL '+r['Prueba'],r['Observado'],r['Esperado'])
    # Auditor conectado con login propio: prueba real SELECT y rechazos inocuos.
    identity=query('SELECT ORIGINAL_LOGIN() AS Login,USER_NAME() AS Usuario,DB_NAME() AS Base,COUNT(*) AS Filas FROM dbo.Clientes',db,True)
    check('Login auditor real',identity[0]['Login'],'auditor_lectura')
    dump(out/'Conexion_auditor.json',identity)
    denials=[]
    for label,stmt in [('INSERT','INSERT dbo.BitacoraSQL (EventoSQLID) VALUES (-1)'),('UPDATE',"UPDATE dbo.BitacoraSQL SET Objeto=Objeto WHERE 1=0"),('DELETE','DELETE dbo.BitacoraSQL WHERE 1=0'),('ALTER','ALTER TABLE dbo.BitacoraSQL ADD PruebaDenegada int NULL'),('ADMIN','CREATE USER prueba_admin_denegada WITHOUT LOGIN')]:
        text="BEGIN TRAN; BEGIN TRY "+stmt+"; ROLLBACK; SELECT 0 AS Rechazado,0 AS Error; END TRY BEGIN CATCH IF @@TRANCOUNT>0 ROLLBACK; SELECT 1 AS Rechazado,ERROR_NUMBER() AS Error; END CATCH"
        # TRY/CATCH contiene SELECT con JSON separados para distinguir error real.
        text=text.replace('SELECT 0 AS Rechazado,0 AS Error;','SELECT 0 AS Rechazado,0 AS Error FOR JSON PATH;').replace('SELECT 1 AS Rechazado,ERROR_NUMBER() AS Error;','SELECT 1 AS Rechazado,ERROR_NUMBER() AS Error FOR JSON PATH;')
        rr=json.loads(run(text,db,True))[0];rr['Operacion']=label;denials.append(rr)
        check('Auditor rechazo real '+label,[rr['Rechazado'],rr['Error']],[1,229 if label in ('INSERT','UPDATE','DELETE') else 1088 if label=='ALTER' else 15247])
    csvout(out/'Permisos_rechazos.csv',denials)
    support_started=now();perms=[]
    for u in ['admin_bitacora_lab','control_bitacora_lab','auditor_lectura']:
        prefix='' if u=='auditor_lectura' else "EXECUTE AS USER=N'"+u+"';"
        rr=query((SQL/'Permisos_bitacora.sql').read_text(),db,u=='auditor_lectura',prefix,'' if not prefix else 'REVERT;')[0]
        perms.append(rr)
        check('Permisos efectivos '+u,[rr['PuedeSelect'],rr['PuedeUpdate'],rr['PuedeDelete'],rr['PuedeAlter'],rr['ControlBD']],[1,int(u=='admin_bitacora_lab'),int(u=='admin_bitacora_lab'),0,0])
    csvout(out/'Q-S01.csv',perms)
    grants=query("SELECT p.name AS Usuario,d.state_desc AS Estado,d.permission_name AS Permiso,OBJECT_NAME(d.major_id) AS Objeto FROM sys.database_permissions d JOIN sys.database_principals p ON p.principal_id=d.grantee_principal_id WHERE p.name IN ('auditor_lectura','admin_bitacora_lab','control_bitacora_lab') ORDER BY p.name,d.class,d.major_id,d.permission_name",db)
    csvout(out/'Concesiones_SQL.csv',grants)
    blocks=re.split(r'-- Q-(\d\d) ',(SQL/'Analisis_Auditoria.sql').read_text())[1:]
    executions=[];counts={}
    for i in range(0,len(blocks),2):
        q='Q-'+blocks[i];body=blocks[i+1];body='\n'.join(body.splitlines()[1:])
        when=now();rows=query(body,db,True,PARAM);again=query(body,db,True,PARAM)
        check(q+' repetición idéntica',rows==again,True)
        p=out/(q+'.csv');csvout(p,rows);counts[q]=len(rows)
        executions.append({'ejecucion':out.name,'fecha_utc':when,'base':db,'usuario':'auditor_lectura','motor':engine['Version'],'datos':'v2','consulta':q,'corte':CUT,'filas':len(rows),'archivo':str(p.relative_to(ROOT)),'sha256_csv':sha(p),'sha256_consulta':hashlib.sha256((PARAM+body).encode()).hexdigest(),'sha256_archivo_sql':sha(SQL/'Analisis_Auditoria.sql'),'sha256_manifest':sha(SQL/'datos/v2/Manifest_datos_v2.json'),'repeticion_identica':True})
    support=dict(executions[0]);support.update(consulta='Q-S01',fecha_utc=support_started,usuario='sa EXECUTE AS USER admin_bitacora_lab/control_bitacora_lab; auditor_lectura conexión propia',filas=3,archivo=str((out/'Q-S01.csv').relative_to(ROOT)),sha256_csv=sha(out/'Q-S01.csv'),sha256_consulta=sha(SQL/'Permisos_bitacora.sql'),sha256_archivo_sql=sha(SQL/'Permisos_bitacora.sql'),repeticion_identica='ver Comparacion_reconstruccion.json')
    executions.append(support)
    csvout(out/'Ejecuciones_v1.csv',executions)
    expected={'Q-01':6,'Q-02':18,'Q-03':3,'Q-04':7,'Q-05':2,'Q-06':3,'Q-07':216,'Q-08':10,'Q-09':9,'Q-10':3,'Q-11':4,'Q-12':13}
    check('Consultas casos y controles',counts,expected)
    boundary=query("SELECT CASE WHEN 180>180 THEN 1 ELSE 0 END AS Recert180,CASE WHEN 181>180 THEN 1 ELSE 0 END AS Recert181,CASE WHEN 300>3*100 THEN 1 ELSE 0 END AS Volumen3x,CASE WHEN 301>3*100 THEN 1 ELSE 0 END AS VolumenMayor3x,CASE WHEN ABS((75.0-100)/100)>0.25 THEN 1 ELSE 0 END AS Backup25,CASE WHEN ABS((74.9-100)/100)>0.25 THEN 1 ELSE 0 END AS BackupMayor25",db,True)
    check('SQL límites estrictos',list(boundary[0].values()),[0,1,0,1,0,1]);dump(out/'Limites_umbrales.json',boundary)
    report={'inicio_utc':started,'fin_utc':now(),'base':db,'motor':engine,'datos':'v2','semilla':1410,'corte':CUT,'conteos_consultas':counts,'comprobaciones':checks,'total_aprobadas':len(checks),'captura':'pendiente; conexión real registrada en JSON y CSV, sin imagen fabricada','limites':['Datos sintéticos; no corroboran el caso','Restauración de julio es registro ficticio; no se ejecutó un restore','Revisión humana y traspasos P2/P3 pendientes']}
    dump(out/'Validacion_laboratorio_v1.json',report)
    (out/'Validacion_laboratorio_v1.txt').write_text('\n'.join('APROBADO '+c['prueba'] for c in checks)+'\n'+json.dumps({k:v for k,v in report.items() if k!='comprobaciones'},ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'base':db,'salida':str(out),'aprobadas':len(checks),'consultas':counts},ensure_ascii=False))
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--base',required=True);p.add_argument('--salida',required=True);p.add_argument('--solo-verificar',action='store_true');a=p.parse_args()
    execute(a.base,EV/'resultados'/a.salida,not a.solo_verificar)
