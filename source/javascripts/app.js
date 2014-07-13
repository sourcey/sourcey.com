$(document).foundation();
$(document).ready(function() { 
  Socialite.load();
});

$(window).load(function() { 
  var sidebar = $('body article .sidebar')
  if (sidebar.length) {
    var content = $('body article .content')
    var topOffset = content.offset().top;
    var bottomLimit = content.height() + topOffset - sidebar.height();
    var isTop, isHidden = false;

    // Bind the sidebar
    $(window).bind('scroll', function() {
      if ($(this).scrollTop() >= bottomLimit) {
          sidebar.hide()
          isHidden = true;
      }
      else if ($(this).scrollTop() >= topOffset) {
          if (isHidden) {
              isHidden = false;
              sidebar.show()
          }
          sidebar.addClass('float')
          isTop = true;
      }
      else if (isTop) {
          sidebar.removeClass('float')
          isTop = false;
      }
    });
  }

  // Bind the tok
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