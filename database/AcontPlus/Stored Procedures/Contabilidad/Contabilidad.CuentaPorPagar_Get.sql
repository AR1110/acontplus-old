USE [Acontplus]
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
-- Author:		Alexis Ramirez
-- Create date: 03/14/2023
-- Description:	SP para lisatar las cuentas por pagar.
-- =============================================
IF OBJECT_ID(N'Contabilidad.CuentaPorPagar_Get', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuentaPorPagar_Get
GO
CREATE PROCEDURE Contabilidad.CuentaPorPagar_Get @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 
	DECLARE @tipo INT 	

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

	IF @tipo = 1
		BEGIN
			DECLARE @sql AS NVARCHAR(MAX) = 'SELECT TOP 50
											 pp.idCuentaPorPagar
											,idTiempoCredito = ISNULL(pp.idTiempoCredito,0)
											,identificacion = p.numeroIdentificacion
											,nombreFiscal = p.nombreFiscal
											,pp.codDoc
											,pp.serieComprobante
											,fechaEmision = Format(pp.fechaEmision, ''yyyy-MM-dd'') 
											,fechaVencimiento = Format(pp.fechaVencimiento, ''yyyy-MM-dd'') 
											,importeTotal 
											,abono = ISNULL(abono,0)
											,saldo = ISNULL(saldo,0)
											,diasCredito = ISNULL(tc.diasCredito,0)
											,estado = ep.descripcion
											,codPago = ep.codigo
											,colorRow  = CASE ep.codigo WHEN ''A''  THEN ''#28a745'' 
																	    WHEN ''PA'' THEN ''#28a745''
																	    ELSE ''''
														END 
										FROM Contabilidad.CuentaPorPagar pp WITH (NOLOCK)
										INNER JOIN dbo.Proveedor      p WITH (NOLOCK) ON p.idProveedor      = pp.idProveedor
   										 LEFT JOIN dbo.TiempoCredito tc WITH (NOLOCK) ON tc.idTiempoCredito = pp.idTiempoCredito
										INNER JOIN dbo.EstadoPago    ep WITH (NOLOCK) ON ep.idEstadoPago    = pp.idEstadoPago
										WHERE pp.idEntidad = @idEntidad'

			DECLARE @params AS NVARCHAR(MAX) = '@idEntidad AS INT'
			
			EXEC sp_executesql 
			      @sql
			     ,@params 
			     ,@idEntidad    = @idEntidad
		END 

	IF @tipo = 2 
		BEGIN
			DECLARE @codPago VARCHAR(5)
			DECLARE @idCuentaPorPagar AS INT 
			SELECT @idCuentaPorPagar = idCuentaPorPagar, @codPago = codPago FROM OPENJSON(@json) WITH (idCuentaPorPagar INT '$.idCuentaPorPagar', codPago VARCHAR(5) '$.codPago')
			
			IF @codPago IS NULL
				BEGIN 
					SELECT 
						 c.idCuotaPorPagar
						,fechaVencimiento = Format(c.fechaVencimiento, 'yyyy-MM-dd')
						,c.nroCuota
						,c.cuota
						,c.abono
						,c.saldo
						,ep.descripcion
						,ep.codigo
					FROM Contabilidad.CuotaPorPagar c 
					INNER JOIN dbo.EstadoPago ep ON ep.idEstadoPago = c.idEstadoPago
					WHERE c.idCuentaPorPagar = @idCuentaPorPagar	
					AND c.estado = 1
				END 
			
			ELSE IF @codPago IS NOT NULL
				BEGIN 
					SELECT 
						 c.idCuotaPorPagar
						,fechaVencimiento = Format(c.fechaVencimiento, 'yyyy-MM-dd')
						,c.nroCuota
						,c.cuota
						,c.abono
						,c.saldo
						,ep.descripcion
						,ep.codigo
					FROM Contabilidad.CuotaPorPagar c 
					INNER JOIN dbo.EstadoPago ep ON ep.idEstadoPago = c.idEstadoPago
					WHERE c.idCuentaPorPagar = @idCuentaPorPagar	
					AND c.estado = 1 AND ep.codigo !='PA'
				END 
				
			 
		END 
END
GO
