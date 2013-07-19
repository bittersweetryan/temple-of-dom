
#Indiana Jones and the Temple of DOM

Ditching the dollar sign can be scary, just like entering the Temple of DOOM.  Just like Indiana Jones doesn't rely on heavy artiliry every web project doesn't need to rely on 3rd party libraries like jQuery. Modern browsers have a powerful API called the Document Object Model, or DOM, developers can manipulate HTML documents.  The DOM's API allows developers to get references to elements on a web page, modifie a page's markup,  and listen for and respond to events. 

In this article we'll dive into the Temple of DOM to build an application to search for artifacts (tweets) by Dr. Jones and his crew on their epic 1984 journey into the Temple of Doom.  We'll be swapping whips and knives for methods and properties as our weapons of choice.  Our journey will present us with four distinct challanges: selecting elements and listening for events, getting data from the server and removing elements from the page, adding elements to the page, and finally we'll tackle event delgation and modifying an element's existing class information. Our journey won't be trouble free, however, much like Indiana Jones had to deal with Mola Ram in the Temple of DOOM we'll have to deal with some Internet Explorer quirks in our Temple of DOM.

Before we get started on this journey we'll need to understand how to navigate our terrain, so we'll start with a quick brief on traversing HTML landscapes.

###Reading The Map
The terrain we'll face in the Temple oF DOM isn't made up of mountains, rivers, and valleys, however it does involve a tree.  It's a digital tree that consists of nodes that relate to each other through parent and child relationships.  Each HTML page is comprised of a tree of nodes, starting with the `html` tag at it's root.  

 

For example the following markup:

    <html>
    <head>
        <title></title>
    </head>
    <body>
        <div>
            <p></p>
        </div>
    </body>
    </html>

Produces the following DOM tree:

< < DOM tree pic > >

Instead of directions like "left" and "right" we traverse our map using directions like "parent" and "child" to move up and down our DOM tree. In the above example the top-most node, or root node, is the `HTML` element. The root has two children, `head` and `body` The `head` and `body` each have a single child of their own, `title` and `div` respectively.  In addition you'll also see `#text` nodes, these nodes contain the text that these elements contain in addition to any whitespace that exists between nodes.  

The DOM has a few properties for node traversal, these properties are available each node in our node tree. The `childNodes` property is a collection of all an element's child nodes.  

> When a DOM property returns a collection, it is actually an instance of a NodeList object.  The NodeList object is an "array like" collection.  It has a length property and elements can be accessed by index, however, none of the other Array metods exist on the collection.  

The `firstChild` property of a node always points to the node's first child. We can also get an elements sibling nodes, or nodes directly above or below it in the tree, by using the `nextSibling` and `previousSibling` properties.  A node's `parentNode` property points to it's parent.  The parent of the `html` node is the `document` object itself. 


###The Treasure Hunt

Now that we're prepared to navigate our landscape let's take a look at where the Temple of DOM will take us.  Our goal will be to search a fake twitter stream for artifacts (tweets) that match a search string and display only the artifacts that contain part of all of our search string.  We will also be able mark artifacts as "favorites" we find in the Temple so we can look at them later. Our HTML map for thes trip will be quite simple, yet will provide us with the opportunity to use many of the DOM's tools to accomplish our goal. 

    ...
	    <div class="content">
	        <section class="search">
	            <input type="text" class="search-text" id="search-input">
	        </section>
	        <section class="tweet-container">
	            <ul class="tweets">
                    <!-- this part will be dynamically added to the DOM -->
	                <li class="tweet">
	                    <div class="avatar">
	                        <img src="" alt="" class="avatar">
	                    </div>
	                    
	                    <div class="tweet-user">
	                    </div>
	                    <div class="tweet-content">
	                        <div class="tweet-info">
	                        </div>
	                    </div>
	                </li>
                    <!-- end dynamic content -->
	            </ul>
	        </section>
    ...

###First Challenge

The first challenge we'll face on our journey is selecting our text input and listening for a 'keyup' events that will tell our application to get a list of matching tweets from the server. 

> We use the `keyup` event becuase the `keydown` and `keypress` events fire continually while the user has a key pressed, however, the keyup event will only fire once key press.

The DOM provides us with a few different methods used to select elements: `getElementById( id )`, `getElementsByClassName( nam[s] )`, `getElementsbyTagName( name )`, `querySelector( cssSelector[s] )`, and `querySelectorAll( selector[s] )`.  `getElementById` has been around since the DOM its inception, also known as Level 1.  It returns a reference to the first node with a matching ID attribute.  The `getElementsByTagName` method will return a collection of nodes matching a specific HTML tag.  The `getElementsByClassName` method will return a collection of nodes with elements matching a specific class. `getElementsByClassName` is only supported in Internet Explorer versions 9 and newer.

The Swiss Army Knife on our journey will be the `querySelector( cssSelector )` and `querySelectorAll( cssSelector )` methods.  Not only will they do everything the methods mentioned above will, they also work in versions of Internet Explorer 8 and up.  `document.querySelector` returns the first matching DOM element it finds and the `querySelectorAll` method returns a collection of all matching elements.

> Note: `getElementsByClassName`, `getElementsByTagName`, `querySelector`, and `querySelectorAll` are also methods that are available on HTMLElement nodes.  This means that they will search the children of a node and return matching results. 

Our `HTML` map has only a single input so the `document.querySelector` method is best fit here.  The following code saves a reference to the search input by passing the `document.querySelector` method the ID of our search input and saving the result to a variable named `searchInput`.  

	var searchInput = document.querySelector( '#search-input' );

Now that we have a reference to our element we need to be able to listen for events being triggered on it.  The DOM Level 2 spec, gives us a clean and easy to use API for listening to events on an objec through the `addEventListener( type, listener [,useCapture] )` and `removeEventListener( type, listener [,useCapture] )` methods.

    searchInput.addEventListener( 'keyup',  getTweets );

>Versions of Internet Explorer less than 9 do not use a standard event model. Instead of using the standard `addEventListener` and `removeEventListener` methods, IE uses `attachEvent` and `detatchEvent`.  The fun doesn't stop there, however, becuase the event object that gets passed into the callback also deviates from the standards set by the W3C.  

###Second Challenge
As we travel deeper into the DOM we need to data from the server and clear the current list of tweets on the page. To get data from the server we'll need to get the text that a user has entered into the input field. Using the special event object that is passed into our callback we can get information about the event that was triggered, including the elment that triggered the event. 

> The event object has two similar properties that point to DOM objects: `target` and `currentTarget`.  The `target` property refers to the element that the event was dispatched on and the `currentTarget` property refers to the element that the eventListener was attached to.  We'll cover these in more detail in our third challenge. 

We'll use these properties to implement the `getTweets` function that we used as the event handler in the previous challenge.  `getTweets` will use the `event.target` property to get a reference to the element the user is typing in, and will use the elements `value` property to retreive the text.  We won't get much meaningful information out of a single character the next step is to make sure that the user has entered at least two characters before sending data off to the server via AJAX request.  The completed `getTweets` function is shown below:  

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
    
The `addTweets( data )` callback function will accept a JSON object as a parameter and clear all the current tweets from the page before adding new ones (which we'll cover in our third challenge).  The completed addTweets function will look like this:

    function addTweets( data ){
        clearTweets();

        if( typeof data === 'object' && data.length ){

            data.forEach(
                addTweet
            );
        }
    } 

In order to remove all of the tweets from the page we'll need to implement the `clearTweets` method.  This method will start by saving a reference to the ordered list that contains the tweets and use some of the navigation properties we learned about earlier.  Using a `while` loop we'll loop through all of the ordered lists' children until it has no more, removing each child along the way using the `removeChild( child )` method as shown below:

    function clearTweets(){
        var ele = document.querySelectorAll( '.tweet' );

        while( ele.firstChild ){
            ele.removeChild( ele.firstChild );
        }
    }  

###Third Challenge
Our third challenge is going to be the longest because creating elements using  DOM methods can be quite verbose. There is a shortcut we could take, by setting the `innerHTML` of our `<ol>`, however it may contain a performance crippling boobie trap becuase becuase it has to fire up the browser's HTML parser.  We'll play it safe on our journey and use the more performant methods provided by the DOM.  

Before we start adding artifacts to the page we'll need a container to hold our new elements before they are added to the page.  The `createDocumentFragment()` method is used just for this situation.  It returns a lightweight container that can hold elements to before they are added to the page.  To create new elements we'll be using the `document.createElement( tagName )`. Our new elements will require a bit of styling information, and in the temple of DOM there are a few different ways of mainpulating class information on an element.  The first, and most consice is to set the element's `className` property. We can also use the powerful `classList` property, however, since the new elements have no styling information the `className` property is the most concise way to set the class.  We will come back to the classList property in the next section.

To insert elements DOM provides us with the `appendChild( child )`, `insertBefore( newEleemnt, referenceElement )`, and `replaceChild( newChild, oldChild )` methods.  `appendChild` method is available on HTMLElement nodes and takes a single HTMLElement node as an argument which will get appended to the node's `childNodes` collection.  The `insertBefore` method is also available on HTMLElementNodes and is powerful method that gives you a bit more flexability than `appendChild`.  `insertBefore` takes two arguments, newElement and referenceElement, the newElement will be inserted into the parentNode's children before the referenceElement.  If no referenceElement is passed into `insertBefore` the newElement is added to the end of the parent's child nodes.  

The last method we'll use when adding artifacts to the page is the `setAttribute( name, value )` method.  This method is used to set attributes on elements, here we will use it to se the `src` property of an `image` tag.

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

We're almost out of the Temple safely, however, we'd like to remember some of the things that we saw along the way.  To do this we'll "favorite" the artifacts we really liked by clicking on a star in the UI. We'll implement this using a technique called "event delegation".  Event delegation relies on events "bubbling" up the DOM tree. Since we are adding and removing artifacts dynamically, without bubbling, we'd have to add an event listener on each artifact we add to the page.  We'd we'd also have to remember to remove the event listeners when items are removed from the page to avoid memory leaks. Additionally if there is a large list of items to listen to we'd end up creating a lot of event listeners, which could slow the page down.  

>Event bubbling is where events trigered on children get triggered on parent elements all the way up the dom tree until the event is finally triggered on the global object.  For example if we have a DOM tree that looks like this `html > body > div > ul > li` and a user clicks on the li the click will fire on the li, ul, div, body, and html elements and each one of these elements can handle the event. < < bubbling pic > > Look at the following example to watch event bubbling in action: [http://jsbin.com/uxufos/3/edit](http://jsbin.com/uxufos/3/edit)
 
In order to implement event delegation into our page an event listener will be added to the parement element of the artifact list using the same `addEventListener` method as before: 

    var tweetList =  document.querySelector( '.tweets' );
    
    tweetList.addEventListener( 'click', addFavorite );
    
The `addFavorite` method will check to determine if the element that was clicked was a favorite link or not using the `event.target` property and respond accordingly. If the event was triggered by an artifact we'll modify it's class information to signify wheater it was favorited or un-favorited. To do this we will use the target's `classList` property.  The `classList` property returns a unique value called a `DOMTokenList`.  `DomTokenList`'s can be iterated like an array, but it also has some useful utility methods.  The `add( class [, additionalClasses] )` method adds a class or multiple classes to an element's classList. It accepts one or more class names as parameters and will append them to the elements `className` attribute.  The `remove( class [,additionalClasses])` method will remove one or more classes from an elemnts's classList. The `toggle( class )` method will add a class if it does not exist on the element and remove it if the class already exists on the element.  Lastly the `contains( class )` method will return a boolean value if the element has the class or not. 

> `classList` isn't supported in versions of Internet Explorer less than 10.  In order to modify the classes on our elements in IE 9 and older we'd have to manually manipulate the className string.

In our journey the `toggle` and `contains` methods will allow us to accomplish our goal.  In our event listener well use the `contains` method to check if the element has a class of "favorite".  If it does we know that the favorite star was clicked and we can then use the `toggle` method to add and remove the `favorite-selected` class with a single line of code.

    function addFavorite( e ){
        
        var target = e.target;
        
        if( target.classList.contains( 'favorite' ) ){
            
            target.classList.toggle( 'favorite-selected' );
        }
    }

###Back to Safety
We made it out of the Temple of DOM alive, and were only midly scathed by a few wretched Internet Explorer quirks.  Through this journey you've learned that the API in modern browsers for maniulating the DOM is really quite powerful and not scary at all.  

Our entire journey can be viewed on Github at: http://www.github.com/bittersweetryan/temple-of-dom

###Resources

http://software.hixie.ch/utilities/js/live-dom-viewer/

