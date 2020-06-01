// mode that applies to entire script of models:index.js file
// use strict - "cleans up javascript code" meaning that it forces poor syntax practices to cause an error. (Poor syntax practices can include: "poorly defined variables, global scope variables, duplicate parameters, etc") 
'use strict';

// brings in node modules "file save system"
var fs        = require('fs');
// brings in node module path, allows for joining of files / functions
var path      = require('path');
// 
var Sequelize = require('sequelize');
// dependent on the 'path' module system
var basename  = path.basename(module.filename);
// node package that needs to be brought in using npm i dotenv (https://www.npmjs.com/package/dotenv)
// allows developers to manage configuration of applications seperate from code base. It protects developers passwords and API keys, other valuable information users should not acquire. While hiding this sensitive information it allows the code to function properly. to see more details, reference the npm dotenv notation
var env       = process.env.NODE_ENV || 'development';
// bring in the confir folder
var config    = require(__dirname + '/../config/config.json')[env];
// sets the varialbe db to an empty object
var db        = {};

// 
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// 
fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(function(file) {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
