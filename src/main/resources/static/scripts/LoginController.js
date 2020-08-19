'use strict';
/**
 * @ngdoc function
 * @name CMSLoginApp:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the CMSLoginApp
 */

loginAppp.controller('LoginCtrl', ['$scope', '$rootScope', 'DataService', '$filter', '$window', function ($scope, $rootScope, DataService, $filter, $window) {

        $rootScope.AppVersion = version;
        $scope.hName = hName;

//        $scope.$on('$routeChangeStart', function (angularEvent, newUrl) {
//            console.log("URL......", newUrl.url);
//            if (newUrl.url === '/otp' && $window.localStorage.getItem('flag') === null) {
//                // User isnâ€™t authenticated
//                window.location = 'login.html#/login';
//            }
//        });

        $scope.doLogin = function () {
            if (!$scope.LoginForm.$valid) {
                return;
            }

            
//            var user = {};
//            user['username'] = $scope.vm.username;
//            user['password'] = $scope.vm.password;

            var formdata = new FormData();
            formdata.append("username", $scope.vm.username);
            formdata.append("password", $scope.vm.password);

//                console.log("formdata", formdata)
            $window.localStorage['username'] = $scope.vm.username;
            $rootScope.showLoading = true;
             DataService.login(formdata).then(function(response){ return response.json();})
                    .then(function (response) {
                        console.log("Logging response", response);
                        $rootScope.showLoading = false;
                        if(response.code === 200){
                            $window.localStorage['flag'] = "isAuthenticated";
                             $window.location = "#/otp";;
                        } else {
                            $scope.loginErrorMsg = response.message;
                            $scope.showLoginErrorMsg = true;
                            $rootScope.showLoading = false;
                            if (response.code === 410) {
                                $window.location = '#/changepassword';
                            } else {
                                alert(response.message);
//                                $scope.loginErrorMsg = response.message;

                            }
                            
                        }

                    });
//            DataService.login(formdata)
//                    .then((response) => response.json())
//                    .then(function (response) {
//                        console.log("Logging response", response);
//                        console.log("formdata", formdata);
//                        $rootScope.showLoading = false;
//                        if (response.code === 200) {
//                            $window.localStorage['flag'] = "isAuthenticated";
//                            $window.location = "#/otp";
//                        } else {
////                            $rootScope.showLoading = false;
//                            if (response.data === null) {
//                                $scope.loginErrorMsg = 'Please check your internet connection';
//                            } else if (response.code === 410) {
////                              $scope.loginErrorMsg = 'please change your passoword before you proceed';
//
//                                $window.location = '#/changepassword';
//                            } else {
//                                $scope.loginErrorMsg = response.message;
//                            }
//                            $scope.showLoginErrorMsg = true;
//                        }
//                    });
                  
                  
//                    .then(function (response) {
//                        console.log("Logging response", response);
//                        $rootScope.showLoading = false;
//                        if(response.code === 200){
//                            $window.localStorage['flag'] = "isAuthenticated";
//                             $window.location = "#/otp";
//                        } else {
//                            $rootScope.showLoading = false;
//                        if (response.data === null) {
//                            $scope.loginErrorMsg = 'Please check your internet connection';
//                        } else if (response.code === 410) {
//                    $scope.loginErrorMsg = 'please change your passoword before you proceed';
//
//                            $window.location = '#/changepassword';
//                        } else {
//                            $scope.loginErrorMsg = response.message;
//                        }
//                       $scope.showLoginErrorMsg = true;
//                       }
//               
//                    });

        };
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
                    DataService.changePassword(formdata).then(function (response) {
                        console.log("password change......", response.data.data);
                        $rootScope.showLoading = false;
//                $window.localStorage['loggedInUser'] = angular.toJson(response.data.data.userDetails);
//                $window.localStorage['permissions'] = angular.toJson(response.data.data.permissions);

                        window.location = 'login.html#/login';
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
//        var newpassword = document.getElementById("newpassword")
//        , confirmpassword = document.getElementById("confirmpassword");
//        
//        function validatePassword(){
//            if(newpassword.value !== confirmpassword.value) {
//              confirmpassword.setCustomValidity("Passwords Don't Match");
//            } else {
//              confirmpassword.setCustomValidity('');
//            }
//          }
//
//          newpassword.onchange = validatePassword;
//          confirmpassword.onkeyup = validatePassword;
            }])
        .controller('OTPCtrl', ['$scope', '$rootScope', 'DataService', '$window', function ($scope, $rootScope, DataService, $window) {

                $scope.sendOTP = function () {
                    if (!$scope.OTPForm.$valid) {
                        return;
                    }

                    $rootScope.showLoading = true;
                    DataService.sendOTP($scope.vm.otp).then(function (response) {
                        console.log("OTP......", response.data.data);
                        $rootScope.showLoading = false;
                        $window.localStorage['loggedInUser'] = angular.toJson(response.data.data.userDetails);
                        $window.localStorage['permissions'] = angular.toJson(response.data.data.permissions);
                        $scope.userType = response.data.data.userDetails.userType;

                        console.log($scope.userType);
                        if ($scope.userType === "Bank Operator" || $scope.userType === "Bank Admin") {
                            $window.location = 'index.html';
                        } else {
//                $rootScope.notify('error', 'Error', 'You are not allowed to access this portal. Please contact your administrator.!');
//                $scope.showLoginErrorMsg = true;

                            DataService.logout().then(function (response) {
                                $window.localStorage.clear();
                                $window.location = 'login.html';
                            }, function (error) {
                                $window.localStorage.clear();
                                $window.location = 'login.html';
                            });

                        }

                    }, function (error) {
                        console.log("Login error......", error.data);
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
            }]);
