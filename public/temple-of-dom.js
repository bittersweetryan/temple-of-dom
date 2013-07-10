;( function( ){
    'use strict';
    
    var input = document.querySelector( '#search-input' );

    input.addEventListener( 'keyup',  getTweets );

    function getTweets( e ){
        var ret = {},
            request,
            term;

        term = e.currentTarget.value;

        if( term.length > 1 ){
            
            request = new XMLHttpRequest();

            request.addEventListener( 'load', function( e ){
                addTweets( JSON.parse( this.response ) );
            });

            request.open( 'GET', 'http://localhost:3000/search/' + term, true );
            request.send();
        }
    }

    function addTweets( data ){
        clearTweets();

        if( data.length ){

            data.forEach(
                addTweet
            );
        }
    }

    function addTweet( tweet ){
        
    }

    function clearTweets(){
        var ele = document.querySelector( '.tweets' );

        while( ele.firstChild ){
            ele.removeChild( ele.firstChild );
        }
    }

    function createTweet( ){
        var frag = document.createDocumentFragment(),
            li = document.createElement( 'li' ),
            avatar = document.createElement( 'div' ),
            avatarImg = document.createElement( 'img' ),
            tweetUser = document.createElement( 'div' ),
            tweetContent = document.createElement( 'div'),
            tweetInfo = document.createElement( 'div'  );

            li.className( 'tweet' );
            avatar.className( 'avatar' );
            avatarImg.setAttribute( 'src', '' );
            avatarImg.setAttribute( 'alt', '' );
            tweetUser.className( 'tweet-user' );
            tweetContent.className( 'tweet-content' );
            tweetInfo.className( 'tweet-info' ); 
    }

}( ) );