USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPFirmaElectronicaGet]    Script Date: 7/17/2023 10:46:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2023-07-17
-- Description:	sp para guardar listar las firmas
-- =============================================
--ASPFirmaElectronicaGet 1
CREATE OR ALTER PROCEDURE Config.EmailConfig_Get @idUsuarioRol INT, @json VARCHAR(MAX) 
AS
BEGIN 
	SET NOCOUNT ON;   
	DECLARE @tipo INT 

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get
	IF @tipo = 1
		BEGIN
			SELECT [idEmailConfig]
				  ,[enableSsl]
				  ,[from]
				  ,[host]
				  ,[password]
				  ,[port]
			FROM Config.Email_Config
		END 

	--> Config. Envio Comprobantes
    IF @tipo = 2
        BEGIN
            DECLARE @codDoc VARCHAR(10), @id INT

            SELECT @id = id, @codDoc = codDoc FROM OPENJSON(@json) WITH (id INT, codDoc VARCHAR(5))
        END
END
