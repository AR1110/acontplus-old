USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-01-16
-- Description:	SP FOR GET DEVICES OF TECHNICAL SUPPORT
-- =============================================
CREATE OR ALTER PROCEDURE TechnicalSupport.Device_Get @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @tipo INT
    ,@textSearch VARCHAR(100)
    ,@customerCompanyId INT
    
    SELECT @tipo            = tipo
        ,@textSearch        = textSearch
        ,@customerCompanyId = customerCompanyId
    FROM OPENJSON(@json) WITH 
    (
        tipo INT '$.tipo',
        textSearch VARCHAR(100) '$.textSearch',
        customerCompanyId INT '$.customerCompanyId'
    )

    IF (@tipo = 1)
        BEGIN
            SET @tableNames = 'establecimientos,categorias'
            SELECT idEstablecimiento
                    ,nombreComercial
                    ,codEstab
                    ,idPuntoEmision
                    ,ptoEmi + '-' + estab as ptoEmi
                    ,defaultEstab
                    ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK)
            WHERE idUsuarioRol = @userRoleId 
            ORDER BY defaultEstab DESC

            SELECT
                tc.Id
               ,tc.Code
               ,tc.Name
               ,tc.CreatedAt
            FROM TechnicalSupport.Category tc WITH(NOLOCK)
            WHERE tc.[Enabled] = 1
            ORDER BY tc.CreatedAt DESC

            RETURN
        END

    IF (@tipo = 2)
        BEGIN
	        SET @tableNames = 'devices'
	        SELECT d.*
                ,m.BrandId
                ,m.[Name] ModeloName
                ,m.[Year]
                ,b.CategoryId
                ,b.[Name] BrandName
                ,c.[Name] CategoryName
                ,ISNULL(ds.Specs, '{}') AS Specs
            FROM TechnicalSupport.Device d WITH (NOLOCK)
                INNER JOIN TechnicalSupport.Modelo m WITH (NOLOCK)ON d.ModeloId = m.Id
                INNER JOIN TechnicalSupport.Brand b WITH (NOLOCK) ON m.BrandId = b.Id
                INNER JOIN TechnicalSupport.Category c WITH (NOLOCK) ON b.CategoryId = c.Id
                LEFT JOIN TechnicalSupport.DeviceSpecs    ds WITH (NOLOCK) ON d.id = ds.DeviceId
            WHERE d.Deleted IS NULL
            RETURN
        END
     IF (@tipo = 3)
        BEGIN
        	SET @tableNames = 'devices'
            SELECT d.*
                ,m.BrandId
                ,m.[Name] ModeloName
                ,m.[Year]
                ,b.CategoryId
                ,b.[Name] BrandName
                ,c.[Name] CategoryName
            FROM TechnicalSupport.Device d WITH (NOLOCK)
                INNER JOIN TechnicalSupport.Modelo m WITH (NOLOCK)ON d.ModeloId = m.Id
                INNER JOIN TechnicalSupport.Brand b WITH (NOLOCK) ON m.BrandId = b.Id
                INNER JOIN TechnicalSupport.Category c WITH (NOLOCK) ON b.CategoryId = c.Id
            WHERE d.[Name] LIKE '%' + @textSearch + '%'
                OR m.[Name] LIKE '%' + @textSearch + '%'
            RETURN
        END
    IF (@tipo = 4)
        BEGIN
        	SET @tableNames = 'devices'
            SELECT d.*, dc.Id DeviceCustomerId, dc.CustomerCompanyId, dc.SerialNumber DeviceSerie, dc.Warranty DeviceWarranty, ISNULL(ds.Specs, '{}') Specs
            
            FROM TechnicalSupport.Device d  WITH (NOLOCK)
            INNER JOIN TechnicalSupport.DeviceCustomer dc WITH (NOLOCK) ON d.Id = dc.DeviceId
            LEFT JOIN TechnicalSupport.DeviceSpecs ds WITH(NOLOCK) ON d.id = ds.DeviceId
            WHERE dc.CustomerCompanyId = @customerCompanyId
            RETURN
        END
END
GO
