/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

app.directive('hasPermission', function(permissions) {  
  return {
    link: function(scope, element, attrs) {
      var value = attrs.hasPermission.trim();      
      function removeItemBasedOnPermission() {
        if(!permissions.hasPermission(value)) {
            element[0].remove();
        }
      }
      removeItemBasedOnPermission();
      scope.$on('permissionsChanged', removeItemBasedOnPermission);
    }
  };
}).directive('numbersOnly', function () {
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
}).directive("required", function() {
//   return {
//       restrict: 'A', //only want it triggered for attributes
//       compile: function(element) {
//          //could add a check to make sure it's an input element if need be
//           //element.after("<span class='required_asterisk'>*</span>");
//       }
//   };
   
   return { 
      link: function(scope, element, attributes){
        element.addClass('required_asterisk');
      }
};
}).directive('fileUpload', function () {
    return {
        scope: true, //create a new scope
        link: function (scope, el, attrs) {            
            var accept = attrs.accept.split(',');
            el.bind('change', function (event) {
                var files = event.target.files;
                   
                //iterate files since 'multiple' may be specified on the element
                for (var i = 0; i < files.length; i++) {
                    var value = files[0].name;
                    var ext = value.substring(value.lastIndexOf('.')).toLowerCase();
                    //emit event upward
                    if (accept.indexOf(ext) !== -1) {
                        scope.$emit("fileSelected", {file: files[i]});
                    }
                }
            });
        }
    };
}).directive('colResizeable', function() {
  return {
    restrict: 'A',
    link: function(scope, elem) {
      setTimeout(function() {
        elem.colResizable({
          liveDrag: true,
          gripInnerHtml: "<div class='grip'></div>",
          draggingClass: "dragging",
          onDrag: function() {
            //trigger a resize event, so width dependent stuff will be updated
            $(window).trigger('resize');
          }
        });
      });
    }
  }
  });

app.filter( 'sentenceCase', function() {
    return function(input) {
      input = input || '';
      return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    };
  }).filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});

app.factory('permissions', function($localStorage) {
  return {
    hasPermission: function (permission) {
      permission = permission.trim();
      return $localStorage.permissions.some(item => {
        if (typeof item !== 'string') {
          return false;
        }
        return item.trim() === permission;
      });
       console.log("permissions", $localStorage.permissions);
    }
   
  };
}).factory('$dialogConfirm', function ($uibModal) {

    return function (message, title) {

        var modal = $uibModal.open({
            template: '<div class="modal-header dialog-header-wait">\
                        <h4><span class="fa fa-warning"></span><span ng-bind="title"></span></h4>\
                    </div>\
                    <div class="modal-body" ng-bind="message"></div>\
                    <div class="modal-footer">\
                        <button class="btn btn-danger" ng-click="modal.dismiss()">Cancel</button>\
                        <button class="btn btn-secondary" ng-click="modal.close()">Proceed</button>\
                    </div>',
            controller: function ($scope, $uibModalInstance) {
                $scope.modal = $uibModalInstance;
                if (angular.isObject(message)) {
                    angular.extend($scope, message);
                } else {
                    $scope.message = message;
                    $scope.title = angular.isUndefined(title) ? 'Warning' : title;
                }
            }
        });
        return modal.result;
    };    
});