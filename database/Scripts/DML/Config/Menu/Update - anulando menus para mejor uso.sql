use [Acontplus]
go 

select * from Menu where descripcion like '%tribu%'

select * from Menu where descripcion like '%elec%'

select * from SubMenu where idmenu = 6

select * from SubMenu where idMenu = 16

--update SubMenu set idMenu = 16 where idMenu = 6