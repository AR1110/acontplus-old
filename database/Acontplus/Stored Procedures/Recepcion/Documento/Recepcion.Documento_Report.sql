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

    --> Recuperar Datos
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    SELECT TOP 1 @idEntidad = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

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
			                                  AND di.Code = ''3''
	                                  ),0) as totalIce

	                                  ,CAST(dr.importeTotal as numeric(18,2)) as importeTotal
	                                  ,(
		
			                                SELECT TOP 1 rt.estab + ''-'' + rt.ptoEmi + ''-'' + Helper.F_Auto_Sequential(rt.secuencial)
			                                FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			                                INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			                                WHERE ds.numAutDocSustento = dr.claveAcceso
				                                AND rt.anuladaSri = 0 

		                                ) as nroRetencion

		                                ,ISNULL((
		
			                                SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			                                FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			                                INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			                                INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
			                                WHERE ds.numAutDocSustento = dr.claveAcceso
	 			                                AND rt.anuladaSri = 0 
				                                AND ir.codigo = 1

		                                ),0) as retRenta

		                                ,ISNULL((
		
			                                SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			                                FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			                                INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			                                INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
			                                WHERE ds.numAutDocSustento = dr.claveAcceso
	 			                                AND rt.anuladaSri = 0 
				                                AND ir.codigo = 2

		                                ),0) as retIva
                                        ,us.nombreUsuario as usuario
                                FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK)
                                INNER JOIN Sri.Establecimiento   es WITH (NOLOCK) ON es.codEstab  = dr.codEstab
                                INNER JOIN dbo.Usuario           us WITH (NOLOCK) ON us.idUsuario = dr.idUsuario
                                WHERE dr.codDoc = ''01''
                                  AND dr.xmlCompressed IS NOT NULL
                                  AND dr.codEstab = @codEstab

                                UNION ALL

                                SELECT es.idEstablecimiento
                                      ,es.nombreComercial
	                                  ,es.codEstab
	                                  ,fc.idFacturaCompra
	                                  ,fc.idUsuario
	                                  ,fc.puntoEmision + ''-'' + Helper.F_Auto_Sequential(fc.nroDocumento) 
	                                  ,fc.nroAutorizacion
	                                  ,fc.fechaEmision
	                                  ,pr.numeroIdentificacion
	                                  ,pr.nombreFiscal
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
			
	                                   ),0) 
	                                    ,ISNULL
	                                   ((
			                                SELECT CAST(SUM(fi.TaxBase)as numeric(18,2)) 
			                                FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                  AND ti.codigoPorcentaje = ''0''
			
	                                   ),0)
	                                   ,ISNULL
	                                   ((
			                                SELECT CAST(SUM(fi.TaxBase)as numeric(18,2)) 
			                                FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                  AND ti.codigoPorcentaje IN(''2'',''8'')
			
	                                   ),0)
	                                   ,CAST(fc.totalDescuento as numeric(18,2))
	                                   ,ISNULL
	                                   ((
			                                SELECT CAST(SUM(fi.TaxValue)as numeric(18,2)) 
			                                FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                  AND im.codigo = ''2''
			
	                                   ),0)
	                                   ,ISNULL
	                                   ((
			                                SELECT CAST(SUM(fi.TaxValue)as numeric(18,2)) 
			                                FROM Compra.FacturaImpuesto fi WITH (NOLOCK)
			                                INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = fi.TaxPercentId
			                                INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = fi.TaxId 
			                                WHERE fi.FacturaCompraId = fc.idFacturaCompra
			                                  AND im.codigo = ''3''
			
	                                   ),0)
	                                   ,CAST(fc.total as numeric(18,2))
                                       ,(
		
			                                SELECT TOP 1 rt.estab + ''-'' + rt.ptoEmi + ''-'' + Helper.F_Auto_Sequential(rt.secuencial)
			                                FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			                                INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			                                WHERE ds.numAutDocSustento = fc.nroAutorizacion
				                                AND rt.anuladaSri = 0 

		                                ) as nroRetencion

		                                ,ISNULL((
		
			                                SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			                                FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			                                INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			                                INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
			                                WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			                                AND rt.anuladaSri = 0 
				                                AND ir.codigo = 1

		                                ),0) as retRenta

		                                ,ISNULL((
		
			                                SELECT CAST(SUM(ir.valorRetenido) as numeric(18,2))
			                                FROM FactElect.RetencionAts            rt WITH (NOLOCK)
			                                INNER JOIN FactElect.RetAtsDocSustento ds WITH (NOLOCK) ON ds.idRetencionAts = rt.idRetencionAts
			                                INNER JOIN FactElect.RetencionAtsRet   ir WITH (NOLOCK) ON ir.idRetencionAts = rt.idRetencionAts
			                                WHERE ds.numAutDocSustento = fc.nroAutorizacion
	 			                                AND rt.anuladaSri = 0 
				                                AND ir.codigo = 2

		                                ),0) as retIva
                                        ,us.nombreUsuario as usuario
                                FROM dbo.FacturaCompra         fc WITH (NOLOCK) 
                                INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab    = fc.codEstab
                                INNER JOIN dbo.Proveedor       pr WITH (NOLOCK) ON pr.idProveedor = fc.idProveedor
                                INNER JOIN dbo.Usuario         us WITH (NOLOCK) ON us.idUsuario   = fc.idUsuario
                                WHERE fc.codEstab = @codEstab
                                  AND fc.estado =  1

                        ) as dt WHERE dt.idDocumento > 0 '

            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(dt.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                END

            IF @identificacion IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.rucEmisor = @identificacion '
                END 

            IF @idUsuario IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dt.idUsuario = @idUsuario '
                END

             IF @ckRetencion = 1
                BEGIN
                    SET @sql = @sql + 'AND dt.nroRetencion IS NOT NULL '
                END 

            SET @sql = @sql + 'ORDER BY dt.idDocumento DESC '

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
							  ,@idEntidad      = @idEntidad
                              ,@codEstab       = @codEstab
                              ,@fechaInicio    = @fechaInicio
                              ,@fechaFin       = @fechaFin
                              ,@identificacion = @identificacion
                              ,@idUsuario      = @idUsuario

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

            SET @params = '@idEntidad       INT
                          ,@codEstab        VARCHAR(100)
                          ,@fechaInicio     DATETIME2
                          ,@fechaFin        DATETIME2
                          ,@identificacion  VARCHAR(20)
                          ,@idUsuario       INT'

            SET @sql = '  SELECT es.idEstablecimiento
                                ,es.nombreComercial
	                            ,es.codEstab
	                            ,dr.serieComprobante
	                            ,dr.claveAcceso
	                            ,dr.fechaEmision
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
                        INNER JOIN Sri.Establecimiento   es WITH (NOLOCK) ON es.codEstab = dr.codEstab
                        INNER JOIN dbo.Usuario           us WITH (NOLOCK) ON us.idUsuario = dr.idUsuario
                        WHERE dr.codDoc = ''04''
                            AND dr.xmlCompressed IS NOT NULL '

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dr.codEstab = @codEstab '
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
                  ,'Comprobantes Recibidos - Nota Credito' as nombreReporte
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

            RETURN  

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
	                          ,dr.claveAcceso
	                          ,dr.rucEmisor
	                          ,dr.razonSocialEmisior as razonSocialEmisor
	                          ,ISNULL
	                          ((
			                        SELECT CAST(SUM(di.TaxValue) as numeric(18,2)) 
			                        FROM Recepcion.DocumentoImpuesto di 
			                        WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                          AND di.Code = ''2''
	  
	                          ),0) as retRenta
	                          ,ISNULL
	                          ((
			                        SELECT CAST(SUM(di.TaxValue) as numeric(18,2)) 
			                        FROM Recepcion.DocumentoImpuesto di 
			                        WHERE di.DocumentoRecibidoId = dr.idDocumento 
			                          AND di.Code = ''1''
	  
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
                        INNER JOIN Sri.Establecimiento   es WITH (NOLOCK) ON es.codEstab  = dr.codEstab
                        INNER JOIN dbo.Usuario           us WITH (NOLOCK) ON us.idUsuario = dr.idUsuario
                        WHERE dr.codDoc = ''07''
                          AND dr.xmlCompressed IS NOT NULL '

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND dr.codEstab = @codEstab '
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

            RETURN  
        END 
END
GO


