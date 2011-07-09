# OData helper

Simple javascript library to generate OData URIs. Still early work

# Example

## Create service
Create the service with URL and optional response format

    var svc = odata.service('http://example.com', 'json');

## Create resource
Create a resource based on the service

    var res = svc.resource('Products');


## Generate query URL
A query is performed on a resource by chaining query methods and finally call
`toString`. `toString` will also reset the current query.

    var url = res.select('Name', 'Price').orderby('Price').desc().toString();

will result in a string:

    http://example.com/Products?$select=Name,Price&$orderby=Price desc&$format=json

or

    var url = res.id(23).path('Colors').filter('Name eq ' + odata.string('red')).toString();

gives:

    http://example.com/Products(23)/Colors?$filter=Name eq 'red'&$format=json


## Change service URL and format
Changes to URL and format will automatically apply to all resources created on the service.

    svc.setUrl('http://myurl.com');
    svc.setFormat();

## Options

The library provides options to configure a suffix to add to the resource path aswell as a function for generating an id for the resource. Eg. if you want a more Rails-like URL scheme:

    odata.options.idFunc = function (id) {
      return '/' + id;
    };
    odata.options.resourceSuffix = '.json';

Will make the following call

    res.id(23).path('Colors').param('page', 1).toString();

generate an URL of the form:

    http://example.com/Products/1/Colors.json?page=1
