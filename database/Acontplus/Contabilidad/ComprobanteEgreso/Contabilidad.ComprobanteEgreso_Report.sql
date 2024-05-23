USE [AcontPlus]
GO
/****** Object:  StoredProcedure [ReporteEgresos].[ComprobanteEgreso]    Script Date: 26/4/2023 15:41:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- exec ReporteEgresos.ComprobanteEgreso '{"id":1853}'
-- =============================================
CREATE OR ALTER PROCEDURE Contabilidad.ComprobanteEgreso_Report 
	 @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

	DECLARE @idComprobanteEgreso INT ,@byEgreso BIT = 0 

	SELECT @idComprobanteEgreso = id FROM OPENJSON(@json) WITH(id INT)

	IF EXISTS(SELECT 1 FROM dbo.PagoDocumento pd INNER JOIN TipoDocumento td ON td.idTipoDocumento = pd.idTipoDocumento WHERE pd.idComprobanteEgreso = @idComprobanteEgreso AND td.codigo = 'EC')
		BEGIN
			SET @byEgreso = 1
		END 

    SET @tableNames = 'comprobanteEgresoDs,comprobanteDetalleDs'

	SELECT 'Nro.:'+td.codigo+dbo.AFTAutoComplete(ce.nroDocumento) as nroComprobante
		  ,@byEgreso                                              as byEgreso
		  ,ce.nombreFiscal                                        as proveedor
		  ,ce.nroIdentificacion
		  ,FORMAT(ce.fechaRegistro, 'dd/MM/yyyy HH:mm')           as fechaEmision
		  ,CAST(ce.total as numeric(18,2))                        as total
		  ,en.nombreComercial
		  ,en.ruc               
		  ,en.telefono          
		  ,en.direccion   
          ,ce.observacion
	FROM dbo.ComprobanteEgreso   ce WITH (NOLOCK) 
	INNER JOIN dbo.TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento = ce.idTipoDocumento
	INNER JOIN dbo.Entidad       en WITH (NOLOCK) ON en.idEntidad       = ce.idEntidad
	WHERE ce.idComprobanteEgreso = @idComprobanteEgreso
		
	IF @byEgreso = 1
		BEGIN
			SELECT td.codigo as tipoDoc
				  ,'EC' + '-' + es.estab + '-'  + dbo.AFTAutoComplete(ma.nroDoc) as nroDoc
				  ,ma.fechaEmision                                               as fechaEmision
				  ,CAST(ma.valor as numeric(18,2))                               as total
				  ,se.descripcion                                                as formaCobro
			FROM PagoDocumento pd
			INNER JOIN dbo.ComprobanteEgreso    ce WITH (NOLOCK) ON ce.idComprobanteEgreso    = pd.idComprobanteEgreso
			INNER JOIN dbo.TipoDocumento        td WITH (NOLOCK) ON td.idTipoDocumento        = pd.idTipoDocumento
			INNER JOIN dbo.MovimientoCaja       ma WITH (NOLOCK) ON ma.idMovimientoCaja       = pd.idComprobante AND ma.idTipoDocumento = pd.idTipoDocumento
			 LEFT JOIN dbo.SubEntidadFinanciera se WITH (NOLOCK) ON se.idSubEntidadFinanciera = ma.idSubEntidadFinanciera
			INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.codEstab			      = ma.codEstab
            WHERE ce.idComprobanteEgreso = @idComprobanteEgreso 
		END 
    ELSE 
        BEGIN
	        SELECT cuenta_pp.idCuentaPorPagar                                       as 'unique'
		          ,cuenta_pp.codDoc                                                 as tipoDoc
		          ,cuenta_pp.serieComprobante                                       as nroDoc
		          ,FORMAT(cuenta_pp.fechaEmision, 'dd/MM/yyyy hh:mm')               as fechaEmision
		          ,CAST(cuenta_pp.importeTotal AS decimal(18,2))                    as total
		          ,ISNULL(se.descripcion,ef.descripcion)                            as formaPago
		          ,IIF(p.posfechado = 1,'SI','NO')                                  as posfechado
		          ,CASE WHEN ef.codigo = 'CHE' THEN b.descripcion 
				        WHEN ef.codigo = 'DOC' THEN tdc.codigo
		           END                                                              as entidadFinanciera
		          ,p.nro                                                            as comprobantePago
		          ,FORMAT(p.fechaEmision, 'dd/MM/yyyy hh:mm')                       as fechaPago
		          ,cuota_pp.nroCuota                                                as cuota
		          ,CAST(cuota_pp.cuota AS decimal(16, 2))                           as valorCuota
		          ,CAST(pde.abono as decimal(16, 2))                                as abono
		          ,CAST(pde.saldo - IIF(p.cobro = 1,pde.abono,0) as decimal(16, 2)) as saldo
	        FROM dbo.ComprobanteEgreso                    ce WITH (NOLOCK) 		
	        INNER JOIN dbo.TipoDocumento                  td WITH (NOLOCK) ON td.idTipoDocumento         = ce.idTipoDocumento		
	        INNER JOIN dbo.Pago                            p WITH (NOLOCK) ON p.idComprobanteEgreso      = ce.idComprobanteEgreso
	        INNER JOIN dbo.EntidadFinanciera              ef WITH (NOLOCK) ON ef.idEntidadFinanciera     = p.idEntidadFinanciera
	         LEFT JOIN dbo.SubEntidadFinanciera           se WITH (NOLOCK) ON se.idSubEntidadFinanciera  = p.idSubEntidadFinanciera
	         LEFT JOIN dbo.Banco                           b WITH (NOLOCK) ON p.idBanco                  = b.idBanco
	         LEFT JOIN dbo.TipoDocumento                 tdc WITH (NOLOCK) ON tdc.idTipoDocumento        = p.idTipoDocumento
	        INNER JOIN dbo.PagoDetalle                   pde WITH (NOLOCK) ON pde.idPago                 = p.idPago
	        INNER JOIN Contabilidad.CuotaPorPagar   cuota_pp WITH (NOLOCK) ON cuota_pp.idCuotaPorPagar   = pde.idCuotaPorPagar 
	        INNER JOIN Contabilidad.CuentaPorPagar cuenta_pp WITH (NOLOCK) ON cuenta_pp.idCuentaPorPagar = cuota_pp.idCuentaPorPagar
	        WHERE ce.idComprobanteEgreso = @idComprobanteEgreso
        END 
END
