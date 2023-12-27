use [Acontplus]
go 


INSERT INTO Compra.DocumentoIngresoImpuesto(DocumentoIngresoId,TaxId,TaxPercentId,[Percent],TaxBase,Discount,TaxValue)

SELECT ld.idDocumentoIngreso 
      ,ti.idImpuesto	      as TaxId
	  ,ld.idTipoIva           as TaxPerentId
	  ,ld.tarifa			  as [Percent]
	  ,ld.precioTotalSinImpuesto as TaxBase
	  ,ld.descuento
	  ,ld.valorImpuesto
FROM Compra.Documento_Ingreso_Detail ld WITH (NOLOCK)
INNER JOIN TipoIva ti WITH (NOLOCK) ON ti.idTipoIva = ld.idTipoIva