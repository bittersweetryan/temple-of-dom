var express = require( 'express' ),
	fs = require( 'fs' ),
	app = express(),
	http = require( 'http' );

app.use( express.logger() );
app.use( express.static( 'public' ) );

app.set('port', process.env.PORT || 3000);

app.get( '/search/:term', function( req, res){
	
	fs.readFile( 'tweets.json', 'utf-8', function( err, content ){

		var tweetData = JSON.parse( content ),
			tweets = tweetData.tweets;

		tweets = tweets.filter( findTweets );

		res.json( tweets );

	} );

	function findTweets( ele ){	

		return new RegExp( req.params.term, 'gi' ).test( ele.tweet + ' ' + ele.username );
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});