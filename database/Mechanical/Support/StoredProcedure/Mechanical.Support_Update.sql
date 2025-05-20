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
-- Author:		Alexis Ramirez
-- Create date: 8/15/2023
-- Description:	for the management of all data related to the vehicle.
-- =============================================
CREATE OR ALTER PROCEDURE Mechanical.Support_Update @userRoleId INT,@id INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    --> Global  
	DECLARE @tipo INT ,@CompanyId INT ,@userId INT


    DECLARE @tbSupport AS TABLE (
        Id INT UNIQUE NOT NULL
       ,[Date] DATETIME2 NOT NULL
       ,VehicleCompanyId INT NOT NULL
       ,CustomerId INT NOT NULL
       ,UserAssignedId INT NOT NULL
       ,Obs VARCHAR(300) NOT NULL
    )

	BEGIN TRY 
        --> VARIABLES GLOBALES
        SELECT TOP 1 @userId = idUsuario, @CompanyId = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
        

        --> SAVING THE JSON DATA 
        INSERT INTO @tbSupport
               (Id,vehicleCompanyId,CustomerId,userAssignedId,Obs,[date])
        SELECT @id,vehicleCompanyId,CustomerId,userAssignedId,Obs,[date]
        FROM OPENJSON(@json) WITH 
        (
            puntoEmisionId   INT 
           ,vehicleCompanyId INT 
           ,customerId       INT 
           ,supportTypeId    INT 
           ,userAssignedId   INT 
           ,obs              VARCHAR(300) 
           ,[date]           DATETIME2
        )

        --> VALIDATION OF INFORMATION 
        IF (SELECT COUNT(*) FROM @tbSupport) = 0
            BEGIN
                SELECT '0' as code, 'Error en la informacion del soporte' as 'message'
                RETURN
            END 

        IF EXISTS (SELECT 1 FROM Mechanical.v_Support WHERE Id = @id AND codeStatus NOT IN ('PE'))
            BEGIN
                SELECT '0' as code, 'El soporte no puede ser editado' as 'message'
                RETURN 
            END

        --> TRANSACTION 
		BEGIN TRAN
            --> CUSTOMER RECORD 
            UPDATE sp WITH (ROWLOCK)
               SET sp.[Date]             = ts.[Date]
                  ,sp.[VehicleCompanyId] = ts.VehicleCompanyId
                  ,sp.[CustomerId]       = ts.CustomerId
                  ,sp.[UserAssignedId]   = ts.UserAssignedId
                  ,sp.Obs                = ts.Obs
                  ,sp.[UpdatedAt]        = GETDATE()
            FROM [Mechanical].[Support] sp
            INNER JOIN @tbSupport       ts ON ts.Id = sp.Id

		COMMIT TRAN 
        SELECT '1' as code, 'Éxitos al Editar' as 'message'
	END TRY 

	BEGIN CATCH
        IF (@@TRANCOUNT > 0) 
            BEGIN 
                ROLLBACK TRAN
            END 

        INSERT INTO ErroresSistema
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'Support/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),dbo.ufnGetDateEcuador(),@userId
	         
        SELECT '0' as code, 'Error en el procedimiento' as 'message'
    END CATCH  
END
GO

