(function() {
  var topPot, corpNameInput, corpOpenInput, corpCloseInput, corpCreateButton;

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
    var main, newSection, locationTable, timeRow, newTH, newText, newForm, locationInput, minCustInput, maxCustInput, avgPurchInput, newButton;
    main = document.querySelector("main");

    newSection = document.createElement("section");
    newSection.id = this.name + "table";

    locationTable = document.createElement("table");
    locationTable.id = this.name;

    newH2 = document.createElement("h2");
    newText = document.createTextNode(this.name);
    newH2.appendChild(newText);
    newSection.appendChild(newH2);

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
    newSection.appendChild(locationTable);

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

    newText = document.createTextNode(this.name + " Shop");
    newButton.appendChild(newText);
    newForm.appendChild(newButton);

    newSection.appendChild(newForm);
    main.appendChild(newSection);



    //Adds event listener to form button, sets it to call topPot Corporation() object's
    //createUpdateShop() method. Uses jquery $.proxy() function to set the context for
    //topPot.createUpdateShop() as topPot.
    newButton = document.getElementById(this.name + "button");
    newButton.addEventListener("click", $.proxy(this.createUpdateShop, this));


    //Blur event of the location input box will change button text to reflect what result of press will be.
    //If length == 0, then default text is restored.
    locationInput = document.getElementById(this.name + "location_input");
    locationInput.addEventListener("blur", $.proxy(function() {
      newButton.textContent = "";
      if (locationInput.value.length == 0) {
        newButton.appendChild(document.createTextNode(this.name + " Shop"));
      }
      else if (this[locationInput.value.toLowerCase()] == undefined) {
        newButton.appendChild(document.createTextNode("Create New Shop"));
      }
      else {
        newButton.appendChild(document.createTextNode("Update Shop"));
      }
    }, this));

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

  function Market() {};

  seattle = new Market();

  //Instantiate toppot as a new Corporation() object, and stores new Shop() objects as properties.
  seattle["top pot"] = new Corporation("Top Pot", 7, 18);

  seattle["top pot"].addNewLocation("Downtown", 8, 43, 4.50);
  seattle["top pot"].addNewLocation("Capitol Hill", 4, 37, 2.00);
  seattle["top pot"].addNewLocation("South Lake Union", 9, 23, 6.33);
  seattle["top pot"].addNewLocation("Wedgewood", 2, 28, 1.25);
  seattle["top pot"].addNewLocation("Ballard", 8, 58, 3.75);

  seattle["top pot"].writeTable();

  corpCreateButton = document.getElementById("corp_create");
  corpNameInput = document.getElementById("corp_name");
  corpOpenInput = document.getElementById("corp_open");
  corpCloseInput = document.getElementById("corp_close");

  corpCreateButton.addEventListener("click", function(e) {
    e.preventDefault();
    corpName = corpNameInput.value;
    corpOpen = parseInt(corpOpenInput.value);
    corpClose = parseInt(corpCloseInput.value);
    if (corpName.length > 0 && corpOpen > 0 && !isNaN(corpOpen) && corpClose > corpOpen && !isNaN(corpClose)) {
      if (seattle[corpNameInput.value.toLowerCase()] == undefined) {
        seattle[corpName.toLowerCase()] = new Corporation(corpName, corpOpen, corpClose);
        seattle[corpName.toLowerCase()].writeTable();
      }
    }
  });


}());
