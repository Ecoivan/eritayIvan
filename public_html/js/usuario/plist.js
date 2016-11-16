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

moduloUsuario.controller('UsuarioPListController', ['$scope', '$routeParams', 'serverService', '$location',
    function ($scope, $routeParams, serverService, $location) {
        
        $scope.visibles={};
        $scope.visibles.id = true;
        $scope.visibles.nombre = true;
        $scope.visibles.apellido1 = true;
        $scope.visibles.apellido2 = true;
        $scope.visibles.dni = true;
        $scope.visibles.tipo_usuario = true;


        $scope.ob = "usuario";
        $scope.op = "plist";
        $scope.title = "Listado de usuarios";
        $scope.icon = "fa-user";
        $scope.neighbourhood = 2;

        if (!$routeParams.page) {
            $routeParams.page = 1;
        }

        if (!$routeParams.rpp) {
            $routeParams.rpp = 10;
        }

        $scope.numpage = $routeParams.page;
        $scope.rpp = $routeParams.rpp;

        $scope.order = "";
        $scope.ordervalue = "";
        $scope.filter = "id";
        $scope.filteroperator = "like";
        $scope.filtervalue = "";
        $scope.systemfilter = "";
        $scope.systemfilteroperator = "";
        $scope.systemfiltervalue = "";
        $scope.params = "";
        $scope.paramsWithoutOrder = "";
        $scope.paramsWithoutFilter = "";
        $scope.paramsWithoutSystemFilter = "";

        if ($routeParams.order && $routeParams.ordervalue) {
            $scope.order = $routeParams.order;
            $scope.ordervalue = $routeParams.ordervalue;
            $scope.orderParams = "&order=" + $routeParams.order + "&ordervalue=" + $routeParams.ordervalue;
            $scope.paramsWithoutFilter += $scope.orderParams;
            $scope.paramsWithoutSystemFilter += $scope.orderParams;
        } else {
            $scope.orderParams = "";
        }

        if ($routeParams.filter && $routeParams.filteroperator && $routeParams.filtervalue) {
            $scope.filter = $routeParams.filter;
            $scope.filteroperator = $routeParams.filteroperator;
            $scope.filtervalue = $routeParams.filtervalue;
            $scope.filterParams = "&filter=" + $routeParams.filter + "&filteroperator=" + $routeParams.filteroperator + "&filtervalue=" + $routeParams.filtervalue;
            $scope.paramsWithoutOrder += $scope.filterParams;
            $scope.paramsWithoutSystemFilter += $scope.filterParams;
        } else {
            $scope.filterParams = "";
        }

        if ($routeParams.systemfilter && $routeParams.systemfilteroperator && $routeParams.systemfiltervalue) {
            $scope.systemFilterParams = "&systemfilter=" + $routeParams.systemfilter + "&systemfilteroperator=" + $routeParams.systemfilteroperator + "&systemfiltervalue=" + $routeParams.systemfiltervalue;
            $scope.paramsWithoutOrder += $scope.systemFilterParams;
            $scope.paramsWithoutFilter += $scope.systemFilterParams;
        } else {
            $scope.systemFilterParams = "";
        }

        $scope.params = ($scope.orderParams + $scope.filterParams + $scope.systemFilterParams);
        $scope.params = $scope.params.replace('&', '?');

        serverService.promise_getCount($scope.ob, $scope.filterExpression).then(function (response) {
            if (response.status == 200) {
                $scope.registers = response.data.message;
                $scope.pages = serverService.calculatePages($scope.rpp, $scope.registers);
                if ($scope.numpage > $scope.pages) {
                    $scope.numpage = $scope.pages;
                }
                return serverService.promise_getPage($scope.ob, $scope.rpp, $scope.numpage, $scope.filterExpression, $routeParams.order);
            } else {
                $scope.status = "Error en la recepción de datos del servidor";
            }
        }).then(function (response) {
            if (response.status == 200) {
                $scope.page = response.data.message;
                $scope.status = "";
            } else {
                $scope.status = "Error en la recepción de datos del servidor";
            }
        }).catch(function (data) {
            $scope.status = "Error en la recepción de datos del servidor";
        });

        $scope.getRangeArray = function (lowEnd, highEnd) {
            var rangeArray = [];
            for (var i = lowEnd; i <= highEnd; i++) {
                rangeArray.push(i);
            }
            return rangeArray;
        };
        $scope.evaluateMin = function (lowEnd, highEnd) {
            return Math.min(lowEnd, highEnd);
        };
        $scope.evaluateMax = function (lowEnd, highEnd) {
            return Math.max(lowEnd, highEnd);
        };

        $scope.dofilter = function () {
            if ($scope.filter != "" && $scope.filteroperator != "" && $scope.filtervalue != "") {
                if ($routeParams.order && $routeParams.ordervalue) {
                    if ($routeParams.systemfilter && $routeParams.systemfilteroperator) {
                        $location.path($scope.ob + '/' + $scope.op + '/' + $scope.numpage + '/' + $scope.rpp).search('filter', $scope.filter).search('filteroperator', $scope.filteroperator).search('filtervalue', $scope.filtervalue).search('order', $routeParams.order).search('ordervalue', $routeParams.ordervalue).search('systemfilter', $routeParams.systemfilter).search('systemfilteroperator', $routeParams.systemfilteroperator).search('systemfiltervalue', $routeParams.systemfiltervalue);
                    } else {
                        $location.path($scope.ob + '/' + $scope.op + '/' + $scope.numpage + '/' + $scope.rpp).search('filter', $scope.filter).search('filteroperator', $scope.filteroperator).search('filtervalue', $scope.filtervalue).search('order', $routeParams.order).search('ordervalue', $routeParams.ordervalue);
                    }
                } else {
                    $location.path($scope.ob + '/' + $scope.op + '/' + $scope.numpage + '/' + $scope.rpp).search('filter', $scope.filter).search('filteroperator', $scope.filteroperator).search('filtervalue', $scope.filtervalue);
                }
            }
            return false;
        };


    }]);