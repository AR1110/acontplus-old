--INSERT INTO Inventario.MetodoValoracion(descripcion,codigo,estado,fechaRegistro)
--select 'Ultimos en entrar, primeros en salir','UEPS',1,dbo.ufnGetDateEcuador()
--union all
--select 'Primeros en entrar, primeros en salir','PEPS',0,dbo.ufnGetDateEcuador()
--union all
--select 'Promedio ponderado','PPO',0,dbo.ufnGetDateEcuador()

select * from Inventario.MetodoValoracion