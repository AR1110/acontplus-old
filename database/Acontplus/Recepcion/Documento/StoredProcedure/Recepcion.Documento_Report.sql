USE AcontPlus
GO
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

CREATE OR ALTER PROCEDURE Recepcion.Documento_Report 
     @userRoleId INT
    ,@json VARCHAR(MAX)
	,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global 
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql 
    DECLARE @sql NVARCHAR(MAX), @params NVARCHAR(MAX)

    -->Filter
    DECLARE @codEstab VARCHAR(100) ,@ckFecha BIT ,@fechaInicio DATETIME2 ,@fechaFin DATETIME2 ,@ckRetencion BIT ,@identificacion VARCHAR(20) ,@idUsuario INT
           ,@identificacionReceptor VARCHAR(20) ,@subcategoryId INT

    --> Recuperar Datos
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    SELECT TOP 1 @idEntidad = idEntidad, @identificacionReceptor = rucEmpresa FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
    
    BEGIN TRY
        --> Factura
        IF @tipo = 2
            BEGIN
            
                SET @tableNames = 'dataEntidad,comprobantes'

                SELECT @codEstab       = codEstab
                      ,@ckFecha        = ckFecha
                      ,@fechaInicio    = fechaInicio
                      ,@fechaFin       = fechaFin
                      ,@ckRetencion    = ckRetencion
                      ,@identificacion = identificacion
                      ,@idUsuario      = idUsuario
                      ,@subcategoryId  = subcategoryId
                FROM OPENJSON(@json) WITH 
                (
                    codEstab       VARCHAR(100)
                   ,ckFecha        BIT
                   ,fechaInicio    DATETIME2
                   ,fechaFin       DATETIME2
                   ,ckRetencion    BIT
                   ,identificacion VARCHAR(20)
                   ,idUsuario      INT
                   ,subcategoryId  INT
                )

                SET @params = '@idEntidad              INT
                              ,@identificacionReceptor VARCHAR(20)
                              ,@codEstab               VARCHAR(100)
                              ,@fechaInicio            DATETIME2
                              ,@fechaFin               DATETIME2
                              ,@identificacion         VARCHAR(20)
                              ,@idUsuario              INT
                              ,@subcategoryId          INT'

                SET @sql = 'SELECT * FROM 
                            (
                            
                                    SELECT es.idEstablecimiento
                                          ,es.nombreComercial
	                                      ,es.codEstab
	                                      ,dr.idDocumento
	                                      ,dr.idUsuario
	                                      ,dr.serieComprobante
	                                      ,dr.claveAcceso
	                                      ,dr.fechaEmision
                                          ,Format(CONVERT(DATETIME2, dr.fechaAutorizacion), ''dd/MM/yyyy HH:mm'') as fechaAutorizacion
	                                      ,dr.rucEmisor
	                                      ,dr.razonSocialEmisior as razonSocialEmisor
                                          ,''FE'' as tipoDoc
	                                      ,ISNULL
	                                      ((
			                                    SELECT CAST(SUM(di.TaxBase)as numeric(18,2)) 
			                                    FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                                    WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                                      AND di.CodePercentage = ''7''
	                                      ),0) as subTotalExento

	                                      ,ISNULL
	                                      ((
			                                    SELECT CAST(SUM(di.TaxBase)as numeric(18,2)) 
			                                    FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                                    WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                                      AND di.CodePercentage = ''6''
	                                      ),0) as subTotalNoIva

                                          ,ISNULL
	                                      ((
			                                    SELECT CAST(SUM(di.TaxBase)as numeric(18,2)) 
			                                    FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                                    WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                                    AND di.CodePercentage = ''5''
	                                      ),0) as subTotalIvaCinco

                                          ,ISNULL
	                                      ((
			                                    SELECT CAST(SUM(di.TaxBase)as numeric(18,2)) 
			                                    FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                                    WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                                    AND di.CodePercentage = ''4''
	                                      ),0) as subTotalIvaQuince

	                                      ,ISNULL
	                                      ((
			                                    SELECT CAST(SUM(di.TaxBase)as numeric(18,2)) 
			                                    FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                                    WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                                    AND di.CodePercentage = ''0''
	                                      ),0) as subTotal0

	                                      ,ISNULL
	                                      ((
			                                    SELECT CAST(SUM(di.TaxBase)as numeric(18,2)) 
			                                    FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                                    WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                                    AND di.CodePercentage IN (''2'',''3'', ''4'', ''5'',''8'')
	                                      ),0) as subTotalIva

	                                      ,ISNULL
	                                      ((
			                                    SELECT CAST(SUM(di.Discount)as numeric(18,2)) 
			                                    FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                                    WHERE di.DocumentoRecibidoId = dr.idDocumento 
	                                      ),0) as descuento

	                                      ,ISNULL
	                                      ((
			                                    SELECT CAST(SUM(di.TaxValue)as numeric(18,2)) 
			                                    FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                                    WHERE di.DocumentoRecibidoId = dr.idDocumento
			                                    AND di.Code = ''2''
                                                AND di.CodePercentage = ''2''
	                                      ),0) as iva

                                          ,ISNULL
	                                      ((
			                                    SELECT CAST(SUM(di.TaxValue)as numeric(18,2)) 
			                                    FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                                    WHERE di.DocumentoRecibidoId = dr.idDocumento
			                                    AND di.Code = ''2''
                                                AND di.CodePercentage = ''5''
	                                      ),0) as iva5

                                          ,ISNULL
	                                      ((
			                                    SELECT CAST(SUM(di.TaxValue)as numeric(18,2)) 
			                                    FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                                    WHERE di.DocumentoRecibidoId = dr.idDocumento
			                                    AND di.Code = ''2''
                                                AND di.CodePercentage = ''4''
	                                      ),0) as iva15
	                                      ,ISNULL
	                                      ((
			                                    SELECT CAST(SUM(di.TaxValue)as numeric(18,2)) 
			                                    FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                                    WHERE di.DocumentoRecibidoId = dr.idDocumento
			                                      AND di.Code = ''3''
	                                      ),0) as totalIce

	                                      ,CAST(dr.importeTotal as numeric(18,2)) as importeTotal
	                                      ,(
		
			                                    SELECT TOP 1 de.serieComprobante
			                                    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
                                                INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = rt.idDocumentoElectronico
			                                    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts         = rt.idRetencionAts
			                                    WHERE ds.numAutDocSustento = dr.claveAcceso
				                                  AND rt.anuladaSri = 0 
                                                  AND ds.estado = 1

		                                    ) as nroRetencion

		                                    ,ISNULL((
		
			                                    SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			                                    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			                                    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			                                    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
			                                    WHERE ds.numAutDocSustento = dr.claveAcceso
	 			                                    AND rt.anuladaSri = 0 
				                                    AND ir.codigo = 1
                                                    AND ds.estado = 1

		                                    ),0) as retRenta

		                                    ,ISNULL((
		
			                                    SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			                                    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			                                    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			                                    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
			                                    WHERE ds.numAutDocSustento = dr.claveAcceso
	 			                                    AND rt.anuladaSri = 0 
				                                    AND ir.codigo = 2
                                                    AND ds.estado = 1

		                                    ),0) as retIva
                                            ,us.nombreUsuario as usuario
                                            ,dr.identificacionReceptor
                                            ,(SELECT TOP 1 cp.subcategoryId FROM Contabilidad.CuentaPorPagar cp WITH (NOLOCK) WHERE cp.codDoc = ''01'' AND cp.idDocumento = dr.idDocumento ) as subcategoryId
                                    FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK)
                                    INNER JOIN Sri.Establecimiento   es WITH (NOLOCK) ON es.idEstablecimiento  = dr.idEstablecimiento
                                    INNER JOIN dbo.Usuario           us WITH (NOLOCK) ON us.idUsuario = dr.idUsuario
                                    WHERE dr.codDoc = ''01''
                                      AND dr.estado = 1
                                      AND dr.xmlCompressed IS NOT NULL
                                      AND dr.identificacionReceptor = @identificacionReceptor

                                    UNION ALL

                                    SELECT es.idEstablecimiento
                                          ,es.nombreComercial
	                                      ,es.codEstab
	                                      ,fc.idFacturaCompra
	                                      ,fc.idUsuario
	                                      ,fc.puntoEmision + ''-'' + Helper.F_Auto_Sequential(fc.nroDocumento) 
	                                      ,fc.nroAutorizacion
	                                      ,Format(fc.fechaEmision,''dd/MM/yyyy'')
                                          ,Format(fc.fechaEmision,''dd/MM/yyyy  HH:mm'') as fechaAutorizacion  
	                                      ,cu.IDCard                                     as numeroIdentificacion
	                                      ,cu.BusinessName                               as nombreFiscal
                                          ,''FF'' as tipoDoc
	                                      ,ISNULL
	                                      ((
			                                    SELECT CAST(SUM(fi.TaxBase)as numeric(18,2)) 
			                                    FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                    INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                    INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                    WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                    AND ti.codigoPorcentaje = ''7''
	                                       ),0) 
	                                       ,ISNULL
	                                       ((
			                                    SELECT CAST(SUM(fi.TaxBase)as numeric(18,2)) 
			                                    FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                    INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                    INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                    WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                      AND ti.codigoPorcentaje = ''6''
                                                  AND fi.[Enabled] = 1
	                                       ),0) 

                                           ,ISNULL
	                                       ((
			                                    SELECT CAST(SUM(fi.TaxBase)as numeric(18,2)) 
			                                    FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                    INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                    INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                    WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                      AND fi.[Enabled] = 1
                                                  AND ti.codigoPorcentaje = ''5''			
	                                       ),0)
                                           ,ISNULL
	                                       ((
			                                    SELECT CAST(SUM(fi.TaxBase)as numeric(18,2)) 
			                                    FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                    INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                    INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                    WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                      AND fi.[Enabled] = 1
                                                  AND ti.codigoPorcentaje = ''4''			
	                                       ),0)                                        

	                                        ,ISNULL
	                                       ((
			                                    SELECT CAST(SUM(fi.TaxBase)as numeric(18,2)) 
			                                    FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                    INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                    INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                    WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                      AND fi.[Enabled] = 1
                                                  AND ti.codigoPorcentaje = ''0''
			
	                                       ),0)                                                                   

	                                       ,ISNULL
	                                       ((
			                                    SELECT CAST(SUM(fi.TaxBase)as numeric(18,2)) 
			                                    FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                    INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                    INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                    WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                      AND fi.[Enabled] = 1
                                                  AND ti.codigoPorcentaje IN (''2'',''3'', ''4'', ''5'',''8'')
			
	                                       ),0)
	                                       ,CAST(fc.totalDescuento as numeric(18,2))
	                                       ,ISNULL
	                                       ((
			                                    SELECT CAST(SUM(fi.TaxValue)as numeric(18,2)) 
			                                    FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                    INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                    INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                    WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                      AND fi.[Enabled] = 1
                                                  AND im.codigo = ''2''
                                                  AND ti.codigoPorcentaje = 2
	                                       ),0)

                                           ,ISNULL
	                                       ((
			                                    SELECT CAST(SUM(fi.TaxValue)as numeric(18,2)) 
			                                    FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                    INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                    INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                    WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                      AND fi.[Enabled] = 1
                                                  AND im.codigo = ''2''
                                                  AND ti.codigoPorcentaje = 5			
	                                       ),0) 

                                           ,ISNULL
	                                       ((
			                                    SELECT CAST(SUM(fi.TaxValue)as numeric(18,2)) 
			                                    FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                    INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                    INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                    WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                    AND im.codigo = ''2''
                                                AND ti.codigoPorcentaje = 4		
	                                       ),0)
	                                       ,ISNULL
	                                       ((
			                                    SELECT CAST(SUM(fi.TaxValue)as numeric(18,2)) 
			                                    FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                    INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                    INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                    WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                      AND fi.[Enabled] = 1
                                                  AND im.codigo = ''3''			
	                                       ),0)

	                                       ,CAST(fc.total as numeric(18,2))
                                           ,(
		
			                                    SELECT TOP 1 de.serieComprobante
			                                    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
                                                INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = rt.idDocumentoElectronico
			                                    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts         = rt.idRetencionAts
			                                    WHERE ds.numAutDocSustento = fc.nroAutorizacion
				                                  AND rt.anuladaSri = 0 
                                                  AND rt.idProveedor = fc.idProveedor
                                                  AND ds.estado = 1

		                                    ) as nroRetencion

		                                    ,ISNULL((
		
			                                    SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			                                    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			                                    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			                                    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
			                                    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			                                  AND rt.anuladaSri = 0 
				                                  AND rt.idProveedor = fc.idProveedor
                                                  AND ds.estado = 1
                                                  AND ir.codigo = 1

		                                    ),0) as retRenta

		                                    ,ISNULL((
		
			                                    SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			                                    FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			                                    INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			                                    INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
			                                    WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			                                    AND rt.anuladaSri = 0 
				                                    AND rt.idProveedor = fc.idProveedor
                                                    AND ds.estado = 1
                                                    AND ir.codigo = 2

		                                    ),0) as retIva
                                            ,us.nombreUsuario as usuario
                                            ,@identificacionReceptor 
                                            ,(SELECT TOP 1 cp.subcategoryId FROM Contabilidad.CuentaPorPagar cp WITH (NOLOCK) WHERE cp.codDoc = ''FC'' AND cp.idDocumento = fc.idFacturaCompra ) as subcategoryId
                                    FROM dbo.FacturaCompra         fc WITH (NOLOCK) 
                                    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab    = fc.codEstab
                                    INNER JOIN dbo.Proveedor       pr WITH (NOLOCK) ON pr.idProveedor = fc.idProveedor
                                    INNER JOIN dbo.Usuario         us WITH (NOLOCK) ON us.idUsuario   = fc.idUsuario
                                    INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.Id          = pr.CustomerId
                                    WHERE fc.estado =  1
                                      AND fc.idEntidad = @idEntidad
                                      AND fc.nroAutorizacion NOT IN (SELECT claveAcceso FROM Recepcion.DocumentoRecibido where identificacionReceptor = @identificacionReceptor)

                            ) as dt WHERE dt.idDocumento > 0 '

                IF @ckFecha = 1
                    BEGIN
                        SET @sql = @sql + 'AND CAST(dt.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                    END

                IF @identificacion IS NOT NULL
                    BEGIN
                        SET @sql = @sql + 'AND dt.rucEmisor = @identificacion '
                    END 

                IF LEN(@codEstab) > 6
                    BEGIN
                        SET @sql = @sql + 'AND dt.codEstab = @codEstab '
                    END 

                IF @idUsuario IS NOT NULL
                    BEGIN
                        SET @sql = @sql + 'AND dt.idUsuario = @idUsuario '
                    END

                 IF @ckRetencion = 1
                    BEGIN
                        SET @sql = @sql + 'AND dt.nroRetencion IS NOT NULL '
                    END
            
                 IF @ckRetencion = 0
                    BEGIN
                        SET @sql = @sql + 'AND dt.nroRetencion IS NULL '
                    END

                 IF @subcategoryId > 0
                    BEGIN
                        SET @sql = @sql + 'AND dt.subcategoryId = @subcategoryId '
                    END

                SET @sql = @sql + 'ORDER BY dt.fechaEmision ASC '

                SELECT entidad as razonSocial 
                      ,rucEmpresa as ruc
                      ,telefono 
                      ,nombreUsuario as usuario
                      ,'Comprobantes Recibidos - Factura' as nombreReporte
                      ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
                FROM v_usuario
                WHERE idUsuarioRol = @userRoleId

                EXEC sp_executesql @sql
							      ,@params 
							      ,@idEntidad              = @idEntidad
                                  ,@identificacionReceptor = @identificacionReceptor
                                  ,@codEstab               = @codEstab
                                  ,@fechaInicio            = @fechaInicio
                                  ,@fechaFin               = @fechaFin
                                  ,@identificacion         = @identificacion
                                  ,@idUsuario              = @idUsuario
                                  ,@subcategoryId          = @subcategoryId

                RETURN 
            END 
    
        --> Nota Credito
        IF @tipo = 3
            BEGIN
            
                SET @tableNames = 'dataEntidad,comprobantes'

                SELECT @codEstab       = codEstab
                      ,@ckFecha        = ckFecha
                      ,@fechaInicio    = fechaInicio
                      ,@fechaFin       = fechaFin
                      ,@ckRetencion    = ckRetencion
                      ,@identificacion = identificacion
                      ,@idUsuario      = idUsuario
                FROM OPENJSON(@json) WITH 
                (
                    codEstab       VARCHAR(100)
                   ,ckFecha        BIT
                   ,fechaInicio    DATETIME2
                   ,fechaFin       DATETIME2
                   ,ckRetencion    BIT
                   ,identificacion VARCHAR(20)
                   ,idUsuario      INT
                )

                SET @params = '@idEntidad              INT
                              ,@identificacionReceptor VARCHAR(20)
                              ,@codEstab               VARCHAR(100)
                              ,@fechaInicio            DATETIME2
                              ,@fechaFin               DATETIME2
                              ,@identificacion         VARCHAR(20)
                              ,@idUsuario              INT'

                SET @sql = '  SELECT es.idEstablecimiento
                                    ,es.nombreComercial
	                                ,es.codEstab
	                                ,dr.serieComprobante
	                                ,dr.claveAcceso
	                                ,dr.fechaEmision
                                    ,format(CONVERT(DATETIME2, dr.fechaAutorizacion), ''dd/MM/yyyy HH:mm'') as fechaAutorizacion
	                                ,dr.rucEmisor
	                                ,dr.razonSocialEmisior as razonSocialEmisor
	                                ,ISNULL
	                                ((
			                            SELECT CAST(SUM(di.TaxBase)as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                                AND di.CodePercentage = ''7''
	                                ),0) as subTotalExento

	                                ,ISNULL
	                                ((
			                            SELECT CAST(SUM(di.TaxBase)as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                            AND di.CodePercentage = ''6''
	                                ),0) as subTotalNoIva

	                                ,ISNULL
	                                ((
			                            SELECT CAST(SUM(di.TaxBase)as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                            AND di.CodePercentage = ''0''
	                                ),0) as subTotal0

                                    ,ISNULL
	                                ((
			                            SELECT CAST(SUM(di.TaxBase)as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                            AND di.CodePercentage = ''5''
	                                ),0) as subTotalIvaCinco

                                    ,ISNULL
	                                ((
			                            SELECT CAST(SUM(di.TaxBase)as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                            AND di.CodePercentage = ''4''
	                                ),0) as subTotalIvaQuince

	                                ,ISNULL
	                                ((
			                            SELECT CAST(SUM(di.TaxBase)as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                            AND di.CodePercentage IN (''2'',''8'')
	                                ),0) as subTotalIva

	                                ,ISNULL
	                                ((
			                            SELECT CAST(SUM(di.Discount)as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento 
	                                ),0) as descuento

	                                ,ISNULL
	                                ((
			                            SELECT CAST(SUM(di.TaxValue)as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento
			                            AND di.Code = ''2''
	                                ),0) as iva

                                    ,ISNULL
	                                ((
			                            SELECT CAST(SUM(di.TaxValue)as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento
			                            AND di.Code = ''5''
	                                ),0) as iva5

                                    ,ISNULL
	                                ((
			                            SELECT CAST(SUM(di.TaxValue)as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento
			                            AND di.Code = ''4''
	                                ),0) as iva15
	                                ,ISNULL
	                                ((
			                            SELECT CAST(SUM(di.TaxValue)as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento
			                            AND di.Code = ''3''
	                                ),0) as totalIce

								    ,ISNULL
	                                ((
			                            SELECT CAST(SUM(di.TaxBase + di.TaxValue)as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento
	                                ),0) as importeTotal 
                                    ,us.nombreUsuario as usuario
                            FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK)
                            INNER JOIN Sri.Establecimiento   es WITH (NOLOCK) ON es.idEstablecimiento = dr.idEstablecimiento
                            INNER JOIN dbo.Usuario           us WITH (NOLOCK) ON us.idUsuario = dr.idUsuario
                            WHERE dr.codDoc = ''04''
                            AND dr.xmlCompressed IS NOT NULL
                            AND dr.identificacionReceptor = @identificacionReceptor '

                IF LEN(@codEstab) > 6 
                    BEGIN
                        SET @sql = @sql + 'AND es.codEstab = @codEstab '
                    END 

                IF @ckFecha = 1
                    BEGIN
                        SET @sql = @sql + 'AND CAST(dr.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                    END

                IF @identificacion IS NOT NULL
                    BEGIN
                        SET @sql = @sql + 'AND dr.rucEmisor = @identificacion '
                    END 

                IF @idUsuario IS NOT NULL
                    BEGIN
                        SET @sql = @sql + 'AND dr.idUsuario = @idUsuario '
                    END

                SET @sql = @sql + 'ORDER BY dr.idDocumento DESC '

                SELECT entidad as razonSocial 
                      ,rucEmpresa as ruc
                      ,telefono 
                      ,nombreUsuario as usuario
                      ,'Comprobantes Recibidos - Nota Credito' as nombreReporte
                      ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
                FROM v_usuario
                WHERE idUsuarioRol = @userRoleId

                EXEC sp_executesql @sql
							      ,@params 
							      ,@idEntidad              = @idEntidad
                                  ,@identificacionReceptor = @identificacionReceptor 
                                  ,@codEstab               = @codEstab
                                  ,@fechaInicio            = @fechaInicio
                                  ,@fechaFin               = @fechaFin
                                  ,@identificacion         = @identificacion
                                  ,@idUsuario              = @idUsuario

                RETURN 
            END 

        --> Comprobante de Retencion
        IF @tipo = 4
            BEGIN
                SET @tableNames = 'dataEntidad,comprobantes'

                SELECT @codEstab       = codEstab
                      ,@ckFecha        = ckFecha
                      ,@fechaInicio    = fechaInicio
                      ,@fechaFin       = fechaFin
                      ,@ckRetencion    = ckRetencion
                      ,@identificacion = identificacion
                      ,@idUsuario      = idUsuario
                FROM OPENJSON(@json) WITH 
                (
                    codEstab       VARCHAR(100)
                   ,ckFecha        BIT
                   ,fechaInicio    DATETIME2
                   ,fechaFin       DATETIME2
                   ,ckRetencion    BIT
                   ,identificacion VARCHAR(20)
                   ,idUsuario      INT
                )

                SET @params = '@idEntidad       INT
                              ,@codEstab        VARCHAR(100)
                              ,@fechaInicio     DATETIME2
                              ,@fechaFin        DATETIME2
                              ,@identificacion  VARCHAR(20)
                              ,@idUsuario       INT'

                SET @sql = 'SELECT es.idEstablecimiento
                                  ,es.nombreComercial
	                              ,dr.serieComprobante
	                              ,dr.fechaEmision
                                  ,format(CONVERT(DATETIME2, dr.fechaAutorizacion), ''dd/MM/yyyy HH:mm'') as fechaAutorizacion
	                              ,dr.claveAcceso
	                              ,dr.rucEmisor
	                              ,dr.razonSocialEmisior as razonSocialEmisor
	                              ,ISNULL
	                              ((
			                            SELECT CAST(SUM(di.TaxValue) as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                              AND di.Code = ''1''
	  
	                              ),0) as retRenta
	                              ,ISNULL
	                              ((
			                            SELECT CAST(SUM(di.TaxValue) as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                              AND di.Code = ''2''
	  
	                              ),0) as retIva
	                               ,ISNULL
	                              ((
			                            SELECT CAST(SUM(di.TaxValue) as numeric(18,2)) 
			                            FROM Recepcion.DocumentoImpuesto di 
			                            WHERE di.DocumentoRecibidoId = dr.idDocumento 

	                              ),0) as totalRet
	                              ,(
			                            SELECT TOP 1 dd.numDocSustento FROM FactElect.DocRelacionado dd WITH (NOLOCK) WHERE dd.idDocumentoRecibido = dr.idDocumento
	  
	                              ) as numDocSustento
	                              ,(
			                            SELECT TOP 1 dd.fechaEmisionDocSustento FROM FactElect.DocRelacionado dd WITH (NOLOCK) WHERE dd.idDocumentoRecibido = dr.idDocumento
	  
	                              ) as fechaEmisionDocSustento
	                              ,us.nombreUsuario as usuario
                            FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK)
                            INNER JOIN Sri.Establecimiento   es WITH (NOLOCK) ON es.idEstablecimiento  = dr.idEstablecimiento
                            INNER JOIN dbo.Usuario           us WITH (NOLOCK) ON us.idUsuario = dr.idUsuario
                            WHERE dr.codDoc = ''07''
                              AND dr.xmlCompressed IS NOT NULL '

                IF @codEstab IS NOT NULL
                    BEGIN
                        SET @sql = @sql + 'AND es.codEstab = @codEstab '
                    END 

                IF @ckFecha = 1
                    BEGIN
                        SET @sql = @sql + 'AND CAST(dr.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                    END

                IF @identificacion IS NOT NULL
                    BEGIN
                        SET @sql = @sql + 'AND dr.rucEmisor = @identificacion '
                    END 

                IF @idUsuario IS NOT NULL
                    BEGIN
                        SET @sql = @sql + 'AND dr.idUsuario = @idUsuario '
                    END

                 IF @ckRetencion = 1
                    BEGIN
                        SET @sql = @sql + 'AND dr.nroRetencion IS NOT NULL '
                    END 

                SET @sql = @sql + 'ORDER BY dr.idDocumento DESC '

                SELECT entidad as razonSocial 
                      ,rucEmpresa as ruc
                      ,telefono 
                      ,nombreUsuario as usuario
                      ,'Comprobantes Recibidos - Comprobantes de Retención' as nombreReporte
                      ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
                FROM v_usuario
                WHERE idUsuarioRol = @userRoleId

                EXEC sp_executesql @sql
							      ,@params 
							      ,@idEntidad      = @idEntidad
                                  ,@codEstab       = @codEstab
                                  ,@fechaInicio    = @fechaInicio
                                  ,@fechaFin       = @fechaFin
                                  ,@identificacion = @identificacion
                                  ,@idUsuario      = @idUsuario

            
            END 
    
        --> Nota Debito
        IF @tipo = 5
            BEGIN
            
                SET @tableNames = 'dataEntidad,comprobantes'

                SELECT @codEstab       = codEstab
                      ,@ckFecha        = ckFecha
                      ,@fechaInicio    = fechaInicio
                      ,@fechaFin       = fechaFin
                      ,@ckRetencion    = ckRetencion
                      ,@identificacion = identificacion
                      ,@idUsuario      = idUsuario
                FROM OPENJSON(@json) WITH 
                (
                    codEstab       VARCHAR(100)
                   ,ckFecha        BIT
                   ,fechaInicio    DATETIME2
                   ,fechaFin       DATETIME2
                   ,ckRetencion    BIT
                   ,identificacion VARCHAR(20)
                   ,idUsuario      INT
                )

                SET @params = '@idEntidad              INT
                              ,@identificacionReceptor VARCHAR(20)
                              ,@codEstab               VARCHAR(100)
                              ,@fechaInicio            DATETIME2
                              ,@fechaFin               DATETIME2
                              ,@identificacion         VARCHAR(20)
                              ,@idUsuario              INT'

                SET @sql = '  SELECT es.idEstablecimiento
                                    ,es.nombreComercial
	                                ,dr.serieComprobante
	                                ,dr.claveAcceso
	                                ,dr.fechaEmision
                                    ,format(CONVERT(DATETIME2, dr.fechaAutorizacion), ''dd/MM/yyyy HH:mm'')                                         as fechaAutorizacion
	                                ,dr.rucEmisor
	                                ,dr.razonSocialEmisior as razonSocialEmisor
									,(SELECT TOP 1 ''Iva'' + '' '' + ti.descripcion FROM Sri.TarifaImpuesto ti WHERE ti.codigo = di.CodePercentage) as impuesto
									,CAST(di.TaxBase AS NUMERIC(18,3))																			    as subTotal
									,CAST(di.TaxValue AS NUMERIC(18,3))																			    as iva																		
									,rd.numDocSustento																						        as numDocModificado
							FROM Recepcion.DocumentoRecibido       dr WITH (NOLOCK)
                            INNER JOIN Sri.Establecimiento         es WITH (NOLOCK) ON es.idEstablecimiento   = dr.idEstablecimiento
                            INNER JOIN dbo.Usuario                 us WITH (NOLOCK) ON us.idUsuario           = dr.idUsuario
							INNER JOIN Recepcion.DocumentoImpuesto di WITH (NOLOCK) ON di.DocumentoRecibidoId = dr.idDocumento
							INNER JOIN FactElect.DocRelacionado    rd WITH (NOLOCK) ON rd.idDocumentoRecibido = dr.idDocumento
                            WHERE dr.codDoc = ''05''
                              AND dr.xmlCompressed IS NOT NULL
                              AND dr.identificacionReceptor = @identificacionReceptor '

                IF LEN(@codEstab) > 6 
                    BEGIN
                        SET @sql = @sql + 'AND es.codEstab = @codEstab '
                    END 

                IF @ckFecha = 1
                    BEGIN
                        SET @sql = @sql + 'AND CAST(dr.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                    END

                IF @identificacion IS NOT NULL
                    BEGIN
                        SET @sql = @sql + 'AND dr.rucEmisor = @identificacion '
                    END 

                IF @idUsuario IS NOT NULL
                    BEGIN
                        SET @sql = @sql + 'AND dr.idUsuario = @idUsuario '
                    END

                SET @sql = @sql + 'ORDER BY dr.idDocumento DESC '

                SELECT entidad as razonSocial 
                      ,rucEmpresa as ruc
                      ,telefono 
                      ,nombreUsuario as usuario
                      ,'Comprobantes Recibidos - Nota Débito' as nombreReporte
                      ,FORMAT(@fechaInicio, 'dd/MM/yyyy') + ' a ' + FORMAT( @fechaFin, 'dd/MM/yyyy') as filtroFechas
                FROM v_usuario
                WHERE idUsuarioRol = @userRoleId

                EXEC sp_executesql @sql
							      ,@params 
							      ,@idEntidad              = @idEntidad
                                  ,@identificacionReceptor = @identificacionReceptor 
                                  ,@codEstab               = @codEstab
                                  ,@fechaInicio            = @fechaInicio
                                  ,@fechaFin               = @fechaFin
                                  ,@identificacion         = @identificacion
                                  ,@idUsuario              = @idUsuario

                RETURN 
            END 
            
    END TRY
    BEGIN CATCH
        INSERT INTO dbo.ErroresSistema([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [idUsuario])
        VALUES('recepcion reporte', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @idUsuario);
        THROW;
    END CATCH
END
GO


