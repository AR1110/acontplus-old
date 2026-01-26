USE Acontplus
GO
/****** Object:  StoredProcedure [Config].[EmailConfig_Update]    Script Date: 27/6/2024 11:33:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE [Config].[EmailConfig_Update] @UserRoleId INT, @Id INT , @Json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @EnableSsl BIT
    DECLARE @From VARCHAR(150)
    DECLARE @Host VARCHAR(150)
    DECLARE @Password VARCHAR(150)
    DECLARE @Port INT                       

	BEGIN TRY
		
		SELECT @EnableSsl = enableSsl    
		      ,@From      = [from]     
			  ,@Host      = host       
			  ,@Password  = [password] 
			  ,@Port      = [port] 
		FROM OPENJSON(@Json) 
		WITH (enableSsl           BIT '$.enableSsl'
		     ,[from]     VARCHAR(150) '$.from'
			 ,host       VARCHAR(150) '$.host'
			 ,[password] VARCHAR(150) '$.password'
			 ,[port]              INT '$.port')

		BEGIN TRAN 
			UPDATE Config.Email_Config
			   SET [enableSsl] = @EnableSsl
				  ,[from]      = @From
				  ,[host]      = @Host
				  ,[password]  = @Password
				  ,[port]      = @Port
			 WHERE idEmailConfig = @Id
			
			SELECT '0'code,'Actualizado Correctamente' as 'message'
		COMMIT TRAN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END
		SELECT '0'code,ERROR_MESSAGE() as 'message'
		RETURN 
	END CATCH 

END
