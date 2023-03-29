USE [AcontPlus]
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
-- Author:		Ivan Paz
-- Create date: 2022-09-01
-- Description:	SP FOR INSERT COMPRA HABITUAL
-- =============================================
IF OBJECT_ID(N'FactElect.CompraHabitual_Insert ', N'P') IS NOT NULL
DROP PROCEDURE FactElect.CompraHabitual_Insert 
GO
CREATE PROCEDURE FactElect.CompraHabitual_Insert
 @idRol INT
,@json NVARCHAR(MAX)
,@method VARCHAR(200) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @codEstab VARCHAR(50)
	DECLARE @idUsuario INT
	DECLARE @idEntidad INT


	DECLARE @tmp AS TABLE(
		idProveedor INT NOT NULL
		,ruc VARCHAR(13) NULL
		,idArticulo INT NOT NULL
		,codArticulo VARCHAR(100) NULL
	)

	--IF EXISTS(SELECT 1 FROM FactElect.CompraHabitual ch
	--					INNER JOIN @tmp t ON ch.idProveedor = t.idProveedor 
	--					AND ch.idArticulo = t.idArticulo
	--					AND ch.codArticulo = t.codArticulo
	--					WHERE ch.idSucursal = @idSucursal)
	--	BEGIN
	--		SELECT '0' code, 'Este articulo ya existe como compra habitual' as 'message'
	--		RETURN
	--	END
	SET @idEntidad = (SELECT idEntidad FROM AFTDataRol(@idRol))

	BEGIN TRY
		INSERT INTO @tmp(idProveedor, ruc, idArticulo, codArticulo)
		SELECT idProveedor, ruc, idArticulo, LTRIM(RTRIM(codArticulo)) FROM OPENJSON(@json) 
													WITH (idProveedor INT '$.idProveedor'
													,ruc VARCHAR(13) '$.ruc'
													,idArticulo INT '$.idArticulo'
													,codArticulo VARCHAR(100) '$.codArticulo')

		IF (SELECT count(1) FROM @tmp) = 0
			BEGIN
				RETURN
			END

		IF EXISTS (SELECT 1 FROM @tmp WHERE LEN(Rtrim(ltrim(codArticulo))) = 0)
			BEGIN
				SELECT '0' code, 'No existe codigo de articulo' as 'message'
			END

		IF EXISTS(SELECT 1 FROM FactElect.CompraHabitual ch WITH (NOLOCK) 
							INNER JOIN Proveedor p ON ch.idProveedor = p.idProveedor AND p.idEntidad = @idEntidad
							INNER JOIN @tmp t ON ch.codArticulo = t.codArticulo AND ch.ruc = t.ruc)
			BEGIN
				DECLARE @idArticleFounded INT 
				,@articleFounded VARCHAR(600)
				
				SET @idArticleFounded = (SELECT TOP 1 ch.idArticulo FROM FactElect.CompraHabitual ch WITH (NOLOCK) 
																	INNER JOIN Proveedor p ON ch.idProveedor = p.idProveedor AND p.idEntidad = @idEntidad
																	INNER JOIN @tmp t ON ch.codArticulo = t.codArticulo 
																	AND ch.ruc = t.ruc)

				SET @articleFounded = (SELECT '(' + codigo + ') - ' + descripcion FROM Articulo WITH (NOLOCK) WHERE idArticulo = @idArticleFounded )

				SELECT '1' code, 'El articulo ya se encuentra vinculado previa con este proveedor: '  + @articleFounded as 'message'
				RETURN
			END

		SELECT @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

		SELECT @codEstab = codEstab FROM Config.Estab_Asig WITH (NOLOCK) WHERE idUsuarioRol = @idRol AND predeterminado = 1

		BEGIN TRAN
			INSERT INTO FactElect.CompraHabitual(codEstab,idProveedor, ruc, idArticulo, codArticulo, idUsuario)
			SELECT @codEstab, idProveedor, ruc, idArticulo, codArticulo, @idUsuario 
			FROM @tmp t
			WHERE NOT EXISTS (
			SELECT * FROM FactElect.CompraHabitual ch
					 INNER JOIN @tmp t ON ch.idProveedor = t.idProveedor 
					 AND ch.idArticulo = t.idArticulo
					 AND ch.codArticulo = t.codArticulo
					 WHERE ch.codEstab = @codEstab
			)
			SELECT '1' code, 'Exitos al guardar' as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), @method, ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
