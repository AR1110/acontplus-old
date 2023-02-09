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
IF OBJECT_ID(N'FactElect.CompImpDetailTemp_Insert_All', N'P') IS NOT NULL
DROP PROCEDURE FactElect.CompImpDetailTemp_Insert_All 
GO
CREATE PROCEDURE FactElect.CompImpDetailTemp_Insert_All
@idRol INT
,@idComp UNIQUEIDENTIFIER
,@jsonData VARCHAR(MAX)
,@impuestos VARCHAR(MAX)
,@method VARCHAR(200) = NULL
AS
BEGIN
	SET NOCOUNT ON; 
	DECLARE @idUsuario INT
	DECLARE @idEntidad INT
	DECLARE @rucProv VARCHAR(20)
	DECLARE @idProveedor INT

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

	DECLARE @taxes TABLE(
	codArticulo VARCHAR(50)
	,codigo VARCHAR(50)
	,codigoPorcentaje VARCHAR(50)
	,tarifa VARCHAR(50)
	,baseImponible VARCHAR(50)
	,valor VARCHAR(50)
	)

	INSERT INTO @tmp(idComp, idArticulo, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto)
	SELECT @idComp, idArticulo, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto
	FROM OPENJSON(@jsonData) WITH (
	idArticulo INT '$.idArticulo'
	,codigoPrincipal VARCHAR(100) '$.codigoPrincipal'
	,codigoAuxiliar VARCHAR(100) '$.codigoAuxiliar'
	,cantidad VARCHAR(100) '$.cantidad'
	,descripcion VARCHAR(300) '$.descripcion'
	,precioUnitario VARCHAR(15) '$.precioUnitario'
	,descuento VARCHAR(15) '$.descuento'
	,precioTotalSinImpuesto VARCHAR(15) '$.precioTotalSinImpuesto'
	)

	INSERT INTO @taxes(codArticulo, codigo, codigoPorcentaje, tarifa, baseImponible, valor)
	SELECT codArticulo, codigo, codigoPorcentaje, tarifa, baseImponible, valor
	FROM OPENJSON(@impuestos) 
	WITH (
	codArticulo VARCHAR(100) '$.codArticulo'
	,codigo VARCHAR(100) '$.codigo'
	,codigoPorcentaje VARCHAR(100) '$.codigoPorcentaje'
	,tarifa VARCHAR(100) '$.tarifa'
	,baseImponible VARCHAR(300) '$.baseImponible'
	,valor VARCHAR(15) '$.valor'
	)

	IF NOT EXISTS (SELECT 1 FROM @tmp)
		BEGIN
			SELECT '0' code, 'No existe datos para registrar'as 'message'
			RETURN
		END
	
	SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM AFTDataRol(@idRol)

	SELECT @rucProv = rucEmisor  FROM FactElect.ComprobanteImportacion WHERE uniqueId = @idComp 

	SELECT TOP 1 @idProveedor = idProveedor FROM Proveedor WHERE idEntidad = @idEntidad AND numeroIdentificacion = @rucProv

	BEGIN TRY
		BEGIN TRAN
			--IF EXISTS(SELECT 1 FROM FactElect.CompImpDetailTemp cpt INNER JOIN @tmp t ON cpt.idComp = t.idComp)
			--	BEGIN
			--		DELETE FROM FactElect.CompImpDetailTemp WHERE idComp = (SELECT TOP 1 idComp FROM @tmp)
			--	END
			IF NOT EXISTS(SELECT 1 FROM FactElect.CompImpDetailTemp cpt INNER JOIN @tmp t ON cpt.idComp = t.idComp WHERE cpt.isCustom = 0)
				BEGIN
					INSERT INTO FactElect.CompImpDetailTemp(idComp, idProveedor, idArticulo, idMedida, codigoPrincipal, codigoAuxiliar
					, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto, idUsuario)
					SELECT idComp, @idProveedor, a.idArticulo, m.idMedida, t.codigoPrincipal, t.codigoAuxiliar
					,cantidad, t.descripcion, precioUnitario = CONVERT(VARCHAR, CAST((CAST(precioTotalSinImpuesto AS decimal(15,5)) / CAST(cantidad AS decimal(18,5))) AS numeric(18,5))), 0.00, precioTotalSinImpuesto, @idUsuario
					FROM @tmp t
					LEFT JOIN dbo.Articulo a ON a.codigo = t.codigoPrincipal AND a.idEntidad = @idEntidad
					LEFT JOIN dbo.Medida m ON a.idMedida = m.idMedida AND a.idEntidad = @idEntidad
					WHERE NOT EXISTS (SELECT * FROM FactElect.CompImpDetailTemp tt 
					WHERE t.idComp = tt.idComp AND t.codigoPrincipal = tt.codigoPrincipal)

					 INSERT INTO FactElect.CompImp_Imp_Temp(idComp, codArticulo, codigo, codigoPorcentaje, tarifa, baseImponible, valor)
					 SELECT (SELECT TOP 1 idComp FROM @tmp), codArticulo, codigo, codigoPorcentaje, tarifa, baseImponible, valor 
					 FROM @taxes tt
					 WHERE NOT EXISTS (SELECT * FROM FactElect.CompImp_Imp_Temp tti 
												WHERE tti.idComp = (SELECT TOP 1 idComp FROM @tmp) 
												AND tti.codArticulo = tt.codArticulo)
				END
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
