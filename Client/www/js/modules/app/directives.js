var module = angular.module('starter');

module.directive('noImage', function () {
    var setDefaultImage = function (el) {
        el.attr('src', 'img/no_image_small.png');
    };

    return {
        restrict: 'A',
        link: function (scope, el, attr) {
            scope.$watch(function() {
                return attr.ngSrc;
            },function () {
                var src = attr.ngSrc;

                if (!src) {
                    setDefaultImage(el);
                }
            });

            el.bind('error', function() { setDefaultImage(el); });
        }
    };
});