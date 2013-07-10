var express = require( 'express' ),
	fs = require( 'fs' ),
	app = express();

app.use( express.logger() );
app.use( express.static( 'public' ) );

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

//app.listen( process.env.PORT );
app.listen( 3000 );