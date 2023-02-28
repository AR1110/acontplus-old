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
	idDocumento INT NOT NULL
	,idArticulo INT NULL
	,codigo VARCHAR(100) NOT NULL
	,codigoPorcentaje VARCHAR(100) NOT NULL
	,valor VARCHAR(15) NOT NULL
	,codigoPrincipal VARCHAR(100) NOT NULL
	,codigoAuxiliar VARCHAR(100) NULL
	,cantidad VARCHAR(100) NOT NULL
	,descripcion VARCHAR(300) NOT NULL
	,precioUnitario VARCHAR(15) NOT NULL
	,descuento VARCHAR(15) NULL
	,precioTotalSinImpuesto VARCHAR(15) NULL
	)

	INSERT INTO @tmp(idDocumento, idArticulo, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto, codigo, codigoPorcentaje, valor)
	SELECT idDocumento, idArticulo, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto, codigo, codigoPorcentaje, valor
	FROM OPENJSON(@jsonData) WITH (idDocumento INT
	,idArticulo INT '$.idArticulo'
	,codigoPrincipal VARCHAR(100) '$.codigoPrincipal'
	,codigoAuxiliar VARCHAR(100) '$.codigoAuxiliar'
	,cantidad VARCHAR(100) '$.cantidad'
	,descripcion VARCHAR(300) '$.descripcion'
	,precioUnitario VARCHAR(15) '$.precioUnitario'
	,descuento VARCHAR(15) '$.descuento'
	,precioTotalSinImpuesto VARCHAR(15) '$.precioTotalSinImpuesto'
	,codigo VARCHAR(15) '$.codigo'
	,codigoPorcentaje VARCHAR(15) '$.codigoPorcentaje' 
	,valor VARCHAR(15) '$.valor' 
	)

	IF NOT EXISTS (SELECT 1 FROM @tmp)
		BEGIN
			SELECT '0' code, 'No existe datos para registrar'as 'message'
			RETURN
		END
	
	SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM AFTDataRol(@idRol)

	SELECT @rucProv = rucEmisor  FROM Recepcion.DocumentoRecibido WHERE idDocumento = (SELECT TOP 1 idDocumento FROM @tmp) 

	SELECT TOP 1 @idProveedor = idProveedor FROM Proveedor WHERE idEntidad = @idEntidad AND numeroIdentificacion = @rucProv

	BEGIN TRY
		BEGIN TRAN
			IF EXISTS(SELECT 1 FROM Recepcion.Doc_Detalle_Temp cpt INNER JOIN @tmp t ON cpt.idDocumento = t.idDocumento)
				BEGIN
					DELETE FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = (SELECT TOP 1 idDocumento FROM @tmp)
					--DELETE FROM Recepcion.Doc_Impuesto_Temp WHERE idDocumento = (SELECT TOP 1 idDocumento FROM @tmp)
				END
			INSERT INTO Recepcion.Doc_Detalle_Temp(idDocumento, idProveedor, idArticulo, idMedida, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, costoNeto, descuento, precioTotalSinImpuesto, idUsuario, isCustom)
			SELECT idDocumento, @idProveedor, a.idArticulo, m.idMedida, t.codigoPrincipal, t.codigoAuxiliar, cantidad, t.descripcion, precioUnitario, precioUnitario, descuento, precioTotalSinImpuesto, @idUsuario,1
			FROM @tmp t
			LEFT JOIN dbo.Articulo a ON a.codigo = t.codigoPrincipal AND a.idEntidad = @idEntidad
			LEFT JOIN dbo.Medida m ON a.idMedida = m.idMedida AND a.idEntidad = @idEntidad
			WHERE NOT EXISTS (SELECT * FROM Recepcion.Doc_Detalle_Temp tt 
			WHERE t.idDocumento = tt.idDocumento AND t.codigoPrincipal = tt.codigoPrincipal)

			--UPDATE Recepcion.Doc_Impuesto_Temp SET codArticulo = (SELECT TOP 1 codigoPrincipal FROM @tmp) WHERE idDocumento = (SELECT TOP 1 idDocumento FROM @tmp)

			IF EXISTS(SELECT 1 FROM Recepcion.Doc_Impuesto_Temp WHERE idDocumento = (SELECT TOP 1 idDocumento FROM @tmp))
				BEGIN
					DELETE FROM Recepcion.Doc_Impuesto_Temp WHERE idDocumento = (SELECT TOP 1 idDocumento FROM @tmp)
				END

			INSERT INTO Recepcion.Doc_Impuesto_Temp(idDocumento, codArticulo, codigo, codigoPorcentaje, tarifa, baseImponible, valor)
			SELECT (SELECT TOP 1 idDocumento FROM @tmp), t.codigoPrincipal, t.codigo, t.codigoPorcentaje, ti.porcentaje, t.precioUnitario, t.valor 
			FROM @tmp t
			LEFT JOIN dbo.Articulo a ON a.codigo = t.codigoPrincipal AND a.idEntidad = @idEntidad
			LEFT JOIN Sri.TarifaImpuesto ti ON t.codigo = ti.codImpuesto AND t.codigoPorcentaje = ti.codigo
			LEFT JOIN dbo.Medida m ON a.idMedida = m.idMedida AND a.idEntidad = @idEntidad
			--WHERE NOT EXISTS (SELECT * FROM Recepcion.Doc_Detalle_Temp tt 
			--WHERE t.idDocumento = tt.idDocumento AND t.codigoPrincipal = tt.codigoPrincipal)


			SET @payload = (SELECT * FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = (SELECT TOP 1 idDocumento FROM @tmp) FOR JSON AUTO) 

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
