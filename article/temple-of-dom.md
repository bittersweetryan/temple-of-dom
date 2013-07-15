
#Indiana Jones and the Temple of DOM

Much like Indiana Jones doesn't rely on heavy artiliry every web project doesn't need to rely on heavy libraries like jQuery.  Many times developers can tap into the power of the browsers native API for working with HTML documents, the Document Object Model.  The DOM is a powerful API for manipulating XML and HTML documents, listening for and responding to events, and handling AJAX requests.  

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
The first challenge we'll face on our journey is selecting our text input and listening for events on it. In our DOM toolbelt we have a few different options on how to do this: `getElementByID`, `getElementsByClassName`, `getElementsbyTagName`, `querySelector`, and `querySelectorAll`.  For the purposes of our journey, the querySelctor methods will be just the Swiss Army Knife kind of tool we need.  `document.querySelector` and `document.querySelectorAll` allows us to pass in a CSS selector and get back a the first matching DOM element in the case of `querySelector` or a populated NodeList object in the case of 'querySelectorAll`.

###Second Challenge
getting tweets and adding them to the dom

###Third Challenge
event delegation


