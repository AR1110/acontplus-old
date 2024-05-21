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
    DECLARE @id INT 

	SELECT @ruc = rucEmpresa FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
 

	SELECT 
		@tipo = tipo,
        @id = id
	FROM OPENJSON(@json)
	WITH(	
			tipo INT ,
            id INT 
		)

        -- lista general 
	IF @tipo=1
		BEGIN 
			SET @tableNames='estabs'
			SELECT 
				e.idEstablecimiento
				,e.codEstab
				,e.estab
				,e.nombreComercial
				,e.dirEstablecimiento
				,estado 
                
			FROM Sri.Establecimiento e
			WHERE e.ruc = @ruc
			ORDER BY e.idEstablecimiento DESC
		    RETURN 
		END 
    --data form
    IF @tipo =2
        BEGIN 
            SET @tableNames = 'cantones,actividadesEconomica,agentesRetencion,contribuyentes,ambientes'
            SELECT codigo,descripcion FROM Catalogo.Canton WHERE estado = 1

	        SELECT codigo,descripcion,grupo FROM Sri.ActividadEconomica WHERE estado = 1

	        SELECT resolucion,descripcion FROM Sri.AgenteRetencion WHERE estado = 1

	        SELECT codigo,descripcion,contribuyenteRimpe FROM Sri.Contribuyente WHERE estado = 1

	        SELECT ambiente = codigo, descripcion FROM Sri.Ambiente WHERE estado = 1
            RETURN 
        END 

    --editar 
    IF @tipo = 3
        BEGIN 
            SET @tableNames = 'data,puntosEmision'
            SELECT 
		         idEstablecimiento
		        ,codEstab
		        ,canton
		        ,actividad
		        ,agenteRetencion
		        ,contribuyente
		        ,ruc
		        ,estab
		        ,contribuyenteEspecial
		        ,obligadoContabilidad
		        ,nombreComercial
		        ,dirEstablecimiento
		        ,telefono
		        ,contribuyenteRimpe
		        ,correo
		        ,estado
                ,autoSriAuth
	        FROM Sri.Establecimiento 
	        WHERE idEstablecimiento = @id

             SELECT idPuntoEmision
					,pe.ambiente
					,pe.ptoEmi 
					,descripcion = a.descripcion
					,pe.estado
			FROM dbo.PuntoEmision pe
			INNER JOIN Sri.Ambiente a ON a.codigo = pe.ambiente
			WHERE pe.codEstab = (SELECT codEstab FROM Sri.Establecimiento WHERE idEstablecimiento = @id)
            RETURN 
        END 

     


END
GO