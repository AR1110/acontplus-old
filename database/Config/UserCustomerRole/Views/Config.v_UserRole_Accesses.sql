USE [Acontplus]
GO 

CREATE OR ALTER VIEW Config.v_UserRole_Accesses
AS(

SELECT ur.idUsuarioRol 
      ,JSON_VALUE(dt.[value],'$.menuId') as MenuId
      ,JSON_VALUE(dt.[value],'$.actions')   as Actions
FROM App.UsuarioRol				  ur WITH (NOLOCK)
CROSS APPLY OPENJSON(ur.Accesses) dt
where ur.Accesses is not null

)