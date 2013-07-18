
#Indiana Jones and the Temple of DOM

Much like Indiana Jones doesn't rely on heavy artiliry every web project doesn't need to rely on heavy libraries like jQuery.  Many times developers can tap into the power of the browsers native API for working with HTML documents, the Document Object Model.  The DOM is a powerful API for manipulating XML and HTML documents, listening for and responding to events, and handling AJAX requests. Much like Indiana Jones had to deal with Mola Ram in the Temple of DOOM we'll have to deal with some Internet Explorere quirks in our Temple of DOM.

swapping whips and knives for methods and properties

In this article we'll build an application to search for tweets by Dr. Jones and his crew on their epic 1984 journey into the Temple of Doom.  

Before we get started we'll need to understand how to navigate our terrain so we'll start with a quick brief on traversing HTML landscapes. From there well build an application that will let us search tweets from the gang, favorite tweets, and even something else.

###The Map
The terrain on our journey isn't made up of mountains, rivers, and valleys, however it does involve a tree.  It's a digital tree that consists of nodes.  Each HTML page is comprised of a tree of nodes.  The map for our journey looks like this:

Just like a map has different types of terrain our DOM tree has different kinds of elements.  Table 1 has a list of these elements and their associated type id's

	<table>
		<tr>
			<td>Type</td>
			<td>id</td>
		</tr>
	</table>

One important distinction to note is that DocumentElement nodes that contain text also have at least one TextNode child that contains the textural data.  

Instead of directions like "left" and "right" we traverse our map using directions like "parent" and "child".  A parent node is the node directly above and to the left of a node in the node tree.  The first parent of a document (the element that has no parents) is called the "root" node, in a HTML document the <html> tag is always the root node.  Each parent node can have one or many children.  The <html> tag typically has children of <head> and <body>.  

In order to traverse these nodes the DOM has some built in methods.  In order to go from a parent elemnt into its children we have a property called childNodes which is a list of all of an elements children.  The firstChild property always points to an elements first child element.  We can get an elements sibling nodes, or nodes directly above or below it in the tree, by using the nextSibling or previous Sibling methods.  In additon, since the childNodes is an array like structure.

> When a DOM property returns a collection, it is actually an instance of a NodeList object.  The NodeList object is an "array like" collection.  It has a length property and elements can be accessed by index, however, none of the other Array metods exist on the collection.  

Getting a nodes parent node is as simple as refering to its parentNode property.  


###The Treasure Hunt

Using only the native JavaScript objects that are in the DOM (and a little bit of household cleaner known as AJAX)we'll dive into the depths of twitter to search for hidden treasure. Using a basic HTML document as our map we'll use  traverse the DOM tree, add/edit/remove elements on the page, listen for events, and even get some data using the browser's XMLHttpRequest object. 

###First Challenge

The first challenge we'll face on our journey is selecting our text input and listening for a 'keyup' event on the input to trigger an AJAX call. 

> `keydown` and `keypress` events may fire continually while the user has a key pressed, however, the keyup event will only fire once key press.

The browser's native DOM provides us with a few different options on how to do select elements: `getElementById( id )`, `getElementsByClassName( name(s) )`, `getElementsbyTagName( name )`, `querySelector( cssSelector(s) )`, and `querySelectorAll( selector(s) )`.  `getElementById` has been around since the DOM level 1 spec.  It will return a reference to the first item that is found with a matching ID attribute, 'getElementsByTagName' will return a list of nodes matching a specific HTML tag.  The `getElementsByClassName` will return a NodeList with elements matching a specific class, however, Internet Explorer is limited to versions 9 and newer. 

For the purposes of our journey, the querySelctor methods will be the Swiss Army Knife kind of tool we need as it does everything the above methods and will work in versions of Internet Explorer 8 and up.  Both `document.querySelector` and `document.querySelectorAll` accept CSS selector list as its only argument and returns the first matching DOM element in the case of `querySelector` or a populated NodeList object in the case of 'querySelectorAll`.

> Note: `getElementsByClassName`, `getElementsByTagName`, `querySelector`, and `querySelectorAll` are also methods that are available on HTMLElement nodes.  This means that they will search the children of a node and return matching results. 

Since our HTML map has only a single input the `document.querySelector` method is the correct one to use.  In the following code we are saving a reference to the search input by passing the `document.querySelector` method the ID of our search input and saving the result to a variable named `input`.  

	var searchInput = document.querySelector( '#search-input' );

Now that we have our element we need to be able to listen for events being fired on it.  The DOM Level 2, gives us a clean and easy to use API to listen to events on an object.  The `addEventListener` and `removeEventListener` methods are used to add and remove event listeners on a HTMLElement node.  

>Unfortunately versions of Internet Explorer less than 9 do not use a standard event model.   Instead of using the standard `addEventListener( type, listener [,useCapture] )` and `removeEventListener( type, listener [,useCapture] )` methods, IE uses `attachEvent` and `detatchEvent`.  The fun doesn't stop there, however, the event object that gets passed into the callback is also not a standard object.  

	input.addEventListener( 'keyup',  getTweets );
	
One thing to note about the code above is how it uses a function reference, `getTweets` as it's callback function and not an anonymous function.  Using an anonymous function would mean that the JavaScript engine would have to create that function every time the key is pressed which could negatively affect performance.  Using a function reference means that the function is only created once and invoked every time the key is pressed.  This brings us to the second challenge.

###Second Challenge
The second challenge we will face on our journey into the DOM is getting data from the server, and clearing the current list of tweets on the page.  In order to get data from the server we'll first need to get the text that a user has entered into the input field.  We could accomplish this by using one of the selector methods mentioned above, however, this tightly couples the event listener to that DOM element.  If it's ID would change, or if we wanted to listen to events on another element the callback wouldn't be useful.  A better way would be to use the special event objec t that is passed into our callback.  The event object contains a lot of information about the event that was triggered.  For our use case there are two properties that are particulary useful `target` and `currentTarget`.

> The event object has two similar properties that point to DOM objects: `target` and `currentTarget`.  The `target` property refers to the element that the event was dispatched on and the `currentTarget` property refers to the element that the eventListener was attached to.  We'll cover these in more detail in our third challenge. 

In order to get our tweet data we'll need to implement the `getTweets` function that we used in the event handler in the previous challenge.  `getTweets` will first get the text from the input by usng the `event.target` property.  Since we won't get much meaningful information out of a single character the next step is to make sure that the user has entered at least two characters before sending data off to the server via AJAX request.  The completed `getTweets` function is shown below:  

    function getTweets( e ){
        var request,
            term;

        term = e.target.value;

        if( term.length > 1 ){
            
            request = new XMLHttpRequest();

            request.addEventListener( 'load', function( e ){
                addTweets( JSON.parse( this.response ) );
            });

            request.open( 'GET', 'http://localhost:3000/search/' + term, true );
            request.send();
        }
    }
    
*XMLHttpRequest is not part of the Document Object Model, it is however it is part of the W3C spec. 

The `addTweets( data )` callback function will accept a JSON object as a parameter and clear all the current tweets from the page before adding new ones (which we'll cover in our third challenge).  The completed addTweets function will look like this:

    function addTweets( data ){
        clearTweets();

        if( typeof data === 'object' && data.length ){

            data.forEach(
                addTweet
            );
        }
    } 

In order to remove all of the tweets from the page we'll get a reference to the ordered list that contains the tweets and use some of the navigation properties we learned earlier in the article.  Using a `while` loop we'll loop through all of the ordered lists' children until it has no more, removing each child along the way using the `removeChild` method as shown below:

    function clearTweets(){
        var ele = document.querySelectorAll( '.tweet' );

        while( ele.firstChild ){
            ele.removeChild( ele.firstChild );
        }
    }  

###Third Challenge
Our third challenge is going to be the longest because creating elements using  DOM methods can be quite verbose. There is a shortcut we could take, by setting the `innerHTML` of our `<ol>`, however it can be an expensive operation becuase it has to fire up the browser's HTML parser.  We'll avoid this trap on our journey and use the more performant methods.  

First we'll the  `document.createDocumentFragment()` method which returns a lightweight container that can be used to attach elements to before inserting them on the page. The fragment container cannot be added to the page without any child elements.  We'll use the  `document.createElement( tagName )` to create new elements that can be appended to our fragment.  The `document.createElement` method accepts the tag name of an HTML element as it's only parameter and returns a new HTMLElement of that type.  Our new elements will require a bit of styling information, and in the temple of DOM there are a few different ways of mainpulating class information on an element.  The first, and most consice is to set the element's `className` property. We can also use the powerful element.classList property wich returns a `DOMTokenList` element, we'll talk more about `classList` in the next challenge.  Since we are creating new elements we know the element has no classes already assigned so using the className property is the most concise way to set the class. 

To add new elements to the page the DOM provides us with the `appendChild( child )`, `insertBefore( newEleemnt, referenceElement )`, and `replaceChild( newChild, oldChild )` methods.  Elements are removed with the `removeChild( child )` method.  `appendChild` method is available on HTMLElement nodes and takes a single HTMLElement node as an argument which gets appended to the node's `childNodes` list.  The `insertBefore` method is also available on HTMLElementNodes and is powerful method that gives you a bit more flexability than `appendChild`.  `insertBefore` takes two arguments, newElement and referenceElement.  The newElement will be inserted into the parentNode's children before the referenceElement.  If no referenceElement is passed into `insertBefore` the newElement is added to the end of the parent's child nodes.  

The last method we'll use to add tweets to the page is the `setAttribute( name, value )` method.  The name parameter is the name of the attribute to be set and the value is the value that it should be set to.  

Using these tools we can create the `addTweet` and `createTweet` methods:

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

###Fourth Challenge
event delegation, classList
The DOMTokenList can be iterated like an array, but it also has some useful utility methods.  The `add` method can be used to add a class to an element, avoiding the need to manually to mainpulate the className's string.  The `remove`

