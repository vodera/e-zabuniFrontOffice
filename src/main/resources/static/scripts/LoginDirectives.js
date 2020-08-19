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
});

