var express = require( 'express' ),
    app = express();
    
app.get( '/hello', function( req, res){
    var ret = {
        count: 100,
        tweets : [
            {
                username : 'bittersweetryan',
                tweet : 'hello, twitter'
            }
        ]
    };
    
    res.json( JSON.stringify( ret ) );
});

app.listen( process.env.PORT );

    
    
    