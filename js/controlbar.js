
define([ "jquery", "i18n", "vo", "date" ], function( $, i18n, vo, date ) {

    const default_background = "../assets/images/background.jpg";
    const current_background = "filesystem:" + chrome.extension.getURL( "/" ) + "temporary/background.jpg";

    setInfoURL = function() {
        var info = vo.cur.info;
        if ( i18n.GetLocale() != "zh_CN" ) {
            info = vo.cur.info.replace( "/knows/", "/" );
        }

        $( ".controlink[url='info']" ).attr({
            "title"    : vo.cur.name,
            "href"     : info
        });
    }

    setDownloadURL = function() {

        var shortname = vo.cur.shortname;
        if ( shortname == "#" ) {
            shortname = vo.cur.name;
        }

        $( ".controlink[url='download']" ).attr({
            "title"    : vo.cur.name,
            "href"     : vo.cur.hdurl,
            "download" : "SimpTab-" + date.Now() + "-" + shortname + ".jpg"
        });

    }

    setBackground = function( url ) {
        $("body").css({ "background-image": "url(" + url + ")" });
    }

    setFavorteState = function( is_show ) {
        is_show ? $( ".controlink[url='favorite']" ).show() : $( ".controlink[url='favorite']" ).hide();
    }

    setFavorteIcon = function() {
        var newclass = vo.cur.favorite == -1 ? "unfavoriteicon" : "favoriteicon";
        $( ".controlink[url='favorite']" ).find("span").attr( "class", "icon " + newclass );
    }

    return {
        Listen: function () {

            // listen chrome link
            $( ".chromelink" ).click( function( event ) {
                chrome.tabs.getCurrent( function( obj ) {
                    chrome.tabs.create({ url : $( event.currentTarget ).attr( "url" ) });
                    chrome.tabs.remove( obj.id );
                })
            });

            // listen control link
            $( ".controlink" ).click( function( event ) {
                var $target =  $( event.currentTarget ),
                    url     = $target.attr( "url" );
                if ( url == "setting" ) {

                    if ( !$target.hasClass( "close" )) {
                        $( ".setting" ).animate({ width: i18n.GetSettingWidth(), opacity : 0.8 }, 500, function() {
                            $target.addClass( "close" );
                        });
                    }
                    else {
                        $( ".setting" ).animate({ width: 0, opacity : 0 }, 500, function() {
                            $target.removeClass( "close" );
                        });
                    }
                }
                else if ( url == "favorite" ) {
                    var is_favorite = $($target.find("span")).hasClass("unfavoriteicon") ? true : false;
                    $( ".controlbar" ).trigger( "favoriteClickEvent", [is_favorite] );
                }
            });
        },

        AutoClick: function( idx ) {
            if ( idx < 3 ) {
                $( $(".chromelink")[idx] ).click();
            }
            else {
                $( $(".controlbar").find( "a" )[idx] )[0].click();
            }
        },

        Set: function( is_default ) {

            // set default background
            if ( is_default ) {
                vo.cur = vo.Create( default_background, default_background, "Wallpaper", "#", new Date(), "Wallpaper", "default" );
            }

            setInfoURL();
            setDownloadURL();
            setBackground( is_default ? default_background: current_background );
            setFavorteState( !is_default );
            setFavorteIcon();
        },
        SetFavorteIcon: setFavorteIcon
    }
});
