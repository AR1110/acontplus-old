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
CREATE OR ALTER PROCEDURE Mechanical.Support_Insert @userRoleId INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global  
	DECLARE @tipo INT ,@Id INT ,@CompanyId INT ,@userId INT

    --> Support
    DECLARE @Sequence INT ,@VehicleCompanyId INT ,@PuntoEmisionId INT ,@SupportStatusId INT ,@TipoDocumentoId INT


    DECLARE @tbSupport AS TABLE (
        PuntoEmisionId INT NOT NULL
       ,[Date] DATETIME2 NOT NULL
       ,VehicleCompanyId INT NOT NULL
       ,CustomerId INT NOT NULL
       ,UserAssignedId INT NOT NULL
       ,Obs VARCHAR(300) NOT NULL
       ,Discount NUMERIC(15,5) NOT NULL DEFAULT 0
       ,Total NUMERIC(15,5) NOT NULL DEFAULT 0
    )

	BEGIN TRY 
        --> Variables Globales
        SELECT TOP 1 @userId = idUsuario, @CompanyId = idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		--> SAVING THE JSON DATA    
        INSERT INTO @tbSupport
              (puntoEmisionId,vehicleCompanyId,CustomerId,userAssignedId,Obs,[date])
        SELECT puntoEmisionId,vehicleCompanyId,CustomerId,userAssignedId,Obs,[date]
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

        --> RUPERERATING IN VARIABLES 

        SELECT TOP 1 @PuntoEmisionId = PuntoEmisionId FROM @tbSupport 

        SELECT TOP 1 @SupportStatusId = Id from Mechanical.SupportStatus WITH (NOLOCK) WHERE Code = 'PE'

        SELECT TOP 1 @TipoDocumentoId = idTipoDocumento FROM dbo.TipoDocumento WHERE codigo = 'SM'

        SELECT TOP 1 @Sequence = ultimaSecuencia FROM dbo.ConfiguracionDocumento WITH (NOLOCK) WHERE idPuntoEmision = @PuntoEmisionId AND idTipoDocumento = @TipoDocumentoId 
            
        --> VALIDATION OF INFORMATION
        IF (SELECT COUNT(*) FROM @tbSupport) = 0
            BEGIN
                SELECT [Common].[ufnSpResponse]('0', 'Error en la informacion del soporte', NULL)
                RETURN
            END 

        IF @Sequence IS NULL
            BEGIN
                SELECT [Common].[ufnSpResponse]('0', 'No tiene una configarion de secuencial', NULL)
                RETURN
            END 

        IF EXISTS (SELECT 1 FROM Mechanical.Support WITH (NOLOCK) WHERE PuntoEmisionId = @PuntoEmisionId AND [Sequence] = @Sequence)
            BEGIN
                SELECT [Common].[ufnSpResponse]('0', 'Secuencial Registrado', NULL)
                RETURN
            END 
            
        --> TRANSACTION 
		BEGIN TRAN
               
            INSERT INTO [Mechanical].[Support]
                  (PuntoEmisionId,[Date],[Sequence],VehicleCompanyId,CustomerId ,CompanyId ,UserId,UserAssignedId,Obs,Total,Discount,SupportStatusId)
            SELECT PuntoEmisionId,[Date],@Sequence, VehicleCompanyId,CustomerId,@CompanyId,@UserId,UserAssignedId,Obs,Total,Discount,@SupportStatusId 
            FROM @tbSupport

			SELECT @Id = SCOPE_IDENTITY()

		COMMIT TRAN 
        SELECT [Common].[ufnSpResponse]('1', 'Éxitos al guardar', NULL)
	END TRY 

	BEGIN CATCH
        IF (@@TRANCOUNT > 0) 
            BEGIN 
                ROLLBACK TRAN
            END 

        INSERT INTO ErroresSistema
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'Support/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),dbo.ufnGetDateEcuador(),@userId
	         
        SELECT [Common].[ufnSpResponse]('0', 'Error en el procedimiento', NULL)
    END CATCH 
END
GO

