/**
 * Created by sunharuka on 14-7-25.
 */

/**
 * Module dependencies.
 */

var views = require('co-views');

// setup views mapping .html
// to the swig template engine

module.exports = views(__dirname + '/../views', {
  map: { html: 'swig' }
});