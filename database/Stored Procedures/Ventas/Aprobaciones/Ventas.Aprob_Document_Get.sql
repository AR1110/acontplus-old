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
--Ventas.Aprob_Document_Get 38,'[]'
IF OBJECT_ID(N'Ventas.Aprob_Document_Get', N'P') IS NOT NULL
DROP PROCEDURE Ventas.Aprob_Document_Get 
GO
CREATE PROCEDURE Ventas.Aprob_Document_Get @idUsuarioRol INT, @json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 
	DECLARE @bySearch VARCHAR(MAX)
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
										,colorFila               = CASE ad.codEstado WHEN ''A''    THEN ''table-danger'' 
																					 WHEN ''APR'' THEN  ''table-success''
																					 ELSE ''''
																   END 
                                        ,count(*) over() as totalRecords
								  FROM Ventas.Aprob_Document     ad WITH (NOLOCK) 
								  INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.codigo         = ad.codEstado
								  INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente      = ad.idCliente
								  INNER JOIN PuntoEmision        pe WITH (NOLOCK) ON pe.idPuntoEmision = ad.idPuntoEmision
								  INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pe.codEstab 
								  WHERE ad.idEntidad = @idEntidad AND es.codEstab = @codEstab '

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol

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

		        --------------------------------------------BUSQUEDA INDIVIDUAL POR PARAMETRO-------------------------------------------------------------------
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

                SELECT descripcion = 'IVA '+descripcion , codigo = 'IVA', codigoPorcentaje = codigo, tarifa = porcentaje FROM Sri.TarifaImpuesto WITH (NOLOCK) WHERE codigo = '2' AND estado = 1 ORDER BY codigoPorcentaje DESC
            RETURN
        END 

    SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
    RETURN


END
