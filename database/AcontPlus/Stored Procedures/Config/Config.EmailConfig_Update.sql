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
IF OBJECT_ID('Config.EmailConfig_Update ')IS NOT NULL
	DROP PROCEDURE Config.EmailConfig_Update 
GO
CREATE PROCEDURE Config.EmailConfig_Update @idUsuarioRol INT, @idEmailConfig INT , @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @enableSsl VARCHAR(5)
    DECLARE @from VARCHAR(150)
    DECLARE @host VARCHAR(150)
    DECLARE @password VARCHAR(150)
    DECLARE @port INT                       

	BEGIN TRY
		
		SELECT @enableSsl = enableSsl    
		      ,@from      = [from]     
			  ,@host      = host       
			  ,@password  = [password] 
			  ,@port      = [port] 
		FROM OPENJSON(@json) 
		WITH (enableSsl    VARCHAR(5) '$.enableSsl'
		     ,[from]     VARCHAR(150) '$.from'
			 ,host       VARCHAR(150) '$.host'
			 ,[password] VARCHAR(150) '$.password'
			 ,[port]              INT '$.port')

		BEGIN TRAN 
			UPDATE Config.Email_Config
			   SET [enableSsl] = @enableSsl
				  ,[from]      = @from
				  ,[host]      = @host
				  ,[password]  = @password
				  ,[port]      = @port
			 WHERE idEmailConfig = @idEmailConfig
			
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
GO
