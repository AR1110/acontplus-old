use acontplus
go
declare @claveAcceso VARCHAR(49) = '2606202407180321990400120010030000180885661429913'
declare @claveAccesoR VARCHAR(49)
declare @idRetencionAts INT
declare @xmlQuery XML
,@xmlDoc XML

select @idRetencionAts = idRetencionAts from FactElect.RetencionAts where claveacceso = @claveAcceso

select * from factelect.RetAtsDocSustento where idretencionats = @idRetencionAts
select @claveAccesoR = numAutDocSustento from factelect.RetAtsDocSustento where idretencionats = @idRetencionAts
select @XMLDOC =  converT(xml, DECOMPRESS(xmlCompressed)) from Recepcion.DocumentoRecibido where claveAcceso = @claveAccesoR

SELECT @xmlQuery =  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))) 

select CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoFactura/importeTotal)[1]','NUMERIC(18,5)')
SELECT x.y.value('(infoTributaria/razonSocial)[1]','VARCHAR(300)')          as razonSocialEmisor
                      ,x.y.value('(infoTributaria/nombreComercial)[1]','VARCHAR(300)')      as nombreComercial
                      ,x.y.value('(infoTributaria/ruc)[1]','VARCHAR(13)')			        as rucEmisor
                      ,x.y.value('(infoTributaria/dirMatriz)[1]','VARCHAR(300)')            as dirMatriz
                      ,x.y.value('(infoTributaria/estab)[1]','VARCHAR(25)')                 as estab             
                      ,x.y.value('(infoTributaria/ptoEmi)[1]','VARCHAR(25)')                as ptoEmi              
                      ,x.y.value('(infoTributaria/secuencial)[1]','VARCHAR(25)')            as secuencial
                      ,x.y.value('(infoFactura/identificacionComprador)[1]','VARCHAR(300)') as identificacionComprador
                      ,x.y.value('(infoFactura/importeTotal)[1]','NUMERIC(18,5)')			as importeTotal
                      ,'Factura'
                FROM @xmlQuery.nodes('//factura') x(y)
return



update factelect.RetAtsDocSustento set importeTotal = (select SUM(total) from factelect.RetencionAtsPago where idretencionats = @idRetencionAts)
where idretencionats = @idRetencionAts

