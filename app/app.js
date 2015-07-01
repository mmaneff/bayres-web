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
    vm.agregarProducto = agregarProducto;
    vm.agregarOferta = agregarOferta;
    vm.searchByName = searchByName;
    vm.showDetails = showDetails;
    vm.showDetailsOferta = showDetailsOferta;
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
    //Agregado por mateo
    vm.actualizarCliente = actualizarCliente;
    vm.confirmarCarrito = confirmarCarrito;
    vm.selectDetalle = selectDetalle;
    vm.borrarCarrito = borrarCarrito;
    vm.masVendidosForm = masVendidosForm;
    vm.destacadosForm = destacadosForm;
    vm.sucursalesForm = sucursalesForm;
    vm.ofertasForm = ofertasForm;
    vm.detalles = [];
    vm.pass_old = '';
    vm.pass_new = '';

    //Manejo de errores
    vm.message_error = '';
    vm.update_error = '0';
    vm.change_pwd_error = '0';
    vm.carrito_mensaje = '0';

    vm.menu_mobile = false;
    vm.menu_mobile_open = false;

    //console.log(window.innerWidth);

    window.addEventListener('resize', function () {
        vm.menu_mobile = (window.innerWidth < 800);

        //if (window.innerWidth < 800) {
        //    vm.menu_mobile = true;
        //} else {
        //    vm.menu_mobile = false;
        //
        //}
        $scope.$apply();
    });

    if (window.innerWidth < 800) {
        vm.menu_mobile = true;
    }


    if (!LoginService.checkLogged()) {

    } else {
        vm.user_is_logged = true;

        vm.cliente = LoginService.checkLogged().cliente[0];
        console.log(vm.cliente);
    }


    acAngularSucursalesService.getSucursales(function (data) {
        vm.sucursales = data;
        vm.sucursal = data[0];
    });

    function destacadosForm() {
        document.getElementById("parallax").scrollTop = 1036;
        vm.active_form = 'main';
    }

    function masVendidosForm() {
        document.getElementById("parallax").scrollTop = 1536;
        vm.active_form = 'main';
    }

    function sucursalesForm() {
        document.getElementById("parallax").scrollTop = 0;
        vm.active_form = 'main';
    }


    function ofertasForm() {
        document.getElementById("parallax").scrollTop = 636;
        vm.active_form = 'main';
    }


    //Estas 2 funciones solo sirven para el link del login
    function ingresarCliente() {
        vm.active_form = 'login';
        vm.creaCliente = false;
        document.getElementById("parallax").scrollTop = 636;
    }

    function crearCliente() {
        vm.message_error = '';
        vm.active_form = 'login';
        vm.creaCliente = true;
        document.getElementById("parallax").scrollTop = 636;
    }

    function modificarPass(){
        inicializarVariables();

        if (!LoginService.checkLogged()) {

        } else {
            if(vm.pass_old.trim().length > 0 && vm.pass_new.trim().length > 0) {
                //if((vm.pass_old.trim().length >= 5 && vm.pass_old.trim().length <= 25)
                //    && (vm.pass_new.trim().length >= 5 && vm.pass_new.trim().length <= 25)) {

                vm.user_is_logged = true;
                vm.cliente_id = LoginService.checkLogged().cliente[0].cliente_id;

                LoginService.changePassword(vm.cliente_id, vm.pass_old, vm.pass_new,
                    function (data) {
                        vm.change_pwd_error = '1';
                        if(data == 1) {
                            vm.message_error = 'La contrase単a se modifico satisfactoriamente';
                        }
                        else {
                            vm.change_pwd_error = '1';
                            vm.message_error = 'Error modificando la contrase単a';
                        }
                        console.log(data);
                    });
                /*}
                 else {
                 vm.change_pwd_error = '1';
                 vm.message_error = 'Las contrase単as deben contener de 5 a 25 caracteres';
                 }*/
            }
            else {
                vm.change_pwd_error = '1';
                vm.message_error = 'Las contrase単as no pueden ser vacias';
            }
        }
    }

    function inicializarVariables() {
        vm.update_error = '0';
        vm.change_pwd_error = '0';
        vm.message_error = '';
        vm.carrito_mensaje = '0';
    }

    function actualizarCliente() {
        inicializarVariables();

        if (!LoginService.checkLogged()) {
            //Si no esta logueado lo pongo en false
            vm.user_is_logged = false;
            //lo mando al formulario para logueo
            vm.active_form = 'login';
            //limpio el objeto cliente
            vm.cliente = {};
        } else {
            vm.user_is_logged = true;
            if(vm.cliente.apellido.trim().length > 0 && vm.cliente.nombre.trim().length > 0 && vm.cliente.mail.trim().length > 0) {
                if (ValidateEmail(vm.cliente.mail.trim())) {
                    LoginService.getClienteByEmail(vm.cliente.mail.trim(), function(data) {
                         if (data.user != null) {
                             if(vm.cliente.cliente_id == data.user.cliente_id){
                                 //Si no encontro dentro de la db otro cliente
                                 //con el email ingresado, actualizo los datos
                                 LoginService.updateCliente(vm.cliente.cliente_id, vm.cliente.nombre.trim(), vm.cliente.apellido.trim(),
                                    vm.cliente.mail.trim(), vm.cliente.direccion.trim(), function(data) {
                                         if (data.result) {
                                             vm.update_error = '1';
                                             vm.message_error = 'Los datos se actualizaron satisfactoriamente';
                                         }
                                         else {
                                             vm.update_error = '1';
                                             vm.message_error = 'Error modificando los datos 1';
                                         }
                                     });
                             }
                             else {
                                 vm.update_error = '1';
                                 vm.message_error = 'Ya existe otro cliente con el email ingresado';
                             }
                         }
                         else {
                             //Si no encontro dentro de la db otro cliente
                             //con el email ingresado, actualizo los datos
                             LoginService.updateCliente(vm.cliente.cliente_id, vm.cliente.nombre.trim(), vm.cliente.apellido.trim(),
                                 vm.cliente.mail.trim(), vm.cliente.direccion.trim(), function(data){
                                     console.log(data.result);
                                     console.log((data.result) ? 1 : 0);
                                 if(data.result) {
                                     vm.update_error = '1';
                                     vm.message_error = 'Los datos se actualizaron satisfactoriamente';
                                 }
                                 else {
                                    vm.update_error = '1';
                                    vm.message_error = 'Error modificando los datos 2';
                                 }
                             });
                         }
                     });
                }
                else {
                    vm.update_error = '1';
                    vm.message_error = 'El mail no es valido';
                }
            }
            else {
                vm.update_error = '1';
                vm.message_error = 'Los campos no deben estar vacios';
            }
        }
    }

    /**
     *
     * @param email
     * @returns {boolean}
     */
    function ValidateEmail(email)
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email)
    }

    function finalizarCompra() {

        var envio_retira = (vm.tipo == 0) ? vm.envios : vm.sucursal.nombre;

        var ret_comprar = acAngularCarritoServiceAcciones.comprar(envio_retira, function (data) {

            vm.compraTerminada = true;
            $timeout(function () {
                vm.compraTerminada = false;
                vm.active_form = 'main';
            }, 2000);
        });

        if(ret_comprar === false){
            console.log('Mensaje de Carrito Vacío');
        }
    }


    function logout() {
        LoginService.logout();
        vm.user_is_logged = false;
        vm.active_form = 'main';
    }

    function nuevoCliente() {
        vm.message_error = '';
        vm.usuario_creado = 0;
        document.getElementById("parallax").scrollTop = 636;
        if(vm.mail.trim().length > 0 && vm.mail_repeat.trim().length > 0) {
            if(vm.mail.trim() === vm.mail_repeat.trim()) {
                console.log('llamando al create');
                LoginService.create(vm.nombre, vm.apellido, vm.mail, vm.password, vm.fecha_nacimiento,
                    vm.telefono, vm.direccion, function (data) {
                        if (data == 'true') {
                            vm.active_form = 'main';
                            vm.nombre = '';
                            vm.apellido = '';
                            vm.mail = '';
                            vm.password = '';
                            vm.fecha_nacimiento = '';
                            vm.telefono = '';
                            vm.direccion = '';
                            vm.mail_repeat = '';
                        }
                        else {
                            vm.message_error = 'Ocurrio un error creando el usuario';
                            vm.usuario_creado = -1;
                        }
                    });
            }
            else {
                vm.message_error = 'Los correos deben ser iguales';
                vm.usuario_creado = -1;
            }
        }
        else {
            vm.message_error = 'Los correos son obligatorios';
            vm.usuario_creado = -1;
        }
    }

    function ingresar() {
        document.getElementById("parallax").scrollTop = 636;
        LoginService.login(vm.mail.trim(), vm.password.trim(), function (data) {
            if (data[0].nombre != null && data[0].nombre.trim().length > 0) {
                vm.active_form = 'carrito';
                //vm.nombre = data[0].nombre;
                vm.user_is_logged = true;
                vm.cliente = data[0];
                vm.mail = '';
                vm.password = '';

                LoginService.getHistoricoPedidos(LoginService.checkLogged().cliente[0].cliente_id,
                    function (data2) {
                        console.log(data2);
                        vm.historico_pedidos = data2;
                    });

            } else {
                vm.message_error = 'Mail o password incorrectos';
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
        inicializarVariables();

        document.getElementById("parallax").scrollTop = 636;
        if (!LoginService.checkLogged()) {
            vm.active_form = 'login';
        } else {
            vm.active_form = 'cuenta';
        }
    }

    function showDetailsOferta(oferta){
        var prod_oferta = {};
        prod_oferta["producto_id"] = -1;
        prod_oferta.precios = [];
        var precio = {precio:0};
        prod_oferta.precios.push(precio);
        prod_oferta.precios[0].precio = oferta.precio;
        prod_oferta.cantidad = 1;

        prod_oferta.fotos = [];
        var foto = {nombre:''};
        prod_oferta.fotos.push(foto);
        prod_oferta.fotos[0].nombre = oferta.imagen;

        prod_oferta.oferta_id = oferta.oferta_id;
        prod_oferta.nombre = oferta.titulo;
        prod_oferta.descripcion = oferta.descripcion;


        showDetails(prod_oferta);
    }

    function showDetails(detalle) {
        vm.active_form_before = vm.active_form;
        vm.active_form = 'details';

        vm.detalle = detalle;
        vm.details = true;
        vm.top_before = document.getElementById("parallax").scrollTop;
        document.getElementById("parallax").scrollTop = 636;

        console.log(vm.detalle);

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

    function confirmarCarrito() {
        inicializarVariables();

        vm.carrito_mensaje = '1';
        vm.message_error = 'El pedido acaba de ser enviado';
    }

    function borrarCarrito() {
        inicializarVariables();

        vm.carrito_mensaje = '1';
        vm.message_error = 'El carrito se borro satisfactoriamente';
    }

    function selectDetalle() {
        vm.detalles = vm.historico_pedidos[2].detalles;
    }

    acAngularProductosService.getOfertas(function (data) {
        console.log(data);
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



    function agregarProducto(producto){

        producto.oferta_id = -1;
        addProducto(producto);
    }

    function agregarOferta(oferta){
        var prod_oferta = {};

        prod_oferta["producto_id"] = -1;
        prod_oferta.precios = [];
        var precio = {precio:0};
        prod_oferta.precios.push(precio);
        prod_oferta.precios[0].precio = oferta.precio;
        prod_oferta.cantidad = 1;
        prod_oferta.oferta_id = oferta.oferta_id;
        prod_oferta.nombre = oferta.titulo;
        prod_oferta.descripcion = oferta.descripcion;
        addProducto(prod_oferta);
    }


    function addProducto(producto) {


        //console.log(producto);
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
