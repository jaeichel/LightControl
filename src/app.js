/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');

// Create a Card with title and subtitle
var card = new UI.Card({
  title:'Scenes',
  subtitle:'Fetching...'
});

// Display the Card
card.show();

// Make the request
ajax(
  {
    url: 'http://10.3.0.1:38005/scenes/presets',
    type: 'json'
  },
  function(data) {
    // Success!
    console.log('Successfully fetched scene data!');
    
    var sceneNames = [], name;
    for (name in data) {
      if (data.hasOwnProperty(name)) {
        sceneNames.push(name);
      }
    }
    sceneNames.sort();
    
    var menuItems = [];
    for (index in sceneNames) {
        name = sceneNames[index];
        menuItems.push({
          title:data[name]['name'],
          sceneKey:name
        });
    }
    
    // Construct Menu to show to user
    var sceneMenu = new UI.Menu({
      sections: [{
        title: 'Scenes',
        items: menuItems
      }]
    });
    
    sceneMenu.on('select', function(e) {
      var sceneKey = menuItems[e.itemIndex].sceneKey;
      console.log('Item number ' + e.itemIndex + ' was pressed!');
      console.log("Activating scene: " + sceneKey);
      ajax(
        {
          url: 'http://10.3.0.1:38005/scenes',
          method: 'post',
          data: {'scene' : sceneKey},
          type: 'json'
        },
        function(data) {
          console.log('Activated scene: ' + data);
        },
        function(error) {
          console.log('Failed activating scene: ' + error);
        }
    );
    });
    
    // Show the Menu, hide the splash
    sceneMenu.show();
    card.hide();
  },
  function(error) {
    // Failure!
    console.log('Failed fetching scene data: ' + error);
    card.subtitle('Failed fetching scene data: ' + error);
  }
);