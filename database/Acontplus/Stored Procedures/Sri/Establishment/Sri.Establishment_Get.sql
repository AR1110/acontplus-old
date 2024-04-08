USE [AcontPlus]
GO 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO 
 
CREATE OR ALTER PROCEDURE Sri.Establishment_Get @userRoleId INT,@json VARCHAR(MAX), @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	 
	SET NOCOUNT ON; 
	DECLARE @ruc VARCHAR(15)
	DECLARE @tipo INT  

	SELECT @ruc = rucEmpresa FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
 

	SELECT 
		@tipo = tipo 
	FROM OPENJSON(@json)
	WITH(	
			tipo INT 
		)

	IF @tipo=1
		BEGIN 
			SET @tableNames='estabs'
			SELECT 
				e.idEstablecimiento
				,e.codEstab
				,e.estab
				,e.nombreComercial
				,e.dirEstablecimiento
				,estado = IIF(e.estado = 1,'ABIERTO','CERRADO')
			FROM Sri.Establecimiento e
			WHERE e.ruc = @ruc
			ORDER BY e.idEstablecimiento DESC
				
		END 


END
GO