USE AcontPlus

-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
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
    DECLARE @tipo INT ,@idEntidad INT ,@idUsuario INT
    
    --> Filter
	DECLARE @codEstab VARCHAR(50) ,@codDoc VARCHAR(2) ,@startDate DATETIME ,@endDate DATETIME ,@claveAcceso VARCHAR(50) ,@rucProveedor VARCHAR(25) ,@id INT ,@ckBoxFecha BIT 
	
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
                          ,@pageSize     INT'

            SET @sql = 'SELECT [idDocumento]
		                      ,[codEstab]
		                      ,[comprobante]
		                      ,[codDoc]
		                      ,[serieComprobante]
		                      ,[rucEmisor]
		                      ,[razonSocialEmisior]
		                      ,[fechaEmision]
		                      ,[fechaAutorizacion]
		                      ,[tipoEmision]
		                      ,[identificacionReceptor]
		                      ,[claveAcceso]
		                      ,[numeroAutorizacion]
		                      ,[importeTotal]
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
	                    FROM Recepcion.DocumentoRecibido WITH (NOLOCK)
	                    WHERE codEstab = @codEstab '

            SELECT @codDoc       = codDoc
		          ,@ckBoxFecha   = ckBoxFecha
                  ,@startDate    = startDate
		          ,@endDate      = endDate
		          ,@claveAcceso  = claveAcceso
		          ,@codEstab     = codEstab
		          ,@rucProveedor = rucProveedor
                  ,@pageSize     = pageSize
				  ,@pageIndex    = pageIndex
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
			)

            IF @ckBoxFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(fechaEmision AS DATE) BETWEEN CAST(@startDate AS DATE) AND CAST(@endDate AS DATE) '
                END 

            IF @codDoc IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND codDoc = @codDoc '
                END 

            IF @rucProveedor IS NOT NULL
	            BEGIN
		            SET @sql = @sql + 'AND rucEmisor = @rucProveedor '
	            END

            IF @claveAcceso IS NOT NULL
                BEGIN 
                    SET @sql = @sql + 'AND claveAcceso = @claveAcceso '
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

            RETURN 
        END 

    --> Filter
    IF @tipo = 2
        BEGIN
            
            SET @tableNames = 'establecimientos,tipoComprobantes'

            SELECT idEstablecimiento,codEstab,nombreComercial FROM v_Estab_Asign WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId 

            SELECT descripcion,codigoSri as codDoc FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigoSri IN ('01','03','04','06','07') ORDER BY codigoSri

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
				           ,rAts.estab + rAts.ptoEmi + Helper.F_Auto_Sequential(rAts.secuencial) as serieComprobante
				           ,rAts.identificacionSujetoRetenido                                    as rucEmisor
				           ,rAts.razonSocialSujetoRetenido                                       as razonSocialEmisior
				           ,CONVERT(NVARCHAR, FORMAT(rAts.fechaEmision, 'dd/MM/yyyy HH:mm'))     as fechaEmision
				           ,rAts.claveAcceso
				           ,0                                                                    as importeTotal
			        FROM FactElect.RetAtsDocSustento retDoc
			        INNER JOIN FactElect.RetencionAts rAts ON rAts.idRetencionAts = retDoc.idRetencionAts
			        WHERE retDoc.numAutDocSustento = @claveAcceso
			        AND rAts.anuladaSri = 0
		        END

		    IF @codDoc = '07' OR @codDoc = '04'
		        BEGIN
			        SELECT CASE dr.codDocSustento WHEN '01' THEN 'Factura' ELSE '' END  as comprobante
				          ,dr.numDocSustento                                            as serieComprobante
				          ,dr.fechaEmisionDocSustento                                   as fechaEmision
				          ,dr.claveAcceso
				          ,dr.baseImponible                                             as importeTotal
			        FROM FactElect.DocRelacionado dr WITH (NOLOCK)
			        WHERE dr.idDocumentoRecibido = @id
		        END

            RETURN 
	    END

    SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
    RETURN 

END
GO


