;( function( ){
    'use strict';
    
    var searchInput = document.querySelector( '#search-input' );

	searchInput.addEventListener( 'keyup',  getTweets );	 

	searchInput = null;

    function getTweets( e ){
        var request,
            term;

        term = e.target.value;

        if( term.length > 1 ){
            
            request = new XMLHttpRequest();

        	request.addEventListener( 'load', function( e ){
        	    addTweets( JSON.parse( this.response ) );
        	});

            request.open( 'GET', 'http://' + window.location.host + '/search/' + term, true );
            request.send();
        }
    }

    function addTweets( data ){
        clearTweets();

        if( typeof data === 'object' && data.length ){

            data.forEach(
                addTweet
            );
        }
    }

    function clearTweets(){
        var ele = document.querySelectorAll( '.tweet' );

        while( ele.firstChild ){
            ele.removeChild( ele.firstChild );
        }
    }

    function addTweet( tweet ){
        
        var tweets = document.querySelector( '.tweets' );

        tweets.insertBefore( createTweet( tweet ), tweets.firstChild );
    }


    function createTweet( tweet ){
        var frag = document.createDocumentFragment(),
            li = document.createElement( 'li' ),
            avatar = document.createElement( 'div' ),
            avatarImage = document.createElement( 'img' ),
            tweetUser = document.createElement( 'div' ),
            userText = document.createTextNode( tweet.username ),
            tweetContent = document.createElement( 'div'),
            tweetText = document.createTextNode( tweet.tweet ),
            tweetInfo = document.createElement( 'div'  ),
            tweetInfoText = document.createTextNode( tweet.date );

            li.className = 'tweet';
            avatar.className =  'avatar';
            avatarImage.setAttribute( 'src', 'images/' + tweet.avatar );
            avatarImage.setAttribute( 'alt', tweet.avatar );

            avatarImage.classList.add( 'avatar' );

            tweetUser.className =  'tweet-user';
            tweetContent.className =  'tweet-content';
            tweetInfo.className = 'tweet-info'; 

            frag.appendChild( li );

            li.appendChild( avatar );

            avatar.appendChild( avatarImage );

            li.appendChild( tweetUser );

            tweetUser.appendChild( userText );

            li.appendChild( tweetContent );

            tweetContent.appendChild( tweetText );

            tweetContent.appendChild( tweetInfo );

            tweetInfo.appendChild( tweetInfoText );

            return frag;
    }

} ( ) );