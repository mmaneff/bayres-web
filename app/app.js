'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'ngAnimate',
    'login.login',
    'acCarrito',
    'acLoginCarritoIngresar'
]).
    config(['$routeProvider', function ($routeProvider) {
        $routeProvider.otherwise({redirectTo: '/view1'});
    }]).controller('MainController', MainController);


MainController.$inject = ['acAngularProductosService', 'acAngularCarritoServiceAcciones', '$scope', '$document',
    'LoginService', 'acAngularSucursalesService', '$timeout'];
function MainController(acAngularProductosService, acAngularCarritoServiceAcciones, $scope, $document,
                        LoginService, acAngularSucursalesService, $timeout) {
    var vm = this;
    vm.ofertas = [];
    vm.destacados = [];
    vm.vendidos = [];
    vm.productos = [];
    vm.search = '';
    vm.ejecuta = '';
    vm.details = false;
    vm.detalle = {};
    vm.mail = '';
    vm.password = '';
    vm.sucursales = [];
    vm.sucursal = {};
    vm.tipo = 0;
    vm.envios = 'Buenos Aires';
    vm.cliente = {};

    vm.active_form = 'main';
    vm.active_form_before = '';

    vm.addProducto = addProducto;
    vm.searchByName = searchByName;
    vm.showDetails = showDetails;
    vm.hideDetails = hideDetails;
    vm.finalizarCompra = finalizarCompra;
    vm.comprar = comprar;
    vm.cuenta = cuenta;
    vm.modificarPass = modificarPass;
    vm.ingresar = ingresar;
    vm.nuevoCliente = nuevoCliente;
    vm.crearCliente = crearCliente;
    vm.ingresarCliente = ingresarCliente;
    vm.logout = logout;
    vm.top = 0;
    vm.top_before = 0;
    vm.debug = false;
    vm.usuario_creado = 0;
    vm.user_is_logged = false;
    vm.creaCliente = false;
    vm.compraTerminada = false;
    vm.slider_nro = 1;


    vm.menu_mobile = false;
    vm.menu_mobile_open = false;

    console.log(window.innerWidth);

    window.addEventListener('resize', function () {
        if (window.innerWidth < 800) {
            vm.menu_mobile = true;
        } else {
            vm.menu_mobile = false;

        }
        $scope.$apply();
    });

    if (window.innerWidth < 800) {
        vm.menu_mobile = true;
    }


    if (!LoginService.checkLogged()) {

    } else {
        vm.user_is_logged = true;

        vm.cliente = LoginService.checkLogged().cliente[0];
    }


    acAngularSucursalesService.getSucursales(function (data) {
        vm.sucursales = data;
        vm.sucursal = data[0];
    });


    //Estas 2 funciones solo sirven para el link del login
    function ingresarCliente() {
        vm.active_form = 'login';
        vm.creaCliente = false;
        document.getElementById("parallax").scrollTop = 636;
    }

    function crearCliente() {
        vm.active_form = 'login';
        vm.creaCliente = true;
        document.getElementById("parallax").scrollTop = 636;
    }

    function modificarPass() {
        if (!LoginService.checkLogged()) {

        } else {
            vm.user_is_logged = true;
            vm.cliente_id = LoginService.checkLogged().cliente[0].cliente_id;

            LoginService.changePassword(vm.cliente_id, vm.pass_old, vm.pass_new,
                function (data) {
                    console.log(data);
                });
        }
    }

    function finalizarCompra() {

        var envio_retira = (vm.tipo == 0) ? vm.envios : vm.sucursal.nombre;

        acAngularCarritoServiceAcciones.comprar(envio_retira, function (data) {
            vm.compraTerminada = true;
            $timeout(function () {
                vm.compraTerminada = false;
                vm.active_form = 'main';
            }, 2000);
        });
    }


    function logout() {
        LoginService.logout();
        vm.user_is_logged = false;
        vm.active_form = 'main';
    }

    function nuevoCliente() {
        document.getElementById("parallax").scrollTop = 636;
        LoginService.create(vm.nombre, vm.apellido, vm.mail, vm.password, vm.fecha_nacimiento,
            vm.telefono, vm.direccion, function (data) {
                //console.log(data);
                if (data == 'true') {
                    vm.active_form = 'main';
                }
                //if(data[0].nombre !== undefined){
                //    vm.active_form = 'carrito';
                //    vm.nombre = data[0].nombre;
                //    vm.user_is_logged = true;
                //}else{
                //    vm.usuario_creado = data;
                //    vm.nombre = '';
                //    vm.user_is_logged = false;
                //}
            });
    }

    function ingresar() {
        document.getElementById("parallax").scrollTop = 636;
        LoginService.login(vm.mail, vm.password, function (data) {
            if (data[0].nombre !== undefined) {
                vm.active_form = 'carrito';
                vm.nombre = data[0].nombre;
                vm.user_is_logged = true;

                LoginService.getHistoricoPedidos(LoginService.checkLogged().cliente[0].cliente_id,
                    function (data) {
                        console.log(data);
                        vm.historico_pedidos = data;
                    });

            } else {
                vm.usuario_creado = data;
                vm.nombre = '';
                vm.user_is_logged = false;
            }
        });
    }

    if (LoginService.checkLogged()) {
        LoginService.getHistoricoPedidos(LoginService.checkLogged().cliente[0].cliente_id,
            function (data) {
                console.log(data);
                vm.historico_pedidos = data;
            });
    }

    function comprar() {

        document.getElementById("parallax").scrollTop = 636;
        if (!LoginService.checkLogged()) {
            vm.active_form = 'login';
        } else {
            vm.active_form = 'carrito';
        }
        //if (!acAngularCarritoServiceAcciones.comprar()) {
        //    vm.active_form = 'login';
        //} else {
        //    vm.active_form = 'carrito';
        //}
    }

    function cuenta() {
        document.getElementById("parallax").scrollTop = 636;
        if (!LoginService.checkLogged()) {
            vm.active_form = 'login';
        } else {
            vm.active_form = 'cuenta';
        }
    }

    function showDetails(detalle) {


        vm.active_form_before = vm.active_form;
        vm.active_form = 'details';

        vm.detalle = detalle;
        vm.details = true;
        vm.top_before = document.getElementById("parallax").scrollTop;
        document.getElementById("parallax").scrollTop = 636;


        //for(var i = vm.top; i <= 636; i++){
        //    console.log(i);
        //    document.getElementById("parallax").scrollTop = i;
        //    $scope.$apply();
        //}


    }

    function hideDetails() {
        vm.active_form = vm.active_form_before;
        vm.detalle = {};
        vm.details = false;
        document.getElementById("parallax").scrollTop = vm.top_before;

        //for(var i = vm.top; i > vm.top_before; i--){
        //    console.log(i);
        //    document.getElementById("parallax").scrollTop = i;
        //}
    }

    function searchByName() {
        //console.log(vm.search.length);
        if (vm.search.length > 2) {
            vm.active_form = 'search';
            acAngularProductosService.getProductoByName(vm.search, function (data) {
                //console.log(data);
                vm.productos = data;
            });
        } else {

            vm.active_form = 'main';
        }
    }

    acAngularProductosService.getOfertas(function (data) {
        vm.ofertas = data;
    });

    acAngularProductosService.getProductosDestacados(function (data) {
        vm.destacados = data;
        //console.log(data);
    });
    acAngularProductosService.getProductosMasVendidos(function (data) {
        vm.vendidos = data;
        //console.log(data);
    });


    function addProducto(producto) {

        acAngularCarritoServiceAcciones.addProducto(producto);

    }

    var container = document.getElementsByClassName('parallax');

    function animate() {
        if (document.getElementById("parallax").scrollTop > 580) {
            document.getElementById("sucursales-03").style.opacity = 0;
            document.getElementById("sucursales-02").style.opacity = 0;

        } else {
            document.getElementById("sucursales-03").style.opacity = 1;
            document.getElementById("sucursales-02").style.opacity = 1;

        }
    }

    container[0].addEventListener('scroll', function () {

        requestAnimationFrame(animate);

        showPosition();
        function showPosition() {
            //console.log('top: ' + window.pageYOffset);
            console.log(document.getElementById("parallax").scrollTop);
            vm.top = document.getElementById("parallax").scrollTop;
            //console.log('bottom: ' + (window.pageYOffset + window.innerHeight));


        }
    }, false);
}
