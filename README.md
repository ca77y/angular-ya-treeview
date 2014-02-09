# ya.treeview [![Build Status](https://travis-ci.org/ca77y/angular-ya-treeview.png)](https://travis-ci.org/ca77y/angular-ya-treeview)

> Yet Another Treeview for AngularJS

## Getting started

Yet another treeview for angular? Why ???

I couldn't find a treeview implementation for angular which would fit all my requirements. A more detailed motivation is
[here](https://ca77y.github.io/test). Long story short:

* external templates
* hooks for all events (expand, collapse, select, double click)
* transclude
* treeview should not modify the original model
* references to a parent and children in nodes
* treeview context which can be used to store treeview-wide properties
* async loading of children
* lazy/eager creation of the virtual tree
* easy to implement multiselect

This directive is inspired by the following projects:

* [angular-bootstrap](https://github.com/angular-ui/bootstrap/)
* [angular-treeview](https://github.com/eu81273/angular.treeview)
* [angular-tree-control](https://github.com/wix/angular-tree-control)

### Requirements

* Angular 1.2.x (should work with 1.0.x, I haven't checked)
* Bootstrap 3.x (if you're using my templates)

## Usage example

Template
```
<div ya-treeview ya-id="myTree" ya-model="model" ya-options="options">
    <span>{{ node.$model.label }}</span>
</div>
```

Controller
```
$scope.options = {
    context: {
        myKey: 'myValue'
    },
    onSelect: function ($event, node, context) {
        if ($event.ctrlKey) {
            context.myKey = 'newValue';
        } else {
            show(context.myKey);
        }
    }
};

$http.get('data.json')
    .success(function (data) {
        $scope.model = data;
    });
```

Some use cases like async children loading, multiselect, node preselection are
described [here](http://ca77y.github.io/2014/02/09/yet-another-angular-treeview-motivation/).

## Virtual model

The model which is passed to a treeview will not be modified, instead the treeview will create a virtual model on top of
the given model. Each node in the virtual tree is a virtual node available to events and can be modified and custom
properties can be added to it.

### Virtual node

#### $model
A reference to the actual node. Used to access properties on the actual node (node.$model.label).

#### $parent
A reference to the node's parent in the virtual model. The actual parent is available through _node.$parent.$model_.

#### $hasChildren
Indicates if a node has any children. Used in templates to show expand/collapse icons.

#### $children
An Array of children. Each child is a virtual node. you can access the actual child through _node.$children[0].$model_.

#### collapsed
Used in templates to indicate if a nodes is collapsed or expanded.

### Context

A context is used to store treeview-wide properties. _selectedNode_ is an example of this. It can be used to store
custom properties. In case of multiselect for exapmle in can store selectedNodes array, which than can be used in
templates. More on this [here](http://ca77y.github.io/2014/02/09/yet-another-angular-treeview-use-cases/).

## Options

Options to be passed to a treeview as an object with keys/values as below.

### childrenKey
Type: String
Default: children

A key which should be used to retrieve children from the node. The returned value can be an Array or a Function.
In case of a Function it should return an Array; If neither an Array nor a Function an Error is thrown.

### hasChildrenKey
Type: String
Default: has_children

Used in case loading children is done asynchronously in which case a treeview needs to know if a given node will be
able to load children.

### onExpand
Type: Function
Parameters: $event, node, context
Default: angular.noop

Fired on a node expand.

### onCollapse
Type: Function
Parameters: $event, node, context
Default: angular.noop

Fired on a node collapse.

### onSelect
Type: Function
Parameters: $event, node, context
Default: angular.noop

Fired on a node selection.

### onDblClick
Type: Function
Parameters: $event, node, context
Default: angular.noop

Fired on a node double click.

### collapseByDefault
Type: Boolean
Default: true

Collapse nodes by default.

### lazy
Type: Boolean
Default: false

Lazy create virtual tree levels. By default a treeview will create the entire virtual model when it loads. This is not
always desirable as a treeview can have 100s of nodes but only a handful of root nodes. In that case the treeview won't
display until the entire virtual tree is created (this is stupid I know, working on an improvement).
In any case you want the treeview to create its virtual model lazily the flag is there.

### context
Type: Object
Default: {}

Treeview-wide context object. In case you would like to prefill the context, you can pass it in options and it will be
used by the treeview. It has methods to manipulate and create the virtual nodes.

#### selectedNode
Type: Object

Stores the last selected node.

#### nodify
Type: Function
Parameters: node, parent
Returns: virtual node

Used to create a virtual node from a node. It will create the whole structure or not depending on _options.lazy_.
This method operates on actual nodes from the model. In case you have a reference to a virtual node pass _node.$model_
to it.

#### nodifyArray
Type: Function
Parameters: nodes, parent
Returns: virtual nodes Array

Used to create a virtual nodes Array from nodes. It expects nodes Array as a parameter. It will create the whole
structure or not depending on _options.lazy_.
This method operates on actual nodes from the model. In case you have a reference to an array or virtual nodes you need
to convert it to an array of actual nodes or use _nodify_ on each node separately.

#### children
Type: Function
Parameters: node
Returns: children Array

Used to retrieve children from a given virtual node. It will return an array of nodes from the model, not virtual nodes.
In case you want an array of virtual nodes you can use _nodifyArray_ on the result.

## Development

```
npm install
bower install
grunt serve
```

PRs are welcome.

## Release History
* 2014-02-09   v0.1.0   Initial release
