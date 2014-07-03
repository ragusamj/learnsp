var main = {};
$(document).ready(function() {
  var gui = require('nw.gui'), win = gui.Window.get(), menubar = new gui.Menu({ type: 'menubar' }), menu = {
    go: new gui.Menu(),
    help: new gui.Menu()
  };

  menu.help.append(new gui.MenuItem({
    label: 'Not Available.',
    enabled: false
  }));
  menu.help.append(new gui.MenuItem({
    type: 'separator'
  }));

  menu.go.append(new gui.MenuItem({
    label: 'Home',
    click: function(){$('#nav-home').click()}
  }));
  menu.go.append(new gui.MenuItem({
    label: 'Conjugator',
    click: function(){$('#nav-conj').click()}
  }));
  menu.go.append(new gui.MenuItem({
    label: 'Lessons',
    click: function(){$('#nav-less').click()}
  }));
  menu.go.append(new gui.MenuItem({
    label: 'User Area',
    click: function(){$('#nav-user').click()}
  }));
  
  menubar.append(new gui.MenuItem({ label: 'Go', submenu: menu.go}));

  win.menu = menubar;
  win.menu.append(new gui.MenuItem({ label: 'Help', submenu: menu.help}));
  
  
  var tray = new gui.Tray({ title: 'SP'});
  tray.menu = menu.go;
  
  // WINDOW CONTROLS
  
  $('#button-quit').click(function() {
    win.close();
  })
  $('#button-mini').click(function() {
    win.minimize();
  })
  $('#button-full').click(function() {
    win.toggleFullscreen();
    win.isFullscreen ? $('#button-mini').removeClass('button-mini').addClass('button-mini-no') : $('#button-mini').removeClass('button-mini-no').addClass('button-mini');
  })
  win.on('leave-fullscreen', function () {
    $('#button-mini').removeClass('button-mini-no').addClass('button-mini');
  });
  
  // SET UP EXIT CONDITIONS
  
  main.canExit = {
    home: function() {return true;},
    conj: function () {
      // Assess whether conjugator can be exited or not
      return true;
    },
    less: function() {return true;},
    user: function () {
      // Assess whether user area can be exited or not
      return true;
    }
  }
  
  main.load = {
    home: function() {},
    conj: function () {},
    less: function() {},
    user: function () {}
  }
  
  main.view = 'none';
  main.goView = 'less';
  
  updateView();
  
  $('.title-nav').click(function(){
    $('.title-nav-selected')
      .removeClass('title-nav-selected')
      .addClass('title-nav');
    $(this).addClass('title-nav-selected');
    main.goView = $(this).attr('id').substr(4,4);
    updateView();
  })
  
  $('#nav-home').click();
  
});

function updateView() {
  if (main.view !== 'none') {
    if (!main.canExit.now())
      return 1;
  } else {
    setTimeout(function(){
      main.canExit.now = main.canExit[main.goView];
      $('.cont-' + main.goView).fadeIn(500, function() {
        main.view = main.goView;
        main.load[main.view];
      }).addClass('cont-visible');
    }, 200);
    return 0;
  }
  if (main.view == main.goView)
    return 1; // Cancel all this schmuck if we're already on that tab
  main.canExit.now = main.canExit[main.goView];
  $('.cont-visible').fadeOut(500, function() {
    $('.cont-' + main.goView).fadeIn(500, function() {
      main.view = main.goView;
      main.load[main.view];
      return 0;
    }).addClass('cont-visible');
  }).removeClass('cont-visible');
}
function store(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return retrieve(key);
}
function retrieve(key) {
  return JSON.parse(localStorage.getItem(key));
}
function destroy(key) {
  try {
    localStorage.removeItem(key);
  } catch(err) {
    return err;
  }
}