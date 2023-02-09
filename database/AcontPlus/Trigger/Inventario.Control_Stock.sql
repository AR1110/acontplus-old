-- ================================================
-- Template generated from Template Explorer using:
-- Create Trigger (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- See additional Create Trigger templates for more
-- examples of different Trigger statements.
--
-- This block of comments will not be included in
-- the definition of the function.
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
--DROP TRIGGER Inventario.Control_Stock
--GO
CREATE TRIGGER Inventario.Control_Stock  ON Inventario.ControlStock FOR INSERT 
AS 
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	BEGIN TRY 
		BEGIN TRAN 
			UPDATE a SET a.stock = dbo.AFTStockArticulo(a.idArticulo) FROM Articulo a INNER JOIN Inventario.ControlStock cs ON cs.idArticulo = a.idArticulo

			UPDATE Inventario.ControlStock SET estado = 'PR' 

			DELETE Inventario.ControlStock WHERE estado = 'PR'
		COMMIT TRAN 
	END TRY 
	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		INSERT INTO ErroresSistema(token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Trigger/UpdateStock',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),1
	END CATCH 

END
GO
