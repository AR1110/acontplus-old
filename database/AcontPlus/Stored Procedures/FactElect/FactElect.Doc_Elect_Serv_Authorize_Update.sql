USE ACONTPLUS
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
IF OBJECT_ID(N'FactElect.Doc_Elect_Serv_Authorize_Update', N'P') IS NOT NULL
DROP PROCEDURE FactElect.Doc_Elect_Serv_Authorize_Update 
GO
CREATE PROCEDURE FactElect.Doc_Elect_Serv_Authorize_Update
	@id INT
   ,@codEstado INT
   ,@xmlSri XML 
   ,@dateAutorized VARCHAR(100)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @codDoc VARCHAR(5)
	DECLARE @dateAuth DATETIME
	DECLARE @idDocumento INT
	DECLARE @receptor VARCHAR(300)
	,@versionComp VARCHAR(5)

	SELECT @codDoc = codDoc, @idDocumento = idDocumento, @versionComp = versionComp FROM dbo.DocumentoElectronico WHERE idDocumentoElectronico = @id

	SET @dateAuth = (SELECT CONVERT(datetime2(0), @dateAutorized))
	
	BEGIN TRY 
		BEGIN TRAN 

			IF @codEstado = 4
				BEGIN

					UPDATE dbo.DocumentoElectronico SET 
						codEstado = @codEstado
					   ,fechaAutorizacion =  @dateAuth
					   ,xmlSri = @xmlSri
					WHERE idDocumentoElectronico = @id

					IF @codDoc = '01'
						BEGIN 
							SELECT @receptor = cl.correo FROM Factura f INNER JOIN dbo.Cliente cl ON cl.idCliente = f.idCliente WHERE f.idFactura = @idDocumento

							UPDATE Factura SET 
								 fechaAutorizacion = @dateAuth
								,autorizada = 1
							WHERE idFactura = @idDocumento AND estado = 1
						END

					IF @codDoc = '03'
						BEGIN
							SELECT @receptor = pr.correo FROM dbo.LiquidacionCompra lc INNER JOIN dbo.Proveedor pr ON pr.idProveedor = lc.idProveedor WHERE lc.idLiquidacionCompra = @idDocumento

							UPDATE LiquidacionCompra SET 
								 fechaAutorizacion = @dateAuth
								,autorizada = 1
							WHERE idLiquidacionCompra = @idDocumento AND estado = 1
						END 

					IF @codDoc = '04'
						BEGIN
							
							SELECT @receptor = cl.correo FROM NotaCredito nc INNER JOIN dbo.Cliente cl ON cl.idCliente = nc.idCliente WHERE nc.idNotaCredito = @idDocumento

							UPDATE NotaCredito SET 
									 fechaAutorizacion = @dateAuth
									,autorizada = 1
							WHERE idNotaCredito = @idDocumento
							AND estado = 1
						END
			 
					IF @codDoc = '06'
						BEGIN 
							SELECT @receptor = cl.correo FROM GuiaRemision gr INNER JOIN dbo.Cliente cl ON cl.idCliente = gr.idCliente WHERE gr.idGuiaRemision = @idDocumento

							UPDATE GuiaRemision SET 
								 fechaAutorizacion = @dateAuth
								,autorizada = 1
							WHERE idGuiaRemision = @idDocumento AND estado = 1
							AND estado = 1
						END 

					IF @codDoc = '07'
						BEGIN
							IF @versionComp = '1.0.0'
								BEGIN
									SELECT @receptor = pr.correo FROM dbo.RetencionCompra rc INNER JOIN dbo.Proveedor pr ON pr.idProveedor = rc.idProveedor WHERE rc.idRetencionCompra = @idDocumento

									UPDATE RetencionCompra SET 
										 fechaAutorizacionSri = @dateAuth
										,autorizada = 1
									WHERE idRetencionCompra = @idDocumento AND estado = 1
								END

							IF @versionComp = '2.0.0'
								BEGIN
									SELECT @receptor = pr.correo FROM FactElect.RetencionAts rc INNER JOIN dbo.Proveedor pr ON pr.idProveedor = rc.idProveedor WHERE rc.idRetencionAts = @idDocumento

									--UPDATE RetencionCompra SET 
									--	 fechaAutorizacionSri = @dateAuth
									--	,autorizada = 1
									--WHERE idRetencionCompra = @idDocumento AND estado = 1
								END
						END

					IF @receptor IS NOT NULL
						BEGIN
							INSERT INTO FactElect.NotificacionTributaria (idDocumentoElectronico,receptor,fechaRegistro,estado)
							SELECT @id,REPLACE(@receptor,';',','),dbo.ufnGetDateEcuador(),'NE'
						END
				END 
			ELSE 
				BEGIN
					UPDATE dbo.DocumentoElectronico SET codEstado = @codEstado WHERE idDocumentoElectronico = @id
				END 

		COMMIT TRAN 
	END TRY 

	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), '/ServiceAutorizer', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), 1)
	END CATCH 
END
GO
