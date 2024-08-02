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
-- Create date: 03/14/2023
-- Description:	SP para lisatar las cuentas por pagar.
-- =============================================

--  Contabilidad.AccountingMovement_Get 44, '{"tipo":2}',''
CREATE OR ALTER PROCEDURE Contabilidad.AccountingMovement_Get
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH 

	 --> Global
    DECLARE @idEntidad INT ,@tipo INT 
	
    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT

    --> Variables
	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT )

    --> Filters
    IF @tipo = 2
        BEGIN
            
            SET @tableNames = 'transactionType,subcategory'

            SELECT idTipoTransaccion,codigo,descripcion FROM dbo.TipoTransaccion WITH (NOLOCK) WHERE codigo IN ('C','V') AND estado = 1

            SELECT Id,Code,[Name] FROM Contabilidad.Subcategory WITH (NOLOCK) WHERE CompanyId = @idEntidad AND [Enabled] = 1

            RETURN 
        END
END
GO
