USE ACONTPLUS
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-07-23
-- Description:	SP FOR INSERT STOCK FISICOS
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.StockFisico_Insert
    @userRoleId INT,
    @json NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT response = (SELECT code = '0', [message] = 'Test', payload = (SELECT 1 id
            for json path)
        FOR JSON PATH)
END
GO
