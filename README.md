# OVERVIEW
### **Description:**
This JavaScript program is a refactored class project on creating Yelp Business Queries using fluent design. 

The program has several functions that filter through a dataset of JSON Business Objects, containing attributes such as location, ratings, and reviews.

The fluent design means that we can chain these functions to essentialy create different combinations of queries, like figuring out the best place to eat in California.
### **Architecture**:
![Architecture](https://lucid.app/publicSegments/view/3f32e049-8949-43e5-831e-c697c63a44a7/image.png)
### **Dependancies**:
1. Ocelot credentials to import lib220 library
1. UMass Amherst's lib220 package for loadJSONFromURL and getProperty functions
1. JavaScript's Math.max, Array.filter, and Array.reduce 
1. Node.JS version used: 14.17.3
1. The JavaScript language has now supported new ways to privatize functions, methods, and fields using the hash symbol, ``#``. This may not be supported for all IDEs including Ocelot, and has other specifications. Check out the [Mozilla Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields) for more details.
### **TODO**:
- More test coverage
- Create independant loadJSONFromURL and getProperty functions
# Installation and Testing:
### **Important note**:
UMass Amherst does not provide access to the lib220 package and the only access to it is with Ocelot credentials, however the Ocelot IDE has a deprecated version of JS. 

Thus I would only suggest running the code after having created independent functions from the lib220 package: ``loadJSONFromURL()`` and ``getProperty()``
### **Installation**:
If you have created the independant functions then you are almost ready to run the program.

**STEPS**
1. Since JavaScript is usually run on the browser download Node.JS to run program  in the terminal
2. You can check whether you have node.JS by going to a bash terminal with, ```node -v```, which should return the version of node if it exists. You may have to reopen your terminal or IDE.
3. download the repository
4. open the terminal
5. change directory into the repo
```BASH
$ cd ~\YelpBusinessQueries
```
6. run Node.js on file
```BASH
$ node Yelp_JSON_DataWrangling.js 
```
