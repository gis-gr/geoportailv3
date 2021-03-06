goog.provide('app.ImguploadController');
goog.provide('app.ImguploadDirective');

/**
 * @fileoverview This file provides a "mymaps" directive. This directive is
 * used to insert a MyMaps block  into the HTML page.
 * Example:
 *
 * <app-mymaps></app-mymaps>
 *
 */

goog.require('app');
goog.require('app.Notify');


/**
 * @return {angular.Directive} The Directive Object Definition.
 * @ngInject
 */
app.imguploadDirective = function() {
  return {
    restrict: 'A',
    link:
        /**
         * @param {!angular.Scope} scope Scope.
         * @param {angular.JQLite} element Element.
         * @param {angular.Attributes} attrs Attributes.
         * @param {app.ImguploadController} ctrl Controller.
         */
        function(scope, element, attrs, ctrl) {
          element.bind('change', function() {
            scope.$apply(function() {
              ctrl.uploadFileToUrl_(element[0].files[0], scope, attrs);
            });
          });
        },
    controller: 'AppImguploadController'
  };
};


app.module.directive('appImgupload', app.imguploadDirective);


/**
 * @param {angular.$parse} $parse The parse service.
 * @param {angular.$http} $http The http service.
 * @param {app.Notify} appNotify Notify service.
 * @param {angularGettext.Catalog} gettextCatalog Gettext service.
 * @param {string} mymapsUrl URL to "mymaps" Feature service.
 * @constructor
 * @ngInject
 */
app.ImguploadController = function($parse, $http, appNotify, gettextCatalog,
    mymapsUrl) {

  /**
   * @type {angular.$parse}
   * @private
   */
  this.parse_ = $parse;

  /**
   * @type {angular.$http}
   * @private
   */
  this.$http_ = $http;

  /**
   * @type {app.Notify}
   * @private
   */
  this.notify_ = appNotify;

  /**
   * @type {angularGettext.Catalog}
   */
  this.gettextCatalog = gettextCatalog;

  /**
   * @type {string}
   * @private
   */
  this.mymapsUrl_ = mymapsUrl;
};


/**
 * Inits the attributes form (ie. gets the name and description from feature).
 * @param {Blob} file the file to upload
 * @param {!angular.Scope} scope Scope.
 * @param {angular.Attributes} attrs Attributes.
 * @private
 */
app.ImguploadController.prototype.uploadFileToUrl_ = function(file, scope,
    attrs) {
  var path = '/upload_image';
  if ('appSymbolupload' in attrs) {
    path = '/upload_symbol';
  }
  var model = this.parse_(attrs['appImgupload']);
  var modelSetter = model.assign;
  if (!file) {
    modelSetter(scope, undefined);
  } else {
    var fd = new FormData();
    fd.append('file', file);
    this.$http_.post(this.mymapsUrl_ + path, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type': undefined}
    })
    .success(
        goog.bind(function(data, status, headers, config) {
          modelSetter(scope, data);
        },this))
    .error(goog.bind(function() {
      var msg = this.gettextCatalog.getString(
              'Ce format d\'image n\'est as supporté.');
      this.notify_(msg, app.NotifyNotificationType.ERROR);
    }, this));
  }
};

app.module.controller('AppImguploadController', app.ImguploadController);

