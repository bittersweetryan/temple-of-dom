;( function( ){
    'use strict';
    
    var searchInput = document.querySelector( '#search-input' ),
        tweetList = document.querySelector( '.tweets' );

	searchInput.addEventListener( 'keyup',  getTweets );	 
    tweetList.addEventListener( 'click', addFavorite );
    
	searchInput = null; //remove reference to searchInput

    function addFavorite( e ){
        
        var target = e.target;
        
        if( target.classList.contains( 'favorite' ) ){
            
            if( target.classList.contains( 'favorite-selected' ) ){
                target.classList.remove( 'favorite-selected' );    
            }
            else{
                target.classList.add( 'favorite-selected' );    
            }
        }
    }

    function getTweets( e ){
        var request,
            term;

        term = e.currentTarget.value; //where the event was dispatched on

        if( term.length > 1 ){
            
            request = new XMLHttpRequest();

        	request.addEventListener( 'load', function( e ){
        	    addTweets( JSON.parse( this.response ) );
        	});
            
            console.log( window.location.protocol + '//' + window.location.host + '/search/' );

            request.open( 'GET', window.location.protocol + '//' + window.location.host + '/search/' + term, true );
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