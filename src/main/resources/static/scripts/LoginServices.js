'use strict';

/**
 * @ngdoc function
 * @name CMSLoginApp:Services
 * @description
 * # Services
 * Services of the CMSLoginApp
 */

loginAppp.service('DataService', ['$http','$window', function ($http, $window) {
    
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
            headers: {'X-CSRF-TOKEN':  hValue, 'Accept': 'Application/json'},
            body: formdata,
            credentials: 'include'
        });
    };
    
    this.changePassword = function (formdata) {
        return $http.post(urlBase + 'users/password', formdata,
        {
            headers: { 'X-CSRF-TOKEN':  hValue, 'Content-Type': undefined }
        });
    };
    
    this.sendOTP = function (otp) {
//        console.log("OTP:", otp);
//        console.log("access_token:", $window.localStorage.getItem('access_token'));

               return $http.post(urlBase + 'otp/verification?&userIp=192.168.8.675&userAgent=Browser/Application&otp='+otp, {}, 
               {
                   headers: { 'X-CSRF-TOKEN':  hValue }
               });
    };
    this.forgotPassword = function (formdata) {
        console.log("email", formdata);
        console.log("access_token:", $window.localStorage.getItem('access_token'));
        return $http.post(urlBase + 'users/forgot-password', formdata, 
        {
            headers: { 'X-CSRF-TOKEN':  hValue, 'Content-Type': undefined }
        });
    };
    
     this.getPasswordPolicy = function () {
        return $http.get(urlBase + 'sys-config/password', 
        {
            headers: { 'X-CSRF-TOKEN':  hValue, 'Content-Type': undefined }
        });
    };
    
    this.logout = function () {
        return $http.post('/logout',{}, 
        {
           headers: { 'X-CSRF-TOKEN':  hValue }
        });
    };
}]);