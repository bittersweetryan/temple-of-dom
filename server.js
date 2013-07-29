var express = require( 'express' ),
	fs = require( 'fs' ),
	app = express();

app.use( express.logger() );
app.use( express.static( 'public' ) );

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

//app.listen( process.env.PORT );
app.listen( 3000 );