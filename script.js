let robotPosition = "A1";
let battery = 100;

const obstacles = ["A2"];

const connections = {
    A1: ["A2", "B1"],
    A2: ["A1", "A3", "B2"],
    A3: ["A2", "B3"],
    B1: ["A1", "B2"],
    B2: ["B1", "A2", "B3"],
    B3: ["B2", "A3"]
};

// Knowledge Representation
function updateKnowledge() {
    document.getElementById("knowledge").innerHTML = `
        <p>Robot: R1</p>
        <p>Current Location: ${robotPosition}</p>
        <p>Battery Level: ${battery}%</p>
        <p>Obstacle Locations: ${obstacles.join(", ")}</p>
        <p>Destination: ${document.getElementById("destination").value}</p>
    `;
}

// Inference Engine and Path Planning
function findPath(start, end) {
    let queue = [[start]];
    let visited = new Set([start]);

    while (queue.length > 0) {
        let path = queue.shift();
        let current = path[path.length - 1];

        if (current === end) {
            return path;
        }

        for (let next of connections[current]) {
            if (!visited.has(next) && !obstacles.includes(next)) {
                visited.add(next);
                queue.push([...path, next]);
            }
        }
    }

    return null;
}

// Warehouse Display
function displayWarehouse(position, destination) {
    document.querySelectorAll(".cell").forEach(cell => {
        cell.className = "cell";
    });

    obstacles.forEach(id => {
        document.getElementById(id).classList.add("obstacle");
        document.getElementById(id).innerHTML = "🚧 " + id;
    });

    document.getElementById(position).className = "cell robot";
    document.getElementById(position).innerHTML = "🤖 " + position;

    if (destination !== position) {
        document.getElementById(destination).className =
            "cell destination";
        document.getElementById(destination).innerHTML =
            "📦 " + destination;
    }
}

// Start Robot
function startRobot() {
    let start = document.getElementById("start").value;
    let destination = document.getElementById("destination").value;

    if (start === destination) {
        alert("Choose a different destination!");
        return;
    }

    robotPosition = start;
    battery = 100;

    let path = findPath(start, destination);

    if (!path) {
        document.getElementById("status").innerText = "Blocked";
        document.getElementById("output").innerHTML =
            "No safe route found. Robot cannot complete the task.";
        return;
    }

    document.getElementById("status").innerText = "Working";
    document.getElementById("taskStatus").innerText = "In Progress";

    document.getElementById("output").innerHTML =
        "Knowledge acquired.<br>" +
        "Obstacle analysis completed.<br>" +
        "Safe route identified: " + path.join(" → ");

    displayWarehouse(robotPosition, destination);
    updateKnowledge();

    let index = 0;

    let timer = setInterval(() => {
        index++;

        if (index >= path.length) {
            clearInterval(timer);

            document.getElementById("status").innerText = "Completed";
            document.getElementById("taskStatus").innerText = "Delivered";

            document.getElementById("output").innerHTML +=
                "<br>📦 Package delivered successfully!";

            return;
        }

        robotPosition = path[index];
        battery = Math.max(0, battery - 5);

        document.getElementById("location").innerText = robotPosition;
        document.getElementById("battery").innerText = battery + "%";

        displayWarehouse(robotPosition, destination);
        updateKnowledge();

    }, 1000);
}

// Reset
function resetRobot() {
    robotPosition = "A1";
    battery = 100;

    document.getElementById("start").value = "A1";
    document.getElementById("destination").value = "B2";

    document.getElementById("status").innerText = "Idle";
    document.getElementById("battery").innerText = "100%";
    document.getElementById("location").innerText = "A1";
    document.getElementById("taskStatus").innerText = "Pending";

    document.getElementById("output").innerText =
        "Waiting for robot instructions...";

    displayWarehouse("A1", "B2");
    updateKnowledge();
}

// Initial Display
displayWarehouse("A1", "B2");
updateKnowledge();