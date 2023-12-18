USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-10-11-03
-- Description:	SP FOR DELETE TPV CONFIGS
-- =============================================
IF OBJECT_ID(N'Restaurant.ConsumoTpv_Print', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.ConsumoTpv_Print
GO
CREATE PROCEDURE Restaurant.ConsumoTpv_Print @idRol INT,@id INT
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @idSucursal INT
	DECLARE @idUsuario INT
	DECLARE @idConsumoTpv INT
	DECLARE @reportParams VARCHAR(MAX)
	DECLARE @printerName VARCHAR(100)
	DECLARE @isThermal BIT
	DECLARE @format VARCHAR(200)
	DECLARE @deviceInfo VARCHAR(max)
	DECLARE @rdlcParams VARCHAR(MAX)
	DECLARE @rdlcProps VARCHAR(MAX)
	DECLARE @razonSocial VARCHAR(500)
	DECLARE @nombreComercial VARCHAR(500)
	DECLARE @estab VARCHAR(5)
	DECLARE @ruc VARCHAR(20)
	

	SELECT @idUsuario = ur.idUsuario, @razonSocial = e.razonSocial,@ruc = e.ruc
	FROM App.UsuarioRol ur INNER JOIN dbo.Entidad e ON e.idEntidad = ur.idEntidad
	WHERE idUsuarioRol = @idRol

	SELECT @idSucursal = asu.idSucursal,@nombreComercial = s.nombreComercial,@estab = s.serie
	FROM Gestion.AsignacionSucursal asu 
	INNER JOIN dbo.Sucursal s ON s.idSucursal = asu.idSucursal
	WHERE asu.idUsuarioRol = @idRol AND asu.defecto = 1

	SELECT @printerName = i.nombreImpresora
		  ,@isThermal = ti.isThermal
		  ,@format = ti.formato
		  ,@deviceInfo = ti.deviceInfo
	FROM ApiPrinter.Impresora i
	INNER JOIN ApiPrinter.TipoImpresora ti ON ti.idTipoImpresora = i.idTipoImpresora
	WHERE idSucursal = @idSucursal AND predeterminada = 1

	BEGIN TRY
		BEGIN TRAN 
			 SET @rdlcParams = 
							(
								SELECT razonSocial = @razonSocial
								,nombreComercial = @nombreComercial
								,c.nombreFiscal cliente
								,e.razonSocial empresa
								,ca.descripcion cargo
								,c.numeroIdentificacion
								,cf.descripcion servicio
								,c.fechaRegistro
								,ct.cantidad
								FROM Restaurant.ConsumoTpv ct WITH (NOLOCK)
								LEFT JOIN Restaurant.configtpv cf ON ct.idConfigtpv = cf.idConfigTpv
								LEFT JOIN Cliente c WITH (NOLOCK) ON ct.idCliente = c.idCliente
								LEFT JOIN Administrador.Empresa e ON c.idEmpresa = e.idEmpresa
								LEFT JOIN Administrador.Cargo ca ON c.idCargo = ca.idCargo
								WHERE ct.idConsumoTpv = @id
								FOR JSON PATH
							)

					SET  @rdlcProps = (SELECT rdlcProps = (SELECT rdlcName = 'TicketTpv.rdl',printerName = @printerName,isThermal = @isThermal, 'format' = @format, deviceInfo = @deviceInfo FOR JSON PATH))

		COMMIT TRAN

	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos' as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/Delete', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
