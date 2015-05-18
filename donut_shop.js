(function() {
  var shops;

  function Shop(location, minCustomers, maxCustomers, avgPurchase) {
    this.location = location;
    this.minCustomers = minCustomers;
    this.maxCustomers = maxCustomers;
    this.avgPurchase = avgPurchase;
    this.open = 7;
    this.close = 18;
  }

  Shop.prototype.customersPerHour = function() {
    return Math.random() * (this.maxCustomers - this.minCustomers + 1) + this.minCustomers;
  }

  Shop.prototype.donutsPerHour = function() {
    return Math.ceil(this.customersPerHour() * this.avgPurchase);
  }

  Shop.prototype.donutsPerDay = function() {
    var donutsPerDay = 0;
    for (var i = this.open; i < this.close; i++) {
      donutsPerDay += this.donutsPerHour();
    }
    return donutsPerDay;
  }

  Shop.prototype.writeToTable = function() {
    var locationTable, rowElement, totalDonuts, dataElement, textNode, hourlyDonuts;
    locationTable = document.getElementById("location_table");
    rowElement = document.createElement("tr");
    totalDonuts = 0;
    dataElement = document.createElement("td");
    textNode = document.createTextNode(this.location);
    dataElement.appendChild(textNode);
    rowElement.appendChild(dataElement);

    for (var i = this.open; i < this.close; i++) {
      dataElement = document.createElement("td");
      hourlyDonuts = this.donutsPerHour();
      textNode = document.createTextNode(hourlyDonuts);
      dataElement.appendChild(textNode);
      rowElement.appendChild(dataElement);
      totalDonuts += hourlyDonuts;
    }

    dataElement = document.createElement("td");
    textNode = document.createTextNode(totalDonuts);
    dataElement.appendChild(textNode);
    rowElement.appendChild(dataElement);
    locationTable.appendChild(rowElement);
  }

  shops = {
    writeAllShops: function() {
       for (i in shops) {
         if (shops[i] instanceof Shop) {
           shops[i].writeToTable();
         }
       }
    },
    downtown: new Shop("Downtown", 8, 43, 4.50),
    capitolHill: new Shop("Capitol Hill", 4, 37, 2.00),
    southLakeUnion: new Shop("South Lake Union", 9, 23, 6.33),
    wedgewood: new Shop("Wedgewood", 2, 28, 1.25),
    ballard: new Shop("Ballard", 8, 58, 3.75)
  }

  shops.writeAllShops();

  document.getElementById("new_shop_button").addEventListener("click", function(e) {
    var location, minCustomers, maxCustomers, avgPurchase;
    e.preventDefault();
    location = document.getElementById("new_shop_location").value;
    minCustomers = document.getElementById("new_shop_min_customers").value;
    maxCustomers = document.getElementById("new_shop_max_customers").value;
    avgPurchase = document.getElementById("new_shop_avg_purchase").value;
    if (location.length > 0 && !isNaN(minCustomers) && minCustomers >= 0 && !isNaN(maxCustomers) && maxCustomers >= 0 && maxCustomers > minCustomers && !isNaN(avgPurchase) && avgPurchase > 0) {
      shops[location] = new Shop(location, minCustomers, maxCustomers, avgPurchase);
      shops[location].writeToTable();
    }
  });

}());
