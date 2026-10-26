USE AcontPlus
GO
SET ANSI_NULLS ON
GO


SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-07-31
-- Description:	SP PARA LISTAR LOS COMPROBANTES ELECTRONICOS DEL SRI IMPORTADOS 
-- =============================================
CREATE OR ALTER PROCEDURE Recepcion.Documento_Get
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT,
        @idEntidad INT,
        @idUsuario INT
    
    --> Filter
	DECLARE @codEstab VARCHAR(50)
           ,@idEstablecimiento INT
           ,@codDoc VARCHAR(2)
           ,@startDate DATETIME2
           ,@endDate DATETIME2
           ,@claveAcceso VARCHAR(50)
           ,@serieComprobante VARCHAR(20)
           ,@rucProveedor VARCHAR(25)
           ,@id INT
           ,@ckBoxFecha BIT
           ,@subcategoryId INT
           ,@detalles VARCHAR(MAX)
           ,@idProveedor INT
	
	--> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT

    --> Recuperando Datos
    SELECT TOP 1 @idEntidad  = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get
    IF @tipo = 1
        BEGIN

            SET @tableNames = 'documentos'

            SET @params = '@idEstablecimiento   INT
						  ,@codDoc           VARCHAR(2)
						  ,@startDate        DATETIME2
						  ,@endDate          DATETIME2
						  ,@rucProveedor     VARCHAR(25)
                          ,@claveAcceso      VARCHAR(49)
                          ,@pageIndex        INT
                          ,@pageSize         INT
                          ,@serieComprobante VARCHAR(20)
                          ,@subcategoryId    INT '

            SET @sql = 'SELECT dr.[idDocumento]
	                          ,e.idEstablecimiento
		                      ,e.[codEstab]
		                      ,dr.[comprobante]
		                      ,dr.[codDoc]
		                      ,dr.[serieComprobante]
		                      ,c.IDCard [rucEmisor]
		                      ,c.businessName razonSocialEmisor
		                      ,dr.[fechaEmision]
		                      ,dr.[fechaAutorizacion]
		                      ,dr.[identificacionReceptor]
		                      ,dr.[claveAcceso]
		                      ,dr.[importeTotal]
		                      ,CASE WHEN xmlCompressed IS NOT NULL THEN 1 ELSE 0 END hasXml
		                      ,ISNULL(complete, 0) complete
                              ,dr.inventarioAnulado
                              ,dr.estado
                              ,COUNT(*) OVER()  as totalRecords
                              ,ISNULL(s.[Name], '''') subcategoryName
                              ,ISNULL(cpp.subcategoryId, 0) subcategoryId
	                    FROM Recepcion.DocumentoRecibido       dr WITH (NOLOCK)
						INNER JOIN Sri.Establecimiento e WITH(NOLOCK) ON dr.idEstablecimiento = e.idEstablecimiento
                        LEFT JOIN Contabilidad.CuentaPorPagar cpp WITH (NOLOCK) ON dr.claveAcceso = cpp.uniqueId
                        LEFT JOIN Contabilidad.Subcategory      s WITH (NOLOCK) ON cpp.subcategoryId = s.Id
						LEFT JOIN Customer.Customer c WITH(NOLOCK) ON dr.customerId = c.Id
	                    WHERE dr.idEstablecimiento = @idEstablecimiento '

                SELECT 
                    @codDoc          = NULLIF(LTRIM(RTRIM(codDoc)), ''),
                    @ckBoxFecha      = ckBoxFecha,
                    @startDate       = startDate,
                    @endDate         = endDate,
                    @claveAcceso     = NULLIF(LTRIM(RTRIM(claveAcceso)), ''),
                    @codEstab        = NULLIF(LTRIM(RTRIM(codEstab)), ''),
                    @rucProveedor    = NULLIF(LTRIM(RTRIM(rucProveedor)), ''),
                    @pageSize        = pageSize,
                    @pageIndex       = pageIndex,
                    @serieComprobante = NULLIF(LTRIM(RTRIM(serieComprobante)), ''),
                    @subcategoryId   = subcategoryId
                FROM OPENJSON(@JSON) WITH 
                (
                    codDoc           VARCHAR(2),
                    ckBoxFecha       BIT,
                    startDate        DATETIME2,
                    endDate          DATETIME2,
                    claveAcceso      VARCHAR(50),
                    codEstab         VARCHAR(50),
                    rucProveedor     VARCHAR(25),
                    pageSize         INT,
                    pageIndex        INT,
                    serieComprobante VARCHAR(20),
                    subcategoryId    INT
                );

            print LEN(@rucProveedor )

            SET @idEstablecimiento = (SELECT idEstablecimiento FROM Sri.Establecimiento WHERE codEstab = @codEstab)

            IF @ckBoxFecha = 1 AND @serieComprobante IS NULL
                BEGIN
                    SET @sql = @sql + 'AND CAST(dr.fechaEmision AS DATE) BETWEEN CAST(@startDate AS DATE) AND CAST(@endDate AS DATE) '
                END 

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dr.codDoc = @codDoc '
                END 

            IF @rucProveedor IS NOT NULL
	            BEGIN 
		            SET @sql = @sql + 'AND rucEmisor = @rucProveedor '
	            END

            IF @claveAcceso IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dr.claveAcceso = @claveAcceso '
                END


            IF @serieComprobante IS NOT NULL
                BEGIN
                    SET @sql = @sql + ' AND dr.serieComprobante LIKE ''%' + @serieComprobante + '%'' ' 
                END


            IF @subcategoryId > 0
                BEGIN
                     SET @sql = @sql + ' AND cpp.subcategoryId = @subcategoryId ' 
                END

            SET @sql = @sql + ' ORDER BY idDocumento DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

            EXEC sp_executesql @sql
		                      ,@params
		                      ,@idEstablecimiento         = @idEstablecimiento
		                      ,@codDoc           = @codDoc
		                      ,@startDate        = @startDate
		                      ,@endDate          = @endDate
		                      ,@rucProveedor     = @rucProveedor
                              ,@claveAcceso      = @claveAcceso
                              ,@pageIndex        = @pageIndex
                              ,@pageSize         = @pageSize
                              ,@serieComprobante = @serieComprobante
                              ,@subcategoryId    = @subcategoryId

            RETURN 
        END 

    --> Filter
    IF @tipo = 2
        BEGIN
            
            SET @tableNames = 'establecimientos,tipoComprobantes,subcategories'

            SELECT idEstablecimiento,codEstab,nombreComercial FROM Config.v_Estab_Asign WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY Predeterminado desc

            SELECT descripcion,codigoSri as codDoc, codigoSri FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigoSri IN ('01','04','07','05') ORDER BY codigoSri

            SELECT * FROM Contabilidad.subcategory  WITH (NOLOCK) WHERE companyId = @idEntidad AND Enabled = 1

            RETURN 
        END 

	--> DataForm Detail
	IF @tipo = 3
	    BEGIN
		    
            SET @tableNames = 'SustentoTributario,CategoriaCompra,Bodega,Medida,Impuestos'

		    SELECT *
		    FROM SustentoTributario WITH (NOLOCK)

		    SELECT *
		    FROM CategoriaCompra WITH (NOLOCK)
		    WHERE idEntidad = @idEntidad

		    SELECT *
		    FROM Bodega WITH (NOLOCK)
		    WHERE estado = 1 AND codEstab IN (SELECT codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = @userRoleId) 

		    SELECT *
		    FROM Medida WITH (NOLOCK)
		    WHERE idEntidad = @idEntidad

            SELECT ti.idTarifaImpuesto
                  ,ti.idImpuesto
			      ,ti.codigo           
			      ,ti.descripcion
                  ,ti.porcentaje
	        FROM Sri.TarifaImpuesto ti
            INNER JOIN Sri.Impuesto im ON im.idImpuesto = ti.idImpuesto
	        WHERE ti.estado = 1
              AND ti.estado = 1
              AND im.codigo = 2

		    RETURN
	    END

    --> Documento Relacionado 
	IF @tipo = 4
	    BEGIN
            
            SET @tableNames = 'comprobante'

            SELECT @id = id  , @codDoc = codDoc FROM OPENJSON(@json) WITH (codDoc VARCHAR(10),id INT)

		    IF @codDoc = '01'
		        BEGIN
                    SELECT TOP 1 @claveAcceso = claveAcceso FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE idDocumento = @id

			        SELECT 'Retencion'                                                           as comprobante
				           ,de.serieComprobante
				           ,cu.IDCard                                                            as rucEmisor
				           ,cu.TradeName                                                         as razonSocialEmisor
				           ,CONVERT(NVARCHAR, FORMAT(de.fechaEmision, 'dd/MM/yyyy HH:mm'))       as fechaEmision
				           ,de.claveAcceso
				           ,0                                                                    as importeTotal
			        FROM FactElect.RetAtsDocSustento retDoc
			        INNER JOIN FactElect.RetencionAts rAts WITH (NOLOCK) ON rAts.idRetencionAts       = retDoc.idRetencionAts
                    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = rAts.idDocumentoElectronico
                    INNER JOIN dbo.Proveedor            pr WITH (NOLOCK) ON pr.idProveedor            = rAts.idProveedor
                    INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = pr.CustomerId
			        WHERE retDoc.numAutDocSustento = @claveAcceso
			          AND rAts.anuladaSri = 0
                      AND retDoc.estado = 1
		        END

		    IF @codDoc = '07' OR @codDoc = '04'
		        BEGIN
			        SELECT CASE dr.codDocSustento WHEN '01' THEN 'Factura' ELSE '' END  as comprobante
				          ,dr.numDocSustento                                            as serieComprobante
				          ,dr.fechaEmisionDocSustento                                   as fechaEmision
				          ,dr.claveAcceso
				          ,ISNULL((
                                SELECT CAST(SUM(di.TaxBase) as numeric(18,2)) FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) WHERE di.DocumentoRecibidoId = @id
                          ),0) as baseImponible
			        FROM FactElect.DocRelacionado dr WITH (NOLOCK)
			        WHERE dr.idDocumentoRecibido = @id
		        END

            RETURN 
	    END

    --> Compra no habitual de los detalles
    IF @tipo = 5
        BEGIN
            SET @tableNames = 'InfoContribuyente,CompraHabitual'

            SELECT @id = id
                  ,@detalles = detalles
            FROM OPENJSON(@json)
            WITH
            (   id INT
               ,detalles NVARCHAR(MAX) AS JSON
            )

            SELECT @idProveedor  = pr.idProveedor
                  ,@rucProveedor = cu.IdCard
            FROM Recepcion.DocumentoRecibido dr
            INNER JOIN Customer.Customer     cu ON cu.Id         = dr.customerId
            INNER JOIN dbo.Proveedor         pr ON pr.CustomerId = cu.Id AND pr.idEntidad = @idEntidad
            WHERE idDocumento = @id

            SELECT dr.customerId
                  ,pr.idProveedor
                  ,cu.IdCard as ruc
            FROM Recepcion.DocumentoRecibido dr
            INNER JOIN Customer.Customer     cu ON cu.Id         = dr.customerId
            INNER JOIN dbo.Proveedor         pr ON pr.CustomerId = cu.Id AND pr.idEntidad = @idEntidad
            WHERE idDocumento = @id

            SELECT  ca.idCompraHabitual
                   ,ca.idProveedor   as idProveedor
                   ,ca.ruc
                   ,ca.codArticulo as codArticulo
                   ,ca.idMedida  
                   ,ar.idArticulo
                   ,ar.codigo
                   ,ar.codigoBarra
                   ,ar.codigoAuxiliar
                   ,ar.llevaInventario
                   ,ar.descripcion
                   ,ISNULL
                   ((
                        SELECT me.idMedida
                              ,me.descripcion as medida
                              ,sa.precioCosto
                              ,af.precioCostoFraccionado as precioUnitario
                              ,af.precioCostoFraccionado as precioCostoFraccionado
                              ,af.conversion
                        FROM ArticuloFraccionado af 
                        INNER JOIN dbo.Articulo  sa ON sa.idArticulo = af.idArticulo
                        INNER JOIN Medida        me ON me.idMedida   = af.idMedida 
                        WHERE af.idArticulo = ar.idArticulo 
                        FOR JSON PATH

                    ),'[]') as fraccionado 

                   ,(
                        SELECT me.idMedida 
                              ,me.descripcion as medida
                              ,a.precioCosto 
                              ,a.precioCosto  as precioUnitario
                              ,a.precioCosto  as precioCostoFraccionado
                              ,1 as conversion
                        FROM Articulo      a WITH (NOLOCK) 
                        INNER JOIN Medida me WITH (NOLOCK) ON me.idMedida = a.idMedida 
                        WHERE a.idArticulo = ar.idArticulo 
                        FOR JSON PATH

                    ) as principal
            FROM OPENJSON(@detalles)
            WITH (codigoPrincipal VARCHAR(100)) as dt
            INNER JOIN Recepcion.CompraHabitual    ca ON ca.codArticulo = dt.codigoPrincipal AND ca.idProveedor = @idProveedor
            INNER JOIN dbo.Articulo                ar ON ar.idArticulo  = ca.idArticulo

        END
END
GO


