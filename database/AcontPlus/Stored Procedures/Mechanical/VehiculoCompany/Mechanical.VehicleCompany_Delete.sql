USE [Acontplus]
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
CREATE OR ALTER PROCEDURE Mechanical.VehicleCompany_Delete
	@userRoleId INT,
    @id INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    BEGIN TRY 
        BEGIN TRAN 
            UPDATE Mechanical.VehicleCompany SET Deleted = 1,[Enabled] = 0, UpdatedAt = GETDATE() WHERE Id = @id
        COMMIT TRAN 
        SELECT dbo.ufn_spresponse('1', 'Eliminado Correctamente', NULL)
    END TRY 

    BEGIN CATCH 
        SELECT dbo.ufn_spresponse('0', 'Error al Actualizar el Vehículo', NULL)
        
        IF (@@TRANCOUNT > 0)
            BEGIN 
                ROLLBACK TRAN
            END 
    END CATCH 
END
GO
