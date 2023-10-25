
USE AcontPlus

IF OBJECT_ID('ReporteIngresos.Anticipo') IS NOT NULL
	DROP PROCEDURE ReporteIngresos.Anticipo
GO

CREATE PROCEDURE ReporteIngresos.Anticipo @json VARCHAR(100)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @id INT 

	SELECT 
		@id = id
	FROM OPENJSON(@json)
	WITH(id INT '$.id')


	SELECT 
		a.entidad
		,a.establecimiento
		,a.ruc
		,dirMatriz = a.dirEstablecimiento
		,a.idAnticipo
		,nroDocumento = a.estab+ '-'+ dbo.AFTAutoComplete(a.nroDoc)
		,a.fechaEmision
		,valorTotal = CAST(a.valor AS numeric(18,2))
		,observacion = a.observaciones
		,identificacionComprador = a.numeroIdentificacion
		,a.cliente
		,a.direccionCliente
		,a.entidadFinanciera 
		,a.estadoDoc  
		,a.codDoc 
		,usuario = a.nombreUsuario
	FROM v_Anticipo a
	WHERE a.idAnticipo = @id
	
END 