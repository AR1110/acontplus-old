



IF OBJECT_ID('ReporteFact.Comp_Retencion_Detalle ')IS NOT NULL
	DROP PROCEDURE ReporteFact.Comp_Retencion_Detalle 
GO 


CREATE PROCEDURE ReporteFact.Comp_Retencion_Detalle @idRol INT, @json VARCHAR(MAX)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	
	DECLARE @byEntidad int = (SELECT idEntidad FROM AFTDataRol(@idRol))
	DECLARE @filtroFecha NVARCHAR(100)
	DECLARE @checkboxSucursalFiltro BIT 
	DECLARE @codEstab VARCHAR(150)

	DECLARE @checkboxPuntoEmisionFiltro BIT 
	DECLARE @byPuntoEmision INT
			
	DECLARE @checkboxProveedorFiltro BIT
	DECLARE @byProveedor INT

	DECLARE @checkboxUsuarioFiltro BIT
	DECLARE @byUsuario INT

	DECLARE @radioFechaFiltro BIT
	DECLARE @fechaInicio datetime
	DECLARE @fechaFin datetime	

	DECLARE @checkboxEstadoFiltro BIT 
	DECLARE @byEstado INT 

	DECLARE @byOrderCampo NVARCHAR(50) 
	DECLARE @byOrder NVARCHAR(10)	




END 




SELECT * FROM Recepcion.DocumentoRecibido WHERE codDoc='07' and serieComprobante='001-003-000001500'

select * from FactElect.DocRelacionado