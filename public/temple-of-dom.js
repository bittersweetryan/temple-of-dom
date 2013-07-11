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
        
        var tweets = document.querySelector( '.tweets' );

        tweets.insertBefore( createTweet( tweet ), tweets.firstChild );
    }

    function clearTweets(){
        var ele = document.querySelector( '.tweets' );

        while( ele.firstChild ){
            ele.removeChild( ele.firstChild );
        }
    }

    function createTweet( tweet ){
        var frag = document.createDocumentFragment(),
            li = document.createElement( 'li' ),
            avatar = document.createElement( 'div' ),
            avatarImg = document.createElement( 'img' ),
            tweetUser = document.createElement( 'div' ),
            userText = document.createTextNode( tweet.username ),
            tweetContent = document.createElement( 'div'),
            tweetText = document.createTextNode( tweet.tweet ),
            tweetInfo = document.createElement( 'div'  ),
            tweetInfoText = document.createTextNode( tweet.date );

            li.className = 'tweet';
            avatar.className =  'avatar';
            avatarImg.setAttribute( 'src', 'images/' + tweet.avatar );
            avatarImg.setAttribute( 'alt', tweet.avatar );
            tweetUser.className =  'tweet-user';
            tweetContent.className =  'tweet-content';
            tweetInfo.className = 'tweet-info'; 

            frag.appendChild( li );

            li.appendChild( avatar );

            avatar.appendChild( avatarImg );

            li.appendChild( tweetUser );

            tweetUser.appendChild( userText );

            li.appendChild( tweetContent );

            tweetContent.appendChild( tweetText );

            tweetContent.appendChild( tweetInfo );

            tweetInfo.appendChild( tweetInfoText );

            return frag;
                
            //append child
            //insertbefore
    }

} ( ) );