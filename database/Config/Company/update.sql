USE Acontplus
GO
/****** Object:  StoredProcedure [App].[aspEntidad_Insert]    Script Date: 10/7/2022 11:49:46 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-04
-- Description:	Proceso Almacenado para registrar las entidades
-- =============================================
CREATE OR ALTER PROCEDURE [Config].[Company_Update] @UserRoleId INT ,@Id INT ,@Json VARCHAR(MAX)
AS
BEGIN
	
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	SET XACT_ABORT ON;
	
	DECLARE @StartTime DATETIME2(7) = SYSUTCDATETIME();
    DECLARE @ResponseTime BIGINT;

	DECLARE @IdCard VARCHAR(15), @Count INT = 0 ,@BusinessName VARCHAR(300) ,@Uuid UNIQUEIDENTIFIER
	DECLARE @TradeName VARCHAR(300) ,@Telephone VARCHAR(15) ,@Email VARCHAR(300) ,@Address VARCHAR(300)
	DECLARE @TbCompany AS TABLE(
		[IdCard] VARCHAR(15) NOT NULL
	   ,[BusinessName] VARCHAR(300) NOT NULL
	   ,[TradeName] VARCHAR(300) NOT NULL
	   ,[Email] VARCHAR(300) NULL
	   ,[Telephone] VARCHAR(15) NULL
	   ,[Address] VARCHAR(300) NULL
	)

	BEGIN TRY
		
		------------------------------------------------ DATA JSON ------------------------------------------------------------------------- 
		INSERT INTO @TbCompany 
		      ([IdCard] ,[BusinessName] ,[TradeName] ,[Telephone] ,[Email] ,[Address])
		SELECT [IdCard] ,[BusinessName] ,[TradeName] ,[Telephone] ,[Email] ,[Address]
		FROM OPENJSON(@Json) WITH 
		(
			[IdCard]        VARCHAR(15) '$.idCard'
		   ,[BusinessName] VARCHAR(300) '$.businessName'
		   ,[TradeName]    VARCHAR(300) '$.tradeName'
		   ,[Email]        VARCHAR(300) '$.email'
		   ,[Telephone]     VARCHAR(15) '$.telephone'
		   ,[Address]      VARCHAR(300) '$.address'
		)
	    

		-------------------------------------------------- VARIABLES ----------------------------------------------------------------------
		
		SELECT TOP 1 
			@IdCard       =  [IdCard]
		   ,@BusinessName = [BusinessName] 
		   ,@TradeName    = [TradeName] 
		   ,@Telephone    = [Telephone] 
		   ,@Email        = [Email] 
		   ,@Address      = [Address] 
		FROM @TbCompany 

		SELECT TOP 1 @Uuid = Uuid FROM Config.Company WITH (NOLOCK) WHERE Id = @Id

		-------------------------------------------------- VALIDACIONES -------------------------------------------------------------------
		IF (SELECT COUNT(*) FROM @TbCompany) = 0 
			BEGIN 
				SELECT '50001' Code, 'Error en los datos de la empresa'as Message
                RETURN
			END

		-------------------------------------------------- TRAN -------------------------------------------------------------------

		BEGIN TRAN 

			UPDATE [Config].[Company]
			   SET [BusinessName] = LTRIM(RTRIM(@BusinessName))
				  ,[TradeName]    = LTRIM(RTRIM(@TradeName))
				  ,[Email]        = LTRIM(RTRIM(@Email))
				  ,[Telephone]    = LTRIM(RTRIM(@Telephone))
				  ,[Address]      = LTRIM(RTRIM(@Address))
				  ,[UpdatedAt]    = GETDATE()
				  --,[IdCard]     = GETDATE
			WHERE Id = @Id

			UPDATE Acontplus.dbo.Entidad 
			   SET razonSocial     = LTRIM(RTRIM(@BusinessName))
				  ,nombreComercial = LTRIM(RTRIM(@TradeName))
				  ,direccion       = LTRIM(RTRIM(@Address))
				  ,telefono        = LTRIM(RTRIM(@Telephone))
				  ,email           = LTRIM(RTRIM(@Email))
				  --,ruc             = LTRIM(RTRIM(@IdCard))
		    WHERE Uuid = @Uuid

		COMMIT TRAN 
		SELECT '0' code, 'Actualizado Correctamente'as message
        RETURN
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		
		SET @ResponseTime = DATEDIFF_BIG(MILLISECOND, @StartTime, SYSUTCDATETIME());
        
        EXEC dbo.LogError
            @ModuleName = 'CONFIG',
            @BusinessProcess = 'EMAIL_CONFIG_INSERT',
            @ErrorCategory = 'BUSINESS_RULE',
            @ErrorSeverityLevel = 'HIGH',
            @ResponseTime = @ResponseTime,
            @EnvironmentName = 'PROD',
            @BuildVersion = '3.0.0';
			SELECT '50001' code, 'Error in procedure' AS 'message';
			THROW;
	END CATCH
END
GO