 USE Acontplus
 GO
 
CREATE OR ALTER VIEW Config.v_User_Permission_Product WITH SCHEMABINDING
AS(
    SELECT  
	    idUserPermission
	    ,idUsuarioRol
	    ,codModule
        ,precio = CAST(ISNULL( precio, 0) AS BIT) 
	    ,estado  
    FROM 
        Config.UserPermission up
    CROSS APPLY OPENJSON (up.permission)
    WITH(
	     precio BIT '$.precio.enabled'    
    )
    WHERE 
        up.codModule = 'AR'  
)
 