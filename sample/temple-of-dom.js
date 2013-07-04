;( function( ){
    var input = document.querySelector( '#search-input' );

    input.addEventListener( 'keyup',  getTweets );


    function getTweets( e ){
    	var ret = {},
    		request = new XMLHttpRequest(),
    		term;

    	term = e.currentTarget.value;	

    	request.addEventListener( 'load', function( e ){
    		console.log( e );
    	});

    	request.open( 'GET', 'http://localhost:3000/search/' + term, true );
    	request.send();
    }

}() );