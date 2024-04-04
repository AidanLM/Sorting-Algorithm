
function createGradient(startColor, endColor, direction = 'to bottom') {
    return `linear-gradient(${direction}, ${startColor}, ${endColor})`;
  }
  const rainbowColors = ["#FFC0C0", "#FFE5A5", "#FFFFC0", "#C0E0C0", "#C0C0FF", "#D1B0EE", "#F9E2EE"]; 
  // Returns a random number between min (inclusive) and max (exclusive)
  function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  } // End getRandomArbitrary
  
  // Create a Node
  function createNode(row, col, weight) {
    var node = document.createElement("div");
    node.setAttribute("class", "node");
    node.setAttribute("row", row);
    node.setAttribute("col", col);
    node.setAttribute("cost", Number.POSITIVE_INFINITY);
    node.setAttribute("parent", null);
    node.setAttribute("weight", weight);
    node.innerText = weight.toString();
    return node;
  } // End createNode
  
  // Create Board and insert into HTML
  function createBoard() {
    var grid = document.querySelector(".container");
    grid.innerHTML = "";
    for (var row = 0; row < 15; row++) {
      for (var col = 0; col < 11; col++) {
        let weight = Math.round(getRandomArbitrary(1, 10));
        let temp = createNode(row, col, weight);
        let shadow = weight / 1;
        temp.style.boxShadow = `${shadow}px ${shadow}px ${shadow}px rgba(0,0,0,0.8)`;
        temp.addEventListener('click', function() {
            this.style.backgroundColor = 'grey'; // Change color on click
        });
        grid.appendChild(temp);
      }
    }
    // Set start and end node
    var startNode = document.querySelector("div[row='0'][col='0']");
    var endNode = document.querySelector("div[row='14'][col='10']");
    startNode.setAttribute("cost", 0);
    startNode.innerHTML = "start";
    endNode.innerHTML = "end";
    startNode.style.boxShadow = `${0}px ${0}px ${0}px rgba(0,0,0,0.5)`;
  } // End createBoard
  
  // Refresh Button
  function refresh() {
    var btn = document.querySelector(".start");
    btn.style.visibility = "visible";
    createBoard();
  } // End refresh
  
  // Check and update node
  function checkNode(row, col, curr, checker, seen, counter) {
    if (row >= 0 && col >= 0 && row <= 14 && col <= 10) {
      var node = document.querySelector(`div[row="${row}"][col="${col}"]`);
      if (node.style.backgroundColor === 'grey') {
        node.setAttribute("cost", Number.POSITIVE_INFINITY); // Or a very high cost
        return node; // Continue processing the node
    }
  
      var cost = Math.min(
        parseInt(curr.getAttribute("cost")) +
          parseInt(node.getAttribute("weight")),
        node.getAttribute("cost")
      );
      if (cost < node.getAttribute("cost")) {
        node.setAttribute(
          "parent",
          curr.getAttribute("row") + "|" + curr.getAttribute("col")
        );
        node.setAttribute("cost", cost);
      }
      changeColor(node, counter, cost);
      changeColor(curr, counter, false);
      if (!seen.includes(node)) {
        checker.push(node);
      }
      seen.push(node);
      return node;
    } else {
      return false;
    }
  } // End checkNode
  
  // Animate the nodes
  function changeColor(node, counter, cost) {
    setTimeout(() => {
      node.style.backgroundColor = "#0973c2";
      if (cost) {
        node.innerHTML = cost;
      }
    }, counter * 100);
    setTimeout(() => {
      node.style.backgroundColor = "#0092ff";
    }, counter * 100 + 100);
  } // End changeColor
  
  // Start path-finding
  function start() {
    var startNode = document.querySelector("div[row='0'][col='0']");
    var endNode = document.querySelector("div[row='14'][col='10']");
    // Hide button
    var btn = document.querySelector(".start");
    var refreshBtn = document.querySelector(".refresh");
    btn.style.visibility = "hidden";
    refreshBtn.style.visibility = "hidden";
    // Algo here
    var seen = [startNode];
    var checker = [startNode];
    var counter = 1;
    while (checker.length != 0) {
      checker.sort(function (a, b) {
        if (parseInt(a.getAttribute("cost")) < parseInt(b.getAttribute("cost"))) {
          return 1;
        }
        if (parseInt(a.getAttribute("cost")) > parseInt(b.getAttribute("cost"))) {
          return -1;
        }
        return 0;
      });
      let curr = checker.pop();
      // Important to parse string to integer
      let row = parseInt(curr.getAttribute("row"));
      let col = parseInt(curr.getAttribute("col"));
      // Check up down left right
      let nextRow = row + 1;
      let prevRow = row - 1;
      let leftCol = col - 1;
      let rightCol = col + 1;
      let a = checkNode(nextRow, col, curr, checker, seen, counter);
      let b = checkNode(prevRow, col, curr, checker, seen, counter);
      let c = checkNode(row, leftCol, curr, checker, seen, counter);
      let d = checkNode(row, rightCol, curr, checker, seen, counter);
      counter++;
    }
  
    // Draw out best route
    setTimeout(() => {
        let colorIndex = 0;
        const colorCount = rainbowColors.length;
  
        startNode.style.background = "";
        
  
        while (endNode.getAttribute("parent") != "null") {
            console.log(endNode)
            let color1 = rainbowColors[colorIndex % colorCount];
            let color2 = rainbowColors[(colorIndex + 1) % colorCount];
            colorIndex++;
  
            var coor = endNode.getAttribute("parent").split("|");
            var prow = parseInt(coor[0]);
            var pcol = parseInt(coor[1]);
            endNode = document.querySelector(`div[row="${prow}"][col="${pcol}"]`);
            endNode.style.background = createGradient(color1, color2);
  
            // Debugging:
            console.log("Pathfinding in Progress - Current Node:", endNode);
        }
    }, counter * 100 + 100);
    // Show refresh button again
    setTimeout(() => {
        refreshBtn.style.visibility = "visible";
    }, counter * 100 + 100);
  } // End start  
  
  function openTab(evt, id) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(id).style.display = "block";
    evt.currentTarget.className += " active";
  } // End openTab
  
  // Initialize
  window.onload = () => {
    createBoard();
    document.querySelectorAll("button")[2].click();
  };
  