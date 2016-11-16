/* 
 * Copyright (c) 2015 by Rafael Angel Aznar Aparici (rafaaznar at gmail dot com)
 * 
 * eritay: The stunning micro-library that helps you to develop easily 
 *             AJAX web applications by using Java and jQuery
 * eritay is distributed under the MIT License (MIT)
 * Sources at https://github.com/rafaelaznar/
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */

'use strict';
moduloDocumento.controller('FacturaEditController', ['$scope', '$routeParams', '$location', 'serverService', 'sharedSpaceService', '$filter',
    function ($scope, $routeParams, $location, serverService, sharedSpaceService, $filter) {
        $scope.title = "Edición de factura";
        $scope.icon = "fa-file-text-o";
        $scope.ob = 'factura';
        $scope.op = 'edit';
        $scope.obj = null;
        $scope.id = $routeParams.id;
        $scope.result = null;

        if (sharedSpaceService.getFase() == 0) {
            serverService.promise_getOne($scope.ob, $scope.id).then(function (response) {
                $scope.obj = response.data.message;
                $scope.obj.fecha = serverService.date_toDate($scope.obj.fecha);
                $scope.obj.cambio = serverService.date_toDate($scope.obj.cambio);
            });
        } else {
            $scope.obj = sharedSpaceService.getObject();
            sharedSpaceService.setFase(0);
        }

        $scope.chooseOne = function (foreignObjectName) {
            sharedSpaceService.setObject($scope.obj);
            sharedSpaceService.setReturnLink('/' + $scope.ob + '/' + $scope.op + '/' + $scope.id);
            sharedSpaceService.setFase(1);
            $location.path('/' + foreignObjectName + '/selection/1/10');
        }

        $scope.save = function () {
            var dateAltaAsString = $filter('date')($scope.obj.fecha, "dd/MM/yyyy");
            var dateCambioAsString = $filter('date')($scope.obj.cambio, "dd/MM/yyyy");
            $scope.obj.fecha = dateAltaAsString;
            $scope.obj.cambio = dateCambioAsString;
            var jsonToSend = {json: JSON.stringify(serverService.array_identificarArray($scope.obj))};         
            serverService.promise_setOne($scope.ob, jsonToSend).then(function (data) {
                $scope.result = data;
            });
        };

        $scope.$watch('obj.obj_tipodocumento.id', function () {
            if ($scope.obj) {
                serverService.promise_getOne('tipodocumento', $scope.obj.obj_tipodocumento.id).then(function (response) {
                    if (response.status == 200) {
                        var old_id = $scope.obj.obj_tipodocumento.id;
                        $scope.obj.obj_tipodocumento = response.data.message;
                        if (response.data.message.id != 0) {
                            $scope.outerForm.obj_tipodocumento.$setValidity('exists', true);
                        } else {
                            $scope.outerForm.obj_tipodocumento.$setValidity('exists', false);
                            $scope.obj.obj_tipodocumento.id = old_id;
                        }
                    } else {

                    }
                });
            }
        });

        $scope.$watch('obj.obj_usuario.id', function () {
            if ($scope.obj) {
                serverService.promise_getOne('usuario', $scope.obj.obj_usuario.id).then(function (response) {
                    if (response.status == 200) {
                        var old_id = $scope.obj.obj_usuario.id;
                        $scope.obj.obj_usuario = response.data.message;
                        if (response.data.message.id != 0) {
                            $scope.outerForm.obj_usuario.$setValidity('exists', true);
                        } else {
                            $scope.outerForm.obj_usuario.$setValidity('exists', false);
                            $scope.obj.obj_usuario.id = old_id;
                        }
                    } else {

                    }
                });
            }
        });
        
        $scope.back = function () {
            window.history.back();
        };
        $scope.close = function () {
            $location.path('/home');
        };
        $scope.plist = function () {
            $location.path('/factura/plist');
        };


        //datepicker 1 
        $scope.open1 = function () {
            $scope.popup1.opened = true;
        };
        $scope.popup1 = {
            opened: false
        };
        $scope.dateOptions1 = {
            formatYear: 'yyyy',
            startingDay: 1
        };

        //datepicker 2 
        $scope.open2 = function () {
            $scope.popup2.opened = true;
        };
        $scope.popup2 = {
            opened: false
        };
        $scope.dateOptions2 = {
            formatYear: 'yyyy',
            startingDay: 1
        };
    }]);