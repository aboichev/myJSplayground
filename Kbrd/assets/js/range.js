function RangeSelector(opts) {
    
    var $kbrd = $('#rangeKbrd'),        
        $msg = $('#rangeMessage'),        
        $lowKey = null, $highKey = null,    
        
        onKeyPressed = function ($key) {
        
          // select lowkey
          if ($lowKey === null) {
             $lowKey = $key;
             
             $lowKey.addClass('low-range');
             $msg.text = "Click to select highest note";
             return;
          }
          // select highkey
          if ($highKey === null) {
              $highKey = $key;
              $highKey.addClass('high-range');
              $msg.text = "Click on selected key to unselect";
              return;
          }
          
          if ($key === $lowKey) {
             $lowKey.removeClass('low-range');
             $msg.text = "Click to select lowest note";
             return;             
          }
          
          if ($key === $highKey) {
             $highKey.removeClass('high-range');
             $msg.text = "Click to select highest note";
             return;             
          }         
          
        },
        
    show = function () {
        $kbrd.show();
        $msg.show();
        redraw();
    },
    
    redraw = function (w, h) {
        
        var keysHeight = h - $msg.height() - 40;
        opts.resizeToParent = w;
        opts.minKeyWidth = 70;
        opts.whiteKeyHeight = keysHeight;
        opts.blackKeyHeight = 0.5 * keysHeight;
        opts.onKeyDown = function ($key) {
            $key.addClass('keydown');
            onKeyPressed($key);
        };
        opts.onKeyUp = function ($key) {
            $key.removeClass('keydown');                    
        };

        $kbrd.kbrd(opts);        
    };
        
    return {
        show: show,
        redraw: redraw,
        selectKey: onKeyPressed        
    };    
}