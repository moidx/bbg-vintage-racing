'use strict';


var UpdateEventCtrl = (function() {
  function UpdateEventCtrl($log, $location, $stateParams, EventService) {
    this.$log = $log;
    this.$location = $location;
    this.$stateParams = $stateParams;
    this.Service = EventService;
    this._obj = {};
    this.list();
  }

  UpdateEventCtrl.prototype.update = function() {
    this._obj.active = true;
    return this.Service.update(this.$stateParams.id, this._obj).then((function(_this) {
      return function(data) {
        return _this.$location.path("/admin/events");
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to update event: " + error);
      };
    })(this));
  };

  UpdateEventCtrl.prototype.list = function() {
    var id;
    id = this.$stateParams.id;

    return this.Service.list().then((function(_this) {
      return function(data) {
        _this.$log.debug(data);
        _this._obj = (data.filter(function(obj) {
          return obj.id === id;
        }))[0];
        return _this.$log.debug(_this._obj);
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to get events: " + error);
      };
    })(this));
  };

  return UpdateEventCtrl;

})();
controllersModule.controller('UpdateEventCtrl', ['$log', '$location', '$stateParams', 'EventService', UpdateEventCtrl]);


var EventShowCtrl = (function() {
  function EventShowCtrl($log, $stateParams, EventService) {
    this.$log = $log;
    this.$stateParams = $stateParams;
    this.Service = EventService;
    this._obj = {};
    this.get(this.$stateParams.id);
  }

  EventShowCtrl.prototype.get = function(id) {
    return this.Service.show(id).then((function(_this) {
      return function(data) {
        return _this._obj = data.event;
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to get event: " + error);
      };
    })(this));
  };
  return EventShowCtrl;
})();
controllersModule.controller('EventShowCtrl', ['$log', '$stateParams', 'EventService', EventShowCtrl]);


var EventDeleteCtrl = (function() {
  function EventDeleteCtrl($log, $stateParams, $location, EventService) {
    this.$log = $log;
    this.Service = EventService;
    this.$stateParams = $stateParams;
    this.$location = $location;
    this.destroy();
  }

  EventDeleteCtrl.prototype.destroy = function() {
    return this.Service.destroy(this.$stateParams.id).then((function(_this) {
      return function(data) {
        return _this.$location.path("/admin/events");
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to delete event: " + error);
      };
    })(this));
  };

  return EventDeleteCtrl;
})();
controllersModule.controller('EventDeleteCtrl', ['$log', '$stateParams', '$location', 'EventService', EventDeleteCtrl]);


var CreateEventCtrl = (function() {
  function CreateEventCtrl($rootScope, $log, $location, EventService) {
    this.$log = $log;
    this.$rootScope = $rootScope;
    this.$location = $location;
    this.Service = EventService;
    this._obj = {};
  }

  CreateEventCtrl.prototype.create = function() {

    // This can be part of a pre-processing function if we want to
    // make the controllers generic.
    this._obj.active = true;
    this._obj.language = "en";
    this._obj.userId = this.$rootScope.user.userID;

    return this.Service.create(this._obj).then((function(_this) {
      return function(data) {
        return _this.$location.path('/admin/events');
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to create event: " + error);
      };
    })(this));
  };

  return CreateEventCtrl;
})();
controllersModule.controller('CreateEventCtrl', ['$rootScope', '$log', '$location', 'EventService', CreateEventCtrl]);



var EventCtrl =  (function() {
  function EventCtrl($log, EventService) {
    this.$log = $log;
    this.Service = EventService;
    this._objs = [];
    this.list();
  }

  EventCtrl.prototype.list = function() {
    return this.Service.list().then((function(_this) {
      return function(data) {
        return _this._objs = data;
      };
    })(this), (function(_this) {
      return function(error) {
        return _this.$log.error("Unable to get list of events: " + error);
      };
    })(this));
  };

  return EventCtrl;
})();
controllersModule.controller('EventCtrl', ['$log', 'EventService', EventCtrl]);

var CalendarCtrl = (function(){
  function CalendarCtrl($rootScope, $log,  $location, $anchorScroll, EventService) {
    this.$log = $log;
    this.$anchorScroll = $anchorScroll;
    this.$location = $location;
    this.Service = EventService;
    this.cur = {};
    this.events = [];
    this.index = 0;
    this.list();
  }

  CalendarCtrl.prototype.list = function() {
      return this.Service.list().then((function(_this) {
        return function(data) {
           _this.events = data;
           _this.events.map(function (event) {
             event.dateRange = _this.CalcDateRange(event);
           });
           if (_this.events.length > 0) {
             _this.cur = _this.events[_this.index];
          }
        };
      })(this), (function(_this) {
        return function(error) {
          return _this.$log.error("Unable to get list of events: " + error);
        };
      })(this));
  };

  CalendarCtrl.prototype.CalcDateRange = function(event) {
    var startDate = new Date(event.startDate);
    var endDate = new Date(event.endDate);

    var result = startDate.getDate().toString();
    if (startDate.getMonth() == endDate.getMonth() &&
        startDate.getYear()  == endDate.getYear()  &&
        startDate.getDate()  != endDate.getDate()) {
      result += '-' + endDate.getDate().toString();
    }
    return result;
  };

  // Select action, updates cur variable and updates events scroll
  CalendarCtrl.prototype.SelectEvent = function(index) {
    this.index = index;
    this.cur = this.events[this.index];

    // Update the scroll so that the first event is the one on display.
    this.$location.hash('event'+index);
    this.$anchorScroll();

    // Reset view to show the event starting from the top.
    this.$location.hash('');
    this.$anchorScroll();
  };

  CalendarCtrl.prototype.Down = function() {
    if (this.index < this.events.length - 1) {
      return this.SelectEvent(this.index + 1);
    }
  }

  CalendarCtrl.prototype.Up = function() {
    if (this.index > 0 && this.events.length > 0) {
      return this.SelectEvent(this.index - 1)
    }
  }

  // Find init date function to initialize cur module after getting list of events

  return CalendarCtrl;
})();
controllersModule.controller('CalendarCtrl', ['$rootScope', '$log', '$location', '$anchorScroll', 'EventService', CalendarCtrl]);

