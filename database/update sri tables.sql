USE Acontplus
GO
--DESPUES DE LAS MIGRACIONES

UPDATE fc SET fc.idSustentoTributario = st.Id

FROM dbo.FacturaCompra fc
	INNER JOIN Sri.SustentoTributario st
		ON fc.codSustentoTributario = st.codigo

