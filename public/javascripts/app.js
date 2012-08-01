(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle) {
    for (var key in bundle) {
      if (has(bundle, key)) {
        modules[key] = bundle[key];
      }
    }
  }

  globals.require = require;
  globals.require.define = define;
  globals.require.brunch = true;
})();

window.require.define({"collections/hacker_collection": function(exports, require, module) {
  var HackerCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = HackerCollection = (function(_super) {

    __extends(HackerCollection, _super);

    function HackerCollection() {
      return HackerCollection.__super__.constructor.apply(this, arguments);
    }

    HackerCollection.prototype.initialize = function() {
      var _this = this;
      return Backbone.Mediator.subscribe('hacker:added', function(hacker) {
        return _this.add(hacker);
      });
    };

    return HackerCollection;

  })(Backbone.Collection);
  
}});

window.require.define({"initialize": function(exports, require, module) {
  var _ref, _ref1, _ref2, _ref3, _ref4;

  if ((_ref = this.Hackerank) == null) {
    this.Hackerank = {};
  }

  if ((_ref1 = Hackerank.Routers) == null) {
    Hackerank.Routers = {};
  }

  if ((_ref2 = Hackerank.Views) == null) {
    Hackerank.Views = {};
  }

  if ((_ref3 = Hackerank.Models) == null) {
    Hackerank.Models = {};
  }

  if ((_ref4 = Hackerank.Collections) == null) {
    Hackerank.Collections = {};
  }

  $(function() {
    var AppView;
    return Hackerank.Views.AppView = new (AppView = require('views/app_view'));
  });
  
}});

window.require.define({"lib/app_helpers": function(exports, require, module) {
  
  (function() {
    Swag.Config.partialsPath = '../views/templates/';
    (function() {
      var console, dummy, method, methods, _results;
      console = window.console = window.console || {};
      method = void 0;
      dummy = function() {};
      methods = 'assert,count,debug,dir,dirxml,error,exception,\
                     group,groupCollapsed,groupEnd,info,log,markTimeline,\
                     profile,profileEnd,time,timeEnd,trace,warn'.split(',');
      _results = [];
      while (method = methods.pop()) {
        _results.push(console[method] = console[method] || dummy);
      }
      return _results;
    })();
    Backbone.View.prototype.template = function() {};
    Backbone.View.prototype.getRenderData = function() {};
    Backbone.View.prototype.render = function() {
      console.debug("Rendering " + this.constructor.name, this);
      this.$el.html(this.template(this.getRenderData()));
      this.afterRender();
      return this;
    };
    return Backbone.View.prototype.afterRender = function() {};
  })();
  
}});

window.require.define({"models/search_model": function(exports, require, module) {
  var SearchModel,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = SearchModel = (function(_super) {

    __extends(SearchModel, _super);

    function SearchModel() {
      return SearchModel.__super__.constructor.apply(this, arguments);
    }

    SearchModel.prototype.defaults = {
      query: ''
    };

    SearchModel.prototype.validate = function(attrs) {
      if (!attrs.query) {
        return 'Query can\'t be empty';
      }
    };

    SearchModel.prototype.initialize = function() {
      return this.on('change:query', this.search);
    };

    SearchModel.prototype.search = function() {
      var _this = this;
      return $.getJSON("https://api.github.com/legacy/repos/search/" + (this.get('query'))).done(function(response) {
        var repos;
        repos = _.sortBy(response.repositories, function(repo) {
          return -repo.watchers;
        });
        return _this.searchHackers(repos.slice(0, 3));
      });
    };

    SearchModel.prototype.searchHackers = function(repos) {
      var findHacker, place;
      place = 1;
      findHacker = function() {
        var repo,
          _this = this;
        repo = repos.shift();
        return $.getJSON("https://api.github.com/users/" + repo.owner).done(function(hacker) {
          _.extend(hacker, {
            repoName: repo.name,
            repoLanguage: repo.language,
            repoFollowers: repo.followers,
            repoUrl: repo.url,
            place: place
          });
          Backbone.Mediator.publish('hacker:added', hacker);
          place += 1;
          if (repos.length > 0) {
            return findHacker();
          }
        });
      };
      return findHacker();
    };

    return SearchModel;

  })(Backbone.Model);
  
}});

window.require.define({"routers/app_router": function(exports, require, module) {
  var AppRouter,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = AppRouter = (function(_super) {

    __extends(AppRouter, _super);

    function AppRouter() {
      return AppRouter.__super__.constructor.apply(this, arguments);
    }

    AppRouter.prototype.routes = {
      '': function() {}
    };

    return AppRouter;

  })(Backbone.Router);
  
}});

window.require.define({"views/app_view": function(exports, require, module) {
  var AppView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = AppView = (function(_super) {

    __extends(AppView, _super);

    function AppView() {
      return AppView.__super__.constructor.apply(this, arguments);
    }

    AppView.prototype.el = 'body.application';

    AppView.prototype.initialize = function() {
      var AppRouter, HackersView, SearchView;
      require('../lib/app_helpers');
      Hackerank.Routers.AppRouter = new (AppRouter = require('../routers/app_router'));
      Hackerank.Views.SearchView = new (SearchView = require('./search_view'));
      return Hackerank.Views.HackersView = new (HackersView = require('./hackers_view'));
    };

    return AppView;

  })(Backbone.View);
  
}});

window.require.define({"views/hacker_view": function(exports, require, module) {
  var HackerView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = HackerView = (function(_super) {

    __extends(HackerView, _super);

    function HackerView() {
      return HackerView.__super__.constructor.apply(this, arguments);
    }

    HackerView.prototype.tagName = 'li';

    HackerView.prototype.className = 'hacker clearfix';

    HackerView.prototype.template = require('./templates/hacker');

    HackerView.prototype.getRenderData = function() {
      return this.model.toJSON();
    };

    return HackerView;

  })(Backbone.View);
  
}});

window.require.define({"views/hackers_view": function(exports, require, module) {
  var HackersView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = HackersView = (function(_super) {

    __extends(HackersView, _super);

    function HackersView() {
      return HackersView.__super__.constructor.apply(this, arguments);
    }

    HackersView.prototype.el = 'section.hackers';

    HackersView.prototype.subscriptions = {
      'search:new': 'cleanResults'
    };

    HackersView.prototype.initialize = function() {
      var HackerCollection;
      this.collection = Hackerank.Collections.HackerCollection = new (HackerCollection = require('../collections/hacker_collection'));
      return this.collection.on('add', this.addHacker, this);
    };

    HackersView.prototype.cleanResults = function() {
      this.collection.reset();
      return this.$el.find('ol.hackers-list').empty().attr('data-state', 'loading');
    };

    HackersView.prototype.addHacker = function(hacker) {
      var HackerView, view;
      this.$el.find('ol.hackers-list').attr('data-state', 'default');
      view = require('./hacker_view');
      HackerView = new view({
        model: hacker
      });
      return this.$el.find('ol.hackers-list').append(HackerView.render().el);
    };

    return HackersView;

  })(Backbone.View);
  
}});

window.require.define({"views/search_view": function(exports, require, module) {
  var SearchView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = SearchView = (function(_super) {

    __extends(SearchView, _super);

    function SearchView() {
      return SearchView.__super__.constructor.apply(this, arguments);
    }

    SearchView.prototype.el = 'section.search';

    SearchView.prototype.events = {
      'click a.search-button': 'search',
      'keyup input.search-input': function(event) {
        if (event.keyCode === 13) {
          return this.search();
        }
      }
    };

    SearchView.prototype.initialize = function() {
      var SearchModel;
      return this.model = Hackerank.Models.SearchModel = new (SearchModel = require('../models/search_model'));
    };

    SearchView.prototype.search = function(event) {
      if (event != null) {
        event.preventDefault();
      }
      Backbone.Mediator.publish('search:new');
      return this.model.set({
        query: $.trim(this.$el.find('input.search-input').val())
      });
    };

    return SearchView;

  })(Backbone.View);
  
}});

window.require.define({"views/templates/hacker": function(exports, require, module) {
  module.exports = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
    helpers = helpers || Handlebars.helpers;
    var buffer = "", stack1, stack2, stack3, stack4, stack5, foundHelper, self=this, functionType="function", helperMissing=helpers.helperMissing, undef=void 0, escapeExpression=this.escapeExpression;


    buffer += "<span class=\"hacker-place\">";
    foundHelper = helpers.place;
    stack1 = foundHelper || depth0.place;
    foundHelper = helpers.ordinalize;
    stack2 = foundHelper || depth0.ordinalize;
    if(typeof stack2 === functionType) { stack1 = stack2.call(depth0, stack1, { hash: {} }); }
    else if(stack2=== undef) { stack1 = helperMissing.call(depth0, "ordinalize", stack1, { hash: {} }); }
    else { stack1 = stack2; }
    buffer += escapeExpression(stack1) + "</span>\n<img class=\"hacker-img\" src=\"";
    foundHelper = helpers.avatar_url;
    stack1 = foundHelper || depth0.avatar_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "avatar_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" width=\"62\" height=\"62\">\n<div class=\"hacker-info\">\n    <a class=\"hacker-name\" href=\"";
    foundHelper = helpers.html_url;
    stack1 = foundHelper || depth0.html_url;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "html_url", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\" target=\"_blank\">";
    foundHelper = helpers.name;
    stack1 = foundHelper || depth0.name;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "name", { hash: {} }); }
    buffer += escapeExpression(stack1) + " <span class=\"hacker-username\">{ ";
    foundHelper = helpers.login;
    stack1 = foundHelper || depth0.login;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "login", { hash: {} }); }
    buffer += escapeExpression(stack1) + " }</span></a>\n    <div class=\"hacker-stats\">\n        <span class=\"hacker-repos\">\n            ";
    stack1 = true;
    stack2 = "repos";
    stack3 = "repo";
    foundHelper = helpers.public_repos;
    stack4 = foundHelper || depth0.public_repos;
    foundHelper = helpers.inflect;
    stack5 = foundHelper || depth0.inflect;
    if(typeof stack5 === functionType) { stack1 = stack5.call(depth0, stack4, stack3, stack2, stack1, { hash: {} }); }
    else if(stack5=== undef) { stack1 = helperMissing.call(depth0, "inflect", stack4, stack3, stack2, stack1, { hash: {} }); }
    else { stack1 = stack5; }
    buffer += escapeExpression(stack1) + "\n        </span> <!-- .hacker-repos -->\n        &middot;\n        <span class=\"hacker-followers\">\n            ";
    stack1 = true;
    stack2 = "followers";
    stack3 = "follower";
    foundHelper = helpers.followers;
    stack4 = foundHelper || depth0.followers;
    foundHelper = helpers.inflect;
    stack5 = foundHelper || depth0.inflect;
    if(typeof stack5 === functionType) { stack1 = stack5.call(depth0, stack4, stack3, stack2, stack1, { hash: {} }); }
    else if(stack5=== undef) { stack1 = helperMissing.call(depth0, "inflect", stack4, stack3, stack2, stack1, { hash: {} }); }
    else { stack1 = stack5; }
    buffer += escapeExpression(stack1) + "\n        </span> <!-- .hacker-followers -->\n    </div> <!-- .hacker-stats -->\n    <div class=\"hacker-repo\">\n        <a class=\"hacker-repo-name\" href=\"";
    foundHelper = helpers.repoUrl;
    stack1 = foundHelper || depth0.repoUrl;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "repoUrl", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\">";
    foundHelper = helpers.repoName;
    stack1 = foundHelper || depth0.repoName;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "repoName", { hash: {} }); }
    buffer += escapeExpression(stack1) + "</a>\n        &middot;\n        <span class=\"hacker-repo-language\">";
    stack1 = "No Language";
    foundHelper = helpers.repoLanguage;
    stack2 = foundHelper || depth0.repoLanguage;
    foundHelper = helpers['default'];
    stack3 = foundHelper || depth0['default'];
    if(typeof stack3 === functionType) { stack1 = stack3.call(depth0, stack2, stack1, { hash: {} }); }
    else if(stack3=== undef) { stack1 = helperMissing.call(depth0, "default", stack2, stack1, { hash: {} }); }
    else { stack1 = stack3; }
    buffer += escapeExpression(stack1) + "</span>\n        &middot;\n        <span class=\"hacker-repo-followers\"><i class=\"icon-eye-open\"></i></span> ";
    foundHelper = helpers.repoFollowers;
    stack1 = foundHelper || depth0.repoFollowers;
    if(typeof stack1 === functionType) { stack1 = stack1.call(depth0, { hash: {} }); }
    else if(stack1=== undef) { stack1 = helperMissing.call(depth0, "repoFollowers", { hash: {} }); }
    buffer += escapeExpression(stack1) + "\n    </div> <!-- .hacker-repo -->\n</div> <!-- .hacker-info -->\n";
    return buffer;});
}});

