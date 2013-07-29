
#Indiana Jones and the Temple of DOM

Ditching the dollar sign can be a scary thought, just like entering the Temple of DOOM.  Just like Indiana Jones doesn't rely on bombs and guns every web project doesn't need to start with adding 3rd party libraries l Modern browsers have a powerful API called the Document Object Model, or DOM for short, that developers can leverage to manipulate HTML documents. 

In this article we'll venture into the Temple of DOM to build an application to search for artifacts (tweets) by Dr. Jones and his crew on their epic 1984 journey.  Instead of whips and knives we'll be arming ourselves with methods and properties. Much like Indiana Jones had to deal with Mola Ram in the Temple of DOOM our villan in the Temple of DOM will be Internet Explorer.  

Before we get started  we'll need to understand how to navigate our terrain, so let's start with a quick brief on traversing an HTML landscape.

###Reading The Map

The terrain we'll face in the Temple oF DOM isn't made up of mountains, rivers, and valleys. Our terrain is made up of a trees and nodes that relate to each other through parent and child relationships.  

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

Instead of directions like "left" and "right" we navigate our map using directions like "parent" and "child" to move up and down our DOM tree. The DOM has a few properties for node traversal, these properties are available each node in our node tree. The `childNodes` property is a collection of all an element's child nodes.  

> When a DOM property returns a collection, it is actually an instance of a NodeList object.  The NodeList object is an "array like" collection.  It has a length property and elements can be accessed by index, however, none of the other Array metods exist on the collection.  

The `firstChild` property of a node always points to the node's first child. We can also get an elements sibling nodes, or nodes directly above or below it in the tree, by using the `nextSibling` and `previousSibling` properties.  A node's `parentNode` property points to it's parent.  The parent of the `html` node is the `document` object itself. 


###The Treasure Hunt

Now that we're prepared to navigate our landscape let's take a look at where the Temple of DOM will take us.  Our goal will be to search a fake twitter stream for artifacts (tweets) that match a search string and display only the artifacts that contain part of all of our search.  We will also be able mark artifacts as "favorites" so we can look at them later. Our map for the trip will be quite simple, yet will provide us with the opportunity to use many of the DOM's tools to accomplish our goal:

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
    </div>
   

###First Challenge

As we enter the Temple of DOM the first challenge we'll face is selecting our input and listening for `keyup` events that will trigger our application to get a list of matching tweets from the server. 

> We use the `keyup` event becuase the `keydown` and `keypress` events fire continually while the user has a key pressed, however, the keyup event will only fire once key press.

The DOM provides us with a few different methods used to select elements: `getElementById( id )`, `getElementsByClassName( nam[s] )`, `getElementsbyTagName( name )`, `querySelector( cssSelector[s] )`, and `querySelectorAll( selector[s] )`. While these methods can be useful the Swiss Army Knife we'll use on our journey will be the `querySelector( cssSelector )` and `querySelectorAll( cssSelector )` methods.   `document.querySelector` returns the first matching DOM element it finds and the `querySelectorAll` method returns a collection of all matching elements.

> Note: `getElementsByClassName`, `getElementsByTagName`, `querySelector`, and `querySelectorAll` are also methods that are available on HTMLElement nodes.  This means that they will search the children of a node and return matching results. 

Our map has only a single input so the `document.querySelector` method is best fit here.  The following code saves a reference to the search input and saves the result to a variable named `searchInput`:

	var searchInput = document.querySelector( '#search-input' );

Next we need to be able to listen for the `keyup` event to be triggered on the select.  The DOM gives us a  easy to use API for subscribing and unsubscribing to events with the `addEventListener( type, listener [,useCapture] )` and `removeEventListener( type, listener [,useCapture] )` methods.  The code below will listen for key up events on the `searchInput` and call the getTweets method.  

    searchInput.addEventListener( 'keyup',  getTweets );

>Versions of Internet Explorer less than 9 do not use a standard event model. Instead of using the standard `addEventListener` and `removeEventListener` methods, IE uses `attachEvent` and `detatchEvent`.  The fun doesn't stop there, however, becuase the event object that gets passed into the callback also deviates from the standards set by the W3C.  

###Second Challenge
As we travel deeper into the DOM we need we'll need to know how to use the `event` object and how to remove elements from the page. To get data from the server we'll need to get the text that a user has entered into the input field by using the special `event` object that is passed into our callback.

> The event object has two similar properties that point to DOM objects: `target` and `currentTarget`.  The `target` property refers to the element that the event was dispatched on and the `currentTarget` property refers to the element that the eventListener was attached to.  We'll cover these in more detail in our third challenge. 

`getTweets` will use the `event.target` property to get a reference to the element the user is typing in and will use the elements `value` property to retreive the text.  We won't get much meaningful information out of a single character the next step is to make sure that the user has entered at least two characters before sending data off to the server via AJAX request.  The completed `getTweets` function is shown below:  

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
    
The `addTweets( data )` function that will be invoked when the ajax request is complete will accept a JSON object as a parameter and clear all the current tweets from the page before adding new ones. The completed addTweets function will look like this:

    function addTweets( data ){
        clearTweets();

        if( typeof data === 'object' && data.length ){

            data.forEach(
                addTweet
            );
        }
    } 

In order to remove all of the artifacts from the page we'll need to implement the `clearTweets` method.  Using a `while` loop we'll loop through all of the ordered lists' children until it has no more, removing each child along the way using the `removeChild( child )` method as shown below:

    function clearTweets(){
        var ele = document.querySelector( '.tweets' );

        while( ele.firstChild ){
            ele.removeChild( ele.firstChild );
        }
    }

###Third Challenge
Our third challenge is going to be quite long because creating elements using DOM methods can be quite verbose. We could use the `innerHTML` shortcut on our journey, however, much like the Temple of DOM contains boobie traps, using innerHTML can have some unwanted performance side effects becuase it has to fire up the browser's HTML parser.  On our journey we'll play it save and use the more performant methods provided by the DOM.  

Instead of adding the elements directly to the page we'll use a lightweight container to temporarly build our complete HTML struture prior to inserting them on the page.  The `createDocumentFragment()` returns a container that can hold elements to before they are added to the page.  We'll be using the `document.createElement( tagName )` to create new nodes to add to our documentFragment. Our new elements will require a bit of styling information, and there are a few different ways of mainpulating class information on an element.  The most consice way is to set the element's `className` property.  We can also use the powerful `classList` property, however, since the new elements have no styling information the `className` property is the most easiest  way to set the class (we will come back to the classList property in the next section).

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

We're almost out of the Temple safely, however, we'd like to remember some of the things that we saw along the way.  To do this we'll "favorite" the artifacts we really liked by clicking on a star in the UI. The best way to implement this is by using a technique called "event delegation".  Event delegation is a technique where the event listener is placed on a parent element farther up the DOM tree than the intended target. This works becuase of the way events "bubble" up the DOM tree.

>Event bubbling is where events trigered on child nodes get triggered on parent elements all the way up the dom tree until the event reaches the top of the tree and is triggered on the global object.  For example if we have a HTML structure that looks like `html > body > div > ul > li` and a user clicks on the li the click event will fire on the li, ul, div, body, and html elements and each one of these elements can handle the event. < < bubbling pic > > Look at the following example to watch event bubbling in action: [http://jsbin.com/uxufos/3/edit](http://jsbin.com/uxufos/3/edit)

Since we are adding and removing artifacts dynamically without event delegation we'd have to add an event listener on each artifact on to the page.  In addion we'd we'd also have to remember to remove each event listener when items are removed from the page to avoid memory leaks. Additionally if there is a large list of items with event listeners attached to them the page could slow considerably.  
 
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

