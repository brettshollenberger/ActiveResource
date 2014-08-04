# ActiveResource for Angular.js

ActiveResource provides a Base class to make modelling with Angular easier. It
provides associations, caching, API integration, validations, and Active Record
pattern persistence methods.

* [Installation](#installation)
* [Writing A Model](#writing-a-model)

## Installation:

In your bower.json:

    "ngActiveResource": "x.x.x"

## Simple:

Say you want a form to add comments to a post:

```html
<form ng-submit="comment.$save">
    <input ng-model="comment.text">
    <input type="submit">
</form>

<div ng-repeat="comment in post.comments">
    {{comment.text}}
</div>
```

In your controller, all you have to setup is something like this:

```javascript
$scope.post    = Post.find(1);
$scope.comment = $scope.post.comments.new();

Comment.after('$save', function() {
    $scope.comment = $scope.post.comments.new();
});
```

You don't even have to tell `ng-repeat` to load in the new comment. The new
comment will already be added to the post by association.

## Writing a Model:

Create an Angular factory or provider that relies on ngActiveResource:

```javascript
angular
    .module('app', ['ngActiveResource'])
    .factory('Post', ['ngActiveResource', function(ngActiveResource) {

        Post.inherits(ngActiveResource.Base);
                
        Post.hasMany('comments');
        Post.belongsTo('author');
        
        Post.api.configure(function(config) {
            config.baseURL  = "http://api.edmodo.com";
            config.resource = "posts";
        });
        
        Post.validates({
            title: { required: true },
            body:  { required: true }
        });

        function Post(data) {
            this.string('title');
            this.string('subtitle');
            this.string('body');

            this.computedProperty('fullTitle', function() {
                return this.title + this.subtitle;
            }, ['title', 'subtitle']);
        };

        return Post;
  });
```

The model is terse, but gains a lot of functionality from ngActiveResource.Base.

It declares a has-many relationship on Comment, allowing it to say things like:

```javascript
var post    = Post.new({ title: "My First Post" });
var comment = post.comments.new({ text: "Great post!" });
```

The new comment will be an instance of the class Comment, which will be defined
in its own model.

It also declares a belongs-to relationship on Author. This allows it to say
things like:

```javascript
var author     = Author.new();
comment.author = author;
comment.$save();
```

This will also cause author.comments to include this instance of Comment.

## Declaring Your API

### Global Declaration

ngActiveResource has to know about your API in order to interact with it. Let's
say you're working with just one API. In your app config, you can bootstrap the
API globally:

```javascript
  angular
    .module('App', ['ngActiveResource'])
    .config(function(ngActiveResource) {

      ngActiveResource.api.configure(function(config) {
        // what's the root of your API?
        config.baseURL = "https://api.edmodo.com/v1";

        // use something generic
        config.format  = "json";

        // or something more specific
        config.format = "application/vnd.amundsen.maze+xml";

        // don't append .format e.g. api.edmodo.com/v1/users.json
        config.appendFormat = false;
      });

    });
```

### Model-Specific Declaration

Maybe you've got a more complicated situation. A service-oriented
architecture with different APIs for your different endpoints. All
application-wide defaults can be overridden on a model-specific basis:

```javascript
angular
    .module('app', [])
    .factory('Post', ['ngActiveResource', function(ngActiveResource) {

      Post.inherits(ngActiveResource.Base);

      Post.api.configure(function(config) {
        config.baseURL  = "https://posty.api.edmodo.com";
        config.format   = "xml";

        // URLs will be:
        // GET    https://posty.api.edmodo.com/posts.xml
        // GET    https://posty.api.edmodo.com/posts/1.xml
        // POST   https://posty.api.edmodo.com/posts.xml
        // PUT    https://posty.api.edmodo.com/posts/1.xml
        // DELETE https://posty.api.edmodo.com/posts/1.xml
        config.resource = "posts";
      });

      function Post() {}

      return Post;

    }]);
```

### Endpoint-Specific Declaration

The most idiomatic way to name your endpoints is through the `resource` config
method shown above. With it, you gain a predicatable, RESTful API structure.

| HTTP Verb | CRUD       | Path         | Action   | Method         | Used To                 |
| --------- | :--------: | :----------: | :------: | :------------: | :---------------------  |
| GET       | Retrieve   | /users       | index    | where          | Display a list of users |
| GET       | Retrieve   | /users/:id   | show     | find           | Display a specific user |
| POST      | Create     | /users       | create   | $create, $save | Create a user           |
| PUT       | Update     | /users/:id   | update   | $update, $save | Update a specific user  |
| DELETE    | Destroy    | /users/:id   | destroy  | $destroy       | Delete a specific user  |

_A word of caution_: You should use the `resource` config method if you need no
more specific configuration. Technically, ngActiveResource doesn't require you
to define any `resource` name at all--it will intuit the resource name from the
name of your model. _BUT_: while this will work in development-mode, if you
uglify your Javascript in production, most uglifiers will remove function names,
which will cause ngActiveResource to lose its ability to intuit resource URLs in
production. _Defining the name of the resource in the config block will save you_.

If you need more specific configuration than the `resource` method (let's be
honest, we all do from time to time), you can override specific URLs. The names
of these URLs are derived from the name of the _action_:

```javascript
  Post.api.configure(function(config) {
    config.indexURL  = "show-me-all-the-posts";
    config.createURL = "create-a-post";
    config.showURL   = "posts/:title";
    config.updateURL = "posts/:title";
    config.deleteURL = "posts/:title";
  });
```

In the example above, we defined a URL structure that probably needs to be able
to "mung" a title. To define your title-munger, define a config method named
`parameterizeTitle`:

```javascript
  Post.api.configure(function(config) {
    // "My Great Title" => "my-great-title"
    config.parameterizeTitle = function(title) {
      return title.split(" ").join("-").toLowerCase().replace(/[\!\?]/g, '');
    }
  });
```

This method should be named `parameterize#{pascal-cased-parameter-name}`. For
example:

```javascript
  config.showURL = "posts/:wonkyPostId";

  config.parameterizeWonkyPostId = function() {
  }

  config.showURL = "posts/:strange_post_id";

  config.parameterizeStrangePostId = function() {
  }
```

### HTTP Configuration

You'll probably also find yourself wanting to configure various `$http` options.
If you've been working with Angular for a little while, you probably already
know that `$http` methods take a signature like this:

```javascript
  $http.get(url, [config])
  $http.delete(url, [config])
  $http.post(url, data, [config])
  $http.put(url, data, [config])
```

ngActiveResource model methods are just wrappers around these methods, and your
API can define options you use all the time to keep you from having to pass in
options every time you make a request.

_Everything_ that you can configure in an Angular `$http` request can be
configured via ngActiveResource's `http` config:

```javascript
ngActiveResource.api.configure(function(config) {
  config.cache   = true;
  config.headers = {
    "Accept": "application/json"
  },
  config.transformRequest = function() { ... }

  ... etc ...
});
```

As an example, let's say you have an authentication service. After your user is
authenticated, all of their requests should include their request token attached
to the query string, so that they can authenticate additional requests:

```javascript
angular
  .module('app')
  .factory('authentication', ['ngActiveResource', function(ngActiveResource) {

    function performAuthentication() { ... }

    function authenticate() {
      performAuthentication.then(configureAPI);
    }

    function configureAPI(response) {
      ngActiveResource.api.configure(function(config) {

        // all $http configuration goes on the $http object
        config.$http.params = {
          api_token = response.api_token
        }

      });
    };

    return authenticate;

  }]);
```

## Computed Properties:

Following the syntax of Ember.js' computed properties, you can create properties
that auto-magically update with or without Angular's two-way binding:

```javascript
function TShirt() {
    this.number('price');
    
    this.computedProperty('salePrice', function() {
        return this.price - (this.price * 0.2);
    }, 'price');
    
    this.computedProperty('superSalePrice', function() {
        return this.price - this.salePrice;
    }, ['price', 'salePrice']);
}
```

## Establish Associations:

A has many association can be setup by naming the field. If the field name is
also the name of the provider that contains the foreign model, this is all you
have to say. If the name of the provider is different, you can set it explicitly
via the `provider` option:

```javascript
this.hasMany('comments', { provider: 'MyApp.CommentModel' });
```

Foreign keys will also be intuited. For instance:

```javascript
this.belongsTo('post');
```

Expect the model to define a `post_id` attribute mapping to the primary key of
the post to which it belongs. If the foreign key is different, you can set it
explicitly: 

```javascript
this.belongsTo('post', { foreign_key: 'my_post_id' });
```

Any number of options can be set on the association:

```javascript
this.belongsTo('post', { provider: 'PostModel', foreign_key: 'my_post_id' });
```

## Methods:

ActiveResource adds two types of methods to your models and instances:

1) API-updating methods. These are prefaced with `$`, such as `$create`,
`$save`, `$update`, and `$delete`, and are the 'unsafe' methods in a RESTful API 
(POST, PUT, and DELETE). These methods will call the API using the URLs you've
set as ModelName.api.createURL, ModelName.api.updateURL, and ModelName.api.deleteURL.
The api.set method sets default API URLs for you, but you can override these defaults by setting
them explicitly.

2) Local-instance creating and finding methods. These include `new`, `find`,
`where`, `all`, and `update`. `new` creates a new instance of a model on the client,
and `update` updates that instance without issuing a PUT request. `find` will
attempt to find local instances in the model's client-side cache before issuing
a GET request, and `where` and `all` will always issue a GET request to ensure it has all
instances of a model that match given terms. These are the 'safe' methods in a
RESTful API (GET).

## Query Interface:

### Getting Set Up:

Best case scenario: You have an API that adheres to ActiveResource's RESTful
convention. Here's that convention:

| HTTP Verb | CRUD     | Path       | Action | Used To                                                           |
| --------- |:--------:|:----------:|:------:|:---------------------                                             |
| GET       | Retrieve | /users     | index  | Display a list of all users, or all users filtered by querystring |
| GET       | Retrieve | /users/:id | show   | Display a specific user, found by params or querystring           |
| POST      | Create   | /users     | create | Create a user                                                     |
| PUT       | Update   | /users/:id | update | Update a specific user                                            |
| DELETE    | Destroy  | /users/:id | destroy| Delete a specific user                                            |

If you do have an API that follows these conventions, hooking it up to ActiveResource is as easy as:

```javascript
Post.api.set('http://api.faculty.com');
```

Optionally, you can specify a format for your requests:

```javascript
Post.api.set('http://api.faculty.com').format('json');
```

Many APIs are set up to respond with specified data types if they are specified
in the URLs. A request like:

```javascript
Post.find({id: 1});
```

Will send the request:

```javascript
http://api.faculty.com/posts/1.json
```

If you need to override specific URLs:

```javascript
Post.api.indexURL  = 'http://api.faculty.com/list-all-the-users';
Post.api.showURL   = 'http://api.faculty.com/show-me-user';
Post.api.deleteURL = 'http://api.faculty.com/show-me-user/:param.json';
```

### Parameterized URLS versus Query Strings:

To signal to ActiveResource that you want it to replace parameters in your URL,
simply type them following a colon:

```javascript
Post.api.showURL = /posts/:id
Post.api.showURL = /posts/:_id  // MongoDB
```

The parameters themselves will be replaced:

```javascript
Post.find({ id: 1 });
>> http://faculty.api.com/posts/1
```

If no parameters are not provided _or_ your request utilizes parameters that are
_not_ specified in the search URL, then a querystring will be generated:

```javascript
Post.findURL = 'http://api.faculty.com/posts/:id';
Post.find({author_id: 1});

// 'http://faculty.api.com/posts/?author_id=1'
```

The `indexURL` is intended as a search URL. It is not expected to be
parameterized (though you can parameterize it). By default, that means it will
search using a querystring:

```javascript
Post.api.set('http://faculty.api.com').format('json');
Post.where({author_id: 1});

// 'http://faculty.api.com/posts.json?author_id=1'
```

### Find:

```javascript
var post = Post.find(1);
```

`find` is used to retrieve a single instance of a model. It is a method akin to
the `show` action in a RESTful API.

Like all ngActiveResource methods, it's also promise-based, so you can do whatever you like after you've found the
initial resource:

```javascript
var post = Post.find(1).then(function() {
    post.comments.findAll();
});
```

This will load all of the comments onto `post.comments`, so you can write your HTML like:

```html
<div ng-repeat="comment in post.comments">
...
</div>
```

Even the `post` is promise-based, so if you prefer, you could write the above like:

```javascript
var post = Post.find(1);

post.then(function() { post.comments.findAll(); });
```

### Where:

Returns an array of instances matching a query.

```javascript
posts = Post.where({ author_id: author.id }).then(function() {
    posts.each(function(post) { post.comments.findAll(); });
});
```

### findAll:

Returns all instances.

```javascript
var posts = Post.findAll().then(function() {
    posts.each(function(post) { post.comments.findAll(); });
});
```

## Custom Primary Keys

By default, models will assume a primary key field labeled `id`, but you can set
a custom one like so:

```javascript
function Post(attributes) {}
Post.primaryKey = '_id';
```

## Destroy Dependent Associations

If you want a model to delete certain associated resources when they themselves
are deleted, use `dependentDestroy`:

```javascript
Post.dependentDestroy('comments');
```
Now when you destroy a post, any associated comments will also be destroyed.

## Serialization

### Serialize

The `serialize` method of instances will serialize to the format of your API.

```javascript
Post.api.configure(function(config) {
    config.format = "json";
});

post = Post.new({title: "My Great Post"});

post.serialize();
>> '{"title": "My Great Post"}'

Post.api.configure(function(config) {
    config.format = "xml";
});

post.serialize();
>> '<post><title>My Great Post</title></post>'
```

### Deserialize

Should you ever need to parse responses yourself, the `deserialize` method will deserialize backend responses into plain old Javascript objects:

```javascript
Post.api.configure(function(config) {
    config.format = "json";
});

Post.deserialize('{"title": "My Great Title"}');
>> {title: "My Great Title"}

Post.api.configure(function(config) {
    config.format = "xml";
    config.unwrapRootElement = true;
});

Post.deserialize('<post><title>My Great Title</title></post>');
>> {title: "My Great Title"}
```

### Defining Custom Mimetypes

Out of the box, ngActiveResource defines JSON and XML Mimetypes, which declare serializers and deserializers for those formats.

Formats based on those formats, such as application/vnd.collection+json, or application/vnd.amundsen.maze+xml, will utilize the default serializers and deserializers. You can add additional serializers and deserializers anywhere in the parse chain to handle the semantics of your own Mimetype. 

You can also register your own custom Mimetypes. Here's the JSON Mimetype as an example:

```javascript
angular
  .module('ngActiveResource')
  .factory('ARMime.JSON', ['ARMime', function(Mime) {
    // declare a generic format (".json")
    var json            = new Mime.Format({name: "json"}),
    // declare a specific mimetype
        applicationJson = new Mime.Type({name: "application/json"});

    // parsers parse API responses into plain old Javascript objects
    Mime.formats["json"].parsers.push(function(json) {
      if (_.isObject(json)) { return json; }
      if (_.isString(json)) { return JSON.parse(json); }
    });

    // formatters format plain old Javascript objects into a serialized format
    Mime.formats["json"].formatters.push(JSON.stringify);

    return JSON;

  }]);
```

## Dirty:

Has an instance changed since last save? Useful for conditionally displaying a
save button:

```html
<button ng-show="comment.dirty()">Save</button>
```

An instance is dirty if any attribute has changed since last save. By default,
associations are ignored:

```javascript
comment = Comment.new();
comment.dirty();
>> false

comment.update({body: "Great post!"});
comment.dirty();
>> true

comment.save();
comment.dirty();
>> false

post    = Post.find(1);
comment = post.comments.new();
comment.dirty();
>> false

comment.dirty({ignoreAssociations: false});
>> true // post_id has changed to 1 and the comment has not been saved
```

## Changed Attributes:

Get a list of attributes that have changed since last save:

```javascript
comment = Comment.new();
comment.changedAttributes();
>> []

comment.update({body: "Great post!"});
comment.changedAttributes();
>> ["body"]

comment.save();
comment.changedAttributes();
>> []

post    = Post.find(1);
comment = post.comments.new();
comment.changedAttributes();
>> []

comment.changedAttributes({ignoreAssociations: false});
>> ["post_id"]
```

## Write Validations:

Models can describe validations required before data will be persisted
successfully:

```javascript
function User(data) {
    this.name  = data.name;
    this.email = data.email;
    
    this.validates({
        name: { presence: true },
        email: { format: { validates: true, message: 'Must provide a valid email.' } }
    });
});
```

Validations also work with the Simple Form directive to perform easy form
styling. 

### Helper Methods:

```javascript
user.$valid
>> false 

user.$invalid
>> true

user.$errors
>> { name: ['Must be defined'] }

user.validate('name')
>> true

user.validateIfErrored('name')
>> true
```

### Usage in Forms:

Helper methods make form validation simple:

```html
<input ng-model="user.name" ng-blur="user.validate('name')">
```

Displaying errors is equally simple. Errors will only be added for a given field once it's been validated. Validate them one-by-one with directives like `ng-blur` or `ng-change`, or validate them all at once by passing no arguments to the `validate` method:

```html
<div ng-show="user.errors.name" class="alert alert-warning">{{user.errors.name}}</div>
```

The interaction we prefer at Faculty Creative usually looks like this:

```html
<input
    ng-model="user.name"
    ng-blur="user.validate('name')
    ng-change="user.validateIfErrored('name')>
```

This causes validations to run on blur, and, if errors exist on the field, to
run on change, so that as soon as a user corrects an error, the error will
disappear immediately.

When a model instance is saved, all validations are automatically run, so errors
will appear if the form contains any errors.

You can also clear errors on a given field, or on the whole instance:

```html
<button ng-submit="user.clearErrors()"></button>

<button ng-submit="user.clearErrors('name')"></button>
```

#### Presence:

Validates that a user has entered a value:

```javascript
name: { presence: true }
```

#### Required If:

Validates that a user has entered a value if a certain requirement is met:

```javascript
username: {requiredIf: { requiredIf: emailIsBlank,  message: 'You must enter a username' } }

function emailIsBlank(value, field, instance) {
    return !instance.email || instance.email.length === 0;
}
```

#### Absence:

Validates that a field does not have a value:

```javascript
name: { absence: true }
```

#### Length:

Validates using ranges, min, max, or exact length:

```javascript
username: { length: { in: _.range(1, 20); } },
email:    { length: { min: 5, max: 20 } },
zip:      { length: { is: 5 } }
```

#### Format:

Validates several built-in formats, and validates custom formats using the `regex`
key:

```javascript
zip:   { format: { zip: true   } },
email: { format: { email: true } },
uuid:  { format: { regex: /\d{3}\w{5}/ } } 
```

#### Numericality:

Validates that a value can be cast to a number. Can be set to ignore values like
commas and hyphens:

```javascript
zip:    { numericality: { ignore: /[\-]/g } }
```

#### Acceptance: 

Validates truthiness, as in checkbox acceptance:

```javascript
termsOfService: { acceptance: true }
```

#### Inclusion:

Validates inclusion in a set of terms:

```javascript
size: { inclusion: { in: ['small', 'medium', 'large'] } }
```

#### Exclusion:

Validates exclusion from a set of terms:

```javascript
size: { exclusion: { from: ['XS', 'XL'] } } 
```

#### Confirmation:

Validates that two fields match:

```javascript
password:             { confirmation: true },
passwordConfirmation: { presence: true }
```

#### Validates Association:

If an association must be valid in order for an instance to be validate, use
the `association` validation:

```javascript
author: { association: 'author' },
comments: { association: 'comments' }
```

The MIT License (MIT)

Copyright (c) 2013-2014 Brett Shollenberger

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
