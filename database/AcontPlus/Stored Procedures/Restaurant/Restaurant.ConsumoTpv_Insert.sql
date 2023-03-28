USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-10-11-03
-- Description:	SP FOR INSERT CONSUMO TPV
-- =============================================
IF OBJECT_ID(N'Restaurant.ConsumoTpv_Insert', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.ConsumoTpv_Insert
GO
CREATE PROCEDURE Restaurant.ConsumoTpv_Insert @idRol INT ,@json VARCHAR(MAx)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @codEstab VARCHAR(50)
	DECLARE @idUsuario INT
	DECLARE @idEntidad INT
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
	DECLARE @estado BIT 

	DECLARE @tmp AS TABLE (
		idConfigTpv VARCHAR(2)
		,idCliente VARCHAR(100)
		,cantidad INT
		,fechaConsumo VARCHAR(50)
		,tipo INT
	)

	INSERT INTO @tmp(idConfigTpv, idCliente, cantidad, fechaConsumo, tipo)
	SELECT idConfigTpv, idCliente, cantidad, fechaConsumo, tipo FROM OPENJSON(@json) WITH (
		idConfigTpv VARCHAR(2) '$.idConfigTpv'
		,idCliente VARCHAR(100) '$.idCliente'
		,cantidad INT '$.cantidad'
		,fechaConsumo VARCHAR(50) '$.fechaConsumo'
		,tipo INT '$.tipo'
	)

	
	--DECLARE @anulado BIT

	IF (SELECT tipo FROM @tmp) = 1 
		BEGIN
			IF EXISTS(SELECT 1 FROM Restaurant.ConsumoTpv c WITH (NOLOCK)
								INNER JOIN @tmp t ON c.idConfigTpv = t.idConfigTpv
								AND c.idCliente = t.idCliente
								AND CAST(c.fechaRegistro AS DATE) = CAST(GETDATE() AS DATE))
				BEGIN
					SET @idConsumoTpv = (SELECT TOP 1 idConsumoTpv FROM Restaurant.ConsumoTpv c WITH (NOLOCK)
								INNER JOIN @tmp t ON c.idConfigTpv = t.idConfigTpv
								AND c.idCliente = t.idCliente
								AND CAST(c.fechaRegistro AS DATE) = CAST(GETDATE() AS DATE) ORDER BY idConsumoTpv DESC)
			
					IF NOT EXISTS (SELECT 1 FROM Restaurant.ConsumoAnuladoTpv WHERE idConsumoTpv = @idConsumoTpv)
						BEGIN
							SET @idConsumoTpv = NULL
							SELECT '0' code, 'Servicio ya ha sido registrado' as 'message'
							RETURN
						END
				END
			
		END
	ELSE
		BEGIN
			IF ((SELECT TOP 1 CAST(CONVERT(datetime2(0), fechaConsumo) AS DATE) FROM @tmp) > (SELECT CAST(dbo.ufnGetDateEcuador() AS DATE)))
				BEGIN
					SELECT '0' code, 'La fecha no puede ser mayor a la fecha actual' as 'message'
					RETURN
				END
			IF EXISTS(SELECT 1 FROM Restaurant.ConsumoTpv c WITH (NOLOCK)
								INNER JOIN @tmp t ON c.idConfigTpv = t.idConfigTpv
								AND c.idCliente = t.idCliente
								AND CAST(c.fechaRegistro AS DATE) = CAST(CONVERT(datetime2(0), fechaConsumo) AS DATE))
				BEGIN
					SET @idConsumoTpv = (SELECT TOP 1 idConsumoTpv FROM Restaurant.ConsumoTpv c WITH (NOLOCK)
								INNER JOIN @tmp t ON c.idConfigTpv = t.idConfigTpv
								AND c.idCliente = t.idCliente
								AND CAST(c.fechaRegistro AS DATE) = CAST(CONVERT(datetime2(0), fechaConsumo) AS DATE) ORDER BY idConsumoTpv DESC)
			
					IF NOT EXISTS (SELECT 1 FROM Restaurant.ConsumoAnuladoTpv WHERE idConsumoTpv = @idConsumoTpv)
						BEGIN
							SET @idConsumoTpv = NULL
							SELECT '0' code, 'Servicio ya ha sido registrado' as 'message'
							RETURN
						END
				END
		END

	SELECT @idUsuario = ur.idUsuario, @idEntidad = idEntidad FROM App.UsuarioRol ur WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT @codEstab = codEstab FROM Config.Estab_Asig WITH (NOLOCK) WHERE idUsuarioRol = @idRol AND predeterminado = 1

	SELECT @razonSocial = razonSocial FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

	SELECT @nombreComercial = nombreComercial FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab
	SET @rdlcProps = (
	SELECT  i.nombreImpresora
		    ,CAST(0 AS bit) isThermal
		   ,ti.formato
		  ,ti.deviceInfo
		  ,i.nombreEquipo computerName
		  ,rdlcName = 'TicketTpv.rdl'
	FROM ApiPrinter.Impresora i
	INNER JOIN ApiPrinter.TipoImpresora ti ON ti.idTipoImpresora = i.idTipoImpresora
	WHERE i.codEstab = @codEstab
	  FOR JSON PATH)

	SELECT @estado =  estado FROM Restaurant.ConfigPrinter WHERE codEstab = @codEstab

	DECLARE @print BIT = (SELECT estado FROM Restaurant.configPrinter where codEstab = @codEstab)


 	BEGIN TRY
		BEGIN TRAN
			INSERT INTO Restaurant.ConsumoTpv(idConfigTpv, idCliente, cantidad, fechaRegistro, idUsuario)
			SELECT idConfigTpv, idCliente, cantidad, CASE WHEN tipo = 1 THEN dbo.ufnGetDateEcuador() ELSE CONVERT(datetime2(0), fechaConsumo) END
			,@idUsuario 
			FROM @tmp
			
			SET @idConsumoTpv = @@IDENTITY
			

			IF (@print = 1)
				BEGIN
									
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
								INNER JOIN Restaurant.configtpv cf ON ct.idConfigtpv = cf.idConfigTpv
								INNER JOIN Cliente c WITH (NOLOCK) ON ct.idCliente = c.idCliente
								LEFT JOIN Administrador.Empresa e ON c.idEmpresa = e.idEmpresa
								LEFT JOIN Administrador.Cargo ca ON c.idCargo = ca.idCargo
								WHERE ct.idConsumoTpv = @idConsumoTpv
								FOR JSON PATH
							)

					--SET  @rdlcProps = (SELECT rdlcProps = (SELECT rdlcName = 'TicketTpv.rdl',printerName = @printerName,isThermal = @isThermal, 'format' = @format, deviceInfo = @deviceInfo FOR JSON PATH))
					
					IF @printerName IS  NULL
						BEGIN
							SET @idConsumoTpv = NULL
							SELECT '0' code, 'No tienes configurada ninguna impresora' as 'message'
						END 
					ELSE
						BEGIN 
							SELECT '1' code, 'Registrado correctamente' as 'message', payload = (SELECT @rdlcProps rdlcProps, @rdlcParams rdlcParams FOR JSON PATH)
						END
					--INSERT INTO ApiPrinter.Service_Printer_Document
					--(
					--	idService_Printer_Document
					--   ,ruc
					--   ,numEstab
					--   ,rdlcProps
					--   ,rdlcParams
					--   ,fechaRegistro
					--)
					--SELECT 
					--	NEWID()
					--   ,@ruc
					--   ,@estab
					--   ,@rdlcProps
					--   ,@rdlcParams
					--   ,dbo.ufnGetDateEcuador()
					--WHERE @estado = 1
				END
			ELSE
				BEGIN
					SELECT '1' code, 'Registrado correctamente' as 'message'--, payload = (SELECT @rdlcProps rdlcProps, @rdlcParams rdlcParams FOR JSON PATH)
				END
		COMMIT TRAN
	END TRY

	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos' as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
