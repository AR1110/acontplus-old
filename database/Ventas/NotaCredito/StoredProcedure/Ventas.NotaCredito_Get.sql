USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[NotaCredito_Get]    Script Date: 1/28/2023 10:21:15 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.NotaCredito_Get @idRol INT,@json NVARCHAR(MAX)
 AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT 

    --> Filters
    DECLARE @id INT
	       ,@idUsuario INT
	       ,@checkBoxFecha BIT 
	       ,@idCliente INT 
           ,@secuencial VARCHAR(50)
	       ,@idEstadoDocumento INT
	       ,@codDoc NVARCHAR(20)
	       ,@codEstab VARCHAR(50)
           ,@idPuntoEmision INT
	       ,@fechaInicio DATETIME2 
	       ,@fechaFin DATETIME2  
    
    --> Recupera inforamacion 
    SELECT @tipo = tipo  FROM OPENJSON(@json) WITH (tipo INT )

	SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

    -- Get
    IF @tipo = 1
        BEGIN 
            
            SET @params = '@idEntidad         INT
						  ,@idCliente         INT
						  ,@idUsuario         INT
						  ,@fechaI            DATETIME2
						  ,@fechaF            DATETIME2
						  ,@idEstadoDocumento INT
						  ,@codEstab          VARCHAR(50)
                          ,@idPuntoEmision    INT'

            SET @sql =  'SELECT nc.codEstab 
		                       ,nc.idNotaCredito
			                   ,FORMAT(nc.fechaEmision, ''dd/MM/yyyy HH:mm'')      as fechaEmision
			                   ,nc.total
			                   ,nc.claveAcceso
			                   ,nc.serieComprobante							       as nroDoc
			                   ,nc.numDocSustento						           as nroFactura
                               ,nc.identificacionComprador
                               ,nc.razonSocialComprador                            as cliente
			                   ,CASE nc.codServicio WHEN 6 THEN ''table-danger''
			                                        WHEN 4 THEN ''table-success'' 
			                                        ELSE '''' 
			                    END											       as style
			                   ,nc.servicioSri							           as estadoSri
			                   ,nc.estadoCuenta							           as estadoDoc
			                   ,nc.codCuenta									   as codDoc
			                   ,nc.usuario
                               ,COUNT(*) OVER()                                    as totalRecords
		                FROM Ventas.v_NotaCredito      nc WITH (NOLOCK)
		                WHERE nc.idEntidad = @idEntidad  '

            SELECT 
		         @checkBoxFecha     = checkBoxFecha
		        ,@idCliente         = byCliente
		        ,@idEstadoDocumento = idEstadoDocumento
		        ,@idUsuario         = byUsuario
		        ,@fechaInicio       = fechaInicio
		        ,@fechaFin          = fechaFin
                ,@secuencial        = LTRIM(RTRIM(nroSecuencial)) 
		        ,@codEstab          = codEstab
                ,@idPuntoEmision    = idPuntoEmision
	        FROM OPENJSON(@json) WITH
            (
                 checkBoxFecha       BIT        
		        ,byCliente           INT         
		        ,idEstadoDocumento   INT         
		        ,byUsuario           INT         
		        ,fechaInicio         DATETIME2 
		        ,fechaFin            DATETIME2 
                ,nroSecuencial       VARCHAR(50)
		        ,codEstab            VARCHAR(50) 
		        ,idPuntoEmision      INT        
            )

            IF EXISTS (SELECT 1 FROM Config.v_User_Permission_Sale WHERE idUsuarioRol = @idRol AND viewOthersDocs = 0) 
				BEGIN
                    SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @idRol
				END 

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND nc.codEstab = @codEstab '
                END 

            IF @secuencial IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND nc.secuencial BETWEEN ' + REPLACE(@secuencial,'-',' AND ')
				END 

            IF @checkBoxFecha = 1
		        BEGIN
			        SET @sql = @sql + 'AND CAST(nc.fechaEmision as date) BETWEEN CAST(@fechaI as date) AND CAST(@fechaF as date) '
		        END 

            IF @idPuntoEmision > 0
                BEGIN   
                    SET @sql = @sql + 'AND nc.idPuntoEmision = @idPuntoEmision '
                END 

	        IF @idCliente > 0
		        BEGIN
			        SET @sql = @sql + 'AND nc.idCliente = @idCliente '
		        END 

	        IF @idEstadoDocumento > 0
		        BEGIN
				    SET @sql = @sql + 'AND nc.idEstadoPago = @idEstadoDocumento '
		        END 

	        IF @idUsuario > 0
		        BEGIN
			        SET @sql = @sql + 'AND nc.idUsuario = @idUsuario '
		        END

	        SET @sql = @sql + ' ORDER BY nc.idNotaCredito DESC'
		
	        EXEC sp_executesql 
			             @sql
			            ,@params 
			            ,@idEntidad         = @idEntidad
				        ,@idCliente         = @idCliente			
				        ,@idUsuario         = @idUsuario
				        ,@fechaI            = @fechaInicio
				        ,@fechaF            = @fechaFin
				        ,@idEstadoDocumento = @idEstadoDocumento
				        ,@codEstab          = @codEstab
                        ,@idPuntoEmision    = @idPuntoEmision
            RETURN 
    END 

    -- Data Form
    IF @tipo = 2
        BEGIN
            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,estab + '-' + ptoEmi as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @idRol ORDER BY defaultEstab DESC

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idBodega
                  ,bodega
                  ,defaultEstab
                  ,defaultBodega 
            FROM v_Bodega_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @idRol ORDER BY defaultEstab DESC

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
            WHERE codTrasaccion = 'V' 
              AND idEntidad = @idEntidad

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
	        WHERE idEntidad = @idEntidad 
              AND estado = 1

            SELECT CAST(multipleVendedor AS BIT) as multipleVendedor
	        FROM Config.v_Sistema_Ventas gs 
            WHERE gs.idEntidad = @idEntidad

            SELECT u.idUsuario
	              ,u.nombreUsuario
	              ,u.nombreCompleto
	              ,predeterminado =  CAST(IIF(u.idUsuario = @idUsuario, 1, 0) AS BIT)
            FROM v_usuario u 
            WHERE u.idEntidad = @idEntidad

            SELECT cd.idPuntoEmision,cd.infoAdicional 
            FROM dbo.ConfiguracionDocumento cd WITH (NOLOCK)
            INNER JOIN dbo.PuntoEmision     pe WITH (NOLOCK) ON pe.idPuntoEmision    = cd.idPuntoEmision
            INNER JOIN dbo.TipoDocumento    td WITH (NOLOCK) ON td.idTipoDocumento   = cd.idTipoDocumento 
            INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
            WHERE es.idEntidad = @idEntidad
              AND td.codigoSri = '04'
              AND cd.infoAdicional IS NOT NULL

            RETURN 
        END 

    -- Filters
    IF @tipo = 3
        BEGIN
            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,estab + '-' + ptoEmi as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @idRol ORDER BY defaultEstab DESC

            SELECT idEstadoPago as idEstadoDocumento,descripcion,codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo IN ('PE','APL')
        END 

    -- Get Id 
    IF @tipo = 4
        BEGIN
            
            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT nc.idNotaCredito
			      ,nc.idCliente
			      ,nc.idPuntoEmision
			      ,nc.codEstab
			      ,nc.fechaEmision as fechaEmision 
			      ,nc.subTotalSinImpuestos
			      ,nc.propina
                  ,nc.totalDescuento
                  ,nc.porcentajeDescuento
			      ,nc.total
			      ,ISNULL(nc.observacion,'') as observacion
		    FROM Ventas.v_NotaCredito  nc WITH (NOLOCK)
		    WHERE nc.idNotaCredito = @id

		    SELECT nc.idFactura
			      ,nc.numDocSustento as nroFactura
		    FROM Ventas.v_NotaCredito  nc WITH (NOLOCK)
		    WHERE nc.idNotaCredito = @id

		    SELECT nc.idCliente
			      ,cu.BusinessName         as nombreFiscal
			      ,cu.IDCard               as numeroIdentificacion
			      ,ISNULL(cl.direccion,'') as direccion
			      ,ISNULL(cl.correo,'')    as correo
			      ,ISNULL(cl.telefono,'')  as telefono
		    FROM dbo.NotaCredito         nc WITH (NOLOCK)
		    INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente = nc.idCliente
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId 
		    WHERE nc.idNotaCredito = @id

		    SELECT nd.idNotaCreditoDetalle
                  ,nd.idArticulo
			      ,nd.idBodega	
			      ,nd.idTarifa
			      ,nd.idMedida
                  ,nd.idTipoIva
                  ,ti.idImpuesto
                  ,ar.codigo
                  ,nd.descripcion
                  ,nd.cantidad
			      ,nd.precioUnitario
                  ,nd.ice
			      ,nd.valorDescuento
			      ,nd.porcentajeDescuento
                  ,nd.precioTotalSinImpuesto
                  ,nd.codigoPorcentaje
                  ,nd.tarifa
                  ,nd.valorImpuesto
			      ,ISNULL(nd.nota, '') as nota
                  ,nd.precioCosto
                  ,ar.llevaInventario
                  ,ISNULL
                   ((
                        SELECT af.idMedida
                              ,IIF(af.gestionVenta = 1,1,3) as orden
                              ,af.conversion
                              ,af.precioCostoFraccionado
                              ,ar.precioCosto
			                  ,me.descripcion               as descripcion
			                  ,(
                                    SELECT pv.idTarifa
                                          ,pv.precioVenta
                                          ,pv.precioConIva
                                          ,UPPER(ta.descripcion) as tarifa
                                          ,ta.ventaPorMayor
					                FROM dbo.ArticuloFraccionadoPvP  pv WITH (NOLOCK)
					                INNER JOIN dbo.Tarifa            ta WITH (NOLOCK) ON ta.idTarifa = pv.idTarifa
					                WHERE pv.idArticuloFraccionado = af.idArticuloFraccionado
					                ORDER BY ta.predeterminada DESC 
                                    FOR JSON PATH

                              ) as tarifas
			            FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			            INNER JOIN dbo.Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida
                        INNER JOIN dbo.Articulo      ar WITH (NOLOCK) ON ar.idArticulo = af.idArticulo
			            WHERE af.idArticulo = nd.idArticulo 
                        FOR JSON PATH
                
                ),'[]') as fraccionado

                ,ISNULL
                ((
                        SELECT sc.idMedida
                              ,2              as orden
                              ,1              as conversion
			                  ,sc.precioCosto as precioCostoFraccionado
                              ,sc.precioCosto
                              ,me.descripcion
			                  ,(
                                    SELECT ap.idTarifa
                                          ,ap.precioVenta
                                          ,ap.precioConIva
                                          ,UPPER(ta.descripcion) as tarifa
                                          ,ta.ventaPorMayor 
					                FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
					                INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
					                WHERE ap.idArticulo = sc.idArticulo
					                ORDER BY ta.predeterminada DESC 
                                    FOR JSON PATH

                               ) as tarifas
			            FROM dbo.Articulo     sc WITH (NOLOCK)
			            INNER JOIN dbo.Medida me WITH (NOLOCK) ON me.idMedida = sc.idMedida
			            WHERE sc.idArticulo = nd.idArticulo 
                        FOR JSON PATH

                 ),'[]') as principal
	        FROM NotaCreditoDetalle  nd WITH (NOLOCK) 
	        INNER JOIN Articulo      ar WITH (NOLOCK) ON ar.idArticulo = nd.idArticulo
	        INNER JOIN Medida        me WITH (NOLOCK) ON me.idMedida   = nd.idMedida
            INNER JOIN TipoIva       ti WITH (NOLOCK) ON ti.idTipoIva  = ar.idTipoIva
	        WHERE nd.idNotaCredito = @id 
                AND nd.estado = 1
            ORDER BY nd.idNotaCreditoDetalle ASC

		    SELECT idInfoAdicionalDoc
			      ,nombre
			      ,valor
		    FROM InfoAdicionalDoc        ia WITH (NOLOCK)
            INNER JOIN dbo.TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento = ia.idTipoDocumento
		    WHERE ia.idComprobante = @id 
              AND td.codigoSri = '04'
              AND ia.estado = 1

		    RETURN 
        END 
    
    --> Informacion Detalle
    IF @tipo = 5
        BEGIN 
            
            DECLARE @idDocumentoElectronico INT

            SELECT @idDocumentoElectronico = idDocumentoElectronico FROM OPENJSON(@json) WITH (idDocumentoElectronico INT)

            IF @idDocumentoElectronico > 0 
                BEGIN 
                    SELECT TOP 1 @id = idNotaCredito FROM dbo.NotaCredito WITH (NOLOCK) WHERE idDocumentoElectronico = @idDocumentoElectronico
                END 
            ELSE 
                BEGIN
                    SELECT @id = id FROM OPENJSON(@json) WITH(id INT)
                END

            SELECT nc.serieComprobante
                  ,nc.nombreComercial
                  ,nc.ptoEmi
                  ,nc.subTotalSinImpuestos
			      ,nc.propina
                  ,nc.totalDescuento
                  ,nc.porcentajeDescuento
			      ,nc.total
			      ,ISNULL(nc.observacion,'') as observacion
		    FROM Ventas.v_NotaCredito  nc WITH (NOLOCK)
		    WHERE nc.idNotaCredito = @id

		    SELECT idDocumento      = nc.idFactura
			      ,serieComprobante = nc.numDocSustento
		    FROM Ventas.v_NotaCredito  nc WITH (NOLOCK)
		    WHERE nc.idNotaCredito = @id

		    SELECT nc.idCliente
			      ,cu.BusinessName         as razonSocialComprador
			      ,cu.IDCard               as identificacionComprador
			      ,ISNULL(cl.direccion,'') as direccion
			      ,ISNULL(cl.correo,'')    as correo
			      ,ISNULL(cl.telefono,'')  as telefono
		    FROM dbo.NotaCredito         nc WITH (NOLOCK)
		    INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente = nc.idCliente
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId 
		    WHERE nc.idNotaCredito = @id

		    SELECT ar.codigo 
                  ,ncd.descripcion
                  ,ncd.cantidad
                  ,ncd.precioUnitario
                  ,ncd.valorDescuento
                  ,ncd.porcentajeDescuento
                  ,ncd.ice
                  ,ncd.precioTotalSinImpuesto
                  ,ncd.codigoPorcentaje
                  ,ncd.tarifa
                  ,ncd.valorImpuesto
                  ,ncd.nota
                  ,me.descripcion as medida
                  ,ti.descripcion as tipoIva
                  ,ta.descripcion as pvp
                  ,bo.descripcion as bodega
		    FROM NotaCreditoDetalle ncd WITH (NOLOCK) 
		    INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = ncd.idArticulo
            INNER JOIN dbo.Medida   me WITH (NOLOCK) ON me.idMedida   = ncd.idMedida
            INNER JOIN dbo.TipoIva  ti WITH (NOLOCK) ON ti.idTipoIva  = ncd.idTipoIva
            INNER JOIN dbo.Tarifa   ta WITH (NOLOCK) ON ta.idTarifa   = ncd.idTarifa
            INNER JOIN dbo.Bodega   bo WITH (NOLOCK) ON bo.idBodega   = ncd.idBodega
		    WHERE ncd.idNotaCredito = @id 
              AND ncd.estado = 1
            ORDER BY ncd.idNotaCreditoDetalle ASC


		    SELECT idInfoAdicionalDoc
			       ,nombre
			       ,valor
		    FROM InfoAdicionalDoc ia WITH (NOLOCK)
            INNER JOIN dbo.TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento = ia.idTipoDocumento
		    WHERE ia.idComprobante = @id
              AND td.codigoSri = '04'
              AND ia.estado = 1


            SELECT idTipoIva
                  ,idImpuesto
	              ,descripcion
	              ,tarifa = porcentaje
	              ,CAST(codigoPorcentaje as varchar) as codigoPorcentaje
	        FROM dbo.TipoIva WITH (NOLOCK) 
	        WHERE estado = 1

            RETURN
        END
    
    --> Serie Comprobante
    IF @tipo = 6
        BEGIN
            SELECT @idPuntoEmision = idPuntoEmision FROM OPENJSON(@json) WITH(idPuntoEmision INT)
               
            SELECT serieComprobante = [Common].[ufnGetSerieDocument](cd.estab,cd.ptoEmi,secuencial,0) 
            FROM Config.v_ConfigDocumento cd WITH (NOLOCK) 
		    WHERE cd.idPuntoEmision = @idPuntoEmision
			    AND cd.codDoc = 'NC'

            RETURN
        END 

    SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
    RETURN
END
