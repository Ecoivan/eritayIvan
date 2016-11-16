/*
 * Copyright (c) 2015 by Rafael Angel Aznar Aparici (rafaaznar at gmail dot com)
 * 
 * eritay: The stunning micro-library that helps you to develop easily 
 *             AJAX web applications by using Java and jQuery
 * eritay is distributed under the MIT License (MIT)
 * Sources at https://github.com/rafaelaznar/eritay
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
 */

'use strict';
angular.module('Services', [])
        .factory('serverService', function ($http) {
            function getFilter(filter, filteroperator, filtervalue) {
                var filterParams;
                if (filter) {
                    filterParams = "&filter=" + filter + "&filteroperator=" + filteroperator + "&filtervalue=" + filtervalue;
                } else {
                    filterParams = "";
                }
                return filterParams;
            }
            ;
            function getOrder(order, ordervalue) {
                var orderParams;
                if (order) {
                    orderParams = '&order=' + order + '&ordervalue=' + ordervalue;
                } else {
                    orderParams = "";
                }
                return orderParams;
            }
            ;
            return {
                isAppInProductionMode: function () {
                    return false;
                },
                getAppClientUrl: function () {
                    return location.protocol + '//' + location.hostname + ':' + location.port + '/' + this.getAppName();
                },
//                        getAppUrl: function () {
//                        return location.protocol + '//' + location.hostname + ':' + location.port + '/' + this.getAppName() + '/json';
//                        },
                getAppUrl: function () {
                    return "http://localhost:8084/zylkanexy/json";
                    //return location.protocol + '//' + location.hostname + ':' + location.port + '/' + this.getAppName() + '/index.php';
                },
                date_toDate: function (input) {
                    var parts = input.split('/');
                    return new Date(parts[2], parts[1] - 1, parts[0]);
                },
                getAppName: function () {
                    var strPath = window.location.pathname;
                    return strPath.substr(1, strPath.substr(1, strPath.length).indexOf('/'));
                },
                ////////////////////////////////////////////////////////////////
                getLoginPromise: function (username, password) {
                    return $http.get(this.getAppUrl() + '?ob=usuario&op=login&user=' + username + '&pass=' + password, 'GET', '');
                },
                getLogoutPromise: function () {
                    return $http.get(this.getAppUrl() + '?ob=usuario&op=logout', 'GET', '');
                },
                getSessionPromise: function () {
                    return $http.get(this.getAppUrl() + '?ob=usuario&op=getsessionstatus', 'GET', '');
                },
                promise_getCount: function (strObject, filter) {
                    if (filter) {
                        filter = "&filter=" + filter;
                    } else {
                        filter = "";
                    }
                    return $http.get(this.getAppUrl() + '?ob=' + strObject + '&op=getcount' + filter, 'GET', '');
                },
                promise_getPage: function (strObject, rpp, page, filter, order) {
                    if (filter) {
                        filter = "&filter=" + filter;
                    } else {
                        filter = "";
                    }
                    if (order) {
                        order = "&order=" + order;
                    } else {
                        order = "";
                    }
                    return $http.get(this.getAppUrl() + '?ob=' + strObject + '&op=getpage&page=' + page + "&rpp=" + rpp + filter + order, 'GET', '');
                },
                calculatePages: function (regsPerPage, totalRegisters) {
                    var pages = Math.floor(totalRegisters / regsPerPage);
                    var remainderPages = totalRegisters % regsPerPage;
                    if (remainderPages > 0) {
                        pages++;
                    }
                    return pages;
                },
                promise_getOne: function (strClass, id) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=get&id=' + id, 'GET', '');
                },
                promise_removeOne: function (strClass, id) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=remove&id=' + id, 'GET', '');
                },
                pendent_promise_setOne: function (strClass, jsonfile) {
                    $http({
                        method: 'GET',
                        url: this.getAppUrl() + '?ob=' + strClass + '&op=set',
                        data: {params: jsonfile},
                        withCredentials: true,
                        headers: {'Content-Type': 'application/json;charset=utf-8'}
                    })
                },
                promise_setOne: function (strClass, jsonfile) {
                    $http.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=set', {params: jsonfile});
                },
                ////////////////////////////////////////////////////////////////
                promise_getMeta: function (strClass) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=getmetainformation', 'GET', '');
                },
                promise_getSome: function (strClass, rpp, page, filterParams, orderParams, systemfilterParams) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=getaggregateviewsome' + '&rpp=' + rpp + '&page=' + page + filterParams + orderParams + systemfilterParams, 'GET', '');
                },
                promise_getAll: function (strClass, filterParams, orderParams, systemfilterParams) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=getaggregateviewall' + filterParams + orderParams + systemfilterParams, 'GET', '');
                },
                promise_getPromise: function (strClass, operation, params) {
                    return $http.get(this.getAppUrl() + '?ob=' + strClass + '&op=' + operation + params, 'GET', '');
                },
                getDataFromPromise: function (promise) {
                    return promise.then(function (result) {
                        return result;
                    });
                },
                get: function (objeto, numero) {
                    return $http.get('/' + this.appName + '/json' + objeto + '/' + numero + '/get.json').then(function (result) {
                        return result.data;
                    });
                },
                getPage: function (objeto, pagina, order, ordervalue, rpp, filter, filteroperator, filtervalue, systemfilter, systemfilteroperator, systemfiltervalue) {
                    var orderParams = getOrder(order, ordervalue);
                    var filterParams = getFilter(filter, filteroperator, filtervalue);
                    var systemfilterParams = getFilter(systemfilter, systemfilteroperator, systemfiltervalue);
                    //console.log('/' + appName + '/' + objeto + '/' + rpp + '/' + pagina + '/getpage.json?' + filterParams + orderParams + systemfilterParams);
                    return $http.get('/' + appName + '/' + objeto + '/' + rpp + '/' + pagina + '/getpage.json?' + filterParams + orderParams + systemfilterParams).then(function (result) {
                        return result.data;
                    });
                },
                getFieldNames: function (objeto) {
                    return $http.get('/' + appName + '/' + objeto + '/getcolumns.json').then(function (result) {
                        return result.data;
                    });
                },
                getPrettyFieldNames: function (objeto) {
                    return $http.get('/' + appName + '/' + objeto + '/getprettycolumns.json').then(function (result) {
                        return result.data;
                    });
                },
                getPages: function (objeto, rpp, filter, filteroperator, filtervalue, systemfilter, systemfilteroperator, systemfiltervalue) {
                    var filterParams = getFilter(filter, filteroperator, filtervalue);
                    var systemfilterParams = getFilter(systemfilter, systemfilteroperator, systemfiltervalue);
                    return $http.get('/' + appName + '/' + objeto + '/' + rpp + '/getpages.json?' + filterParams + systemfilterParams).then(function (result) {
                        return result.data;
                    });
                },
                remove: function (objeto, numero) {
                    return $http.get('/' + appName + '/' + objeto + '/' + numero + '/remove.json').then(function (result) {
                        return result.data;
                    });
                },
                save: function (objeto, datos) {
                    $http.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';
//


                    $http({
                        url: this.getAppUrl() + '?ob=' + strClass + '&op=set',
                        method: "GET",
                        params: jsonfile
                    });
                },
                array_identificarArray: function (arr) {
                    var newObj = {};
                    for (var property in arr) {
                        if (arr.hasOwnProperty(property)) {
                            if (property.match("^obj_")) {
                                newObj[property.replace("obj_", "id_")] = arr[property].id;
                            } else {
                                newObj[property] = arr[property];
                            }
                        }
                    }
                    return newObj;
                },
                getPaginationBar: function (objeto, accion, page_number, total_pages, neighborhood, nrpp) {
                    page_number = parseInt(page_number);
                    total_pages = parseInt(total_pages);
                    neighborhood = parseInt(neighborhood);
                    var link = '#/' + objeto + '/' + accion + '/';
                    var vector = "<div class=\"pagination\"><ul>";
                    if (page_number > 1)
                        vector += ("<li><a class=\"pagination_link\" id=\"" + (page_number - 1) + "\" href=\"" + link + (page_number - 1) + "/" + nrpp + "\">prev</a></li>");
                    if (page_number > neighborhood + 1)
                        vector += ("<li><a class=\"pagination_link\" id=\"1\" href=\"" + link + "1/" + nrpp + "\">1</a></li>");
                    if (page_number > neighborhood + 2)
                        vector += ("<li>" + "<a href=\"#\">...</a>" + "</li>");
                    for (var i = (page_number - neighborhood); i <= (page_number + neighborhood); i++) {
                        if (i >= 1 && i <= total_pages) {
                            if (page_number == i) {
                                vector += ("<li class=\"active\"><a class=\"pagination_link\" id=\"" + i + "\" href=\"" + link + i + "/" + nrpp + "\">" + i + "</a></li>");
                            } else
                                vector += ("<li><a class=\"pagination_link\" id=\"" + i + "\" href=\"" + link + i + "/" + nrpp + "\">" + i + "</a></li>");
                        }
                    }
                    if (page_number < total_pages - (neighborhood + 1))
                        vector += ("<li>" + "<a href=\"#\">...</a>" + "</li>");
                    if (page_number < total_pages - (neighborhood))
                        vector += ("<li><a class=\"pagination_link\" id=\"" + total_pages + "\" href=\"" + link + total_pages + "/" + nrpp + "\">" + total_pages + "</a></li>");
                    if (page_number < total_pages)
                        vector += ("<li><a class=\"pagination_link\"  id=\"" + (page_number + 1) + "\" href=\"" + link + (page_number + 1) + "/" + nrpp + "\">next</a></li>");
                    vector += "</ul></div>";
                    return vector;
                },
                getNrppBar: function (objeto, accion, page_number, nrpp) {
                    var link = '#/' + objeto + '/' + accion + '/';
                    var vector = "<div class=\"pagination\"><ul>";
                    if (nrpp == 5)
                        vector += "<li class=\"active\" >";
                    else
                        vector += "<li> ";
                    vector += "<a class=\"nrpp\" id=\"nrrp5\" href=\"" + link + page_number + "/5" + "\">5</a></li>";
                    if (nrpp == 10)
                        vector += "<li class=\"active\" >";
                    else
                        vector += "<li> ";
                    vector += "<a class=\"nrpp\" id=\"nrrp10\" href=\"" + link + page_number + "/10" + "\">10</a></li>";
                    if (nrpp == 20)
                        vector += "<li class=\"active\" >";
                    else
                        vector += "<li> ";
                    vector += "<a class=\"nrpp\" id=\"nrrp20\" href=\"" + link + page_number + "/20" + "\">20</a></li>";
                    if (nrpp == 50)
                        vector += "<li class=\"active\" >";
                    else
                        vector += "<li> ";
                    ;
                    vector += "<a class=\"nrpp\" id=\"nrrp50\" href=\"" + link + page_number + "/50" + "\">50</a></li>";
                    if (nrpp == 100)
                        vector += "<li class=\"active\" >";
                    else
                        vector += "<li> ";
                    vector += "<a class=\"nrpp\" id=\"nrrp100\" href=\"" + link + page_number + "/100" + "\">100</a></li>";
                    // http://localhost:8081/AjaxStockUniDaoSpring/index.jsp#/cliente/4/nrpp
                    vector += "</ul></div>";
                    return vector;
                },
                parameter_printOrderParamsInUrl: function (objParams) {
                    if (objParams)
                        if (objParams.order) {
                            return '&order=' + objParams.order + '&ordervalue=' + objParams.ordervalue;
                        } else {
                            return '';
                        }
                    else
                        return '';
                },
                parameter_printFilterParamsInUrl: function (objParams) {
                    if (objParams)
                        if (objParams.filter) {
                            return "&filter=" + objParams.filter + "&filteroperator=" + objParams.filteroperator + "&filtervalue=" + objParams.filtervalue;
                        } else {
                            return '';
                        }
                    else
                        return '';
                },
                parameter_printSystemFilterParamsInUrl: function (objParams) {
                    if (objParams)
                        if (objParams.systemfilter) {
                            return "&systemfilter=" + objParams.systemfilter + "&systemfilteroperator=" + objParams.systemfilteroperator + "&systemfiltervalue=" + objParams.systemfiltervalue;
                        } else {
                            return '';
                        }
                    else
                        return '';
                }



            };
        })
        .factory('sharedSpaceService', function ($http) {
            var obj = {};
            var link = "";
            var fase = 0;
            return {
                getObject: function () {
                    return obj;
                },
                setObject: function (value) {
                    obj = value;
                },
                getReturnLink: function () {
                    return link;
                },
                setReturnLink: function (value) {
                    link = value;
                },
                getFase: function () {
                    return fase;
                },
                setFase: function (value) {
                    fase = value;
                }

            };
        })
        .factory('sessionService', function ($http) {
            var isSessionActive = false;
            var username = "";
            return {
                getUsername: function () {
                    return username;
                },
                setUsername: function (value) {
                    username = value;
                },
                isSessionActive: function () {
                    return isSessionActive;
                },
                setSessionInactive: function () {
                    isSessionActive = false;
                },
                setSessionActive: function () {
                    isSessionActive = true;
                }

            };
        })
        .value('version', '0.1');
