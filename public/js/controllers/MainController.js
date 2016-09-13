// Angelika Dahlberg 2016-09-12 angelika.dahlberg@gmail.com 


// ========= SERVICE =============

// Coordinate set Service
app.service('mapify', ['$http', function($http) { // A service that compute an array used as marker by the MAP VIEW

    this.mapifyFunction = function() {
        var arr = [];

        $http.get('http://localhost:3000/suppliers') // Gets the supplier objects through http
            .then(function(response) {

                var nrOfObjects = response.data.length; // Nr of objects in the supplier array

                for (var i = 0; i < nrOfObjects; i++) { // Looping through the objects and push the result (each object id and coords) to the arr-array
                    arr.push({
                        id: response.data[i].id,
                        name: response.data[i].name,
                        category: response.data[i].category,
                        coords: {
                            latitude: response.data[i].latitude,
                            longitude: response.data[i].longitude
                        }
                    });
                }
            });

        return arr;
    }
}]);



// ======== CONTROLLER ==========


app.controller('MainController', ['$scope', '$http', 'mapify', function($scope, $http, mapify) {

    generateMapInfo() // start function to generate info to display map
    myFunction() // start function that displays map
    getAllSuppliers() // start function that gets all the suppliers


    // ====== PRE SETS =======

    $scope.editId = -1; // Start value which hide the editform for all suppliers


    // List of supplier types 

    $scope.categories = [{
        category: "Grossist"
    }, {
        category: "Frukt & grönt"
    }, {
        category: "Kött"
    }, {
        category: "Mejeri"
    }, {
        category: "Växter"
    }];



    // ================ GET ALL SUPPLIER FUNCTION ===================   

    function getAllSuppliers() {
        $http.get('http://localhost:3000/suppliers') // Gets the suppliersobject through http and saves to allSuppliers
            .then(function(response) {

                $scope.allSuppliers = response.data;

            });
    }


    // ================ SORT SUPPLIERLIST ===================

    $scope.sortType = 'name'; // set the default sort type
    $scope.sortReverse = false; // set the default sort order
    $scope.searchSupplier = ''; // set the default search/filter term



    // ================ ADD SUPPLIER ===================  

    $scope.hideAddNew = true; // Hides the input fields from start

    $scope.showInputAdd = function() {

        $scope.hideAddNew = !$scope.hideAddNew; // toggle function that hide show div

        delete $scope.addSupplierName; // deletes old inputs from user
        delete $scope.addSupplierContact;
        delete $scope.addSupplierEmail;
        delete $scope.addSupplierNumber;
        delete $scope.addSupplierCategory;
        delete $scope.addSupplierLatitude;
        delete $scope.addSupplierLongitude;
    }


    // Save to db.JSON
    $scope.addNewSupplier = function() {
        for (var i = 0; i < $scope.allSuppliers.length; i++) { // Looping the objects and push the result (each object id and coords) to the arr-array
            var lastId = $scope.allSuppliers[i].id + 1; //Sets the last ID and adds one
        };

        $http({
            method: "POST",
            url: 'http://localhost:3000/suppliers/',
            data: {
                id: lastId, //the generated id
                name: $scope.addSupplierName,
                contact: $scope.addSupplierContact,
                email: $scope.addSupplierEmail,
                number: $scope.addSupplierNumber,
                category: $scope.addSupplierCategory,
                latitude: $scope.addSupplierLatitude,
                longitude: $scope.addSupplierLongitude
            }
        });

        $scope.hideAddNew = true; // Hide div after new suppliers is saved
        getAllSuppliers() // Get all suppliers including the new one
        generateMapInfo()
        myFunction()
    };


    // Cancel Add new supplier
    $scope.cancelAdd = function() {
        $scope.hideAddNew = true;
    }


    // ================ UPDATE SUPPLIER ===================   

    $scope.update = function(supplierId) {
        $scope.editId = supplierId; // editId is set to the objectid that is edited, edit form gets visble through ng-show
        getAllSuppliers()
    };


    // Update db.JSON
    $scope.save = function(supplierId1, supplierName, supplierContact, supplierEmail, supplierNumber, supplierCategory, supplierLatitude, supplierLongitude) {

        $http({
            method: "patch",
            url: 'http://localhost:3000/suppliers/' + supplierId1,
            data: {
                name: supplierName,
                contact: supplierContact,
                email: supplierEmail,
                number: supplierNumber,
                category: supplierCategory,
                latitude: supplierLatitude,
                longitude: supplierLongitude
            }
        });

        $scope.editId = -1; // Hide the input fields after save
        getAllSuppliers()
        generateMapInfo()
        myFunction()
    };


    // Cancel the edit
    $scope.cancel = function() {

        getAllSuppliers()
        $scope.editId = -1; // Hide the input fields after save
    };



    // ================ DELETE SUPPLIER ===================    

    $scope.remove = function(supplierId2) {

        var r = confirm("Är du säker på att du vill ta bort leverantören?");
        if (r == true) {

            $http.delete('http://localhost:3000/suppliers/' + supplierId2) //deletes the supplier from db with chosen id
                .then(function(response) {
                    getAllSuppliers(); // Gets all of the suppliers
                });

            generateMapInfo()
            myFunction()

        } else {
            return;
        }
    };



    // ======== GOOGLE MAP========

    // Generate map info
    function generateMapInfo() {
        $scope.latiLongi = mapify.mapifyFunction(); // Scope that starts a function in the service mapify
    }


    // Map view
    function myFunction() {

        $scope.map = {
            zoom: 12, // Sets the level of zooming for the map
            bounds: {},
            center: { // Center at the local store
                latitude: 56.78761,
                longitude: 15.12349
            },
            markers: $scope.latiLongi // An array computed by the service mapify
        };
    }
}]);