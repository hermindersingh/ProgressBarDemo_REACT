# Progress Bars Demo

This is a demo project created using REACT framework. There are multiple progress bars and multiple buttons. The bars and buttons get generated dynamically from JSON file (pagedata.json). There can be any number of bars and buttons.

## Prerequisites

```
react.min.js
react-dom.min.js
browser.min.js
gulp: ^3.9.1
gulp_sass: ^3.1.0
gulp-uglify: ^2.0.1
reactify:^1.1.1
```

### Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 
Once you have the prerequisites set, run the local http-server (node <path to http-server/bin>) and launch

```
http://localhost:8080/index.html
```

### Built With

* REACT - The REACT JS framework is used to build this demo
* GULP - Gulp is a JavaScript task runner

### Tests

Tested for basic case
```
{"buttons":[30,20,-42,-44],"bars":[87,76,20],"limit":120}
```

The demo is tested by entering different data values (as shown below):

```
{"buttons":[30,20,-42,-44,60],"bars":[87,76,20],"limit":120}---More buttons added
{"buttons":[30,20,-42,-44],"bars":[87,76,20,66,99],"limit":120}---More bars added
{"buttons":[30,20,-42,-44],"bars":[87,76,20,66,99],"limit":270}---Limit changed
```

### Versioning

Version 1.0

### Authors

* **Herminder Singh** - *REACT Demo*
