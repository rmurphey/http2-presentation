var scout = require('scoutfile');
var fs = require('fs');
var path = require('path');

module.exports = function () {
  return [
    scout.generate({
      appModules : [
        {
          name : 'scout',
          path : './src/example-h1-app.js'
        }
      ]
    }).then(function (content) {
      fs.writeFileSync(path.join(__dirname, './static/example-h1-app/scout.js'), content, 'utf8')
    }, function (error) {
      console.log(error);
    }),

    scout.generate({
      appModules : [
        {
          name : 'scout',
          path : './src/example-h2-app.js'
        }
      ]
    }).then(function (content) {
      fs.writeFileSync(path.join(__dirname, './static/example-h2-app/scout.js'), content, 'utf8')
    }, function (error) {
      console.log(error);
    })

  ];
}
