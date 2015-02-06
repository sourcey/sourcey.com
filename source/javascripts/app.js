$(document).foundation();
$(document).ready(function() { 
  Socialite.load();
});

$(window).load(function() { 
  var sidebar = $('body article .sidebar')

  // Bind the floating sidebar  
  var sidebarFloat = $('body article .sidebar-float')
  if (sidebarFloat.length) {
    var content = $('body article .content')
    var topOffset = sidebarFloat.offset().top;
    var bottomLimit = content.height() + topOffset - sidebar.height();
    var isTop, isHidden = false;

    $(window).bind('scroll', function() {
      if ($(this).scrollTop() >= bottomLimit) {
          sidebarFloat.hide()
          isHidden = true;
      }
      else if ($(this).scrollTop() >= topOffset) {
          if (isHidden) {
              isHidden = false;
              sidebarFloat.show()
          }
          sidebarFloat.addClass('float')
          isTop = true;
      }
      else if (isTop) {
          sidebarFloat.removeClass('float')
          isTop = false;
      }
    });
  }

  // Bind the toc
  var toc = $('.toc', sidebar)
  if (toc.length) {
    toc.find('h4').append('<a href="#top">&uArr;</a>')
    toc.find('ul#markdown-toc > li').each(function(i) {
      var e = $(this)
      var l = e.children('ul')
      if (l.length) {
          var t = $('<a href="#" class="toggle"><span class="open">&dArr;</span><span class="close">&lArr;</span></a>')
          t.click(function() {
            //l.slideToggle()
            e.toggleClass('closed')
            return false;
          })
          e.prepend(t)
          if (i > 0)
            e.addClass('closed')
      }
      console.log(l.length)
    })
  }
});

http://css-tricks.com/snippets/html/glyphs/