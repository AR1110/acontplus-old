USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Cliente_Get]    Script Date: 12/15/2022 11:21:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-10-06
-- Description:	SP para listar los clietes
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.Aprob_Document_Get @idUsuarioRol INT, @json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) 
	
    --> Filters Generales
    DECLARE @byUsuario INT

    --> Global
	SELECT TOP 1 @idEntidad = idEntidad ,@byUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get 
    IF @tipo = 1
        BEGIN 
            
            --> Filters
            DECLARE @checkBoxFecha BIT 
                   ,@codEstab      VARCHAR(25) 
                   ,@byCliente     INT 
                   ,@codEstado     VARCHAR(5)
                   ,@dateStart     DATETIME2 
                   ,@dateEnd       DATETIME2 
                   ,@secuencial    VARCHAR(100) 

            --> Sql
            DECLARE @pageIndex INT ,@pageSize INT

            SET @params = '@idEntidad INT
						  ,@codEstab  VARCHAR(25)
						  ,@idCliente INT
						  ,@codEstado VARCHAR(5)
						  ,@idUsuario INT
						  ,@dateStart DATETIME2
						  ,@dateEnd   DATETIME2
                          ,@pageSize  INT
						  ,@pageIndex INT'

            SET @sql = 'SELECT ad.idAprob_Document
							  ,ad.idAprob_Document                           as uniqueId
							  --,ad.docOrigen  
							   ,IIF(td.codigo=''''FV'''', td.codigoSri, td.codigo) as docDestino
							  ,es.codEstab
                              ,og.descripcion                                as docOrigenDesc
							  ,td.descripcion                                as docDestinoDesc
							  ,FORMAT(ad.fechaEmision, ''dd/MM/yyyy HH:mm'') as fechaEmision
							  ,ad.SerieComprobante                           as serie
							  ,cu.IDCard                                     as identificacionComprador
							  ,cu.BusinessName                               as razonSocialComprador
							  ,ad.importeTotal                               as total
							  ,ep.codigo                                     as codEstado
							  ,ep.descripcion                                as estado
                              ,count(*) over()                               as totalRecords
                              ,us.nombreUsuario                              as userName
						FROM Ventas.Aprob_Document     ad WITH (NOLOCK) 
						INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.idEstadoPago      = ad.idEstadoDocumento
						INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente         = ad.idCliente
						INNER JOIN dbo.Usuario         us WITH (NOLOCK) ON us.idUsuario         = ad.idUsuario 
                        INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision    = ad.idPuntoEmision
                        INNER JOIN dbo.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = ad.idTipoDocumento
                        INNER JOIN dbo.TipoDocumento   og WITH (NOLOCK) ON og.idTipoDocumento   = ad.idTipoDocOrigen
						INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
                        INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.Id                = cl.CustomerId
						WHERE es.idEntidad = @idEntidad  '

	        SELECT @checkBoxFecha = checkBoxFecha
		          ,@codEstab      = codEstab
		          ,@byCliente     = byCliente
		          ,@codEstado     = byEstado
		          ,@byUsuario     = byUsuario
		          ,@dateStart     = fechaInicio
		          ,@dateEnd       = fechaFin
		          ,@secuencial    = LTRIM(TRIM(nroSecuencial))
                  ,@pageIndex     = pageIndex
                  ,@pageSize      = pageSize
	        FROM OPENJSON(@json) WITH
            (    
                 checkBoxFecha   BIT  
		        ,codEstab        VARCHAR(25)
		        ,byCliente       INT 
		        ,byEstado        VARCHAR(5) 
		        ,byUsuario       INT
		        ,fechaInicio     DATETIME2
		        ,fechaFin        DATETIME2
		        ,nroSecuencial   VARCHAR(20)
                ,pageIndex       INT
			    ,pageSize        INT
            )

             
            IF EXISTS(SELECT 1 FROM Config.v_User_Permission_Sale WHERE idUsuarioRol = @idUsuarioRol AND viewOthersDocs=0)
                BEGIN 
                    SELECT TOP 1 @byUsuario = idUsuario FROM v_usuario WHERE idUsuarioRol = @idUsuarioRol
                END

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND es.codEstab = @codEstab '
                END 

	        IF @secuencial IS NOT NULL
		        BEGIN
			        SET @sql = @sql + 'AND ad.secuencial BETWEEN ' + REPLACE(@secuencial,'-',' AND ')
		        END 

			IF @byCliente > 0
				BEGIN
					SET @sql = @sql + ' AND ad.idCliente = @idCliente '
				END 

			IF @codEstado IS NOT NULL
				BEGIN
				    SET @sql = @sql + 'AND ep.codigo = @codEstado '
				END

            ELSE 
                BEGIN
                    SET @sql = @sql + 'AND ep.codigo NOT IN (''A'') '
                END 

			IF @byUsuario > 0
				BEGIN
					SET @sql = @sql + 'AND ad.idUsuario = @idUsuario '
				END 
			
			IF @checkBoxFecha = 1 
				BEGIN
					SET @sql = @sql + 'AND CAST(ad.fechaEmision as date) BETWEEN CAST(@dateStart as date) AND CAST(@dateEnd as date) '
				END

	        SET @sql= @sql + 'ORDER BY ad.idAprob_Document DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '

	        EXEC sp_executesql @sql
			                  ,@params 
			                  ,@idEntidad  = @idEntidad
			                  ,@codEstab   = @codEstab
			                  ,@idCliente  = @byCliente
			                  ,@codEstado  = @codEstado 
			                  ,@idUsuario  = @byUsuario
			                  ,@dateStart  = @dateStart
			                  ,@dateEnd    = @dateEnd
                              ,@pageSize   = @pageSize
							  ,@pageIndex  = @pageIndex
            RETURN 
        END 
    
    --> DataForm
    IF @tipo = 2
        BEGIN
            SELECT nroPrecio
	              ,nroCantidad
	              ,nroIva
	              ,nroDescuentoDetalle
	              ,nroTotalDetalle
	              ,nroTotalSubTotal
	              ,nroDescuento
	              ,nroIce
	              ,importeTotal
	        FROM Config.v_Sistema_Decimal WITH (NOLOCK)
            WHERE codTrasaccion = 'V' AND idEntidad = @idEntidad

	        SELECT idTipoIva
                  ,idImpuesto
	              ,descripcion
	              ,tarifa = porcentaje
	              ,codigoPorcentaje = CAST(codigoPorcentaje as varchar)
	        FROM dbo.TipoIva WITH (NOLOCK) 
	        WHERE estado = 1

	        SELECT idTarifa
	              ,descripcion
	              ,predeterminada
	              ,codigo 
	        FROM Tarifa WITH (NOLOCK) 
	        WHERE idEntidad = @idEntidad AND estado = 1

	        SELECT idTiempoCredito
	              ,descripcion
	              ,diasCredito
	              ,numeroCuota 
	        FROM TiempoCredito WITH (NOLOCK) 
	        WHERE idEntidad = @idEntidad AND gestion = 1 AND estado = 1

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,estab + '-' + ptoEmi as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @idUsuarioRol ORDER BY defaultEstab DESC

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idBodega
                  ,bodega
                  ,defaultEstab
                  ,defaultBodega 
            FROM v_Bodega_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @idUsuarioRol ORDER BY defaultEstab DESC

            SELECT u.idUsuario 
                  ,u.nombreUsuario
                  ,u.nombreCompleto
                  ,CAST(IIF(u.idUsuario = @byUsuario, 1, 0) AS bit) as predeterminado
	        FROM v_usuario          u WITH(NOLOCK) 
	        WHERE u.idEntidad = @idEntidad
              AND u.estadoUsuario = 1

             SELECT    
	              CAST(multipleVendedor AS BIT) as multipleVendedor 
	              ,CAST(detailDuplicate AS BIT) as detailDuplicate                  
	        FROM Config.v_Sistema_Ventas gs
            WHERE gs.idEntidad = @idEntidad

            SELECT idTipoDocumento,codigo,descripcion FROM dbo.TipoDocumento WITH (NOLOCK)
            WHERE codigo IN ('FV','NE','PR') 
              AND estado = 1

            RETURN
        END 

    --> filtros
    IF @tipo = 3
        BEGIN
            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,estab + '-' + ptoEmi as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @idUsuarioRol ORDER BY defaultEstab DESC

            SELECT idEstadoPago, descripcion, codigo as codEstado FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo IN ('PE','APR','A')

            RETURN 
        END 
    
    --> Ver Documento
    IF @tipo = 4
        BEGIN
            DECLARE @id INT

            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT ad.serieComprobante
	              ,ad.fechaEmision	 
	              ,ad.observacion
	              ,ad.totalSinImpuestos
	              ,ad.totalDescuento
	              ,ad.propina
	              ,ad.importeTotal
                  ,es.nombreComercial
                  ,pe.ptoEmi
                  ,ISNULL(td.codigoSri,'NE')     as codDoc
                  ,og.codigo                     as docOrigen
                  ,cu.IDCard as identificacionComprador
             FROM Ventas.Aprob_Document     ad WITH (NOLOCK)
             INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente         = ad.idCliente
             INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision    = ad.idPuntoEmision
             INNER JOIN dbo.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = ad.idTipoDocumento
             INNER JOIN dbo.TipoDocumento   og WITH (NOLOCK) ON og.idTipoDocumento   = ad.idTipoDocOrigen
             INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
             INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.Id                = cl.CustomerId
             WHERE ad.idAprob_Document = @id

             SELECT cl.idCliente
		           ,cu.BusinessName         as nombreFiscal
		           ,cu.TradeName            as nombreComercial
		           ,cu.IdCard               as numeroIdentificacion
		           ,ISNULL(cl.direccion,'') as direccion
		           ,ti.codigoSri            as tipoIdentificacion
	         FROM Ventas.Aprob_Document        ad WITH (NOLOCK)
	         INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente            = ad.idCliente
	         INNER JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.Id                   = cl.CustomerId
             INNER JOIN dbo.TipoIdentificacion ti WITH (NOLOCK) ON ti.idTipoIdentificacion = cu.IdTypeId
	         WHERE ad.idAprob_Document = @id

             SELECT dt.idAprob_Document_Detailt
                   ,ar.codigo
                   ,dt.descripcion
                   ,dt.cantidad
                   ,dt.precioUnitario
                   ,dt.descuento
                   ,dt.precioTotalSinImpuesto
	               ,dt.codigoPorcentaje
	               ,dt.tarifa
                   ,dt.valorImpuesto
                   ,bo.descripcion as bodega
                   ,ta.descripcion as pvp
                   ,me.descripcion as medida
                   ,ti.descripcion as tipoIva
                   ,dt.nota
             FROM Ventas.Aprob_Document_Detailt dt WITH (NOLOCK) 
             INNER JOIN dbo.Articulo            ar WITH (NOLOCK) ON ar.idArticulo = dt.idArticulo
             INNER JOIN dbo.Bodega              bo WITH (NOLOCK) ON bo.idBodega   = dt.idBodega
             INNER JOIN dbo.Tarifa              ta WITH (NOLOCK) ON ta.idTarifa   = dt.idTarifa
             INNER JOIN dbo.Medida              me WITH (NOLOCK) ON me.idMedida   = dt.idMedida
             INNER JOIn dbo.TipoIva             ti WITH (NOLOCK) ON ti.idTipoIva  = dt.idTipoIva
             WHERE dt.idAprob_Document = @id 
               AND dt.estado = 1 
             ORDER BY dt.idAprob_Document_Detailt ASC

	        SELECT CASE WHEN ah.idProForma    > 0 THEN 'Proforma' 
			            WHEN ah.idNotaEntrega > 0 THEN 'Nota Entrega' 
			            ELSE '' END             as tipoDoc

		          ,CASE WHEN ah.idProForma    > 0 THEN pr.serieComprobante
			            WHEN ah.idNotaEntrega > 0 THEN ne.serieComprobante 
			            ELSE '' END             as serieComprobante
	        FROM Ventas.Aprob_Document_Hist ah WITH (NOLOCK)
            LEFT JOIN dbo.Proforma          pr WITH (NOLOCK) ON pr.idProforma    = ah.idProforma
            LEFT JOIN dbo.NotaEntrega       ne WITH (NOLOCK) ON ne.idNotaEntrega = ah.idNotaEntrega
            WHERE idAprob_Document = @id
            
            SELECT idTipoIva
                  ,idImpuesto
	              ,descripcion
	              ,tarifa = porcentaje
	              ,codigoPorcentaje = CAST(codigoPorcentaje as varchar)
	        FROM dbo.TipoIva WITH (NOLOCK) 
	        WHERE estado = 1

            RETURN 
        END 

    SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
    RETURN
END
