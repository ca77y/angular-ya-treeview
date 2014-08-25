# ya.treeview [![Build Status](https://travis-ci.org/ca77y/angular-ya-treeview.png)](https://travis-ci.org/ca77y/angular-ya-treeview)

> Yet Another Treeview for AngularJS

## Getting started

### Features
* External templates
* Hooks for all events (expand, collapse, select, double click)
* Transclude
* Treeview does not modify the original model
* References to a parent and children in nodes
* Treeview context which can be used to store treeview-wide properties
* Async loading of children
* As little DOM as possible
* Easy to implement multiselect


### Demo
Live example on [plunker](http://plnkr.co/edit/mAfWCLmD9NW0CD44gdNF).


### Inspiration
This directive is inspired by the following projects:

* [angular-bootstrap](https://github.com/angular-ui/bootstrap/)
* [angular-treeview](https://github.com/eu81273/angular.treeview)
* [angular-tree-control](https://github.com/wix/angular-tree-control)

### Requirements

* Angular 1.2.x (should work with 1.0.x, I haven't checked)
* Bootstrap 3.x (if you're using my templates)


## Installation
```
bower install angular-ya-treeview
```
Include `ya.treeview` in your angular app's dependencies. In case you are using included templates add `ya.treeview.tpls` as well.

## Usage example

Template
```
<div ya-treeview ya-id="myTree" ya-model="model" ya-options="options" ya-context="context">
    <span>{{ node.$model.label }}</span>
</div>
```

Controller
```
$scope.options = {
    onSelect: function ($event, node, context) {
        if ($event.ctrlKey) {
            context.myKey = 'newValue';
        } else {
            show(context.myKey);
        }
    }
};

$scope.context = {
    myKey: 'myValue'
},

$scope.model = [{
        label: 'parent1',
        children: [{
            label: 'child'
        }]
    }, {
        label: 'parent2',
        children: [{
            label: 'child',
            children: [{
                label: 'innerChild'
            }]
        }]
    }, {
        label: 'parent3'
    }];
```

Some use cases like async children loading, multiselect, node preselection are
described [here](http://ca77y.github.io/2014/02/09/yet-another-angular-treeview-use-cases/).

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

#### selectedNode
Type: Object

Stores the last selected node.

#### nodify
Type: Function
Parameters: node, parent
Returns: virtual node

Used to create a virtual node from a node. This method operates on actual nodes from the model. In case you have a
reference to a virtual node pass _node.$model_ to it.

#### nodifyArray
Type: Function
Parameters: nodes, parent
Returns: virtual nodes Array

Used to create a virtual nodes Array from nodes. It expects nodes Array as a parameter.
This method operates on actual nodes from the model. In case you have a reference to an array or virtual nodes you need
to convert it to an array of actual nodes or use _nodify_ on each node separately.

#### children
Type: Function
Parameters: node
Returns: children Array

Used to retrieve children from a given virtual node. It will return an array of nodes from the model, not virtual nodes.
In case you want an array of virtual nodes you can use _nodifyArray_ on the result.


## Options

Options to be passed to a treeview as an object with keys/values as below.

#### childrenKey
Type: String
Default: children

A key which should be used to retrieve children from the node. The returned value can be an Array or a Function.
In case of a Function it should return an Array; If neither an Array nor a Function an Error is thrown.

#### hasChildrenKey
Type: String
Default: has_children

Used in case loading children is done asynchronously in which case a treeview needs to know if a given node will be
able to load children.

#### onExpand
Type: Function
Parameters: $event, node, context
Default: angular.noop

Fired on a node expand.

#### onCollapse
Type: Function
Parameters: $event, node, context
Default: angular.noop

Fired on a node collapse.

#### onSelect
Type: Function
Parameters: $event, node, context
Default: angular.noop

Fired on a node selection.

#### onDblClick
Type: Function
Parameters: $event, node, context
Default: angular.noop

Fired on a node double click.

#### expanded
Type: Boolean
Default: false

Expand nodes by default.

#### context
Type: Object
Default: {}

Treeview-wide context object. In case you would like to prefill the context, you can pass it in options and it will be
used by the treeview. It has methods to manipulate and create the virtual nodes.

## Additional stuff

### Breadcrumbs

Include additional file:

* ya-treeview-breadcrumbs-<version>(-tpls)(.min).js

and modules:

* ya.treeview.breadcrumbs
* ya.treeview.breadcrumbs.tpls (if you're using the provided templates)

Use in html like this:

```
<div ya-treeview-breadcrumbs ya-context="context"></div>
```

The context should be the same object you pass to the treeview.

## Development

```
npm install
bower install
grunt serve
```

PRs are welcome.

## Release History
* 2014-08-25   v0.2.1   Async children creation. Breadcrumbs.
* 2014-04-14   v0.2.0   Async children creation. Breadcrumbs.
* 2014-02-18   v0.1.0   Initial release
