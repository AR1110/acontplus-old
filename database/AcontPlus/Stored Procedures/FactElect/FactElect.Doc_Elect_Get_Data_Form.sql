

IF OBJECT_ID('FactElect.Doc_Elect_Get_Data_Form') IS NOT NULL
	DROP PROCEDURE FactElect.Doc_Elect_Get_Data_Form
GO

CREATE PROCEDURE  FactElect.Doc_Elect_Get_Data_Form
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	SELECT descripcion, codigo FROM FactElect.EstadoServicio WHERE estado = 1 AND codigo BETWEEN 1 AND 6
END 