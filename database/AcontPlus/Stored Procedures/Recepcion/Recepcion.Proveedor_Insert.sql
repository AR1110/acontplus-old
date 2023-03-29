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
-- Author:		Ivan Paz
-- Create date: 2022-09-22
-- Description:	SP FOR SAVE PROV
-- =============================================
IF OBJECT_ID(N'Recepcion.Proveedor_Insert', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Proveedor_Insert
GO
CREATE PROCEDURE Recepcion.Proveedor_Insert
 @idRol INT
 ,@jsonData NVARCHAR(MAX)
 ,@method VARCHAR(30) = NULL
AS
BEGIN
	SET NOCOUNT ON; 
	DECLARE @idEntidad INT
	DECLARE @idUsuario INT
	DECLARE @idProveedor INT

	DECLARE @tmp AS TABLE(
		idTipoIdentificacion INT NOT NULL
		,idTipoClienteProveedor INT NOT NULL
		,idTipoEntidad INT NOT NULL
		,idSubContribuyente INT NOT NULL
		,idTiempoCredito INT NOT NULL
		,idCiudad INT NULL
		,numeroIdentificacion VARCHAR(15) NOT NULL
		,razonSocial VARCHAR(250) NOT NULL
		,nombreComercial VARCHAR(250) NULL
		,direccion VARCHAR(300) NULL
		,telefono VARCHAR(15) NULL
		,correo  VARCHAR(100) NULL
	)

	INSERT INTO @tmp(idTipoIdentificacion, idTipoClienteProveedor, idTipoEntidad, idSubContribuyente,
	idTiempoCredito, idCiudad, numeroIdentificacion, razonSocial, nombreComercial, direccion, telefono, correo)
	SELECT idTipoIdentificacion, idTipoClienteProveedor, idTipoEntidad, idSubContribuyente, idTiempoCredito
	,idCiudad, LTRIM(RTRIM(numeroIdentificacion)), razonSocial, nombreComercial, direccion, telefono, correo 
													FROM OPENJSON(@jsonData) 
													WITH (idTipoIdentificacion INT '$.idTipoIdentificacion'
													,idTipoClienteProveedor INT '$.idTipoClienteProveedor'
													,idTipoEntidad INT '$.idTipoEntidad'
													,idSubContribuyente INT '$.idSubContribuyente'
													,idTiempoCredito INT '$.idTiempoCredito'
													,idCiudad INT '$.idCiudad'
													,numeroIdentificacion VARCHAR(15) '$.ruc'
													,razonSocial VARCHAR(250) '$.razonSocial'
													,nombreComercial VARCHAR(250) '$.nombreComercial'
													,direccion VARCHAR(300) '$.dirMatriz'
													,telefono VARCHAR(15) '$.telefono'
													,correo  VARCHAR(100) '$.correo')

	IF (SELECT count(1) FROM @tmp) = 0
		BEGIN
			RETURN
		END

	SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	IF EXISTS(SELECT 1 FROM dbo.Proveedor
						WHERE idEntidad = @idEntidad
						AND numeroIdentificacion = (SELECT numeroIdentificacion FROM @tmp)
						)
		BEGIN
			RETURN
		END

	BEGIN TRY
		BEGIN TRAN
			INSERT INTO Proveedor(idEntidad, idTipoIdentificacion, idTipoClienteProveedor, idTipoEntidad, idSubContribuyente,
							idTiempoCredito, numeroIdentificacion, nombreComercial, nombreFiscal, direccion, telefono, correo, idUsuario)
			SELECT @idEntidad, idTipoIdentificacion, idTipoClienteProveedor, idTipoEntidad, idSubContribuyente,
							idTiempoCredito, numeroIdentificacion, nombreComercial, razonSocial, direccion, telefono, correo, @idUsuario 
			FROM @tmp
			SET @idProveedor = @@IDENTITY
			SELECT @idProveedor idProveedor, idTiempoCredito FROM @tmp
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), '/', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
