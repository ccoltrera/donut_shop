(function() {
  var topPot;

  //Shop() object, with set hours.
  function Shop(location, minCustomers, maxCustomers, avgPurchase) {
    this.location = location;
    this.minCustomers = minCustomers;
    this.maxCustomers = maxCustomers;
    this.avgPurchase = avgPurchase;
    this.open = 7;
    this.close = 18;
  }

  //Returns a random number of customers, within the allowable range.
  Shop.prototype.customersPerHour = function() {
    return Math.random() * (this.maxCustomers - this.minCustomers + 1) + this.minCustomers;
  }

  //Returns donuts per hour, as a function of avgPurchase and customersPerHour().
  Shop.prototype.donutsPerHour = function() {
    return Math.ceil(this.customersPerHour() * this.avgPurchase);
  }

  //Returns donuts per day, by calling customersPerHour() for each open hour.
  Shop.prototype.donutsPerDay = function() {
    var donutsPerDay = 0;
    for (var i = this.open; i < this.close; i++) {
      donutsPerDay += this.donutsPerHour();
    }
    return donutsPerDay;
  }

  //Writes information about a shop to the table, calling donutsPerHour() and keeping track of total.
  //Will update an existing shop, or add a new row for a new shop.
  Shop.prototype.writeToTable = function() {
    var locationTable, rowElement, totalDonuts, dataElement, textNode, hourlyDonuts;
    locationTable = document.getElementById("location_table");
    //If inputted shop is not on the table, creates a new row with the location as id.
    if (document.getElementById(this.location.toLowerCase()) == undefined) {
      rowElement = document.createElement("tr");
      rowElement.id = this.location.toLowerCase();
    }
    //If inputted shop is on the table, gets the row element, using the location as id.
    else {
      rowElement = document.getElementById(this.location.toLowerCase());
      rowElement.textContent = "";
    }
    totalDonuts = 0;
    dataElement = document.createElement("td");
    textNode = document.createTextNode(this.location);
    dataElement.appendChild(textNode);
    rowElement.appendChild(dataElement);
    // For each open hour, calls donutsPerHour, creates <td> element appended text node,
    //stores the value in total, and appends the <td> to the shop's row.
    for (var i = this.open; i < this.close; i++) {
      dataElement = document.createElement("td");
      hourlyDonuts = this.donutsPerHour();
      textNode = document.createTextNode(hourlyDonuts);
      dataElement.appendChild(textNode);
      rowElement.appendChild(dataElement);
      totalDonuts += hourlyDonuts;
    }
    // Creates <td> to hold text node with total, and attaches it to the row.
    dataElement = document.createElement("td");
    textNode = document.createTextNode(totalDonuts);
    dataElement.appendChild(textNode);
    rowElement.appendChild(dataElement);
    //If the row is new, appends it to the table.
    if (document.getElementById(this.location.toLowerCase()) == undefined) {
      locationTable.appendChild(rowElement);
    }
  }

  //Corporation() object constructor, to hold shops. Stores name as property.
  function Corporation(name) {
    this.name = name;
  }

  //Calls all Corporation() object's Shop() objects' writeToTable() method.
  Corporation.prototype.writeAllShops = function() {
     for (i in this) {
       if (this[i] instanceof Shop) {
         this[i].writeToTable();
       }
     }
  }

  //Method that updates a Corporation() object's shop if inputted location already used,
  //or creates a new Shop() object if not.
  Corporation.prototype.createUpdateShop = function(e) {
    var location, minCustomers, maxCustomers, avgPurchase;
    e.preventDefault();
    location = document.getElementById("new_top_pot_location").value;
    minCustomers = parseInt(document.getElementById("new_top_pot_min_customers").value);
    maxCustomers = parseInt(document.getElementById("new_top_pot_max_customers").value);
    avgPurchase = parseInt(document.getElementById("new_top_pot_avg_purchase").value);
    //Checks input is valid.
    if (location.length > 0 && !isNaN(minCustomers) && minCustomers >= 0 && !isNaN(maxCustomers) && maxCustomers >= 0 && maxCustomers > minCustomers && !isNaN(avgPurchase) && avgPurchase > 0) {
      //For new locations, creates a new Shop() object.
      if (this[location.toLowerCase()] == undefined) {
        this[location.toLowerCase()] = new Shop(location, minCustomers, maxCustomers, avgPurchase);
      }
      //For old locations, updates Shop() object.
      else {
        this[location.toLowerCase()].minCustomers = parseInt(minCustomers);
        this[location.toLowerCase()].maxCustomers = parseInt(maxCustomers);
        this[location.toLowerCase()].avgPurchase = parseInt(avgPurchase);
      }
      //Either way, calls Shop() object's writeToTable() method.
      this[location.toLowerCase()].writeToTable();
    }
  }

  //Instantiate topPot as a new Corporation() object, and stores new Shop() objects as properties.
  topPot = new Corporation("Top Pot");

  topPot.downtown = new Shop("Downtown", 8, 43, 4.50);
  topPot.capitolHill = new Shop("Capitol Hill", 4, 37, 2.00);
  topPot.southLakeUnion = new Shop("South Lake Union", 9, 23, 6.33);
  topPot.wedgewood = new Shop("Wedgewood", 2, 28, 1.25);
  topPot.ballard = new Shop("Ballard", 8, 58, 3.75);

  //Adds event listener to form button, sets it to call topPot Corporation() object's
  //createUpdateShop() method.
  document.getElementById("new_top_pot_button").addEventListener("click", topPot.createUpdateShop);

  //window.addEventListener("load", topPot.writeAllShops);
  topPot.writeAllShops();

}());
