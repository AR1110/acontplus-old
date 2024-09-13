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
	DECLARE @codEstab VARCHAR(50),
        @codDoc VARCHAR(2),
        @startDate DATETIME,
        @endDate DATETIME,
        @claveAcceso VARCHAR(50),
        @serieComprobante VARCHAR(20),
        @rucProveedor VARCHAR(25),
        @id INT,
        @ckBoxFecha BIT,
        @subcategoryId INT
	
	--> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT

    --> Recuperando Datos
    SELECT TOP 1 @idEntidad  = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get
    IF @tipo = 1
        BEGIN
            
            SET @tableNames = 'documentos'

            SET @params = '@codEstab     VARCHAR(50)
						  ,@codDoc       VARCHAR(2)
						  ,@startDate    DATETIME2
						  ,@endDate      DATETIME2
						  ,@rucProveedor VARCHAR(25)
                          ,@claveAcceso  VARCHAR(49)
                          ,@pageIndex    INT
                          ,@pageSize     INT
                          ,@serieComprobante VARCHAR(20)
                          ,@subcategoryId INT'

            SET @sql = 'SELECT dr.[idDocumento]
		                      ,dr.[codEstab]
		                      ,dr.[comprobante]
		                      ,dr.[codDoc]
		                      ,dr.[serieComprobante]
		                      ,dr.[rucEmisor]
		                      ,dr.[razonSocialEmisior] razonSocialEmisor
		                      ,dr.[fechaEmision]
		                      ,dr.[fechaAutorizacion]
		                      ,dr.[tipoEmision]
		                      ,dr.[identificacionReceptor]
		                      ,dr.[claveAcceso]
		                      ,dr.[numeroAutorizacion]
		                      ,dr.[importeTotal]
		                      ,CASE WHEN xmlCompressed IS NOT NULL THEN 1 ELSE 0 END hasXml
		                      ,ISNULL(complete, 0) complete
		                      ,CASE WHEN xmlCompressed IS NOT NULL AND complete = 0 THEN ''background-color: #FFF5BD;''
			                        WHEN complete = 1                               THEN ''background-color: #03a9f3; cursor: pointer;''
			                                                                        ELSE ''''
			                   END                                                               as colorRow
		                      ,CASE WHEN complete = 1 THEN ''background-color: #03a9f3;''
			                                          ELSE ''''
			                   END                                                               as colorCol
		                      ,CASE WHEN complete = 1 THEN ''Documento Importado'' ELSE '''' END as hoverText
                              ,COUNT(*) OVER()                                                   as totalRecords
                              ,ISNULL(s.[Name], '''') subcategoryName
                              ,ISNULL(dr.subcategoryId, 0) subcategoryId
	                    FROM Recepcion.DocumentoRecibido       dr WITH (NOLOCK)
                        LEFT JOIN Contabilidad.CuentaPorPagar cpp WITH (NOLOCK) ON dr.claveAcceso = cpp.uniqueId
                        LEFT JOIN Contabilidad.Subcategory      s WITH (NOLOCK) ON dr.subcategoryId = s.Id
	                    WHERE dr.codEstab = @codEstab
                          AND dr.estado = 1 '

            SELECT @codDoc       = codDoc
		          ,@ckBoxFecha   = ckBoxFecha
                  ,@startDate    = startDate
		          ,@endDate      = endDate
		          ,@claveAcceso  = claveAcceso
		          ,@codEstab     = codEstab
		          ,@rucProveedor = rucProveedor
                  ,@pageSize     = pageSize
				  ,@pageIndex    = pageIndex
                  ,@serieComprobante = serieComprobante
                  ,@subcategoryId = subcategoryId
	        FROM OPENJSON(@JSON) WITH 
            (
			     codDoc       VARCHAR(2) 
			    ,ckBoxFecha   BIT
                ,startDate    DATETIME2 
			    ,endDate      DATETIME2
			    ,claveAcceso  VARCHAR(50) 
			    ,codEstab     VARCHAR(50) 
			    ,rucProveedor VARCHAR(25)
                ,pageSize     INT
                ,pageIndex    INT
                ,serieComprobante VARCHAR(20)
                ,subcategoryId INT
			)

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

            IF (@subcategoryId > 0)
                BEGIN
                     SET @sql = @sql + ' AND dr.subcategoryId = @subcategoryId ' 
                END


            SET @sql = @sql + ' ORDER BY idDocumento DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

            EXEC sp_executesql @sql
		                      ,@params
		                      ,@codEstab     = @codEstab
		                      ,@codDoc       = @codDoc
		                      ,@startDate    = @startDate
		                      ,@endDate      = @endDate
		                      ,@rucProveedor = @rucProveedor
                              ,@claveAcceso  = @claveAcceso
                              ,@pageIndex    = @pageIndex
                              ,@pageSize     = @pageSize
                              ,@serieComprobante = @serieComprobante
                              ,@subcategoryId = @subcategoryId

            RETURN 
        END 

    --> Filter
    IF @tipo = 2
        BEGIN
            
            SET @tableNames = 'establecimientos,tipoComprobantes,subcategories'

            SELECT idEstablecimiento,codEstab,nombreComercial FROM Config.v_Estab_Asign WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId 

            SELECT descripcion,codigoSri as codDoc FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigoSri IN ('01','04','07') ORDER BY codigoSri

            SELECT * FROM Contabilidad.subcategory  WITH (NOLOCK) WHERE companyId = @idEntidad AND Enabled = 1

            RETURN 
        END 

	--> DataForm Detail
	IF @tipo = 3
	    BEGIN
		    
            SET @tableNames = 'SustentoTributario,CategoriaCompra,Bodega,Medida'

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

			        SELECT 'Retención'                                                           as comprobante
				           ,de.serieComprobante
				           ,pr.numeroIdentificacion                                              as rucEmisor
				           ,pr.nombreComercial                                                   as razonSocialEmisor
				           ,CONVERT(NVARCHAR, FORMAT(de.fechaEmision, 'dd/MM/yyyy HH:mm'))       as fechaEmision
				           ,de.claveAcceso
				           ,0                                                                    as importeTotal
			        FROM FactElect.RetAtsDocSustento retDoc
			        INNER JOIN FactElect.RetencionAts rAts ON rAts.idRetencionAts       = retDoc.idRetencionAts
                    INNER JOIN dbo.DocumentoElectronico de ON de.idDocumentoElectronico = rAts.idDocumentoElectronico
                    INNER JOIN dbo.Proveedor            pr ON pr.idProveedor            = rAts.idProveedor
			        WHERE retDoc.numAutDocSustento = @claveAcceso
			          AND rAts.anuladaSri = 0
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

    SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
    RETURN 

END
GO


