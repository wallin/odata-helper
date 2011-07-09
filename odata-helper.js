//
// Simple OData query string builder
// https://github.com/wallin/odata-helper
//

(function (window) {
  var odata;
  // Builderfunctions for different types
  var paramSingle = function (name) {
    return function (val) {
      if (typeof(val) === 'number' || typeof(val) === ('string')) {
        this._params[name] = val;
      }
      return this;
    };
  };

  var paramMulti = function (name) {
    return function () {
      var str = '';

      for (var i = 0, len = arguments.length; i < len; i++) {
        if (i !== 0) {
          str += ',';
        }
        str += arguments[i];
      }
      if (str.length > 0) {
        this._params[name] = str;
      }
      return this;
    };
  };

  var paramSort = function (name) {
    return function () {
      if (this._params &&
          this._params.orderby) {
        this._params.orderby += ' ' + name;
      }
      return this;
    };
  };

  // Define valid parameters
  var queryParams = {
    expand: paramMulti,
    orderby: paramMulti,
    select: paramMulti,

    asc: paramSort,
    desc: paramSort,

    callback: paramSingle,
    filter: paramSingle,
    inlinecount: paramSingle,
    top: paramSingle,
    skip: paramSingle
  };

  // Generate prototype functions as specified in queryParams
  var odataQueryFuncs = {};
  for (var j in queryParams) {
    if (queryParams.hasOwnProperty(j)) {
      var fn = queryParams[j];
      odataQueryFuncs[j] = fn(j);
    }
  }

  // Append a regular parameter. First parameter can be an object instead
  odataQueryFuncs.param = function (name, value) {
    if (typeof name === 'string') {
      var obj = {};
      obj[name] = value;
      name = obj;
    }
    for (var i in name) {
      if (name.hasOwnProperty(i)) {
        this._params[i] = name[i];
      }
    }
    return this;
  };

  // Generates URL-string from odataService object
  var toString = function () {
    var segments = [this._root];
    var qry = [];
    var suffix = '';
    if (this._params) {
      for (var i in this._params) {
        if (this._params.hasOwnProperty(i)) {
          var item = i + '=' + this._params[i];
          if (i in queryParams) {
            item = '$' + item;
          }
          qry.push(item);
        }
      }
      this._params = {};
    }
    if (this._format) {
      qry.push(odata.options.systemQueryPrefix + 'format=' + this._format);
    }
    if (this._default) {
      var def = this._default;
      if (this._id) {
        def += odata.options.idFunc(this._id);
        this._id = null;
      }
      segments.push(def);
    }
    if (this._resource && this._resource.length > 0) {
      segments = segments.concat(this._resource);
      this._resource = [];
    }
    if (odata.options.resourceSuffix) {
      suffix = odata.options.resourceSuffix;
    }
    qry = qry.length > 0 ? '?' + qry.join('&') : '';
    return segments.join('/') + suffix + qry;
  };


  // odataService object helper methods
  var setId = function (id) {
    if (id || id === 0 && this._default) {
      this._id = id;
    }
    return this;
  };

  var addResource = function (resource, id) {
    if (id || id === 0) {
      resource += odata.options.idFunc(id);
    }
    this._resource.push(resource);
    return this;
  };

  // Describe an OData service URI
  var odataService = function (serviceURL, format) {
    var proto = {
      _root: serviceURL,
      _format: format,
      toString: toString
    };

    for (var i in odataQueryFuncs) {
      if (odataQueryFuncs.hasOwnProperty(i)) {
        proto[i] = odataQueryFuncs[i];
      }
    }

    // Generate a new service object
    var F = function () {};
    F.prototype = proto;
    F.prototype.setFormat = function (fmt) {
      proto._format = fmt;
    };
    F.prototype.setUrl = function (url) {
      proto._root = url;
    };
    // Generate a new resource on the service
    F.prototype.resource = function (url) {
      var R = function () {
        this._resource = [];
        this._params = {};
        this._default = url;
        this.path = addResource;
        this.id = setId;
      };
      R.prototype = F.prototype;
      return new R();
    };
    return new F();
  };

  odata = {
    string: function (str) {
      return '\'' + str + '\'';
    },
    date: function (date) {
      return odata.string(date.toISOString());
    },
    service: odataService,
    options: {
      systemQueryPrefix: '$',
      resourceSuffix: false,
      idFunc: function (str) {
        return '(' + str + ')';
      }
    }
  };

  window.odata = odata;
}(window));