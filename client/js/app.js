angular.module('app', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/main', {
        templateUrl: 'partials/main.html',
        controller: 'mainCtrl'
      })
      .when('/pastUrls', {
        templateUrl: 'partials/pastUrls.html',
        controller: 'pastUrlsCtrl'
      })
      .when('/webcam', {
        templateUrl: 'partials/webcam.html',
        controller: 'webcamCtrl'
      })
      .when('/pastImagesIds', {
        templateUrl: 'partials/pastImagesIds.html',
        controller: 'pastImagesIdsCtrl'
      })
      .otherwise({redirectTo:'/main'});
  })

  .factory('Images', function($http) {
    var postImage = function (image) {
      return $http({
        method: 'POST',
        url: '/api/image',
        data: {image: image}
      })
      .then(function (data) {
        return data;
      });
    };

    var getImagesIds = function (image) {
      return $http({
        method: 'GET',
        url: '/api/images'
      })
      .then(function (data) {
        return data.data;
      });
    };

    var getImageById = function (id) {
      return $http({
        method: 'GET',
        url: '/api/image/' + id
      })
      .then(function (data) {
        return data.data;
      });
    };

    var postURL = function (url) {
      return $http({
        method: 'POST',
        url: '/api/url',
        data: {url: url}
      })
      .then(function (data) {
        return data;
      });
    };

    var getURLs = function () {
      return $http({
        method: 'GET',
        url: '/api/urls'
      })
      .then(function (data) {
        return data.data;
      });
    };

    return {
      postURL: postURL,
      getURLs: getURLs,
      postImage: postImage,
      getImagesIds: getImagesIds,
      getImageById: getImageById
    };
  })
  .controller('mainCtrl', function($scope, $compile, Images) {
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

        var br2 = document.createElement('br');
        copyDiv.appendChild(br2);


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
  })
  .controller('pastUrlsCtrl', function($scope, Images) {
    Images.getURLs().then(function (data) {
      //console.log(data);
      //$scope.test = data;

      //clear
      var div = document.getElementById('result');
      while (div.firstChild) {
        div.removeChild(div.firstChild);
      }

      var table = document.createElement('table');
      var thr = document.createElement('tr');

      var thId = document.createElement('th');
      thId.innerText = 'id';
      var thUrl = document.createElement('th');
      thUrl.innerText = 'URL';
      var thVisits = document.createElement('th');
      thVisits.innerText = 'Visits';

      thr.appendChild(thId);
      thr.appendChild(thUrl);
      thr.appendChild(thVisits);


      table.appendChild(thr);

      for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');

        var tdId = document.createElement('td');
        tdId.innerText = data[i]._id;
        var tdUrl = document.createElement('td');
        tdUrl.innerHTML = '<a href="'+data[i].url+'">'+data[i].url+'</a>';
        var tdVisits = document.createElement('td');
        tdVisits.innerText = data[i].count;

        tr.appendChild(tdId);
        tr.appendChild(tdUrl);
        tr.appendChild(tdVisits);

        table.appendChild(tr);
      }

      document.getElementById('result').appendChild(table);
    });
  })
  .controller('webcamCtrl', function($scope, $compile, Images) {
    $scope.applyFilter = function (filter) {
      Caman("#canvas", function () {
        //this.revert();
        this[filter]().render();
      });
    };

    $scope.saveImage = function () {
      Images.postImage(document.getElementById('canvas').toDataURL("image/png")).then(function (data) {
        alert('done!');
      });
    };

    var video = document.getElementById('video');

    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
          video.src = window.URL.createObjectURL(stream);
          //video.play();
          var waitTime = 150;

          setTimeout(function () {
            // Resume play if the element if is paused.
            if (video.paused) {
              video.play();
            }
          }, waitTime);
      });
    }

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');

    document.getElementById("snap").addEventListener("click", function() {
      context.drawImage(video, 0, 0, 640, 480);
    });
  })
  .controller('pastImagesIdsCtrl', function($scope, Images) {
    Images.getImagesIds().then(function (data) {
      console.log(data)
      //clear
      var div = document.getElementById('result');
      while (div.firstChild) {
        div.removeChild(div.firstChild);
      }

      var table = document.createElement('table');
      var thr = document.createElement('tr');

      var thId = document.createElement('th');
      thId.innerText = 'id';

      thr.appendChild(thId);

      table.appendChild(thr);

      for (var i = 0; i < data.length; i++) {
        var tr = document.createElement('tr');

        var tdId = document.createElement('td');
        tdId.innerText = data[i]._id;

        tr.appendChild(tdId);

        table.appendChild(tr);
      }

      document.getElementById('result').appendChild(table);
    });

    $scope.getImageClick = function () {
      //console.log($scope.imageId);
      if ($scope.imageId !== undefined || $scope.imageId !== '') {
        Images.getImageById($scope.imageId).then(function (data) {
          var div = document.getElementById('imageArea');
          while (div.firstChild) {
            div.removeChild(div.firstChild);
          }

          var image = new Image();
          image.src = data.image;

          div.appendChild(image);
        });
      }
    };
  });