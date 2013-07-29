;( function( ){
    'use strict';
    
    var searchInput = document.querySelector( '#search-input' ),
        artifactList = document.querySelector( '.artifacts' );

	searchInput.addEventListener( 'keyup',  getArtifacts );	 
    artifactList.addEventListener( 'click', addFavorite );
    
	searchInput = null; //remove reference to searchInput

    function addFavorite( e ){
        
        var target = e.target;
        
        if( target.classList.contains( 'favorite' ) ){
            
            target.classList.toggle( 'favorite-selected' );
        }
    }

    function getArtifacts( e ){
        var request,
            term;

        term = e.currentTarget.value; //where the event was dispatched on

        if( term.length > 1 ){
            
            request = new XMLHttpRequest();

        	request.addEventListener( 'load', function( e ){
        	    addArtifacts( JSON.parse( this.response ) );
        	});
            
            console.log( window.location.protocol + '//' + window.location.host + '/search/' );

            request.open( 'GET', window.location.protocol + '//' + window.location.host + '/search/' + term, true );
            request.send();
        }
    }

    function addArtifacts( data ){
        clearArtifacts();

        if( typeof data === 'object' && data.length ){

            data.forEach(
                addArtifact
            );
        }
    }

    function clearArtifacts(){
        var ele = document.querySelector( '.artifacts' );
        
        while( ele.firstChild ){
            ele.removeChild( ele.firstChild );
        }
    }

    function addArtifact( artifact ){
        
        var artifacts = document.querySelector( '.artifacts' );

        artifacts.insertBefore( createArtifact( artifact ), artifacts.firstChild );
    }


    function createArtifact( artifact ){
        var frag = document.createDocumentFragment(),
            li = document.createElement( 'li' ),
            avatar = document.createElement( 'div' ),
            avatarImage = document.createElement( 'img' ),
            artifactUser = document.createElement( 'div' ),
            userText = document.createTextNode( artifact.browser ),
            artifactContent = document.createElement( 'div'),
            artifactText = document.createTextNode( artifact.hack ),
            artifactInfo = document.createElement( 'div'  ),
            artifactInfoText = document.createTextNode( artifact.category );

            li.className = 'artifact';
            avatar.className =  'avatar';
            avatarImage.setAttribute( 'src', 'images/' + artifact.avatar );
            avatarImage.setAttribute( 'alt', artifact.avatar );

            avatarImage.classList.add( 'avatar' );

            artifactUser.className =  'artifact-browser';
            artifactContent.className =  'artifact-content';
            artifactInfo.className = 'artifact-info'; 

            frag.appendChild( li );

            li.appendChild( avatar );

            avatar.appendChild( avatarImage );

            li.appendChild( artifactUser );

            artifactUser.appendChild( userText );

            li.appendChild( artifactContent );

            artifactContent.appendChild( artifactText );

            artifactContent.appendChild( artifactInfo );

            artifactInfo.appendChild( artifactInfoText );

            return frag;
    }

} ( ) );