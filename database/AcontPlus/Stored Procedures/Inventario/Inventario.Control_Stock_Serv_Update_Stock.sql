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
USE [AcontPlus]
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Inventario.Control_Stock_Serv_Update_Stock', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Control_Stock_Serv_Update_Stock 
GO
CREATE PROCEDURE Inventario.Control_Stock_Serv_Update_Stock @idControlStock INT,@idArticulo INT, @stock DECIMAL(15,5)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	BEGIN TRY 
		BEGIN TRAN 
			UPDATE dbo.Articulo SET stock = @stock WHERE idArticulo = @idArticulo

			DELETE FROM Inventario.ControlStock WHERE idControlStock = @idControlStock

		COMMIT TRAN 
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT ERROR_MESSAGE() as 'message'
	END CATCH

END
GO
