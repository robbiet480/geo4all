var request = require('request')
  , url = require('url')
  , util = require('util')
  , _ = require('lodash')
  , async = require('async');

//Countries for Esri. Taken from https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes

var countriesList = {"AFG":"Afghanistan","ALA":"Åland Islands","ALB":"Albania","DZA":"Algeria","ASM":"American Samoa","AND":"Andorra","AGO":"Angola","AIA":"Anguilla","ATA":"Antarctica","ATG":"Antigua and Barbuda","ARG":"Argentina","ARM":"Armenia","ABW":"Aruba","AUS":"Australia","AUT":"Austria","AZE":"Azerbaijan","BHS":"Bahamas","BHR":"Bahrain","BGD":"Bangladesh","BRB":"Barbados","BLR":"Belarus","BEL":"Belgium","BLZ":"Belize","BEN":"Benin","BMU":"Bermuda","BTN":"Bhutan","BOL":"Bolivia, Plurinational State of","BES":"Bonaire, Sint Eustatius and Saba","BIH":"Bosnia and Herzegovina","BWA":"Botswana","BVT":"Bouvet Island","BRA":"Brazil","IOT":"British Indian Ocean Territory","BRN":"Brunei Darussalam","BGR":"Bulgaria","BFA":"Burkina Faso","BDI":"Burundi","KHM":"Cambodia","CMR":"Cameroon","CAN":"Canada","CPV":"Cape Verde","CYM":"Cayman Islands","CAF":"Central African Republic","TCD":"Chad","CHL":"Chile","CHN":"China","CXR":"Christmas Island","CCK":"Cocos (Keeling) Islands","COL":"Colombia","COM":"Comoros","COG":"Congo","COD":"Congo, the Democratic Republic of the","COK":"Cook Islands","CRI":"Costa Rica","CIV":"Côte d'Ivoire","HRV":"Croatia","CUB":"Cuba","CUW":"Curaçao","CYP":"Cyprus","CZE":"Czech Republic","DNK":"Denmark","DJI":"Djibouti","DMA":"Dominica","DOM":"Dominican Republic","ECU":"Ecuador","EGY":"Egypt","SLV":"El Salvador","GNQ":"Equatorial Guinea","ERI":"Eritrea","EST":"Estonia","ETH":"Ethiopia","FLK":"Falkland Islands (Malvinas)","FRO":"Faroe Islands","FJI":"Fiji","FIN":"Finland","FRA":"France","GUF":"French Guiana","PYF":"French Polynesia","ATF":"French Southern Territories","GAB":"Gabon","GMB":"Gambia","GEO":"Georgia","DEU":"Germany","GHA":"Ghana","GIB":"Gibraltar","GRC":"Greece","GRL":"Greenland","GRD":"Grenada","GLP":"Guadeloupe","GUM":"Guam","GTM":"Guatemala","GGY":"Guernsey","GIN":"Guinea","GNB":"Guinea-Bissau","GUY":"Guyana","HTI":"Haiti","HMD":"Heard Island and McDonald Islands","VAT":"Holy See (Vatican City State)","HND":"Honduras","HKG":"Hong Kong","HUN":"Hungary","ISL":"Iceland","IND":"India","IDN":"Indonesia","IRN":"Iran, Islamic Republic of","IRQ":"Iraq","IRL":"Ireland","IMN":"Isle of Man","ISR":"Israel","ITA":"Italy","JAM":"Jamaica","JPN":"Japan","JEY":"Jersey","JOR":"Jordan","KAZ":"Kazakhstan","KEN":"Kenya","KIR":"Kiribati","PRK":"Korea, Democratic People's Republic of","KOR":"Korea, Republic of","KWT":"Kuwait","KGZ":"Kyrgyzstan","LAO":"Lao People's Democratic Republic","LVA":"Latvia","LBN":"Lebanon","LSO":"Lesotho","LBR":"Liberia","LBY":"Libya","LIE":"Liechtenstein","LTU":"Lithuania","LUX":"Luxembourg","MAC":"Macao","MKD":"Macedonia, the former Yugoslav Republic of","MDG":"Madagascar","MWI":"Malawi","MYS":"Malaysia","MDV":"Maldives","MLI":"Mali","MLT":"Malta","MHL":"Marshall Islands","MTQ":"Martinique","MRT":"Mauritania","MUS":"Mauritius","MYT":"Mayotte","MEX":"Mexico","FSM":"Micronesia, Federated States of","MDA":"Moldova, Republic of","MCO":"Monaco","MNG":"Mongolia","MNE":"Montenegro","MSR":"Montserrat","MAR":"Morocco","MOZ":"Mozambique","MMR":"Myanmar","NAM":"Namibia","NRU":"Nauru","NPL":"Nepal","NLD":"Netherlands","NCL":"New Caledonia","NZL":"New Zealand","NIC":"Nicaragua","NER":"Niger","NGA":"Nigeria","NIU":"Niue","NFK":"Norfolk Island","MNP":"Northern Mariana Islands","NOR":"Norway","OMN":"Oman","PAK":"Pakistan","PLW":"Palau","PSE":"Palestine, State of","PAN":"Panama","PNG":"Papua New Guinea","PRY":"Paraguay","PER":"Peru","PHL":"Philippines","PCN":"Pitcairn","POL":"Poland","PRT":"Portugal","PRI":"Puerto Rico","QAT":"Qatar","REU":"Réunion","ROU":"Romania","RUS":"Russian Federation","RWA":"Rwanda","BLM":"Saint Barthélemy","SHN":"Saint Helena, Ascension and Tristan da Cunha","KNA":"Saint Kitts and Nevis","LCA":"Saint Lucia","MAF":"Saint Martin (French part)","SPM":"Saint Pierre and Miquelon","VCT":"Saint Vincent and the Grenadines","WSM":"Samoa","SMR":"San Marino","STP":"Sao Tome and Principe","SAU":"Saudi Arabia","SEN":"Senegal","SRB":"Serbia","SYC":"Seychelles","SLE":"Sierra Leone","SGP":"Singapore","SXM":"Sint Maarten (Dutch part)","SVK":"Slovakia","SVN":"Slovenia","SLB":"Solomon Islands","SOM":"Somalia","ZAF":"South Africa","SGS":"South Georgia and the South Sandwich Islands","SSD":"South Sudan","ESP":"Spain","LKA":"Sri Lanka","SDN":"Sudan","SUR":"Suriname","SJM":"Svalbard and Jan Mayen","SWZ":"Swaziland","SWE":"Sweden","CHE":"Switzerland","SYR":"Syrian Arab Republic","TWN":"Taiwan, Province of China","TJK":"Tajikistan","TZA":"Tanzania, United Republic of","THA":"Thailand","TLS":"Timor-Leste","TGO":"Togo","TKL":"Tokelau","TON":"Tonga","TTO":"Trinidad and Tobago","TUN":"Tunisia","TUR":"Turkey","TKM":"Turkmenistan","TCA":"Turks and Caicos Islands","TUV":"Tuvalu","UGA":"Uganda","UKR":"Ukraine","ARE":"United Arab Emirates","GBR":"United Kingdom","USA":"United States","UMI":"United States Minor Outlying Islands","URY":"Uruguay","UZB":"Uzbekistan","VUT":"Vanuatu","VEN":"Venezuela, Bolivarian Republic of","VNM":"Viet Nam","VGB":"Virgin Islands, British","VIR":"Virgin Islands, U.S.","WLF":"Wallis and Futuna","ESH":"Western Sahara","YEM":"Yemen","ZMB":"Zambia","ZWE":"Zimbabwe"};

module.exports = {
  getEsriToken: function(clientId, clientSecret, callback){
    if(!clientId) callback(new Error('No clientId provided as first argument'));
    if(!clientSecret) callback(new Error('No clientSecret provided as second argument'));
    // Get a token that expires in 14 days
    request.get({
      url: "https://www.arcgis.com/sharing/oauth2/token?client_id="+clientId+"&client_secret="+clientSecret+"&f=json&grant_type=client_credentials&expiration=20160",
      json: true
    }, function(err,resp,body){
      if(!err && resp.statusCode == 200) {
        callback(null,body);
      } else {
        callback(err);
      }
    });
  },
  polylineDecode: function(str, precision) {
      var index = 0,
          lat = 0,
          lng = 0,
          coordinates = [],
          shift = 0,
          result = 0,
          byte = null,
          latitude_change,
          longitude_change,
          factor = Math.pow(10, precision || 5);

      // Coordinates have variable length when encoded, so just keep
      // track of whether we've hit the end of the string. In each
      // loop iteration, a single coordinate is decoded.
      while (index < str.length) {

          // Reset shift, result, and byte
          byte = null;
          shift = 0;
          result = 0;

          do {
              byte = str.charCodeAt(index++) - 63;
              result |= (byte & 0x1f) << shift;
              shift += 5;
          } while (byte >= 0x20);

          latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

          shift = result = 0;

          do {
              byte = str.charCodeAt(index++) - 63;
              result |= (byte & 0x1f) << shift;
              shift += 5;
          } while (byte >= 0x20);

          longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

          lat += latitude_change;
          lng += longitude_change;

          coordinates.push([lng / factor, lat / factor]);
      }

      return coordinates;
  },
  _fromCompressedGeometry: function(str) {
    var xDiffPrev = 0,
      yDiffPrev = 0,
      points = [],
      x, y,
      strings,
      coefficient;

    // Split the string into an array on the + and - characters
    strings = str.match(/((\+|\-)[^\+\-]+)/g);

    // The first value is the coefficient in base 32
    coefficient = parseInt(strings[0], 32);

    for (var j = 1; j < strings.length; j += 2) {
      // j is the offset for the x value
      // Convert the value from base 32 and add the previous x value
      x = (parseInt(strings[j], 32) + xDiffPrev);
      xDiffPrev = x;

      // j+1 is the offset for the y value
      // Convert the value from base 32 and add the previous y value
      y = (parseInt(strings[j + 1], 32) + yDiffPrev);
      yDiffPrev = y;

      points.push([x / coefficient, y / coefficient]);
    }

    return points;
  },
  getDirections: function(provider, from, to, inputOpts, callback) {
    var _this = this;
    if(typeof inputOpts === 'function') {
      callback = inputOpts
      inputOpts = {
        request: {},
        query: {}
      }
    }
    var requestOpts = {
      json: true,
      urlBuilder: {
        protocol: 'https'
      }
    };
    var queryOpts = {
      format: "json"
    };
    _.assign(requestOpts, inputOpts.request);
    _.assign(queryOpts, inputOpts.query);
    switch(provider) {
      case 'google':
        if(!queryOpts.sensor) queryOpts.sensor = false;
        if((queryOpts.mode == "transit") && (!queryOpts.departure_time) && (!queryOpts.arrival_time)) queryOpts.departure_time = Math.round(new Date().getTime() / 1000);
        requestOpts.urlBuilder.host = "maps.googleapis.com:443";
        requestOpts.urlBuilder.pathname = "/maps/api/directions/"+queryOpts.format;
        delete queryOpts.format;
        if(typeof from === "string" || from instanceof String) {
          // Given an address, let's geocode and use the lat/long
          queryOpts.origin = from;
        } else if(typeof from === "array" || from instanceof Array) {
          queryOpts.origin = from.join(",");
        } else {
          var err = new Error('You didn\t provide a valid from. Valid inputs for from are string or array')
          callback(err);
        }
        if(typeof to === "string" || to instanceof String) {
          // Given an address, let's geocode and use the lat/long
          queryOpts.destination = to;
        } else if(typeof to === "array" || to instanceof Array) {
          queryOpts.destination = to.join(",");
        } else {
          var err = new Error('You didn\t provide a valid from. Valid inputs for from are string or array')
          callback(err);
        }
        requestOpts.urlBuilder.query = queryOpts;
        requestOpts.url = url.format(requestOpts.urlBuilder);
        console.log('url',requestOpts.url);
        request.get(requestOpts, function(err,resp,body){
          if(!err && resp.statusCode == 200) {
            callback(null, _this.formatDirectionsResult(provider, body, requestOpts.url));
          } else {
            callback(err);
          }
        });
        break;
      case 'arcgis':
      case 'esri':
        requestOpts.urlBuilder.host = "route.arcgis.com:443";
        requestOpts.urlBuilder.pathname = "/arcgis/rest/services/World/Route/NAServer/Route_World/solve";
        queryOpts.directionsOutputType = "esriDOTComplete";
        queryOpts.stops = {};
        queryOpts.stops.features = [];
        async.series([
          function(cb) {
            if(typeof from === "string" || from instanceof String) {
              // Given an address, let's geocode and use the lat/long
              _this.geocode(provider,from, function(err,resp){
                if(err) {
                  cb(err);
                } else {
                  queryOpts.stops.features.push({"geometry": {"x": resp.geometry.longitude,"y": resp.geometry.latitude},"attributes": {"name": resp.address.pretty}});
                  cb(null);
                }
              });
            } else if(typeof from === "array" || from instanceof Array) {
              queryOpts.stops.features.push({"geometry": {"x": from[1],"y": from[0]},"attributes": {"name": from[0]+", "+from[1]}});
              cb(null);
            } else {
              var err = new Error('You didn\t provide a valid from. Valid inputs for from are string or array')
              cb(err);
            }
          }, function(cb){
            if(typeof to === "string" || to instanceof String) {
              // Given an address, let's geocode and use the lat/long
              _this.geocode(provider,to, function(err,resp){
                if(err) {
                  cb(err);
                } else {
                  queryOpts.stops.features.push({"geometry": {"x": resp.geometry.longitude,"y": resp.geometry.latitude},"attributes": {"name": resp.address.pretty}});
                  cb(null);
                }
              });
            } else if(typeof to === "array" || to instanceof Array) {
              queryOpts.stops.features.push({"geometry": {"x": to[1],"y": to[0]},"attributes": {"name": to[0]+", "+to[1]}});
              cb(null);
            } else {
              var err = new Error('You didn\t provide a valid to. Valid inputs for to are string or array')
              cb(err);
            }
          }, function(cb) {
            queryOpts.f = queryOpts.format;
            delete queryOpts.format;
            if(!inputOpts.token) callback(new Error('You must provide a token!'));
            queryOpts.token = inputOpts.token;
            queryOpts.stops = JSON.stringify(queryOpts.stops);
            cb(null);
          }
        ], function(err){
          requestOpts.urlBuilder.query = queryOpts;
          requestOpts.url = url.format(requestOpts.urlBuilder);
          request.get(requestOpts, function(err,resp,body){
            if(!err && resp.statusCode == 200) {
              callback(null, _this.formatDirectionsResult(provider, body, requestOpts.url));
            } else {
              callback(err);
            }
          });
        });
        break;
      default:
        break;
    }
  },
  formatDirectionsResult: function(provider, response, url) {
    var _this = this;
    var replyObj = {
      origin: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: []
        },
        properties: {}
      },
      destination: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: []
        },
        properties: {}
      },
      steps: [],
      lineString: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: []
        },
        properties: {}
      },
      warnings: [],
      info: {
        url: url,
        provider: provider
      }
    };
    switch(provider) {
      case 'google':
        var route = response.routes[0];
        var firstLeg = route.legs[0];
        replyObj.distance = firstLeg.distance.text;
        replyObj.duration = firstLeg.duration.text;
        replyObj.origin.geometry.coordinates = [firstLeg.start_location.lng,firstLeg.start_location.lat];
        replyObj.origin.properties.address = firstLeg.start_address;
        replyObj.destination.geometry.coordinates = [firstLeg.end_location.lng,firstLeg.end_location.lat];
        replyObj.destination.properties.address = firstLeg.end_address;
        replyObj.summary = route.summary;
        replyObj.lineString.geometry.coordinates = _this.polylineDecode(response.routes[0].overview_polyline.points);
        _.forEach(firstLeg.steps, function(val,key){
          var step = {
            lineString: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: _this.polylineDecode(val.polyline.points)
              },
              properties: {}
            },
            distance: val.distance.text,
            duration: val.duration.text,
            instruction: val.html_instructions,
            start: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [val.start_location.lng,val.start_location.lat]
              }
            },
            end: {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [val.end_location.lng,val.end_location.lat]
              }
            }
          };
          replyObj.steps.push(step);
        });
        break;
      case 'esri':
      case 'arcgis':
        var route = response.routes;
        var directions = response.directions[0];
        console.log(util.inspect(response,{depth:null}));
        replyObj.distance = directions.summary.totalLength.toFixed(2)+" mi";
        replyObj.duration = directions.summary.totalDriveTime.toFixed(2).split('.')[0]+" mins";
        replyObj.origin.geometry.coordinates = route.features[0].geometry.paths[0][0];
        // replyObj.origin.properties.address = firstLeg.start_address;
        replyObj.destination.geometry.coordinates = route.features[0].geometry.paths[0][route.features[0].geometry.paths[0].length-1];
        // replyObj.destination.properties.address = firstLeg.end_address;
        // replyObj.summary = route.summary;
        replyObj.lineString.geometry.coordinates = route.features[0].geometry.paths[0];
        function decimalToHHMM(str) {
          var hrs = parseInt(Number(str));
          var min = Math.round((Number(str)-hrs) * 60);
          return hrs+':'+min;
        }
        _.forEach(directions.features, function(val,key){
          var step = {
            lineString: {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: _this._fromCompressedGeometry(val.compressedGeometry)
              },
              properties: {}
            },
            distance: val.attributes.length.toFixed(2)+" mi",
            duration: decimalToHHMM(val.attributes.time),
            instruction: val.attributes.text,
            // start: {
            //   type: "Feature",
            //   geometry: {
            //     type: "Point",
            //     coordinates: [val.start_location.lng,val.start_location.lat]
            //   }
            // },
            // end: {
            //   type: "Feature",
            //   geometry: {
            //     type: "Point",
            //     coordinates: [val.end_location.lng,val.end_location.lat]
            //   }
            // },
          };
          replyObj.steps.push(step);
        });
        break;
      default:
        break;
    }
    return replyObj;
  },
  formatGeocodeResult: function(provider, response, url) {
    var _this = this;
    var replyObj = {
      address: {},
      feature: {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: []
        },
        properties: {}
      },
      geometry: {
        latitude: null,
        longitude: null
      },
      info: {
        url: url,
        provider: provider
      }
    };
    switch(provider) {
      case 'google':
        var resp = response.results[0];
        replyObj.address.precision = resp.types[0];
        replyObj.address.pretty = resp.formatted_address;
        replyObj.geometry.latitude = resp.geometry.location.lat;
        replyObj.geometry.longitude = resp.geometry.location.lng;
        replyObj.feature.geometry.coordinates = [resp.geometry.location.lng,resp.geometry.location.lat];
        _.forEach(resp.address_components, function(val,key){
          if (val.types.indexOf('country') >= 0) {
            replyObj.address.country = val.long_name;
          }
          if (val.types.indexOf('country') >= 0) {
            replyObj.address.countryCode = val.short_name;
          }
          // State
          if (val.types.indexOf('administrative_area_level_1') >= 0) {
            replyObj.address.region = val.long_name;
          }
          // if (val.types.indexOf('administrative_area_level_1') >= 0) {
          //   replyObj.address.stateCode = val.short_name;
          // }
          // City
          if (val.types.indexOf('locality') >= 0) {
            replyObj.address.city = val.long_name;
          }
          // Adress
          if (val.types.indexOf('postal_code') >= 0) {
            replyObj.address.postal = val.long_name;
          }
          if (val.types.indexOf('street_number') >= 0) {
            // replyObj.address.streetNumber = val.long_name;
            replyObj.address.address = val.long_name+" ";
          }
          if (val.types.indexOf('route') >= 0) {
            // replyObj.address.streetName = val.long_name;
            replyObj.address.address += val.long_name;
          }
        });
        break;
      case 'arcgis':
      case 'esri':
        if(response.locations) {
          // We have a geocode response
          // Lets return best match
          var location = response.locations[0];
          replyObj.address.precision = location.feature.attributes.Addr_type;
          replyObj.address.pretty = location.name;
          replyObj.address.address = location.feature.attributes.AddNum+' '+location.feature.attributes.StName+' '+location.feature.attributes.StType;
          replyObj.address.city = location.feature.attributes.City;
          replyObj.address.region = location.feature.attributes.Region;
          replyObj.address.country = countriesList[location.feature.attributes.Country];
          replyObj.address.countryCode = location.feature.attributes.Country;
          replyObj.address.postal = location.feature.attributes.Postal;
          replyObj.geometry.latitude = location.feature.geometry.y;
          replyObj.geometry.longitude = location.feature.geometry.x;
        } else if(response.address) {
          // We have a reverse geocoding response
          replyObj.geometry.latitude = response.location.y;
          replyObj.geometry.longitude = response.location.x;
          var pieces = _.filter(response.address, function(val,key){
            if((!_.isNull(val)) && (key != "Loc_name")) {
              return val;
            }
          });
          replyObj.address.pretty = pieces.join(', ');
          _.forEach(response.address, function(val,key){
            if((!_.isNull(val)) && (key != "Loc_name")) {
              replyObj.address[key.charAt(0).toLowerCase() + key.slice(1)] = val;
            }
          });
        }
        break;
      default:
        return new Error('No such provider');
        break;
    }
    replyObj.feature.properties = replyObj.address;
    replyObj.feature.geometry.coordinates = [replyObj.geometry.longitude,replyObj.geometry.latitude];
    return replyObj;
  },
  geocode: function(provider, input, inputOpts, callback) {
    var _this = this;
    if(typeof inputOpts === 'function') {
      callback = inputOpts
      inputOpts = {
        request: {},
        query: {}
      }
    }
    var requestOpts = {
      json: true,
      urlBuilder: {
        protocol: 'https'
      }
    };
    var queryOpts = {
      format: "json"
    };
    _.assign(requestOpts, inputOpts.request);
    _.assign(queryOpts, inputOpts.query);
    switch(provider) {
      case 'google':
        if(!queryOpts.sensor) queryOpts.sensor = false;
        requestOpts.urlBuilder.host = "maps.googleapis.com:443";
        requestOpts.urlBuilder.pathname = "/maps/api/geocode/"+queryOpts.format;
        delete queryOpts.format;
        if(typeof input === "string" || input instanceof String) {
          queryOpts.address = input;
        } else if(typeof input === "array" || input instanceof Array) {
          queryOpts.latlng = input.join(',');
        } else {
          var err = new Error('You didn\t provide a valid input. Valid inputs are string or array')
          callback(err);
        }
        break;
      case 'esri':
      case 'arcgis':
        requestOpts.urlBuilder.host = "geocode.arcgis.com:443";
        requestOpts.urlBuilder.pathname = "/arcgis/rest/services/World/GeocodeServer/";
        if(typeof input === "string" || input instanceof String) {
          requestOpts.urlBuilder.pathname += "find/";
          queryOpts.text = input;
          queryOpts.outFields = "*";
        } else if(typeof input === "array" || input instanceof Array) {
          requestOpts.urlBuilder.pathname += "reverseGeocode/";
          queryOpts.location = input.reverse().join(',');
        } else {
          var err = new Error('You didn\t provide a valid input. Valid inputs are string or array')
          callback(err);
        }
        queryOpts.f = queryOpts.format;
        delete queryOpts.format;
        break;
      default:
        return new Error('No such provider');
        break;
    }
    requestOpts.urlBuilder.query = queryOpts;
    requestOpts.url = url.format(requestOpts.urlBuilder);
    request.get(requestOpts, function(err,resp,body){
      if(!err && resp.statusCode == 200) {
        callback(null, _this.formatGeocodeResult(provider, body, requestOpts.url));
      } else {
        callback(err);
      }
    });
  }
};