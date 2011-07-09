module('Service functions')
test("service: create", function () {
  var url = 'http://example.com'
  var svc = odata.service(url);
  ok(svc, 'can create OData service');

  equals(svc.toString(), url, 'url is correctly set on initialization');

  var url2 = 'http://myurl.com';
  var svc2 = odata.service(url2);
  equals(svc2.toString(), url2, 'can create multiple services');
  notEqual(svc.toString(), svc2.toString(), 'can create multiple independent services');
});

test('service: set format, change url', function () {
  var url = 'http://example.com';
  var svc = odata.service(url, 'json');
  equals(svc.toString(), url + '?$format=json', 'can set format on service');

  var url2 = 'http://myurl.com';
  svc.setUrl(url2);
  svc.setFormat();
  equals(svc.toString(), url2, 'can set new URL and set format');
})