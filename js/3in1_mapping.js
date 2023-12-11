// Read and Display CSV
function readAndDisplayCSV() {
    var fileInput = document.getElementById('csvFileInput');
    var reader = new FileReader();

    reader.onload = function(e) {
        var text = e.target.result;
        populateDropdown(text); // Populate the dropdown with unique values from the first column
        displayCSV(text);
    };

    reader.readAsText(fileInput.files[0]);
}

// -----------------------------------------------------------------------------
function populateDropdown(csvText) {
    var csvRows = csvText.split('\n');
    var dropdown = document.getElementById('filterDropdown');

    // Reset dropdown
    dropdown.length = 1; // Keep the first 'Select Filter' option

    // Get unique values from the first column
    var uniqueValues = [...new Set(csvRows.map(row => row.split(',')[0]))];
    uniqueValues.forEach(function(value) {
        if (value.trim() === "") return; // Skip empty values
        var option = new Option(value, value);
        dropdown.add(option);
    });
}

// -----------------------------------------------------------------------------
function displayCSV(csvText) {
    var filterValue = document.getElementById('filterDropdown').value;
    var csvRows = csvText.split('\n');
    var tableBody = document.getElementById('csvTable').getElementsByTagName('tbody')[0];

    // Clear previous data
    tableBody.innerHTML = "";

    // Loop over the rows and create a table row for each
    csvRows.forEach(function(rowText, i) {
        var cells = rowText.split(',');
        if (cells[0] === filterValue || i === 0 || filterValue === "") {
            var row = tableBody.insertRow(-1);
            cells.forEach(function(cellText, index) {
                var cell = row.insertCell(-1);
                cell.textContent = cellText;

                // Assuming the "Data Type" column is the last one, apply the class to these cells
                if (index === cells.length - 2) { // Check if it's the 2nd to last column
                    cell.className = 'data-type-cell'; // Apply the class to the "Data Type" cells
                }
            });
        }
    });
}

// -----------------------------------------------------------------------------
function sortTable(columnIndex) {
    var table = document.getElementById('csvTable');
    var tbody = table.tBodies[0];
    var rows = Array.from(tbody.rows);

    // Determine sort direction (ascending or descending)
    var isAscending = tbody.getAttribute('data-sort-asc') === 'true';
    tbody.setAttribute('data-sort-asc', !isAscending);

    rows.sort(function(rowA, rowB) {
        var cellA = rowA.cells[columnIndex].textContent.trim();
        var cellB = rowB.cells[columnIndex].textContent.trim();

        // Attempt to convert cell values to numbers for proper numeric sorting
        var numA = parseFloat(cellA.replace(/,/g, ''));
        var numB = parseFloat(cellB.replace(/,/g, ''));
        if (!isNaN(numA) && !isNaN(numB)) {
            cellA = numA;
            cellB = numB;
        }

        if (cellA < cellB) return isAscending ? -1 : 1;
        if (cellA > cellB) return isAscending ? 1 : -1;
        return 0;
    });

    // Append rows back to the table body in their new order
    rows.forEach(function(row) {
        tbody.appendChild(row);
    });
}

// -----------------------------------------------------------------------------
function showDataTypeSubMenu(cell, posX, posY) {
    // Remove any existing context menu
    var existingMenu = document.getElementById('contextMenu');
    if (existingMenu) {
        existingMenu.remove();
    }

    // Create the context menu
    var menu = document.createElement('ul');
    menu.id = 'contextMenu';
    menu.style.position = 'absolute';
    menu.style.left = posX + 'px';
    menu.style.top = posY + 'px';
    menu.style.listStyle = 'none';
    menu.style.padding = '10px';
    menu.style.margin = '0';
    menu.style.backgroundColor = '#f2f2f2';
    menu.style.border = '1px solid #d4d4d4';
    menu.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    menu.style.cursor = 'default';
    menu.style.zIndex = '1000';

    // List of data types to be included in the context menu
    var dataTypes = ['STRING', 'DATE', 'FLOAT', 'EEID', 'SSN', 'PHONE'];

    dataTypes.forEach(function(dataType) {
        var menuItem = document.createElement('li');
        menuItem.textContent = dataType;
        menuItem.style.padding = '5px 10px';
        menuItem.style.cursor = 'pointer';

        // Handle click on menu item
        menuItem.addEventListener('click', function() {
            cell.textContent = dataType;
            // Here you would also handle updating the CSV file.
            // This requires a server-side component which is not included in this example.
        });

        menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);
}

// -----------------------------------------------------------------------------
// Function to handle right-click on "Data Type" cells
document.addEventListener('DOMContentLoaded', function() {
    var tableBody = document.getElementById('csvTable').getElementsByTagName('tbody')[0];
    tableBody.addEventListener('contextmenu', function(event) {
        event.preventDefault();

        if (event.target.tagName === 'TD' && event.target.cellIndex === 7) { // Assuming "Data Type" is the 8th column
            // Create and show the context menu
            showDataTypeSubMenu(event.target, event.pageX, event.pageY);
        }
    });
});

// -----------------------------------------------------------------------------
// Hide context menu when clicking elsewhere
document.addEventListener('click', function(event) {
    var contextMenu = document.getElementById('contextMenu');
    if (contextMenu && event.target.id !== 'contextMenu') {
        contextMenu.remove();
    }
});

// -----------------------------------------------------------------------------
// Add event listener to the dropdown for filtering
document.getElementById('filterDropdown').addEventListener('change', function() {
    var fileInput = document.getElementById('csvFileInput');
    if (fileInput.files.length > 0) {
        var reader = new FileReader();

        reader.onload = function(e) {
            var text = e.target.result;
            displayCSV(text); // Display CSV with the filter applied
        };

        reader.readAsText(fileInput.files[0]);
    }
});
