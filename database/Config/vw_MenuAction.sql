-- Database view for cross-service MenuAction queries
-- Run this script to create the view in the database

CREATE OR ALTER VIEW [Configuration].[vw_MenuAction]
AS
SELECT
    ma.Id,
    ma.MenuId,
    m.Name AS MenuName,
    ma.ActionId,
    a.Code AS ActionCode,
    a.Name AS ActionName,
    ma.IsActive,
    ma.CreatedAt
FROM Configuration.MenuAction ma
INNER JOIN Configuration.Menu m ON ma.MenuId = m.Id
INNER JOIN Identity.Actions a ON ma.ActionId = a.Id
