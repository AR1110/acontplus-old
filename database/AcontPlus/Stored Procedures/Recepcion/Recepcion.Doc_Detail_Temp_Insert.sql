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
-- Create date: 2022-09-17
-- Description:	SP Para insertar los detalles temporales del comprobante importado
-- =============================================
IF OBJECT_ID(N'Recepcion.Doc_Detail_Temp_Insert', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Doc_Detail_Temp_Insert 
GO
CREATE PROCEDURE Recepcion.Doc_Detail_Temp_Insert
@idRol INT
,@jsonData NVARCHAR(MAX)
,@method VARCHAR(200) = NULL
AS
BEGIN
	SET NOCOUNT ON; 
	DECLARE @idUsuario INT
	DECLARE @idEntidad INT
	DECLARE @rucProv VARCHAR(20)
	DECLARE @idProveedor INT
		DECLARE @payload VARCHAR(MAX)

	DECLARE @tmp TABLE(
	idComp UNIQUEIDENTIFIER NOT NULL
	,idArticulo INT NULL
	,codigoPrincipal VARCHAR(100) NOT NULL
	,codigoAuxiliar VARCHAR(100) NULL
	,cantidad VARCHAR(100) NOT NULL
	,descripcion VARCHAR(300) NOT NULL
	,precioUnitario VARCHAR(15) NOT NULL
	,descuento VARCHAR(15) NULL
	,precioTotalSinImpuesto VARCHAR(15) NULL
	)

	INSERT INTO @tmp(idComp, idArticulo, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto)
	SELECT idComp, idArticulo, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto
	FROM OPENJSON(@jsonData) WITH (idComp UNIQUEIDENTIFIER
	,idArticulo INT '$.idArticulo'
	,codigoPrincipal VARCHAR(100) '$.codigoPrincipal'
	,codigoAuxiliar VARCHAR(100) '$.codigoAuxiliar'
	,cantidad VARCHAR(100) '$.cantidad'
	,descripcion VARCHAR(300) '$.descripcion'
	,precioUnitario VARCHAR(15) '$.precioUnitario'
	,descuento VARCHAR(15) '$.descuento'
	,precioTotalSinImpuesto VARCHAR(15) '$.precioTotalSinImpuesto'
	)

	IF NOT EXISTS (SELECT 1 FROM @tmp)
		BEGIN
			SELECT '0' code, 'No existe datos para registrar'as 'message'
			RETURN
		END
	
	SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM AFTDataRol(@idRol)

	SELECT @rucProv = rucEmisor  FROM Recepcion.DocumentoRecibido WHERE uniqueId = (SELECT TOP 1 idComp FROM @tmp) 

	SELECT TOP 1 @idProveedor = idProveedor FROM Proveedor WHERE idEntidad = @idEntidad AND numeroIdentificacion = @rucProv

	BEGIN TRY
		BEGIN TRAN
			IF EXISTS(SELECT 1 FROM Recepcion.Doc_Detalle_Temp cpt INNER JOIN @tmp t ON cpt.idComp = t.idComp)
				BEGIN
					DELETE FROM Recepcion.Doc_Detalle_Temp WHERE idComp = (SELECT TOP 1 idComp FROM @tmp)
					--DELETE FROM Recepcion.Doc_Impuesto_Temp WHERE idComp = (SELECT TOP 1 idComp FROM @tmp)
				END
			INSERT INTO Recepcion.Doc_Detalle_Temp(idComp, idProveedor, idArticulo, idMedida, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto, idUsuario, isCustom)
			SELECT idComp, @idProveedor, a.idArticulo, m.idMedida, t.codigoPrincipal, t.codigoAuxiliar, cantidad, t.descripcion, precioUnitario, descuento, precioTotalSinImpuesto, @idUsuario,1
			FROM @tmp t
			LEFT JOIN dbo.Articulo a ON a.codigo = t.codigoPrincipal AND a.idEntidad = @idEntidad
			LEFT JOIN dbo.Medida m ON a.idMedida = m.idMedida AND a.idEntidad = @idEntidad
			WHERE NOT EXISTS (SELECT * FROM Recepcion.Doc_Detalle_Temp tt 
			WHERE t.idComp = tt.idComp AND t.codigoPrincipal = tt.codigoPrincipal)

			UPDATE Recepcion.Doc_Impuesto_Temp SET codArticulo = (SELECT TOP 1 codigoPrincipal FROM @tmp) WHERE idComp = (SELECT TOP 1 idComp FROM @tmp)

		 --INSERT INTO Recepcion.Doc_Impuesto_Temp(idComp, codArticulo, codigo, codigoPorcentaje, tarifa, baseImponible, valor)
		 --SELECT (SELECT TOP 1 idComp FROM @tmp), codArticulo, codigo, codigoPorcentaje, tarifa, baseImponible, valor 
		 --FROM @taxes tt
		 --WHERE NOT EXISTS (SELECT * FROM Recepcion.Doc_Impuesto_Temp tti 
			--						WHERE tti.idComp = (SELECT TOP 1 idComp FROM @tmp) 
			--						AND tti.codArticulo = tt.codArticulo)


			SET @payload = (SELECT * FROM Recepcion.Doc_Detalle_Temp WHERE idcomp = (SELECT TOP 1 idComp FROM @tmp) FOR JSON AUTO) 

			SELECT '1' AS code, @payload AS payload, 'Detalle añadido correctamente'  as 'message'
			
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
