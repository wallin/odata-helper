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
    return '/' + str + '/';
  };
  var svc = odata.service(url);
  var r = svc.resource(res);
  equals(r.id(1).toString(), url + '/' + res + '/1/', 'can modify id on resource by function');

  odata.options.idFunc = old;
});