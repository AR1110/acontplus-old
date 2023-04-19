

angular.module('acontPlusApp')
    .controller('layoutCtrl', layoutCtrl);

layoutCtrl.$inject = ['$scope', '$window', 'Idle', 'mainService', 'modalService', 'toastService', 'formulario'];

function layoutCtrl($scope, $window, Idle, mS, _modalSvc, toast, form) {
    'use strict';

    // $scope.IsVisible = false;
    // $scope.idle = 700;
    // $scope.timeout = 15;

    // $scope.$on('IdleStart', function () {
	// 	// the user appears to have gone idle
    //     //tS.toastr('warning', 'Su sesión expirará en ' + $scope.idle + ' segundos.');
    // });

    // $scope.$on('IdleEnd', function () {
    //     // the user is doing stuff. if you are warning them, you can use this to hide the dialog.
    // });

    // $scope.$on('Keepalive', function () {
    //     // the user is doing stuff. if you are warning them, you can use this to hide the dialog.
    // });

    // $scope.$on('IdleWarn',  async function (e, countdown) {       
    //     // the countdown arg is the number of seconds remaining until then.
    //     // you can change the title or display a warning dialog from here.
    //     // you can let them resume their session by calling Idle.watch()
    //     $scope.IsVisible = true;
    //     // document.getElementById('modalSession').style.display = "block";
    //     // const {ModalSessionCtrl} = await import('./../modal/modalSessionCtrl.js')
    //     // $scope.modalRef = _modalSvc.openModalSecond(ModalSessionCtrl, 'Shared/_ModalSession.cshtml', 'md')
    //   // $('#modalSession').modal('show');
    // });

    // $scope.$on('IdleTimeout', function () {        
    //     // the user has timed out (meaning idleDuration + timeout has passed without any activity).
    //     // this is where you'd log them.
    //     //    window.location.href = "/Login/Logout";
    //     //location.href = location.href
    //     mS.getData('post', '/Home/BackendAlive').then(function (response) {
    //         $('#modalSession').modal('hide');
    //     //    Swal.fire('info', 'estoy vivo', '')
    //     });
    // });

    // $scope.Reset = function () { window.location = window.location.href; }
    // $scope.SignOut = function () { window.location.href = "/Login/Logout"; }

    // $scope.$watch('idle', function (value) {
    //     if (value !== null) {
    //         Idle.setIdle(value);
    //     }
    // });
    // $scope.$watch('timeout', function (value) {
    //     if (value !== null) {
    //         Idle.setTimeout(value);
    //     }
    // });

    if(JSON.parse(localStorage.getItem('userData'))===null){        
        location.href = '/Login/Logout';
        return
    }

    let dataUser = JSON.parse(localStorage.getItem('userData'));
    $scope.menus = JSON.parse(localStorage.getItem("menus"));
    $scope.subMenus = JSON.parse(localStorage.getItem("subMenus"));

    $scope.usuario = dataUser.userName;
    $scope.politica = dataUser.role;
    $scope.entidad = dataUser.entidad;
    $scope.nombreComercial = dataUser.nombreComercial;



    $scope.drawMenus = function () {

        let textHtml = "";
        let subMenu = false;
        //textHtml +=
        //    '<li class="user-pro"> <a class="has-arrow waves-effect waves-dark" href="javascript:void(0)" aria-expanded="false"><img src="' + userInfo.image + '" alt="" class="img-circle"><span class="hide-menu">' + userInfo.userName + '</span></a>' +
        //    '<ul aria-expanded="false" class="collapse">' +
        //    '<li><a href="/Usuario/Profile"><i class="ti-user"></i> Mi Perfil</a></li>' +
        //    '<li><a href="#" onclick="logout()" id="logoutII"><i class="fa fa-power-off"></i> Salir</a></li>' +
        //    '</ul>' +
        //    '</li>';
        for (let i = 0; i < $scope.menus.length; i++) {
            if (subMenu) {
                textHtml += '</ul></li>';
                subMenu = false;
            }
            //    if ($scope.menus[i].subMenu === false) {
            //        textHtml += '<li>' +
            //            '<a href="' + $scope.menus[i].url + '" class="waves-effect waves-dark">' +
            //            '<i class="' + $scope.menus[i].icon + '" ></i ><span class="hide-menu"> ' + $scope.menus[i].description + '</a></span>' +
            //            '</li>';
            //    }
            if ($scope.menus[i].subMenu) {
                subMenu = true;
                textHtml += `<li>
                       <a class="has-arrow waves-effect waves-dark" href="javascript:void(0)" aria-expanded="false"><i class="${$scope.menus[i].icon}"></i><span class="hide-menu"> ${$scope.menus[i].description}</span></a>
                       <ul aria-expanded="false" class="collapse">`;
                for (let sm = 0; sm < $scope.subMenus.length; sm++) {
                    if ($scope.menus[i].idMenu == $scope.subMenus[sm].idMenu) {

                        textHtml += '<li><a href="' + $scope.subMenus[sm].url + '">' + $scope.subMenus[sm].description + '</a></li>';
                    }
                }
            }
        };

        //  $('#sidebarnav').html(textHtml);
    };

    // if ($scope.menus.length > 0 || $scope.subMenus.length > 0) {
    //     $scope.drawMenus();
    //  };

    const pathname = $window.location.pathname;
    
    
    if(pathname){ 
        console.log(pathname.indexOf('/'))   
        if(pathname==='/'){
          location.href='/Home/Index';
        }
        console.log(pathname)    
        //Verificamos si url es /Home/Index
        if(pathname.indexOf('/Home')==-1){
            let lengthPath = pathname.split('/').splice(1).length;

            if([1, 2].includes(lengthPath)){
                let path = pathname.indexOf('/Index') == -1 ? pathname + '/Index' : pathname;
                console.log(path);
                let dataMenu = $scope.subMenus.find(item=>item.url===path);
                console.log(dataMenu);
                mS.getData('get', '/Acceso/GetAccesoBySubMenu?idSubMenu=' + dataMenu.idSubMenu).then(response => {
                    if(response.id==="0"){
                        console.log(response)
                    }
                    if(response.id==="1"){
                        $scope.accion = JSON.parse(response.data)[0]
                        console.log($scope.accion)
                    }
                })
            }            
        }
        // if (url.indexOf('/Index') === -1) {
        
        // var script = document.createElement('script');
        // script.src = 'path/to/your/script.js';
        // document.head.appendChild(script);
        // }
        
    }
   

    // $scope.accion = 'test'
    // console.log(pathname)
    $scope.onChangeSubMenu = function (item) {       
        try {
            location.href = item.url;
            // mS.getData('get', '/Acceso/GetAccesoBySubMenu?idSubMenu=' + item.idSubMenu).then(response => {            
            //     if (response.id === null) {
            //         toast.toastr('warning', 'No tienes acceso a este Sub Menu', 'Acceso');
            //         return
            //     }
            //     if (response.id === "0") {
            //         form.sweetAlert('warning', response.message, response.titleSms);
            //         return
            //     }
            //     if (response.id === "1") {
            //         localStorage.removeItem("accion");
            //         localStorage.setItem("accion", JSON.stringify(JSON.parse(response.data)));
            
            //         return
            //     }
    
            //     location.href = '/Login/Logout';
    
            // });
            
        } catch (error) {
            location.href = '/Login/Logout';           
        }
        
    }
   
    // let dataMenu = $scope.subMenus.find(item=>item.url===pathname);
    // if(dataMenu && dataMenu.idSubMenu){
    //     mS.getData('get', '/Acceso/GetAccesoBySubMenu?idSubMenu=' + dataMenu.idSubMenu).then(response => {            
    //         if (response.id === null) {
    //             toast.toastr('warning', 'No tienes acceso a este Sub Menu', 'Acceso');
    //             return
    //         }
    //         if (response.id === "0") {
    //             form.sweetAlert('warning', response.message, response.titleSms);
    //             return
    //         }
    //         if (response.id === "1") {
    //             localStorage.removeItem("accion");
    //             localStorage.setItem("accion", JSON.stringify(JSON.parse(response.data)));                
    //         }            
    //     });        
    // }

    
    $scope.logout = function () {
        Object.keys(localStorage).forEach(function (key) {
            localStorage.removeItem(key);
        })       
        location.href = '/Login/Logout';
    }
}
