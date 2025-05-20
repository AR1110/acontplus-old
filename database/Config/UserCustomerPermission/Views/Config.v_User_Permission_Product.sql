 USE Acontplus
 GO
 
CREATE OR ALTER VIEW Config.v_User_Permission_Product  
AS(
    SELECT  
	    idUserPermission
	    ,idUsuarioRol
	    ,codModule
        ,precio = CAST(ISNULL( precio, 0) AS BIT) 
        ,gestionUbicacion = CAST(ISNULL( gestionUbicacion, 0) AS BIT) 
	    ,estado  
    FROM 
        Config.UserPermission up
    CROSS APPLY OPENJSON (up.jsonPermission)
    WITH(
	     precio BIT '$.precio.enabled'    
	     ,gestionUbicacion BIT '$.gestionUbicacion.enabled'    
    )
    WHERE 
        up.codModule = 'AR'  
)
 