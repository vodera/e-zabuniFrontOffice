'use strict';
/**
 * @ngdoc overview
 * @name CMSLoginApp
 * @description
 * # CMSLoginApp
 *
 * Login module of the application.
 */
var loginAppp = angular.module('CMSLoginApp', ['ngRoute']);

loginAppp.config(function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('');
    $routeProvider.when("/login", {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'templates/login-box.html'
    })
            .when("/changepassword", {
                url: '/changepassword',
                controller: 'ChangePasswordCtrl',
                templateUrl: 'templates/changepassword-box.html'
            })
            .when("/otp", {
                url: '/otp',
                controller: 'OTPCtrl',
                templateUrl: 'templates/otp-box.html'
            })
            .when("/registration", {
                url: '/registration',
                controller: 'RegistrationCtrl',
                templateUrl: 'templates/registration.html'
            })
            .when("/ForgotPassword", {
                url: '/ForgotPassword',
                controller: 'ForgotPasswordCtrl',
                templateUrl: 'templates/forgot-password.html'
            }).otherwise({redirectTo: "/login"});
}).
        run(function ($rootScope, $window) {
            console.log('Starting login application');



//    if ($window.localStorage.getItem('loggedInUser') != null) {
//        $window.location = 'index.html';
//    }
        })


//CONTROLLERS

loginAppp.controller('LoginCtrl', ['$scope', '$rootScope', 'DataService', '$filter', '$window', function ($scope, $rootScope, DataService, $filter, $window) {

        $rootScope.AppVersion = version;
        $scope.hName = hName;
        $scope.LoginButtonText = "Log In";
//        grecaptcha.reset();
        $scope.initCaptcha = function () {
            try {
                grecaptcha.render('g-recaptcha', {
                    'sitekey': '6Lf5e1UUAAAAAA374n3L-2ZJM64d9qgIGaxvg5c9'
                });
            } catch (ex) {
                //captcha exception
            }
        };
        $scope.doLogin = function () {
            $window.location = "#/otp";
//             if (!$scope.LoginForm.$valid) {
//                 return;
//             }
//             $scope.showLoginErrorMsg = false;
//             $rootScope.showLoading = true;
//             var data = "username=" + $scope.vm.username + "&password=" + $scope.vm.password
//                     + "&g-recaptcha-response=" + grecaptcha.getResponse();
//             $window.localStorage['username'] = $scope.vm.username;
//             DataService.login_(data).then(function (response) {
//                 console.log("login response", response)
//                 console.debug("Login response:", response.data.data);
//                 $scope.loginSuccessMsg = response.message;
//                 $window.localStorage['fullName'] = response.data.data.userInfo.fullName;
//                 $scope.showLoginSuccessMsg = true;
//                 $window.localStorage['flag'] = "isAuthenticated";
// //                var expires_in = (new Date().getTime() / 1000) + response.data.data.timeout;
// //                $window.localStorage['expiryTime'] = (expires_in * 1000);
//                 $window.localStorage['expiryTime'] = response.data.data.timeout;
//                 $rootScope.showLoading = false;
//                 $window.location = "#/otp";
//
//             }, function (error) {
//                 console.log("error......", error.data);
//                 if (error.data === null) {
//                     $scope.loginErrorMsg = 'Please check your internet connection';
//                 } else if (error.status === 400) {
//                     $scope.loginErrorMsg = error.data.message;
//                 } else if (error.status == 410) {
//                     $scope.loginErrorMsg = 'Sorry password expired please change your passoword before you proceed';
//                     $window.location = '#/changepassword';
//                 } else {
//                     $scope.loginErrorMsg = error.data.message;
//                 }
//                 grecaptcha.reset();
//                 $scope.showLoginErrorMsg = true;
//                 $rootScope.showLoading = false;
//             });
        };

        $scope.createAccount = function (){
            $window.location = "#/registration";
        }
    }])
        .controller('ChangePasswordCtrl', ['$scope', '$rootScope', 'DataService', '$window', function ($scope, $rootScope, DataService, $window) {
                $scope.username = $window.localStorage.getItem('username');
                console.log($scope.username);

                DataService.getPasswordPolicy().then(function (response) {
                    console.log("Password Policy Resp:", response.data.data);
                    $scope.PasswordPolicy = response.data.data;
                    $window.scrollTo(0, 0);
                }, function (error) {
                    console.log("error......", error.data);
                    if (error.data === null) {
                        $scope.ErrorMsg = 'Please check your internet connection';
                    } else if (error.status === 400) {
                        $scope.ErrorMsg = error.data.message;
                    } else {
                        $scope.ErrorMsg = error.data.message;
                    }
                    $scope.showErrorMsg = true;
                });


                $scope.changePassword = function () {
                    if (!$scope.ChangePasswordForm.$valid) {
                        return;
                    }
                    var formdata = new FormData();
                    formdata.append("username", $window.localStorage.getItem('username'));
                    formdata.append("currentPassword", $scope.vm.currentpassword);
                    formdata.append("newPassword", $scope.vm.newpassword);

                    $rootScope.showLoading = true;
                    $scope.showErrorMsg = false;
                    DataService.changePassword(formdata).then(function (response) {
                        console.log("password change......", response.data.data);
                        $rootScope.showLoading = false;
//                $window.localStorage['loggedInUser'] = angular.toJson(response.data.data.userDetails);
//                $window.localStorage['permissions'] = angular.toJson(response.data.data.permissions);

                        window.location = 'login.html#/login';
                        $window.reload();
                    }, function (error) {
                        console.log("error......", error.data);
                        $rootScope.showLoading = false;
                        if (error.data === null) {
                            $scope.ErrorMsg = 'Please check your internet connection';
                        } else if (error.status === 400) {
                            $scope.ErrorMsg = error.data.message;
                        } else {
                            $scope.ErrorMsg = error.data.message;
                        }
                        $scope.showErrorMsg = true;
                    });
                };
                var newpassword = document.getElementById("newpassword")
                        , confirmpassword = document.getElementById("confirmpassword");

                function validatePassword() {
                    if (newpassword.value !== confirmpassword.value) {
                        confirmpassword.setCustomValidity("Passwords Don't Match");
                    } else {
                        confirmpassword.setCustomValidity('');
                    }
                }

                newpassword.onchange = validatePassword;
                confirmpassword.onkeyup = validatePassword;
            }])
        .controller('OTPCtrl', ['$scope', '$rootScope', 'DataService', '$window', function ($scope, $rootScope, DataService, $window) {
                $scope.fullName = $window.localStorage.getItem('fullName');
                $scope.sendOTP = function () {



                    $window.localStorage['loggedInUser'] = [{
                        emailAddress: 'oderavick@gmail.com',
                        fullName: 'Victor Odera',
                        msisdn: '0718809966'
                        }]
                    $window.localStorage['permissions'] = [];
                    $window.localStorage['userType'] = "Bank Admin";
                    $window.location = '/';
                    $window.localStorage['loggedIn'] = "true";
                    $window.localStorage['redirect'] = "dashboard";



//                     if (!$scope.OTPForm.$valid) {
//                         return;
//                     }
//
//                     $rootScope.showLoading = true;
//                     DataService.sendOTP($scope.vm.otp).then(function (response) {
//                         console.log("OTP......", response.data.data);
//                         $rootScope.showLoading = false;
//                         $window.localStorage['loggedInUser'] = angular.toJson(response.data.data.userDetails);
//                         $window.localStorage['permissions'] = angular.toJson(response.data.data.permissions);
//                         $window.localStorage['userType'] = angular.toJson(response.data.data.userDetails.userType);
//                         $scope.userType = response.data.data.userDetails.userType.userType;
//                         console.log($scope.userType);
//                         if ($scope.userType === "Bank Operator") {
//                             $window.location = 'index.html';
//                             $window.localStorage['redirect'] = "dashboard";
//                         } else if ($scope.userType === "Bank Admin") {
//                             $window.location = 'index.html#/AdminDashboard';
// //                            $window.location = 'index2.html';
//                             $window.localStorage['redirect'] = "AdminDashboard"
//                         } else {
// //                $rootScope.notify('error', 'Error', 'You are not allowed to access this portal. Please contact your administrator.!');
// //                $scope.showLoginErrorMsg = true;
//
//                             DataService.logout().then(function (response) {
//                                 $window.localStorage.clear();
//                                 $window.location = 'login.html';
//                             }, function (error) {
//                                 $window.localStorage.clear();
//                                 $window.location = 'login.html';
//                             });
//
//                         }
//
//                     }, function (error) {
//                         console.log("Login error......", error.data);
//                         $rootScope.showLoading = false;
//                         if (error.data === null) {
//                             $scope.loginErrorMsg = 'Please check your internet connection';
//                         } else {
//                             $scope.loginErrorMsg = error.data.message;
//                         }
//                         $scope.showLoginErrorMsg = true;
//                     });
                };

                // $scope.resendOTP = function () {
                //     $rootScope.showLoading = true;
                //     DataService.resendOTP().then(function (response) {
                //         $rootScope.showLoading = false;
                //         $scope.loginSuccessMsg = "Resend OTP successfully";
                //         $scope.showLoginSuccessMsg = true;
                //
                //     }, function (error, res) {
                //         $rootScope.showLoading = false;
                //         if (error.status === 401) {
                //             $scope.loginErrorMsg = error.data.message;
                //             $window.location = 'login.html#/login'
                //         } else if (error.data === null) {
                //             $scope.loginErrorMsg = 'Please check your internet connection';
                //         } else {
                //             $scope.loginErrorMsg = error.data.message;
                //         }
                //         $scope.showLoginErrorMsg = true;
                //     });
                // };
            }])
        .controller('ForgotPasswordCtrl', ['$scope', '$rootScope', 'DataService', '$window', function ($scope, $rootScope, DataService, $window) {
                $rootScope.AppVersion = version;
                $scope.showLoginErrorMsg = false;

                $scope.resetPassword = function () {
                    if (!$scope.ForgotPasswordForm.$valid) {
                        return;
                    }
                    $rootScope.showLoading = true;

                    var formdata = new FormData();
                    formdata.append("email", $scope.vm.email);

                    DataService.forgotPassword(formdata).then(function (response) {
                        console.log("forgot password response......", response.data.data);
                        $rootScope.showLoading = false;
                        $window.location = 'login.html#/login';
                    }, function (error) {
                        console.log("change password error......", error.data);
                        $rootScope.showLoading = false;
                        if (error.data === null) {
                            $scope.loginErrorMsg = 'Please check your internet connection';
                        } else {
                            $scope.loginErrorMsg = error.data.message;
                        }
                        $scope.showLoginErrorMsg = true;
                    });
                };
            }])

    .controller('RegistrationCtrl', ['$rootScope', '$scope', 'DataService', '$window', function ($rootScope, $scope, DataService, $window) {
        $scope.BusinessCategories = [
            {Category:"Information Technology", id: "1"},
            {Category:"Supplies", id: "2"},
            {Category:"Construction and Engineering", id: "3"},
            {Category:"Financial Services", id: "4"},
            {Category:"Creative Arts", id: "5"},
        ];

    }])

//        SERVICES

loginAppp.service('DataService', ['$http', '$window', function ($http, $window) {

        this.login = function (formdata) {

//        return $http.post(urlBase + 'process-login', formdata,
//        {
//            headers: {
//                'X-CSRF-TOKEN':  hValue,
//                'Content-Type': 'multipart/form-data'}
//        });


            return fetch('process-login',
                    {
                        method: 'POST',
                        headers: {'X-CSRF-TOKEN': hValue, 'Accept': 'Application/json'},
                        body: formdata,
                        credentials: 'include'
                    });
        };

        this.login_ = function (urlencodedData) {
            return $http.post('process-login', urlencodedData,
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': 'application/x-www-form-urlencoded'}
                    });
        };

        this.changePassword = function (formdata) {
            return $http.post(urlBase + 'users/password', formdata,
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': undefined}
                    });
        };

        this.sendOTP = function (otp) {
//        console.log("OTP:", otp);
//        console.log("access_token:", $window.localStorage.getItem('access_token'));

            return $http.post(urlBase + 'otp/verification?&userIp=192.168.8.675&userAgent=Browser/Application&otp=' + otp, {},
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };

        this.resendOTP = function () {
            return $http.get(urlBase + 'otp/resend',
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': undefined}
                    });
        };
        this.forgotPassword = function (formdata) {
            console.log("email", formdata);
            console.log("access_token:", $window.localStorage.getItem('access_token'));
            return $http.post(urlBase + 'users/forgot-password', formdata,
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': undefined}
                    });
        };

        this.getPasswordPolicy = function () {
            return $http.get(urlBase + 'sys-config/password',
                    {
                        headers: {'X-CSRF-TOKEN': hValue, 'Content-Type': undefined}
                    });
        };

        this.logout = function () {
            return $http.post('/logout', {},
                    {
                        headers: {'X-CSRF-TOKEN': hValue}
                    });
        };
    }])


//DIRECTIVES

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
loginAppp.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
}).directive("required", function () {
//   return {
//       restrict: 'A', //only want it triggered for attributes
//       compile: function(element) {
//          //could add a check to make sure it's an input element if need be
//           //element.after("<span class='required_asterisk'>*</span>");
//       }
//   };

    return {
        link: function (scope, element, attributes) {
            element.addClass('required_asterisk');
        }
    };
})


//CONFIG

var version = "1.0.0.1";

/* DEV ENV URL */
var urlBase = '/';

/* DEV ENV PUBLIC URL*/

var urlBase = 'api/';

/* SYSTEM IDLE TIMEOUT */
var idleTimeout = 15 * 60; //In Seconds

//HEADER VALUE
var hValue = document.head.querySelector("[name=_csrf]").content;

//HEADER NAME
var hName = document.head.querySelector("[name=_csrf_header]").content;



