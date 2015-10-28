goog.provide('app.StyleEditingController');
goog.provide('app.styleEditingDirective');

goog.require('app');
goog.require('goog.color.alpha');
goog.require('ol.Feature');


/**
 * @param {string} appStyleEditingTemplateUrl Url to style editing partial.
 * @return {angular.Directive} Directive Definition Object.
 * @ngInject
 */
app.styleEditingDirective = function(appStyleEditingTemplateUrl) {
  return {
    restrict: 'E',
    scope: {
      'feature': '=appStyleEditingFeature',
      'editingStyle': '=appStyleEditingStyle'
    },
    controller: 'AppStyleEditingController',
    bindToController: true,
    controllerAs: 'ctrl',
    templateUrl: appStyleEditingTemplateUrl
  };
};

app.module.directive('appStyleediting', app.styleEditingDirective);



/**
 * @param {angular.Scope} $scope The scope.
 * @param {app.DrawnFeatures} appDrawnFeatures Drawn features service.
 * @constructor
 * @ngInject
 */
app.StyleEditingController = function($scope, appDrawnFeatures) {

  /**
   * @type {app.DrawnFeatures}
   * @private
   */
  this.drawnFeatures_ = appDrawnFeatures;

  /**
   * @type {ol.Feature}
   * @export
   */
  this.feature;

  /**
   * @type {ol.Feature}
   * @export
   */
  this.featureOrig;

  /**
   * @type {string}
   * @export
   */
  this.type = '';


  /**
   * @type {Array<string>}
   * @export
   */
  this.colors = [
    ['#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8',
      '#3f48cc', '#a349a4'],
    ['#b97a57', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea',
      '#7092be', '#c8bfe7'],
    ['#ffffff', '#f7f7f7', '#c3c3c3', '#000000']
  ];

  $scope.$watch(goog.bind(function() {
    return this.feature;
  }, this), goog.bind(function() {
    if (!goog.isDef(this.feature)) {
      return;
    }
    this.type = this.feature.getGeometry().getType().toLowerCase();
    if (this.type == 'point' && this.feature.get('is_label')) {
      this.type = 'text';
    }
    this.featureOrig = this.feature.clone();
  }, this));
};


/**
 * @param {string} lineStyle
 * @export
 */
app.StyleEditingController.prototype.setLineDash = function(lineStyle) {
  if (!goog.isDef(this.feature)) {
    return;
  }
  this.feature.set('linestyle', lineStyle);
};


/**
 * @param {string} symbol
 * @export
 */
app.StyleEditingController.prototype.setShape = function(symbol) {
  if (!goog.isDef(this.feature)) {
    return;
  }
  this.feature.set('symbol_id', symbol);
};


/**
 * @param {number} val
 * @return {*}
 * @export
 */
app.StyleEditingController.prototype.getSetStroke = function(val) {
  if (!goog.isDef(this.feature)) {
    return;
  }
  if (arguments.length) {
    this.feature.set('stroke', parseFloat(val));
  } else {
    return this.feature.get('stroke');
  }
};


/**
 * @param {number} val
 * @return {*}
 * @export
 */
app.StyleEditingController.prototype.getSetSize = function(val) {
  if (!goog.isDef(this.feature)) {
    return;
  }
  if (arguments.length) {
    this.feature.set('size', parseFloat(val));
  } else {
    return this.feature.get('size');
  }
};


/**
 * @param {number} val
 * @return {*}
 * @export
 */
app.StyleEditingController.prototype.getSetRotation = function(val) {
  if (!goog.isDef(this.feature)) {
    return;
  }
  if (arguments.length) {
    this.feature.set('angle', parseFloat(val) / 360 * Math.PI * 2);
  } else {
    var angle = /** @type {number} */ (this.feature.get('angle'));
    return angle * 360 / Math.PI / 2;
  }
};


/**
 * @param {number} val
 * @return {*}
 * @export
 */
app.StyleEditingController.prototype.getSetOpacity = function(val) {
  if (!goog.isDef(this.feature)) {
    return;
  }
  if (arguments.length) {
    this.feature.set('opacity', 1 - (parseFloat(val) / 100));
  } else {
    var opacity = /** @type {number} */ (this.feature.get('opacity'));
    return (1 - opacity) * 100;
  }
};


/**
 * @param {string} val
 * @return {*}
 * @export
 */
app.StyleEditingController.prototype.setColor = function(val) {
  if (!goog.isDef(this.feature)) {
    return;
  }
  if (arguments.length) {
    this.feature.set('color', val);
  } else {
    var color = /** @type {string} */ (this.feature.get('color'));
    return goog.color.parseRgb(color);
  }
};


/**
 * @export
 */
app.StyleEditingController.prototype.saveFeature = function() {
  this.drawnFeatures_.saveFeature(this.feature);
  this.editingStyle = false;
};


/**
 * @export
 */
app.StyleEditingController.prototype.close = function() {
  this.feature.set('color', this.featureOrig.get('color'));
  this.feature.set('opacity', this.featureOrig.get('opacity'));
  this.feature.set('angle', this.featureOrig.get('angle'));
  this.feature.set('size', this.featureOrig.get('size'));
  this.feature.set('symbol_id', this.featureOrig.get('symbol_id'));
  this.feature.set('stroke', this.featureOrig.get('stroke'));
  this.feature.set('linestyle', this.featureOrig.get('linestyle'));

  this.editingStyle = false;
};

app.module.controller('AppStyleEditingController', app.StyleEditingController);