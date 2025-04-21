USE AcontPlus
GO
--- Author: Ignacio Manchu - Ignacio Manchu
--- Date: 2023-08-15
--- Description: Listado general de configuraciones para módulo de ventas - Restaurante.
--- Restaurant.Configuration_Get 139, '{"codEstab":"ESTAB-000000117","tipo": 2}', ''
 
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
    DECLARE @idUsuario INT 

    DECLARE @tipo INT 
    
	SELECT TOP 1  @idEntidad = idEntidad, @idUsuario = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
	SELECT @codEstab = codEstab, @tipo = tipo FROM OPENJSON(@json) WITH(codEstab VARCHAR(20)  '$.codEstab', tipo INT ) 

    --cliente por defecto agregado en configuracion general
     SELECT TOP 1 @customerCompanyId = idCliente FROM Config.v_Sistema_Ventas WITH (NOLOCK) WHERE idEntidad = @idEntidad 
      
    -- cargar datos estabs, puntos, emision y bodegas al direccionar ruta main de manera general
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

     --Listado para POS 
    IF @tipo = 2
        BEGIN 
	        SET @tableNames = 'ConfigDecimal,Tables,SubCategorias,Impuesto,TarifaImpuesto,Customer,config,vendedores,tarifas,orderCount'
            
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
	        --SELECT i.idImpuesto, ti.idTarifaImpuesto, ti.codImpuesto, ti.codigo, ti.descripcion, ti.porcentaje FROM Sri.TarifaImpuesto ti WITH (NOLOCK)  
         --   INNER JOIN Sri.Impuesto i WITH(NOLOCK) ON i.codigo = ti.codImpuesto
         
          SELECT i.idImpuesto, ti.idTarifaImpuesto, codImpuesto=i.codigo, ti.codigo, ti.descripcion, ti.porcentaje FROM Sri.TarifaImpuesto ti WITH (NOLOCK)  
          INNER JOIN Sri.Impuesto i WITH(NOLOCK) ON i.idImpuesto = ti.idImpuesto
          
   
             --CUSTOMER DEFAULT      
	        SELECT TOP 1 cl.idCliente,
                   cu.IDCard       AS numeroIdentificacion,
                   cu.BusinessName AS nombreComercial,
                   cu.TradeName    AS nombreFiscal,
                   cl.direccion,
                   cl.correo
            FROM dbo.Cliente cl WITH (NOLOCK) 
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id = cl.CustomerId
            INNER JOIN dbo.TipoIdentificacion ti WITH (NOLOCK) ON ti.idTipoIdentificacion = cu.IdTypeId 
            WHERE cl.idEntidad = @idEntidad AND ((@customerCompanyId IS NOT NULL AND cl.idCliente = @customerCompanyId) 
               OR (@customerCompanyId IS NULL AND ti.codigoSri = '07'));


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

             SELECT 
                idTarifa
                ,descripcion
                ,predeterminada as defaultTarifa
             FROM dbo.Tarifa 
             WHERE idEntidad = @idEntidad AND estado = 1


             SELECT count(*) AS pendingOrders
            FROM Restaurant.[Order] ro
            INNER JOIN Sri.Establecimiento se ON se.idEstablecimiento = ro.EstablecimientoId
            WHERE se.idEntidad = @idEntidad 
                AND se.codEstab = @codEstab 
                AND CAST(ro.CreatedAt AS DATE) = CAST(GETDATE() AS DATE)
                AND ro.Deleted IS NULL 
                AND ro.Finished = 0
                AND ro.Divided = 0
          

            RETURN 
        END 

    
END
GO
