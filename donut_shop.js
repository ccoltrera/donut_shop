(function() {
  var topPot;

  //Shop() object, with set hours.
  function Shop(location, minCustomers, maxCustomers, avgPurchase, open, close) {
    this.location = location;
    this.minCustomers = minCustomers;
    this.maxCustomers = maxCustomers;
    this.avgPurchase = avgPurchase;
    this.open = open;
    this.close = close;
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
  Shop.prototype.writeToTable = function(tableID) {
    var locationTable, rowElement, totalDonuts, dataElement, textNode, hourlyDonuts;
    locationTable = document.getElementById(tableID);
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
  function Corporation(name, open, close) {
    this.name = name;
    this.open = open;
    this.close = close;
  }

  Corporation.prototype.addNewLocation = function(location, minCustomers, maxCustomers, avgPurchase) {
    this[location.toLowerCase()] = new Shop(location, minCustomers, maxCustomers, avgPurchase, this.open, this.close);
  }

  //Calls all Corporation() object's Shop() objects' writeToTable() method.
  Corporation.prototype.writeAllShops = function(tableID) {
     for (i in this) {
       if (this[i] instanceof Shop) {
         this[i].writeToTable(tableID);
       }
     }
  }

  //Creates a table for a given Corporation() object, with its hours in the first row,
  //and then calls writeAllShops() to write to the new table.
  Corporation.prototype.writeTable = function() {
    var body, locationTable, timeRow, newTHead, newTH, newText, newTD, newHR, newForm, locationInput, minCustInput, maxCustInput, avgPurchInput, newButton;
    body = document.querySelector("body");
    locationTable = document.createElement("table");
    locationTable.id = this.name;

    newTHead = document.createElement("thead");
    newTD = document.createElement("td");
    newTD.setAttribute("colspan", this.close - this.open + 2);
    newText = document.createTextNode(this.name);
    newTD.appendChild(newText);
    newTHead.appendChild(newTD);
    locationTable.appendChild(newTHead);

    timeRow = document.createElement("tr");

    newTH = document.createElement("th");
    newText = document.createTextNode("Location");
    newTH.appendChild(newText);
    timeRow.appendChild(newTH);

    for (var i = 0; i < this.close - this.open; i ++) {
      newTH = document.createElement("th");

      if (this.open + i < 12) {
        newText = document.createTextNode((this.open + i) + ":00 am");
      }
      else if (this.open + i === 12) {
        newText = document.createTextNode((this.open + i) + ":00 pm");
      }
      else {
        newText = document.createTextNode((this.open + i - 12) + ":00 pm");
      }

      newTH.appendChild(newText);
      timeRow.appendChild(newTH);
    }

    newTH = document.createElement("th");
    newText = document.createTextNode("Total");
    newTH.appendChild(newText);
    timeRow.appendChild(newTH);

    locationTable.appendChild(timeRow);
    body.appendChild(locationTable);

    newHR = document.createElement("hr");
    body.appendChild(newHR);

    newForm = document.createElement("form");
    locationInput = document.createElement("input");
    locationInput.id = this.name + "location_input";
    locationInput.setAttribute("type","text");
    locationInput.setAttribute("placeholder","Location");
    newForm.appendChild(locationInput);


    minCustInput  = document.createElement("input");
    minCustInput.id = this.name + "min_cust_input";
    minCustInput.setAttribute("type","number");
    minCustInput.setAttribute("placeholder","Min Custom / Hour");
    newForm.appendChild(minCustInput);

    maxCustInput  = document.createElement("input");
    maxCustInput.id = this.name + "max_cust_input";
    maxCustInput.setAttribute("type","number");
    maxCustInput.setAttribute("placeholder","Max Custom / Hour");
    newForm.appendChild(maxCustInput);

    avgPurchInput  = document.createElement("input");
    avgPurchInput.id = this.name + "avg_purch_input";
    avgPurchInput.setAttribute("type","number");
    avgPurchInput.setAttribute("placeholder","Avg Purch / Custom");
    newForm.appendChild(avgPurchInput);

    newButton = document.createElement("button");
    newButton.id = this.name + "button";
    newText = document.createTextNode("Create / Update " + this.name + " Shop");
    newButton.appendChild(newText);
    newForm.appendChild(newButton);

    body.appendChild(newForm);


    //Adds event listener to form button, sets it to call topPot Corporation() object's
    //createUpdateShop() method. Uses jquery $.proxy() function to set the context for
    //topPot.createUpdateShop() as topPot.
    document.getElementById(this.name + "button").addEventListener("click", $.proxy(this.createUpdateShop, this));

    this.writeAllShops(this.name);
  }

  //Method that updates a Corporation() object's shop if inputted location already used,
  //or creates a new Shop() object if not.
  Corporation.prototype.createUpdateShop = function(e) {
    var location, minCustomers, maxCustomers, avgPurchase;
    e.preventDefault();
    location = document.getElementById(this.name + "location_input").value;
    minCustomers = parseInt(document.getElementById(this.name + "min_cust_input").value);
    maxCustomers = parseInt(document.getElementById(this.name + "max_cust_input").value);
    avgPurchase = parseInt(document.getElementById(this.name + "avg_purch_input").value);
    //Checks input is valid.
    if (location.length > 0 && !isNaN(minCustomers) && minCustomers >= 0 && !isNaN(maxCustomers) && maxCustomers >= 0 && maxCustomers > minCustomers && !isNaN(avgPurchase) && avgPurchase > 0) {
      //For new locations, creates a new Shop() object.
      if (this[location.toLowerCase()] == undefined) {
        this.addNewLocation(location, minCustomers, maxCustomers, avgPurchase);
      }
      //For old locations, updates Shop() object.
      else {
        this[location.toLowerCase()].minCustomers = parseInt(minCustomers);
        this[location.toLowerCase()].maxCustomers = parseInt(maxCustomers);
        this[location.toLowerCase()].avgPurchase = parseInt(avgPurchase);
      }
      //Either way, calls Shop() object's writeToTable() method.
      this[location.toLowerCase()].writeToTable(this.name);
    }
  }

  //Instantiate topPot as a new Corporation() object, and stores new Shop() objects as properties.
  topPot = new Corporation("Top Pot", 7, 18);

  topPot.addNewLocation("Downtown", 8, 43, 4.50);
  topPot.addNewLocation("Capitol Hill", 4, 37, 2.00);
  topPot.addNewLocation("South Lake Union", 9, 23, 6.33);
  topPot.addNewLocation("Wedgewood", 2, 28, 1.25);
  topPot.addNewLocation("Ballard", 8, 58, 3.75);

  // topPot.downtown = new Shop("Downtown", 8, 43, 4.50, 7, 18);
  // topPot.capitolHill = new Shop("Capitol Hill", 4, 37, 2.00, 7, 18);
  // topPot.southLakeUnion = new Shop("South Lake Union", 9, 23, 6.33, 7, 18);
  // topPot.wedgewood = new Shop("Wedgewood", 2, 28, 1.25, 7, 18);
  // topPot.ballard = new Shop("Ballard", 8, 58, 3.75, 7, 18);

  //window.addEventListener("load", topPot.writeAllShops);
  //topPot.writeAllShops("location_table");

  topPot.writeTable();

}());
