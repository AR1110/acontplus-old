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
	DECLARE @idEntidad INT
    DECLARE @tipo INT
    DECLARE @checkBoxFecha BIT 
    DECLARE @codEstab VARCHAR(25) 
    DECLARE @byCliente INT 
    DECLARE @codEstado VARCHAR(5) 
    DECLARE @byUsuario INT 
    DECLARE @dateStart DATETIME 
    DECLARE @dateEnd DATETIME  
	DECLARE @secuencial VARCHAR(100) 
    DECLARE @pageSize INT
    DECLARE @pageIndex INT 
    DECLARE @id INT
    DECLARE @uniqueId VARCHAR(500)

	DECLARE @params NVARCHAR(MAX) = '@idEntidad         INT
									,@codEstab  VARCHAR(25)
									,@idCliente         INT
									,@codEstado  VARCHAR(5)
									,@idUsuario         INT
									,@dateStart    DATETIME
									,@dateEnd      DATETIME
                                    ,@pageSize          INT
							        ,@pageIndex         INT'

	DECLARE @sql NVARCHAR(MAX) = 'SELECT idAprob_Document        = ad.idAprob_Document
										,uniqueId                = ad.uniqueId
										,es.codEstab
										,ad.docOrigen  
										,ad.codDoc
										,docOrigenDesc           = CASE ad.docOrigen WHEN ''PR'' THEN ''Proforma''
																				     WHEN ''NE'' THEN ''Nota Entrega''
																				     ELSE '''' 
																   END
										,docDestinoDesc          = CASE ad.codDoc WHEN ''01'' THEN ''Factura''
																				  WHEN ''NE'' THEN ''Nota Entrega''
																				  ELSE '''' 
																   END
										,fechaEmision            = CONVERT(NVARCHAR,FORMAT(ad.fechaEmision, ''dd/MM/yyyy HH:mm''))
										,serie                   = ad.estab+''-''+ad.ptoEmi+''-''+Helper.F_Auto_Sequential(ad.secuencial)
										,identificacionComprador = ad.identificacionComprador
										,razonSocialComprador	 = cl.nombreFiscal
										,total                   = ad.importeTotal
										,codEstado               = ad.codEstado
										,estado			         = ep.descripcion
										,colorFila               = CASE ad.codEstado WHEN ''A''   THEN ''table-danger'' 
																					 WHEN ''APR'' THEN ''table-success''
																					 ELSE ''''
																   END 
                                        ,count(*) over() as totalRecords
								  FROM Ventas.Aprob_Document     ad WITH (NOLOCK) 
								  INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.codigo         = ad.codEstado
								  INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente      = ad.idCliente
								  INNER JOIN PuntoEmision        pe WITH (NOLOCK) ON pe.idPuntoEmision = ad.idPuntoEmision
								  INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pe.codEstab 
								  WHERE ad.idEntidad = @idEntidad AND es.codEstab = @codEstab '

	SELECT @idEntidad = idEntidad ,@byUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get 
    IF @tipo = 1
        BEGIN 
	        SELECT @checkBoxFecha = checkBoxFecha
		          ,@codEstab      = codEstab
		          ,@byCliente     = byCliente
		          ,@codEstado     = byEstado
		          ,@byUsuario     = byUsuario
		          ,@dateStart     = CONVERT(DATETIME, fechaInicio, 105)
		          ,@dateEnd       = CONVERT(DATETIME, fechaFin, 105)
		          ,@secuencial    = LTRIM(TRIM(nroSecuencial))
                  ,@pageIndex     = pageIndex
                  ,@pageSize      = pageSize
	        FROM OPENJSON(@json) WITH
            (    
                 checkBoxFecha           BIT  
		        ,codEstab        VARCHAR(25)
		        ,byCliente               INT 
		        ,byEstado         VARCHAR(5) 
		        ,byUsuario               INT
		        ,fechaInicio     VARCHAR(50)
		        ,fechaFin        VARCHAR(50)
		        ,nroSecuencial   VARCHAR(20)
                ,pageIndex               INT
			    ,pageSize                INT
            )

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
						SET @sql = @sql + 'AND ad.codEstado = @codEstado '
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
			                  ,@idEntidad     = @idEntidad
			                  ,@codEstab      = @codEstab
			                  ,@idCliente     = @byCliente
			                  ,@codEstado     = @codEstado 
			                  ,@idUsuario     = @byUsuario
			                  ,@dateStart     = @dateStart
			                  ,@dateEnd       = @dateEnd
                              ,@pageSize      = @pageSize
							  ,@pageIndex     = @pageIndex
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
                  ,ptoEmi + '-' + estab as ptoEmi
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
	        FROM Usuario               u WITH(NOLOCK)
	        INNER JOIN App.UsuarioRol ur WITH(NOLOCK) ON u.idUsuario = ur.idUsuario
	        WHERE ur.idEntidad = @idEntidad

            RETURN
        END 

    --> filtros
    IF @tipo = 3
        BEGIN
            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,ptoEmi + '-' + estab as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @idUsuarioRol ORDER BY defaultEstab DESC

            SELECT idEstadoPago, descripcion, codigo as codEstado FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo IN ('PE','AC')

            RETURN 
        END 
    
    --> Ver Documento
    IF @tipo = 4
        BEGIN
            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT TOP 1 @uniqueId = uniqueId FROM Ventas.Aprob_Document WITH (NOLOCK) WHERE idAprob_Document = @id

            SELECT d.estab+'-'+d.ptoEmi+'-'+Helper.F_Auto_Sequential(d.secuencial) as serieComprobante
                  ,e.nombreComercial
                  ,d.ptoEmi
	              ,d.identificacionComprador
	              ,d.codDoc
	              ,d.docOrigen
	              ,d.fechaEmision	 
	              ,d.observacion
	              ,totalSinImpuestos
	              ,totalDescuento
	              ,propina
	              ,importeTotal	   
             FROM Ventas.Aprob_Document     d WITH (NOLOCK)
             INNER JOIN dbo.PuntoEmision   pe WITH (NOLOCK) ON pe.idPuntoEmision = d.idPuntoEmision 
             INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON e.codEstab = pe.codEstab
             WHERE d.idAprob_Document = @id

             SELECT cl.idCliente
		           ,cl.nombreComercial
		           ,cl.nombreFiscal
		           ,cl.numeroIdentificacion
		           ,ISNULL(cl.direccion,'') as direccion
		           ,ti.codigoSri            as tipoIdentificacion
	         FROM Ventas.Aprob_Document        ad
	         INNER JOIN dbo.Cliente            cl WITH(NOLOCK) ON cl.idCliente            = ad.idCliente
	          LEFT JOIN dbo.TipoIdentificacion ti WITH(NOLOCK) ON ti.idTipoIdentificacion = cl.idTipoIdentificacion
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
             FROM Ventas.Aprob_Document_Detailt dt WITH (NOLOCK) 
             INNER JOIN dbo.Articulo            ar WITH (NOLOCK) ON ar.idArticulo = dt.idArticulo
             INNER JOIN dbo.Bodega              bo WITH (NOLOCK) ON bo.idBodega   = dt.idBodega
             INNER JOIN dbo.Tarifa              ta WITH (NOLOCK) ON ta.idTarifa   = dt.idTarifa
             INNER JOIN dbo.Medida              me WITH (NOLOCK) ON me.idMedida   = dt.idMedida
             INNER JOIn dbo.TipoIva             ti WITH (NOLOCK) ON ti.idTipoIva  = dt.idTipoIva
             WHERE dt.uniqueId = @uniqueId 
               AND dt.estado = 1 
             ORDER BY dt.idAprob_Document_Detailt ASC

             
	        SELECT tipoDoc  = CASE WHEN codDocumento = 'PR' THEN 'Proforma' 
			                       WHEN codDocumento = 'NE' THEN 'NotaEntrega' 
			                       ELSE '' END 
		          ,serieComprobante = serie
	        FROM Ventas.Aprob_Document_Hist WHERE uniqueId = @uniqueId
            
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
