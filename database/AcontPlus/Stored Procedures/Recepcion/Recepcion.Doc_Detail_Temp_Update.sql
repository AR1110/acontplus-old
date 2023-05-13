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
-- Create date: 2022-10-19
-- Description:	SP Para insertar los detalles temporales del comprobante importado
-- =============================================
IF OBJECT_ID(N'Recepcion.Doc_Detail_Temp_Update', N'P') IS NOT NULL
	DROP PROCEDURE Recepcion.Doc_Detail_Temp_Update
GO

CREATE PROCEDURE Recepcion.Doc_Detail_Temp_Update @idRol INT
	,@jsonData NVARCHAR(MAX)
	,@method VARCHAR(200) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @idUsuario INT
	DECLARE @idEntidad INT
	DECLARE @rucProv VARCHAR(20)
	DECLARE @idProveedor INT
	DECLARE @idMedida INT
	DECLARE @payload VARCHAR(MAX)
	DECLARE @tmp TABLE (
		todos BIT NULL
		,idDocumento INT NOT NULL
		,idProveedor INT NULL
		,idArticulo INT NULL
		,codArticulo VARCHAR(100) NULL
		,idMedida INT
		,idBodega INT
		,idDetalle INT
		)

	INSERT INTO @tmp (
		todos
		,idDocumento
		,idProveedor
		,idArticulo
		,codArticulo
		,idMedida
		,idBodega
		,idDetalle
		)
	SELECT todos
		,idDocumento
		,idProveedor
		,idArticulo
		,LTRIM(RTRIM(codArticulo))
		,idMedida
		,idBodega
		,idDetalle
	FROM OPENJSON(@jsonData) WITH (
			todos BIT '$.todos'
			,idDocumento INT '$.idDocumento'
			,idProveedor INT '$.idProveedor'
			,idArticulo INT '$.idArticulo'
			,codArticulo VARCHAR(100) '$.codArticulo'
			,idMedida INT '$.idMedida'
			,idBodega INT '$.idBodega'
			,idDetalle INT '$.idDetalle'
			)

	IF NOT EXISTS (
			SELECT 1
			FROM @tmp
			)
	BEGIN
		SELECT '0' code
			,'No existe datos para registrar' AS 'message'

		RETURN
	END

	IF EXISTS (
			SELECT 1
			FROM @tmp
			WHERE idProveedor = 0
				AND idArticulo = 0
			)
	BEGIN
		SELECT '0' AS CODE
			,'No se pudo actualizar el articulo' AS 'message'

		RETURN
	END

	SELECT @idEntidad = idEntidad
		,@idUsuario = idUsuario
	FROM AFTDataRol(@idRol)

	SET @idProveedor = (
			SELECT TOP 1 idProveedor
			FROM @tmp
			)

	SELECT @rucProv = rucEmisor
	FROM Recepcion.DocumentoRecibido
	WHERE idDocumento = (
			SELECT TOP 1 idDocumento
			FROM @tmp
			)

	IF (
			@idProveedor = 0
			AND @rucProv IS NOT NULL
			)
	BEGIN
		SELECT TOP 1 @idProveedor = idProveedor
		FROM Proveedor
		WHERE idEntidad = @idEntidad
			AND numeroIdentificacion = @rucProv
	END

	IF (
			SELECT TOP 1 idArticulo
			FROM @tmp
			) > 0
	BEGIN
		SET @idMedida = (
				SELECT idMedida
				FROM Articulo
				WHERE idArticulo = (
						SELECT TOP 1 idArticulo
						FROM @tmp
						)
				)
	END

	BEGIN TRY
		BEGIN TRAN

		IF EXISTS (
				SELECT 1
				FROM @tmp
				WHERE todos = 1
				)
		BEGIN
			DECLARE @messageResp VARCHAR(100)

			IF EXISTS (
					SELECT 1
					FROM @tmp
					WHERE idBodega > 0
					)
			BEGIN
				UPDATE Recepcion.Doc_Detalle_Temp
				SET idBodega = (
						SELECT TOP 1 idBodega
						FROM @tmp
						)
				WHERE idDocumento = (
						SELECT TOP 1 idDocumento
						FROM @tmp
						)

				SET @messageResp = 'Bodega asignada correctamente'
			END
			ELSE
			BEGIN
				UPDATE Recepcion.Doc_Detalle_Temp
				SET idMedida = (
						SELECT TOP 1 idMedida
						FROM @tmp
						)
				WHERE idDocumento = (
						SELECT TOP 1 idDocumento
						FROM @tmp
						)

				SET @messageResp = 'Medida asignada correctamente'
			END

			SET @payload = (
					SELECT d.*
						,impuesto = (
							SELECT TOP 1 si.descripcion
							FROM Recepcion.Doc_Impuesto_Temp i
							INNER JOIN Sri.Impuesto si ON i.codigo = si.codigo
							WHERE d.idDocumento = i.idDocumento
								AND d.codigoPrincipal = i.codArticulo
							)
						,valorImpuesto = (
							SELECT SUM(CONVERT(NUMERIC(18, 2), i.valor))
							FROM Recepcion.Doc_Impuesto_Temp i
							WHERE d.idDocumento = i.idDocumento
								AND d.codigoPrincipal = i.codArticulo
							)
						,ISNULL(dd.idDocumentoDetalle, 0) idDocumentoDetalle
					FROM Recepcion.Doc_Detalle_Temp d
					LEFT JOIN Recepcion.DocumentoDetalle dd ON d.idArticulo = dd.idArticulo
						AND dd.idDocumento = (
							SELECT TOP 1 idDocumento
							FROM @tmp
							)
					WHERE d.idDocumento = (
							SELECT TOP 1 idDocumento
							FROM @tmp
							)
					ORDER BY idDetalle ASC
					FOR JSON AUTO
					)

			SELECT '1' AS code
				,@payload AS payload
				,@messageResp AS 'message'
		END
		ELSE
		BEGIN
			UPDATE a
			SET a.idProveedor = @idProveedor
				,a.idArticulo = atmp.idArticulo
				,a.codigoPrincipal = LTRIM(RTRIM(atmp.codArticulo))
				,a.idMedida = atmp.idMedida
				,a.idUsuario = @idUsuario
				,a.fechaRegistro = GETDATE()
			FROM Recepcion.Doc_Detalle_Temp a WITH (NOLOCK)
			JOIN (
				SELECT t.idDocumento
					,t.idArticulo
					,t.codArticulo
					,t.idMedida
					,t.idDetalle
				FROM @tmp t
				) AS atmp ON a.idDocumento = atmp.idDocumento
				--AND a.codigoPrincipal = LTRIM(RTRIM(atmp.codArticulo))
				AND a.idDetalle = atmp.idDetalle

			SET @payload = (
					SELECT d.*
						,impuesto = (
							SELECT TOP 1 si.descripcion
							FROM Recepcion.Doc_Impuesto_Temp i
							INNER JOIN Sri.Impuesto si ON i.codigo = si.codigo
							WHERE d.idDocumento = i.idDocumento
								AND d.codigoPrincipal = i.codArticulo
							)
						,valorImpuesto = (
							SELECT SUM(CONVERT(NUMERIC(18, 2), i.valor))
							FROM Recepcion.Doc_Impuesto_Temp i
							WHERE d.idDocumento = i.idDocumento
								AND d.codigoPrincipal = i.codArticulo
							)
						,idDocumentoDetalle = ISNULL((
								SELECT TOP 1 dd.idDocumentoDetalle
								FROM Recepcion.DocumentoDetalle dd
								WHERE d.idArticulo = dd.idArticulo
									AND dd.idDocumento = d.idDocumento
								), 0)
					FROM Recepcion.Doc_Detalle_Temp d
					WHERE d.idDocumento = (
							SELECT TOP 1 idDocumento
							FROM @tmp
							)
					ORDER BY d.idDetalle asc
					FOR JSON AUTO
					)

			SELECT '1' AS code
				,@payload AS payload
				,'Articulo Actualizado' AS 'message'
		END

		COMMIT TRAN
	END TRY

	BEGIN CATCH
		SELECT '0' code
			,'Error en base de datos: ' + ERROR_MESSAGE() AS 'message'

		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN

		INSERT INTO ErroresSistema (
			[token]
			,[method]
			,[errorNumber]
			,[errorSeverity]
			,[errorState]
			,[errorProcedure]
			,[errorLine]
			,[errorMessage]
			,[errorDate]
			,[idUsuario]
			)
		VALUES (
			NEWID()
			,@method
			,ERROR_NUMBER()
			,ERROR_SEVERITY()
			,ERROR_STATE()
			,ERROR_PROCEDURE()
			,ERROR_LINE()
			,ERROR_MESSAGE()
			,dbo.ufnGetDateEcuador()
			,@idUsuario
			)
	END CATCH
END
GO


	