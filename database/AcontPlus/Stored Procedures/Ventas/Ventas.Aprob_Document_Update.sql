USE [AcontPlus]
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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Ventas.Aprob_Document_Update', N'P') IS NOT NULL
DROP PROCEDURE Ventas.Aprob_Document_Update 
GO
CREATE PROCEDURE Ventas.Aprob_Document_Update 
	@idRol INT
   ,@id INT
   ,@jsonHeader VARCHAR(MAX)
   ,@jsonDetail VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 
	DECLARE @idUsuario INT
	DECLARE @uniqueId VARCHAR(150)

	DECLARE @fechaEmision DATETIME
	DECLARE @observacion VARCHAR(300)
	DECLARE @identificacionComprador VARCHAR(20)
    DECLARE @codDoc VARCHAR(5) = '01'
    DECLARE @estab VARCHAR(5)
    DECLARE @ptoEmi VARCHAR(5)
    DECLARE @ruc VARCHAR(20)
    DECLARE @ambiente VARCHAR(5)
    DECLARE @tipoEmision VARCHAR(5) = '1'
    DECLARE @secuencial INT
    DECLARE @claveAcceso VARCHAR(50)
	DECLARE @totalSinImpuestos DECIMAL(20,5)
	DECLARE @totalDescuento DECIMAL(20,5)
	DECLARE @totalConImpuestos DECIMAL(20,5)
	DECLARE @propina DECIMAL(20,5)
	DECLARE @importeTotal DECIMAL(20,5)

	BEGIN TRY 
		SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idRol

		SELECT @ruc = ruc FROM dbo.Entidad WHERE idEntidad = @idEntidad

		SELECT 
			@uniqueId    = uniqueId
		   ,@secuencial  = secuencial 
		   ,@estab       = estab
		   ,@ptoEmi      = ptoEmi
		   ,@ambiente    = ambiente
		FROM Ventas.Aprob_Document WHERE idAprob_Document = @id

		SELECT	
			@observacion             = dt.observacion
		   ,@identificacionComprador = cl.numeroIdentificacion
		   ,@fechaEmision            = dt.fechaEmision
		   ,@totalSinImpuestos       = dt.subTotalSinImpuestos
		   ,@totalDescuento          = dt.totalDescuento 
		   ,@totalConImpuestos       = dt.total 
		   ,@propina                 = dt.propina
		   ,@importeTotal            = dt.total
		FROM Helper.F_DeserializeDocument_header(@jsonHeader) dt 
		INNER JOIN dbo.Cliente cl ON cl.idCliente = dt.idCliente 

		SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab)
													   ,@codDoc
													   ,CAST(@ambiente as nvarchar)
													   ,@tipoEmision
													   ,dbo.AFTConvertDate(@fechaEmision)
													   ,@ruc
													   ,@estab+@ptoEmi
													   ,dbo.AFTAutoComplete(@secuencial))


   
		IF @claveAcceso IS NULL
			BEGIN
				SELECT '0'code,'Error critico la clave de Acceso no se genero correctamente' as 'message'
				RETURN 
			END 

		IF EXISTS (SELECT 1 FROM Ventas.Aprob_Document wHERE claveAcceso = @claveAcceso AND idAprob_Document != @id)
			BEGIN
				SELECT '0'code,'Esta clave de acceso ya se encuentra registrada' as 'message'
				RETURN
			END 

		BEGIN TRAN 
			UPDATE Ventas.Aprob_Document SET 
				fechaEmision            = @fechaEmision
			   ,identificacionComprador = @identificacionComprador
			   ,claveAcceso             = @claveAcceso
			   ,totalSinImpuestos       = @totalSinImpuestos
			   ,totalDescuento          = @totalDescuento 
	           ,totalConImpuestos       = @totalConImpuestos 
	           ,propina                 = @propina
	           ,importeTotal            = @importeTotal
			   ,observacion             = @observacion 
			WHERE idAprob_Document = @id

			DELETE FROM Ventas.Aprob_Document_Detailt WHERE uniqueId = @uniqueId

			INSERT INTO Ventas.Aprob_Document_Detailt(
				uniqueId
			   ,codArticulo
			   ,idTarifa
			   ,codMedida
			   ,codigoPrincipal
			   ,codigoAuxiliar
			   ,cantidad
			   ,descripcion
			   ,precioUnitario
			   ,descuento
			   ,precioTotalSinImpuesto
			   ,codigo
			   ,codigoPorcentaje
			   ,tarifa
			   ,baseImponible
			)
			SELECT 
			    @uniqueId
			   ,a.code_unique
			   ,dt.idTarifa
			   ,m.codigo
			   ,a.codigo
			   ,a.codigoAuxiliar
			   ,dt.cantidad
			   ,dt.descripcion
			   ,dt.precioUnitario
			   ,dt.valorDescuento
			   ,dt.precioTotalSinImpuesto
			   ,i.codigo
			   ,ti.codigoPorcentaje
			   ,ti.porcentaje
			   ,dt.precioTotalSinImpuesto
			FROM Helper.F_DeserializeDocument_Detail(@jsonDetail) dt
			LEFT JOIN dbo.Articulo a ON a.idArticulo = dt.idArticulo
			LEFT JOIN dbo.TipoIva ti ON ti.idTipoIva = dt.idTipoIva
			LEFT JOIN dbo.Impuesto i ON i.idImpuesto = ti.idImpuesto
			LEFT JOIN dbo.Medida   m ON m.idMedida   = dt.idMedida

		COMMIT TRAN 
		SELECT '1'code,'Actualizado Correctamente' as 'message'
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END
			SELECT '0'code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as  'message'
			INSERT INTO ErroresSistema
					(token
					,method
					,errorNumber
					,errorSeverity 
					,errorState
					,errorProcedure
					,errorLine
					,errorMessage
					,errorDate
					,idUsuario)
			VALUES
					(NEWID()
					,'/Aprobacion/Update'
					,ERROR_NUMBER()
					,ERROR_SEVERITY()
					,ERROR_STATE()
					,ERROR_PROCEDURE()
					,ERROR_LINE()
					,ERROR_MESSAGE()
					,GETDATE()
					,@idUsuario)
	END CATCH 

END
GO
