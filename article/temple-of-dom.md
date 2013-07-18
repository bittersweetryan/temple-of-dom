
#Indiana Jones and the Temple of DOM

For some developers ditching the dollar sign can be as scary as entering the Temple of DOOM.  Much like Indiana Jones doesn't rely on heavy artiliry every web project doesn't need to rely on heavy libraries like jQuery.  Many times developers can tap into the power of the browsers native API for working with HTML documents, the Document Object Model.  The DOM is a powerful API for manipulating XML and HTML documents, listening for and responding to events, and handling AJAX requests. Much like Indiana Jones had to deal with Mola Ram in the Temple of DOOM we'll have to deal with some Internet Explorere quirks in our Temple of DOM.

In this article we'll build an application to search for tweets by Dr. Jones and his crew on their epic 1984 journey into the Temple of Doom.  However we'll be swapping whips and knives for methods and properties as our weapons of choice as we build our application.  In our journey we'll face four distinct challanges: selecting elements and listening for events, getting data from the server and removing elements from the page, lastly we'll tackle event delgation and modifying an element's existing class information. 

Before we get started on this journey we'll need to understand how to navigate our terrain so we'll start with a quick brief on traversing HTML landscapes. After we know now to navigate our HTML structure our journey will take us through building an application that will let us dynamically search for tweets from the gang and favorite the ones we like.

###Reading The Map
The terrain in the Temple oF DOM isn't made up of mountains, rivers, and valleys, however it does involve a tree.  It's a digital tree that consists of nodes that relate to each other through parent and child relationships.  Each HTML page is comprised of a tree of nodes, starting with the `html` tag at it's root.  Each type of node on our map has a specific type, however for this journey we'll mainly be dealing with Element nodes and Text nodes. ElementNodes represent HTML elements and Text nodes contain the text that is displayed on the users screen.  

Instead of directions like "left" and "right" we traverse our map using directions like "parent" and "child".  A parent node is the node directly above and to the left of a node in the node tree.  The first parent of a document (the element that has no parents) is called the "root" node, in a HTML document the <html> tag is always the root node.  Each parent node can have one or many children.  The <html> tag typically has children of <head> and <body>.  

In order to traverse these nodes the DOM has some built in methods.  In order to go from a parent elemnt into its children we have a property called childNodes which is a list of all of an elements children.  The firstChild property always points to an elements first child element.  We can get an elements sibling nodes, or nodes directly above or below it in the tree, by using the nextSibling or previous Sibling methods.  In additon, since the childNodes is an array like structure.

> When a DOM property returns a collection, it is actually an instance of a NodeList object.  The NodeList object is an "array like" collection.  It has a length property and elements can be accessed by index, however, none of the other Array metods exist on the collection.  

Getting a nodes parent node is as simple as refering to its parentNode property.  


###The Treasure Hunt

Now that we're prepared to navigate our landscape let's take a look at where the Temple of DOM will take us.  Our goal will be to search a fake twitter stream for artifacts (tweets) that match a search string and display only the matching tweets on the screen.  We will also have the ability to favorite artifacts we find in the Temple so we can look at them later. Our HTML document map will be quite simple, yet will provide us with the opportunity to use many of the DOM's tools to accomplish our goal. 

	<!doctype html>
	<html lang="en">
	<head>
	    <meta charset="UTF-8">
	    <title>Twitter Client</title>
	    <link rel="stylesheet" href="style.css">
	</head>
	<body>
	    <header>
	        <h1 class="header-text">Twitter Treasure Hunt</h1>
	    </header>
	    <div class="content">
	        <section class="search">
	            <input type="text" class="search-text" id="search-input">
	        </section>
	        <section class="tweet-container">
	            <ul class="tweets">
	                <li class="tweet">
	                    <div class="avatar">
	                        <img src="images/Indiana_Jones.jpg" alt="" class="avatar">
	                    </div>
	                    
	                    <div class="tweet-user">
	                        Ryan Anklam @bittersweetryan
	                    </div>
	                    <div class="tweet-content">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tempore aliquam ex.
	                        <div class="tweet-info">
	                            1/1/2030 12:00 am
	                        </div>
	                    </div>
	                </li>
	            </ul>
	        </section>
	    </div>
	    <script src="temple-of-dom.js"></script>
	</body>
	</html>

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

We're almose out of the Temple safely, however, we'd like to come back and remember the things that we really liked along the way.  To do this we'll "favorite" the artifacts we really liked.  In order to do this we'll use a technique called "event delegation".  Since we are adding and removing artifacts dynamically we'd have to add event listeners on each item we add to the page, we'd also have to remember to clean up after ourselves when items are removed to the page. Additionally if we had a large list of items to listen to we'd end up creating a lot of event listeners which could slow our page down.  The solution to this problem is to use event delegation. Event delegation is where the event handler for an item is added to one of the element's parents and use event bubbling to respond to the event.

>Event bubbling is where events trigered on children get triggered on parent elements all the way up the dom tree until the event is finally triggered on the global object.  For example if we have a DOM tree that looks like this `html > body > div > ul > li` and a user clicks on the li the click will fire on the li, ul, div, body, and html elements and each one of these elements can handle the event. < < bubbling pic > > Look at the following example to watch event bubbling in action: [http://jsbin.com/uxufos/3/edit](http://jsbin.com/uxufos/3/edit)
 
In order to implement event delegation into the page an event listener will be added to the tweet container using the same `addEventListener` method as before: 

    tweetList.addEventListener( 'click', addFavorite );
    
The `addFavorite` method will check to determine if the element that was clicked was a favorite link or not using the `event.target` property and respond accordingly.  To do this we will use the target's `classList` property.  The `classList` property is unique in that it returns a DOMTokenListwhich can be iterated like an array, but it also has some useful utility methods.  The `add( class [, additionalClasses] )` method adds a class to an element's classList, it accepts one or more class name parameters.  The `remove( class [,additionalClasses])` method will remove a class from an elemnts's classList, the `toggle( class )` method will add a class if it does not exist on the element and remove it if it does.  Lastly the `contains( class )` method will return a boolean value if the element has the class or not. 

> `classList` isn't supported in versions of Internet Explorer less than 10.  In order to modify the classes on our elements in IE 9 and older we'd have to manually manipulate the className string.

In our journey the `toggle` and `contains` methods will allow us to accomplish our final goal.  In our event listener well use the `contains` method to check if the element has a class of "favorite".  If it does we know that the favorite star was clicked and we can then use the `toggle` method to add and remove the favorite-selected class.

    function addFavorite( e ){
        
        var target = e.target;
        
        if( target.classList.contains( 'favorite' ) ){
            
            target.classList.toggle( 'favorite-selected' );
        }
    }

###Back to Safety
We made it out of the Temple of DOM alive, and only midly scathed by those wretched Internet Explorer quirks.  Hopefully through this journey you've learned that the API in modern browsers for maniulating the DOM is really quite powerful and that the heavy frameworks aren't needed for every project.  



