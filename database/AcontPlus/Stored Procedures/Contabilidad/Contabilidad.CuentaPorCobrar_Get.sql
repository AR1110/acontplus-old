USE [Acontplus]
go 
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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Contabilidad.CuentaPorCobrar_Get', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.CuentaPorCobrar_Get
GO
CREATE PROCEDURE Contabilidad.CuentaPorCobrar_Get @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN

	DECLARE @idEntidad AS INT 
	DECLARE @tipo AS INT 
	DECLARE @idDocumento AS INT 
	DECLARE @idTipoDocumento AS INT 
	DECLARE @codDoc AS VARCHAR(5)


	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	SELECT @tipo = tipo,@idTipoDocumento = idTipoDocumento, @idDocumento = idDocumento FROM OPENJSON(@json) WITH (tipo INT '$.tipo',idDocumento INT '$.idDocumento', idTipoDocumento INT '$.idTipoDocumento')

	SELECT TOP 1 @codDoc = codigo FROM dbo.TipoDocumento WITH (NOLOCK) WHERE idTipoDocumento = @idTipoDocumento
	
	-- ============================= Datos para cobros rapidos ==============================================================

	IF @tipo = 2
		BEGIN
			
			SELECT idEntidadFinanciera,descripcion,detalle,codigo FROM dbo.EntidadFinanciera WITH (NOLOCK) WHERE estado = 1

			SELECT idEntidadFinanciera,idSubEntidadFinanciera,descripcion,codigo,interes,controlCaja FROM dbo.SubEntidadFinanciera WHERE idEntidad = 9 AND estado = 1 

			SELECT idBanco,descripcion,codigo FROM dbo.Banco WITH (NOLOCK) WHERE estado = 1

			SELECT cd.idCiudad,provincia = pr.descripcion ,cd.descripcion,pr.codigo FROM dbo.Provincia pr WITH (NOLOCK)
			INNER JOIN dbo.Ciudad cd WITH (NOLOCK) ON cd.idProvincia = pr.idProvincia WHERE cd.estado = 1

			SELECT idTipoDocumento,idDocumento = idComprobante,idCuotaXCobrar,cuota,mora,abono,saldo FROM dbo.CuotaXCobrar WHERE idTipoDocumento = @idTipoDocumento AND idComprobante = @idDocumento AND estado = 1

			IF @codDoc = 'FV'
				BEGIN
					SELECT 
					     fe.idTipoDocumento
						,idDocumento = fe.idFactura
						,pe.codEstab
						,fe.idCliente
						,cl.numeroIdentificacion
						,cl.nombreFiscal
						,fe.abono
						,fe.saldo
						,importeTotal = fe.total
						,fechaEmision =  FORMAT(fe.fechaEmision,'MM/dd/yyyy')
						,serieComprobante = es.estab + '-' + pe.ptoEmi + '-' + [Helper].[F_Auto_Sequential](fe.nroFactura) 
					FROM dbo.Factura               fe WITH (NOLOCK)
					INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente      = fe.idCliente
					INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = fe.idPuntoEmision
					INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pe.codEstab
					WHERE idFactura = @idDocumento
				END 

			IF @codDoc = 'NE'
				BEGIN
					SELECT pe.codEstab,ne.idCliente,cl.numeroIdentificacion,cl.nombreFiscal,ne.saldo
					FROM dbo.NotaEntrega        ne WITH (NOLOCK)
					INNER JOIN dbo.Cliente      cl WITH (NOLOCK) ON cl.idCliente      = ne.idCliente
					INNER JOIN dbo.PuntoEmision pe WITH (NOLOCK) ON pe.idPuntoEmision = ne.idPuntoEmision
					WHERE ne.idNotaEntrega = @idDocumento
				END 
		END 
	
	
END
GO
