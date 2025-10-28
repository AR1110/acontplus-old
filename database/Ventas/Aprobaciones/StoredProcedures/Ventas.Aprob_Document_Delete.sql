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
CREATE OR ALTER PROCEDURE Ventas.Aprob_Document_Delete @idUsuarioRol INT, @id INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEstadoDocumento INT
	DECLARE @idUsuario INT
	DECLARE @docOrigen VARCHAR(5) 

	BEGIN TRY 
        --> Variables
		SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol

		SELECT @docOrigen = td.codigo 
        FROM Ventas.Aprob_Document   ad WITH (NOLOCK)
        INNER JOIN dbo.TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento = ad.idTipoDocOrigen 
        WHERE idAprob_Document = @id

		SELECT @idEstadoDocumento = idEstadoPago FROM dbo.EstadoPago WHERE codigo = 'A'

        --> Validation
        IF EXISTS (SELECT 1 FROM Ventas.Aprob_Document ad WITH (NOLOCK) 
                             INNER JOIN dbo.EstadoPago ep WITH (NOLOCK) ON ep.idEstadoPago = ad.idEstadoDocumento
                   WHERE ad.idAprob_Document = @id 
                     AND ep.codigo = 'APR')
            BEGIN
                SELECT '0'code,'Este documento esta Aprobado no puede ser anulado.' as 'message'
				RETURN
            END 

		BEGIN TRAN 
			
			UPDATE Ventas.Aprob_Document SET idEstadoDocumento = @idEstadoDocumento,UpdatedByUserId = @idUsuario ,UpdatedAt = GETDATE()  WHERE idAprob_Document = @id
			
			IF @docOrigen = 'NE'
				BEGIN
					
					DECLARE @idDocumento AS INT

					DECLARE cursor_inventory CURSOR LOCAL FOR
					SELECT dt.idNotaEntrega FROM Ventas.Aprob_Document_Hist dt
				    WHERE dt.idAprob_Document = @id

					
					UPDATE dbo.NotaEntrega WITH (ROWLOCK) SET convertToDoc = 0
                    WHERE idNotaEntrega IN (
                                              SELECT dt.idNotaEntrega FROM Ventas.Aprob_Document_Hist dt WHERE dt.idAprob_Document = @id  
                                           )


					OPEN cursor_inventory

						FETCH NEXT FROM cursor_inventory INTO @idDocumento

						WHILE @@FETCH_STATUS = 0
							BEGIN
								--tipo transaccion  salidas
								--tipo documento  NotaEntrega
								EXEC Inventario.Transaccion_Update 'S','NE',@idDocumento,1
								FETCH NEXT FROM cursor_inventory INTO @idDocumento
							END
					CLOSE cursor_inventory
					DEALLOCATE cursor_inventory 

				END 

			IF @docOrigen = 'PR'
				BEGIN
                    SELECT TOP 1 @idEstadoDocumento = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'AC'

					UPDATE dbo.Proforma SET idEstadoDocumento = @idEstadoDocumento
                    WHERE idProforma IN (
                                            SELECT dt.idProforma FROM Ventas.Aprob_Document_Hist dt WHERE dt.idAprob_Document = @id  
                                        )
				END 

		COMMIT TRAN 
		SELECT '1'code,'Anulado Correctamente' as 'message'
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END

		SELECT '0'code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as  'message'

		INSERT INTO ErroresSistema
		    (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Aprobacion/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario 
	END CATCH 

END
GO
