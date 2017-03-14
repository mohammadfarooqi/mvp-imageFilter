angular.module('app', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main.html',
        controller: 'mainCtrl'
      });
  })

  .factory('Images', function($http) {
    var postURL = function (url) {
      return $http({
        method: 'POST',
        url: '/api/image',
        data: {url: url}
      })
      .then(function (data) {
        return data;
      });
    }

    return {
      postURL: postURL
    };
  })
  .controller('mainCtrl', function($scope, $http, $compile, Images) {
    $scope.applyFilter = function (filter) {
      Caman("#imgCopy", function () {
        this.revert();
        this[filter]().render();
      });
    };

    $scope.saveImage = function () {
      Caman("#imgCopy", function () {
        this.render(function () {
          this.save('jpg');
        });
      });
    };

    $scope.submit = function (form) {
      if (form.$invalid) {
        return;
      }

      //first clear original div
      var originalDiv = document.getElementById('original');
      while (originalDiv.firstChild) {
        originalDiv.removeChild(originalDiv.firstChild);
      }

      var copyDiv = document.getElementById('copy');
      while (copyDiv.firstChild) {
        copyDiv.removeChild(copyDiv.firstChild);
      }

      var img = new Image();
      img.src = $scope.imgUrl;
      img.height = img.height * 0.8;

      var originalH2 = document.createElement('h2');
      originalH2.innerText = 'Original';

      originalDiv.appendChild(originalH2);
      originalDiv.appendChild(img);



      Images.postURL($scope.imgUrl).then(function (data) {
        //console.log(data.data);
        var imgCopy = new Image();
        imgCopy.src = data.data;
        imgCopy.setAttribute('id', 'imgCopy');
        imgCopy.crossOrigin = "Anonymous";

        var copyH2 = document.createElement('h2');
        copyH2.innerText = 'Copy';

        copyDiv.appendChild(copyH2);
        copyDiv.appendChild(imgCopy);

        var br = document.createElement('br');
        copyDiv.appendChild(br);


        var filters = [{code: 'vintage', text: 'Vintage'}, {code: 'lomo', text: 'Lomo'}, {code: 'clarity', text: 'Clarity'}, {code: 'sinCity', text: 'Sin City'}, {code: 'sunrise', text: 'Sunrise'}, {code: 'crossProcess', text: 'Cross Process'}];

        for (var i = 0; i < filters.length; i++) {
          var btn = document.createElement('button');
          btn.innerText = filters[i].text;
          btn.setAttribute('ng-click', 'applyFilter("' + filters[i].code + '")');
          copyDiv.appendChild(btn);
          $compile(btn)($scope);
        }

        var br1 = document.createElement('br');
        copyDiv.appendChild(br1);

        var btn = document.createElement('button');
        btn.innerText = 'Save Image';
        btn.setAttribute('ng-click', 'saveImage()');
        copyDiv.appendChild(btn);
        $compile(btn)($scope);
      });
    };
  });