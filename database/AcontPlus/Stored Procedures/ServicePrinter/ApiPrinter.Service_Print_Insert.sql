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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'ApiPrinter.Service_Print_Insert', N'P') IS NOT NULL
DROP PROCEDURE ApiPrinter.Service_Print_Insert
GO
CREATE PROCEDURE ApiPrinter.Service_Print_Insert @idRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	------DATA JSON PARAMETER-------------
	DECLARE @idDocument INT
	DECLARE @idTipoDocumento INT
	DECLARE @codEstab VARCHAR(50)
	DECLARE @nroIdentificacion VARCHAR(15)
	DECLARE @codDoc VARCHAR(5)
	------------END---------------------

	--------PARAMETER MANAGEMENT----------
	DECLARE @idUsuario INT
	DECLARE @SP VARCHAR(MAX)
    DECLARE @idImpresora INT
	DECLARE @ruc VARCHAR(15)
	DECLARE @rdlcProps VARCHAR(MAX)
	DECLARE @dataSources VARCHAR(MAX)
    DECLARE @estab VARCHAR(5)
	DECLARE @invoice VARCHAR(15) = 'Factura'
	DECLARE @note VARCHAR(15) = 'NotaEntrega'
	DECLARE @identificacion VARCHAR(15)
	------------END-----------------------
	
	-----DATA PRINTER SERVICE------
	DECLARE @printerName VARCHAR(100)
	DECLARE @computerName VARCHAR(100)
    DECLARE @printer VARCHAR(150)
    DECLARE @isThermal BIT
    DECLARE @format VARCHAR(200)
    DECLARE @deviceInfo VARCHAR(max)
    DECLARE @copyPrint INT
	-------------END----------------

	BEGIN TRY	
		

		SELECT @codEstab          = codEstab 
			  ,@idDocument        = idDocument
			  ,@codDoc            = codDoc
			  ,@nroIdentificacion = nroIdentificacion
			  ,@idTipoDocumento   = idTipoDocumento
		FROM OPENJSON(@json) 
		WITH (idDocument        INT          '$.idDocument'
		     ,idTipoDocumento   INT			 '$.idTipoDocumento'
			 ,codEstab          VARCHAR(50)  '$.codEstab'
			 ,codDoc            VARCHAR(5)   '$.codDoc'
			 ,nroIdentificacion VARCHAR(15)  '$.nroIdentificacion')

		SELECT @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

		SELECT @identificacion = nroIdentificacion FROM dbo.Usuario WITH (NOLOCK) WHERE idUsuario = @idUsuario

		SELECT  @ruc = ruc, @estab = estab FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab

		
		IF NOT EXISTS (SELECT 1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab)
			BEGIN
				SELECT '0' code,'No tienes ninguna impresora configurada' as 'message'
				RETURN 
			END 

		IF EXISTS (SELECT 1 FROM ApiPrinter.Service_Printer_Document WHERE idTipoDocumento = @idTipoDocumento AND idComprobante = @idDocument)
			BEGIN
				SELECT '0' code,'El documento se encuentra imprimiendo' as 'message'
				RETURN 
			END


		IF EXISTS (SELECT  1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab  AND predeterminada = 1 AND nroIdentificacion = @nroIdentificacion)
			BEGIN
				IF @identificacion != @nroIdentificacion
					BEGIN
						SELECT '0' code,'Tu configuracion esta por usuario no puedes imprimir facturas de otro vendedor' as 'message'
						RETURN
					END 

				IF EXISTS (SELECT 1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab  AND predeterminada = 1 AND nroIdentificacion = @nroIdentificacion AND codDoc = @codDoc)
					BEGIN
						SELECT TOP 1 
							@idImpresora = idImpresora 
						FROM ApiPrinter.Impresora WITH (NOLOCK)
						WHERE codEstab          = @codEstab 
						  AND predeterminada    = 1 
						  AND nroIdentificacion = @nroIdentificacion 
						  AND codDoc            = @codDoc

					END 

			    IF EXISTS (SELECT 1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab  AND predeterminada = 1 AND nroIdentificacion = @nroIdentificacion AND codDoc = 'A')
					BEGIN
						SELECT TOP 1 @idImpresora = idImpresora 
						FROM ApiPrinter.Impresora WITH (NOLOCK)
						WHERE codEstab          = @codEstab 
						  AND predeterminada    = 1 
						  AND nroIdentificacion = @nroIdentificacion 
						  AND codDoc            = 'A'
					END 
			END 

		IF NOT EXISTS (SELECT  1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab  AND predeterminada = 1 AND nroIdentificacion = @nroIdentificacion)
			BEGIN
				IF EXISTS (SELECT 1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab  AND predeterminada = 1 AND codDoc = @codDoc)
					BEGIN
						SELECT TOP 1 @idImpresora = idImpresora 
						FROM ApiPrinter.Impresora WITH (NOLOCK)
						WHERE codEstab          = @codEstab 
						  AND predeterminada    = 1 
						  AND codDoc            = @codDoc

					END 

			    IF EXISTS (SELECT 1 FROM ApiPrinter.Impresora WHERE codEstab = @codEstab  AND predeterminada = 1 AND codDoc = 'A')
					BEGIN
						SELECT TOP 1 @idImpresora = idImpresora 
						FROM ApiPrinter.Impresora WITH (NOLOCK)
						WHERE codEstab          = @codEstab 
						  AND predeterminada    = 1 
						  AND codDoc            = 'A'
					END 
			END 

		IF @idImpresora IS NULL	
			BEGIN
				SELECT '0'code,'No tienes configurado una impresora' as 'message'
				RETURN 
			END

		SELECT TOP 1
			 @printerName  = i.nombreImpresora
			,@computerName = i.nombreEquipo 
			,@printer      = ti.descripcion
			,@isThermal    = ti.isThermal
			,@format       = ti.formato
			,@deviceInfo   = ti.deviceInfo
			,@copyPrint    = cd.copyPrint
		FROM ApiPrinter.Config_Document cd WITH (NOLOCK)
		INNER JOIN ApiPrinter.Impresora      i WITH (NOLOCK) ON i.idImpresora      = cd.idImpresora
		INNER JOIN ApiPrinter.TipoImpresora ti WITH (NOLOCK) ON ti.idTipoImpresora = i.idTipoImpresora
		WHERE cd.idImpresora = @idImpresora 
		  AND cd.estado = 1

		SELECT  @dataSources = dataSources FROM ApiPrinter.Document_Data(@idDocument,@idTipoDocumento,@codDoc)

		SET @rdlcProps = (SELECT rdlcName = IIF(@codDoc = 'FV',@invoice,@note)+@printer+'.rdl'
								,printerName = @printerName	 
								,isThermal =@isThermal
								,'format' = @format
								,deviceInfo = @deviceInfo
						  FOR JSON PATH
						  ) 

		BEGIN TRAN 
			INSERT INTO [ApiPrinter].[Service_Printer_Document](
				 idService_Printer_Document
				,numEstab
				,ruc
				,computerName
				,idUser
				,idTipoDocumento
				,idComprobante
				,rdlcProps
				,dataSources
				,fechaRegistro
			   )
			SELECT 
			    NEWID()
			   ,@estab
			   ,@ruc
			   ,@computerName
			   ,@nroIdentificacion
			   ,@idTipoDocumento
			   ,@idDocument
			   ,@rdlcProps
			   ,@dataSources
			   ,dbo.ufnGetDateEcuador()
		COMMIT TRAN 
		SELECT '1'code,'Imprimiendo....' as 'message'
		RETURN 
	END TRY 

	BEGIN CATCH
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		SELECT '0' code,'Error en el procedimiento'+ ERROR_MESSAGE() as 'message'
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
					,'/Aprobacion/Insert'
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
