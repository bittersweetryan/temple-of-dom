var express = require( 'express' ),
	fs = require( 'fs' ),
	app = express(),
	http = require( 'http' );

app.use( express.logger() );
app.use( express.static( 'public' ) );

app.set('port', process.env.PORT || 3000);

app.get( '/search/:term', function( req, res){
	
	fs.readFile( 'hacks.json', 'utf-8', function( err, content ){

		var artifactData = JSON.parse( content ),
			artifacts = artifactData.artifacts;

		artifacts = artifacts.filter( findArtifacts );

		res.json( artifacts );

	} );

	function findArtifacts( ele ){	

		return new RegExp( req.params.term, 'gi' ).test( ele.hack + ' ' + ele.browser + ' ' + ele.category );
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
