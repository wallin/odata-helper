var url = 'http://example.com';
var url2 = 'http://myurl.com';
var res = 'resource';
var res2 = 'resource2';

module('Service functions');
test("service: create", function () {
  var svc = odata.service(url);
  ok(svc, 'can create OData service');

  equals(svc.toString(), url, 'url is correctly set on initialization');

  var svc2 = odata.service(url2);
  equals(svc2.toString(), url2, 'can create multiple services');
  notEqual(svc.toString(), svc2.toString(), 'can create multiple independent services');
});

test('service: set format, change url', function () {
  var svc = odata.service(url, 'json');
  equals(svc.toString(), url + '?$format=json', 'can set format on service');

  svc.setUrl(url2);
  svc.setFormat();
  equals(svc.toString(), url2, 'can set new URL and set format');
});

module('Resource functions');
test('resource: create', function () {
  var svc = odata.service(url);
  var r = svc.resource(res);
  var r2 = svc.resource(res2);
  equals(r.toString(), url + '/' + res, 'can create resource');
  equals(r2.toString(), url + '/' + res2, 'can create multiple resources on same service');
});

test('resource: system functions', function () {
  var svc = odata.service(url);
  var r = svc.resource(res);
  equals(r.expand('expand').toString(), url + '/' + res + '?$expand=expand', 'can expand');

  equals(r.path('path', 1).toString(), url + '/' + res + '/path(1)', 'can create path with id');

});

test('resource: change id function', function () {
  var old = odata.options.idFunc;
  odata.options.idFunc = function (str) {
    return '/' + str;
  };
  var svc = odata.service(url);
  var r = svc.resource(res);
  equals(r.id(1).toString(), url + '/' + res + '/1', 'can modify id on resource by function');

  odata.options.idFunc = old;
});

test('resource: set custom suffix on resource', function () {
  odata.options.resourceSuffix = '.json';
  var svc = odata.service(url);
  var r = svc.resource(res);
  equals(r.expand('expand').toString(), url + '/' + res + '.json?$expand=expand', 'can set custom suffix on resource');

  equals(r.id(1).expand('expand').toString(), url + '/' + res + '(1).json?$expand=expand', 'can set custom suffix on resource with id');
  equals(r.id(1).path('path').expand('expand').toString(), url + '/' + res + '(1)/path.json?$expand=expand', 'can set custom suffix on resource with path and id');
  odata.options.resourceSuffix = false;
});

test('resource: set custom suffix and custom id function', function () {
  var old = odata.options.idFunc;
  odata.options.resourceSuffix = '.json';
  odata.options.idFunc = function (str) {
    return '/' + str;
  };
  var svc = odata.service(url);
  var r = svc.resource(res);
  equals(r.id(1).toString(), url + '/' + res + '/1.json', 'can set custom suffix and id on resource');

  equals(r.id(1).path('path').toString(), url + '/' + res + '/1/path.json', 'can set custom suffix and id on resource with path');

  odata.options.idFunc = old;
  odata.options.resourceSuffix = false;
});