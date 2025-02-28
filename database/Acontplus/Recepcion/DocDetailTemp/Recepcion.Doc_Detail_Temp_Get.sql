USE AcontPlus
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-09-27
-- Description: SP FOR GET DETAIL TEMP
-- =============================================
--Recepcion.Doc_Detail_Temp_Get 1061, 'A250AADC-1033-4056-B0A1-13A2F857CB37'

CREATE OR ALTER PROCEDURE Recepcion.Doc_Detail_Temp_Get
@idRol INT
,@idDocumento INT
,@jsonData NVARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	SELECT  d.[idDocumento]
    ,d.[idProveedor]
    ,d.[idBodega]
    ,d.[idArticulo]
    ,d.[idMedida]
    ,d.[codigoPrincipal]
    ,d.[codigoAuxiliar]
    ,d.[cantidad]
    ,d.[descripcion]
    ,d.[precioUnitario]
    ,d.[descuento]
    ,d.[precioTotalSinImpuesto]
    ,d.[costoNeto]
    ,d.[detallesAdicionales]
    ,d.[impuestos]
    ,d.[fechaRegistro]
    ,d.[idUsuario]
    ,d.[isCustom]
    ,d.[idDetalle]
	,impuesto  = (SELECT TOP 1 si.descripcion FROM Recepcion.Doc_Impuesto_Temp i
											INNER JOIN Sri.Impuesto si ON i.codigo = si.codigo
														WHERE d.idDocumento = i.idDocumento 
														AND d.codigoPrincipal = i.codArticulo)
	,valorImpuesto  = (SELECT SUM(CONVERT(NUMERIC(18,2),i.valor)) FROM Recepcion.Doc_Impuesto_Temp i
														WHERE d.idDocumento = i.idDocumento 
														AND d.codigoPrincipal = i.codArticulo)
	
	,idDocumentoDetalle = ISNULL((SELECT TOP 1 dd.idDocumentoDetalle FROM Recepcion.DocumentoDetalle dd WITH(NOLOCK)
                            WHERE d.idArticulo = dd.idArticulo 
                                AND dd.idDocumento = d.idDocumento), 0) 

	,etiquetas = IIF(d.idARTICULO = 0, '[]', ISNULL((SELECT TOP 1 ee.idEtiqueta, ee.descripcion, ee.etiquetas
				  FROM Inventario.Etiqueta ee WITH(NOLOCK)
			      WHERE ee.idEtiqueta IN (
					SELECT ar.idEtiqueta
					FROM Articulo ar WITH(NOLOCK)
					WHERE ar.idArticulo = d.idArticulo
				) FOR JSON PATH), '[]'))
	,datosAdicionales = IIF(d.idArticulo = 0, 0, ISNULL((SELECT top 1 ar.datosAdicionales FROM Articulo ar WITH(NOLOCK) where ar.idArticulo = d.idArticulo), 0))
    ----Medidas agregado por Emilio 
    ,IIF(d.idArticulo = 0, '[]', ISNULL
        ((
            SELECT af.idMedida
                  ,IIF(af.gestionVenta = 1,1,3) as orden
                  ,af.conversion
                  ,af.precioCostoFraccionado
                  ,ar.precioCosto
			      ,me.descripcion               as descripcion 
			FROM dbo.ArticuloFraccionado af WITH (NOLOCK) 
			INNER JOIN dbo.Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida
            INNER JOIN dbo.Articulo      ar WITH (NOLOCK) ON ar.idArticulo = af.idArticulo
			WHERE af.idArticulo = d.idArticulo 
            FOR JSON PATH
                
        ),'[]')) as fraccionado

        ,IIF(d.idArticulo = 0, '[]',ISNULL
        ((
            SELECT sc.idMedida
                  ,2              as orden
                  ,1              as conversion
			      ,sc.precioCosto as precioCostoFraccionado
                  ,sc.precioCosto
                  ,me.descripcion 
			FROM dbo.Articulo     sc WITH (NOLOCK)
			INNER JOIN dbo.Medida me WITH (NOLOCK) ON me.idMedida = sc.idMedida
			WHERE sc.idArticulo = d.idArticulo 
            FOR JSON PATH

         ),'[]')) as principal
         ,IIF(a.idArticulo > 0, ' <b>-></b> <small class=''text-success''>' + ISNULL(a.codigo, '') + '</small>', '') existentCode
         ,IIF(a.idArticulo > 0, ' <b>-></b> <small class=''text-success''>' + ISNULL(a.descripcion, '') + '</small>', '') existentProduct
         ,IIF(a.idArticulo > 0,  ' <b>-></b> <small class=''text-success''>' + CONVERT(VARCHAR, CAST(ISNULL(a.precioCosto, 0) AS NUMERIC(18,5)))+ '</small>', '') existentCost
	FROM Recepcion.Doc_Detalle_Temp d WITH (NOLOCK)
        LEFT JOIN dbo.Articulo a WITH(NOLOCK) ON d.idArticulo = a.idArticulo
	WHERE d.idDocumento = @idDocumento
	ORDER BY d.idDetalle ASC
END
GO
