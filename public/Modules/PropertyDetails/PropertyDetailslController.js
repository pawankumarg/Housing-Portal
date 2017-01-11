var app = angular.module("HousingApp");

app.controller('PropertyDetailslController',function($scope,$http,$window,$location,$timeout){
    //var id = localStorage.getItem('PropId');

   
    var path = $location.absUrl();
    var id = path.split("?PID=")[1].split("qazxsw")[0];
     $http.get('api/getPropertyByID/'  + id)
            .success(function(response) {
              console.log(response);
              $scope.AllData=response;
               $scope.$parent.seo = { 
                pageTitle : response.Title + " " + response.Location, 
                pageDescripton: response.Description 
                };
                
                console.log($scope.AllData.ImagePath);
                // $scope.gallery = [];
               
                // for(var i =0;i<$scope.AllData.ImagePath;i++)
                // {
                //     //gal.thumb =  $scope.AllData.ImagePath[i].src;
                //     //gal.img = $scope.AllData.ImagePath[i].src;                    
                //     $scope.gallery.push({thumb:$scope.AllData.ImagePath[i].src,img:$scope.AllData.ImagePath[i].src});
                // }

               



         var mapOptions = {
                    zoom: 10,
                    center: new google.maps.LatLng($scope.AllData.Latitude, $scope.AllData.Longitude),
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                }

                $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

                $scope.markers = [];

                var marker = new google.maps.Marker({
                    map: $scope.map,
                    position: new google.maps.LatLng($scope.AllData.Latitude, $scope.AllData.Longitude),
                    title: $scope.AllData.MapAddress, options: { draggable: false }
                });
             
            })
            .error(function(data) {
                console.log('Error: ' + data);
               
            });
    
    
    $scope.btnClick = function () {
        $scope.OverlayDiv = true;
        $scope.InnerDiv = true;
        $scope.formDiv = true;
        $scope.messageSent = false;

    }

    $scope.doAnimation = function () {
        var Name = angular.element(document.querySelector('#name')).val();
        var EMail = angular.element(document.querySelector('#email')).val();
        if ((Name == "") || (EMail == "")) {
            var rtdiv = angular.element(document.querySelector('#formColRight'));
            rtdiv.addClass('Invalid');
            $timeout(RemoveInvalidCss, 2000);

        } else {
            $timeout(callAtTimeout, 1500);
        }


    }
    $scope.cancelAll = function () {
        $scope.OverlayDiv = false;
        $scope.InnerDiv = false;
        $scope.formDiv = false;
        $scope.messageSent = false;

    }

    function RemoveInvalidCss() {
        var rtdiv = angular.element(document.querySelector('#formColRight'));
        rtdiv.removeClass('Invalid');
    }

    function callAtTimeout() {
        $scope.formDiv = false;
        var myEl = angular.element(document.querySelector('#InnerDiv'));
        myEl.addClass('animate');
        $scope.messageSent = true;
        $timeout(removeAll, 2000);
    }
    function removeAll() {
        $scope.InnerDiv = false;
        $scope.OverlayDiv = false;
    }

    
    
   
});

app.directive('ngGallery', ['$document', '$timeout', '$q', '$templateCache', function($document, $timeout, $q, $templateCache) {
    'use strict';

    var defaults = { 
        baseClass   : 'ng-gallery',
        thumbClass  : 'ng-thumb',
        templateUrl : 'ng-gallery.html'
    };

    var keys_codes = {
        enter : 13,
        esc   : 27,
        left  : 37,
        right : 39
    };

    function setScopeValues(scope, attrs) {
        scope.baseClass = scope.class || defaults.baseClass;
        scope.thumbClass = scope.thumbClass || defaults.thumbClass;
        scope.thumbsNum = scope.thumbsNum || 3; // should be odd
    }

    var template_url = defaults.templateUrl;
    // Set the default template
    $templateCache.put(template_url,
    '<div class="{{ baseClass }}">' +
    '  <div ng-repeat="i in images">' +
    '    <img ng-src="{{ i.src }}" class="{{ thumbClass }}" ng-click="openGallery($index)" alt="Image {{ $index + 1 }}" />' +
    '  </div>' +
    '</div>' +
    '<div class="ng-overlay" ng-show="opened">' +
    '</div>' +
    '<div class="ng-gallery-content" ng-show="opened">' +
    '  <div class="uil-ring-css" ng-show="loading"><div></div></div>' + 
    '  <a class="close-popup" ng-click="closeGallery()"><i class="fa fa-close"></i></a>' +
    '  <a class="nav-left" ng-click="prevImage()"><i class="fa fa-angle-left"></i></a>' +
    '  <img ng-src="{{ img }}" ng-click="nextImage()" ng-show="!loading" class="effect" />' +
    '  <a class="nav-right" ng-click="nextImage()"><i class="fa fa-angle-right"></i></a>' +
    '  <span class="info-text">{{ index + 1 }}/{{ images.length }}</span>' +
    '  <div class="ng-thumbnails-wrapper">' +
    '    <div class="ng-thumbnails slide-left">' +
    '      <div ng-repeat="i in images">' + 
    '        <img ng-src="{{ i.src }}" ng-class="{\'active\': index === $index}" ng-click="changeImage($index)" />' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</div>'
    );

    return {
        restrict: 'EA',
        scope: {
            images: '=',
            thumbsNum: '@'
        },
        templateUrl: function(element, attrs) {
                return attrs.templateUrl || defaults.templateUrl;
            },
        link: function (scope, element, attrs) {
            setScopeValues(scope, attrs);

            if (scope.thumbsNum >= 11) {
                scope.thumbsNum = 11;
            }

            var $body = $document.find('body');
            var $thumbwrapper = angular.element(document.querySelectorAll('.ng-thumbnails-wrapper'));
            var $thumbnails = angular.element(document.querySelectorAll('.ng-thumbnails'));

            scope.index = 0;
            scope.opened = false;

            scope.thumb_wrapper_width = 0;
            scope.thumbs_width = 0;

            var loadImage = function (i) {
                var deferred = $q.defer();
                var image = new Image();

                image.onload = function () {
                    scope.loading = false;
                        if (typeof this.complete === false || this.naturalWidth === 0) {
                            deferred.reject();
                        }
                        deferred.resolve(image);
                };
        
                image.onerror = function () {
                    deferred.reject();
                };
                
                image.src = scope.images[i].src;
                scope.loading = true;

                return deferred.promise;
            };

            var showImage = function (i) {
                loadImage(scope.index).then(function(resp) {
                    scope.img = resp.src;
                    smartScroll(scope.index);
                });
                scope.description = scope.images[i].description || '';
            };

            scope.changeImage = function (i) {
                scope.index = i;
                loadImage(scope.index).then(function(resp) {
                    scope.img = resp.src;
                    smartScroll(scope.index);
                });
            };

            scope.nextImage = function () {
                scope.index += 1;
                if (scope.index === scope.images.length) {
                    scope.index = 0;
                }
                showImage(scope.index);
            };

            scope.prevImage = function () {
                scope.index -= 1;
                if (scope.index < 0) {
                    scope.index = scope.images.length;
                }
                showImage(scope.index);
            };

            scope.openGallery = function (i) {
                console.log(i);
                if (typeof i !== undefined) {
                    scope.index = i;
                    showImage(scope.index);
                }
                scope.opened = true;

                $timeout(function() {
                    var calculatedWidth = calculateThumbsWidth();
                    scope.thumbs_width = calculatedWidth.width+1;
                    $thumbnails.css({ width: calculatedWidth.width + 2 + 'px' });
                    $thumbwrapper.css({ width: calculatedWidth.visible_width + 'px' });
                    smartScroll(scope.index);
                });
            };

            scope.closeGallery = function () {
                scope.opened = false;
            };

            $body.bind('keydown', function(event) {
                if (!scope.opened) {
                    return;
                }
                var which = event.which;
                if (which === keys_codes.esc) {
                    scope.closeGallery();
                } else if (which === keys_codes.right || which === keys_codes.enter) {
                    scope.nextImage();
                } else if (which === keys_codes.left) {
                    scope.prevImage();
                }

                scope.$apply();
            });

            var calculateThumbsWidth = function () {
                var width = 0,
                    visible_width = 0;
                angular.forEach($thumbnails.find('img'), function(thumb) {
                    width += thumb.clientWidth;
                    width += 10; // margin-right
                    visible_width = thumb.clientWidth + 10;
                });
                return {
                    width: width,
                    visible_width: visible_width * scope.thumbsNum
                };
            };

            var smartScroll = function (index) {
                $timeout(function() {
                    var len = scope.images.length,
                        width = scope.thumbs_width,
                        current_scroll = $thumbwrapper[0].scrollLeft,
                        item_scroll = parseInt(width / len, 10),
                        i = index + 1,
                        s = Math.ceil(len / i);

                    $thumbwrapper[0].scrollLeft = 0;
                    $thumbwrapper[0].scrollLeft = i * item_scroll - (s * item_scroll);
                }, 100);
            };

        }
    };

}]);