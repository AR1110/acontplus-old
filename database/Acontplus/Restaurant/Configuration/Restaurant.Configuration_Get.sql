USE AcontPlus
GO
--- Author: Ignacio Manchu - Ignacio Manchu
--- Date: 2023-08-15
--- Description: Listado general de configuraciones para módulo de ventas - Restaurante.
--- Restaurant.Configuration_Get 139, '{"codEstab":"ESTAB-000000117"}', ''
 
CREATE OR ALTER PROCEDURE Restaurant.Configuration_Get
@userRoleId INT
,@json NVARCHAR(MAX)
,@tableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 
	DECLARE @codEstab VARCHAR(20)
    DECLARE @customerCompanyId INT 
  --  DECLARE @actividad VARCHAR(4)
    DECLARE @idUsuario INT 

    DECLARE @tipo INT 
    
	SELECT TOP 1  @idEntidad = idEntidad, @idUsuario = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
	SELECT @codEstab = codEstab, @tipo = tipo FROM OPENJSON(@json) WITH(codEstab VARCHAR(20)  '$.codEstab', tipo INT )
   -- SELECT TOP 1 @actividad = actividad FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab

    --cliente por defecto agregado en configuracion general
    SELECT TOP 1 @customerCompanyId = ISNULL(JSON_VALUE(jsonConfig, '$.idCliente'), 0) FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND  codConfig = 'CV'

    
    --no eliminar este tipo 1, se usa para una nueva depuracion o migracion 
    -- cargar datos estabs, puntos, emision y bodegas al iniciar sessión de manera general
    IF @tipo = 1 
         BEGIN 
            SET @tableNames='puntosEmision,bodegas'
             SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,estab + '-' + ptoEmi as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idBodega
                  ,bodega
                  ,defaultEstab
                  ,defaultBodega 
            FROM v_Bodega_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC
            RETURN 
        END 

     --no eliminar este tipo 2, se usa para una nueva depuracion o migracion  
    IF @tipo = 2
        BEGIN 
	        SET @tableNames = 'ConfigDecimal,Tables,SubCategorias,Impuesto,TarifaImpuesto,Customer,config,vendedores'
            
            SELECT * FROM  Config.v_Sistema_Decimal WHERE idEntidad = @idEntidad AND codTrasaccion = 'V';

            SELECT 
                 Id, 
                 [NumberTable], 
                 [Description], 
                 [Floor], 
                 roomDescription ,
                 vt.Assigned
             FROM Restaurant.v_Table vt 
             INNER JOIN Entidad e WITH(NOLOCK) ON vt.ruc = e.ruc 
             WHERE vt.codEstab = @codEstab

              SELECT
		        idSubFamilia    = sf.idSubFamilia
		        ,idFamilia      = ISNULL(sf.idFamilia,0)
		        ,descripcion    = sf.descripcion
		        ,estado         = sf.estado
		        ,siglas         = sf.siglas
		        ,codigo         = sf.codigo
		        ,montoObjetivo  = ISNULL(sf.montoObjetivo,0)
		        ,nombreFamilia  = ISNULL(f.descripcion, 'Ninguna')
                ,s3ObjectUrl    = ISNULL(sf.s3ObjectUrl, '')
	        FROM Inventario.v_SubFamilia  sf
	        INNER JOIN Familia f ON f.idFamilia = sf.idFamilia
	        WHERE sf.idEntidad = @idEntidad
	        --AND sf.applicationId IS NOT NULL
            AND f.siglas IN( 'RES', 'POR')
            AND sf.estado = 1
            ORDER BY sf.idSubFamilia DESC  

            SELECT * FROM Sri.Impuesto WITH (NOLOCK) 
	        SELECT i.idImpuesto, ti.idTarifaImpuesto, ti.codImpuesto, ti.codigo, ti.descripcion, ti.porcentaje FROM Sri.TarifaImpuesto ti WITH (NOLOCK)  
            INNER JOIN Sri.Impuesto i WITH(NOLOCK) ON i.codigo = ti.codImpuesto 

             --CUSTOMER DEFAULT      
	        SELECT 
		        cl.idCliente
	           ,cl.numeroIdentificacion
	           ,cl.nombreComercial
	           ,cl.nombreFiscal
	           ,cl.direccion
	           ,cl.correo
	        FROM dbo.Cliente cl WITH (NOLOCK) WHERE cl.idCliente = @customerCompanyId 

             SELECT CAST(searchCode AS BIT)       as searchCode
	            ,CAST(printerAutomatic AS BIT) as printerAutomatic
	            ,CAST(payAutomatic AS BIT)     as payAutomatic
	            ,CAST(multipleVendedor AS BIT) as multipleVendedor
	        FROM Config.v_Sistema_Ventas gs
            WHERE gs.idEntidad = @idEntidad

             SELECT 
                u.idUsuario, 
                u.nombreUsuario, 
                u.nombreCompleto, 
                predeterminado = CAST(IIF(u.idUsuario = @idUsuario, 1, 0) AS bit)
             FROM v_usuario u WITH(NOLOCK) 
             WHERE u.idEntidad = @idEntidad AND u.estadoUsuario = 1
            RETURN 
        END 

   --se usa en pos tecnologia react 
	SET @tableNames = 'ConfigDecimal,Tables,SubCategorias,Impuesto,TarifaImpuesto,PtoEmi_Asig,Bodega_Asign,Floor,Room,Customer,tarifaImpuestoVigente,config,vendedores'
	
    SELECT * FROM  Config.v_Sistema_Decimal WHERE idEntidad = @idEntidad AND codTrasaccion = 'V'
    
    SELECT rt.Id, rt.Capacity, rt.NumberTable, rt.description, rr.id as roomId, rf.id as floorId, rt.Assigned
    FROM Restaurant.v_Table rt
	INNER JOIN Restaurant.v_Room rr ON rr.id = rt.roomId
	INNER JOIN Restaurant.v_Floor rf ON rf.id = rr.floorId
	WHERE rf.codEstab = @codEstab AND rt.Enabled = 1 
	ORDER BY rt.numberTable ASC

    SELECT
		idSubFamilia    = sf.idSubFamilia
		,idFamilia      = ISNULL(sf.idFamilia,0)
		,descripcion    = sf.descripcion
		,estado         = sf.estado
		,siglas         = sf.siglas
		,codigo         = sf.codigo
		,montoObjetivo  = ISNULL(sf.montoObjetivo,0)
		,nombreFamilia  = ISNULL(f.descripcion, 'Ninguna')
        ,s3ObjectUrl    = ISNULL(sf.s3ObjectUrl, '')
	FROM Inventario.v_SubFamilia  sf
	INNER JOIN Familia f ON f.idFamilia = sf.idFamilia
	WHERE sf.idEntidad = @idEntidad
	--AND sf.applicationId IS NOT NULL
    AND f.siglas IN( 'RES', 'POR')
    AND sf.estado = 1
    ORDER BY sf.idSubFamilia DESC  
    
	SELECT * FROM Sri.Impuesto WITH (NOLOCK) 
	SELECT * FROM Sri.TarifaImpuesto WITH (NOLOCK)  
    

    SELECT pa.idPtoEmi_asig, ea.codEstab_Asig, pe.idPuntoEmision, pe.ptoEmi, pa.predeterminado, pa.estado
	FROM Config.PtoEmi_Asig pa  WITH (NOLOCK) 
	INNER JOIN  Config.Estab_Asig ea WITH (NOLOCK)  ON ea.codEstab_Asig = pa.codEstab_Asig
	INNER JOIN PuntoEmision pe On pa.idPuntoEmision = pe.idPuntoEmision
 	WHERE ea.idUsuarioRol = @userRoleId

    SELECT * FROM v_Bodega_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId
    
    SELECT Id, Capacity, Code, [Description]  FROM Restaurant.[Floor] WHERE CodEstab = @codEstab

    SELECT id, code, [description], capacity, floorId 
    FROM Restaurant.v_room WHERE codEstab = @codEstab

    --CUSTOMER DEFAULT      
	SELECT 
		cl.idCliente
	   ,cl.numeroIdentificacion
	   ,cl.nombreComercial
	   ,cl.nombreFiscal
	   ,cl.direccion
	   ,cl.correo
	FROM dbo.Cliente cl WITH (NOLOCK) WHERE cl.idCliente = @customerCompanyId 
            
	SELECT idTarifaImpuesto, descripcion, codigo, porcentaje FROM Sri.TarifaImpuesto WITH (NOLOCK) WHERE codigo IN ('4') AND estado = 1 ORDER BY codigo DESC

    SELECT CAST(searchCode AS BIT)       as searchCode
	    ,CAST(printerAutomatic AS BIT) as printerAutomatic
	    ,CAST(payAutomatic AS BIT)     as payAutomatic
	    ,CAST(multipleVendedor AS BIT) as multipleVendedor
	FROM Config.v_Sistema_Ventas gs
    WHERE gs.idEntidad = @idEntidad

     SELECT 
        u.idUsuario, 
        u.nombreUsuario, 
        u.nombreCompleto, 
        predeterminado = CAST(IIF(u.idUsuario = @idUsuario, 1, 0) AS bit)
     FROM v_usuario u WITH(NOLOCK) 
     WHERE u.idEntidad = @idEntidad AND u.estadoUsuario = 1
END
GO
