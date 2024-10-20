function updateTable(data) {
    const tbody = document.getElementById('dataTable').querySelector('tbody');
    tbody.innerHTML = ''; // Clear existing data

    data.forEach(item => {
        const row = document.createElement('tr');
        const nameCell = document.createElement('td');
        const surnameCell = document.createElement('td');
        const idCell = document.createElement('td');

        nameCell.textContent = item.name;
        surnameCell.textContent = item.surname;
        idCell.textContent = item.id;

        row.appendChild(nameCell);
        row.appendChild(surnameCell);
        row.appendChild(idCell);
        tbody.appendChild(row);
    });
}

// Helper function to split name into first and surname
function processData(data) {
    return data.map(item => {
        const [name, surname] = item.name.split(' ');
        return { name, surname, id: item.id };
    });
}

// Fetch and display data using synchronous XMLHttpRequest
function fetchDataSync() {
    const referenceRequest = new XMLHttpRequest();
    referenceRequest.open('GET', 'data/reference.json', false);
    referenceRequest.send();
    const referenceData = JSON.parse(referenceRequest.responseText);

    const data1Request = new XMLHttpRequest();
    data1Request.open('GET', `data/${referenceData.data_location}`, false);
    data1Request.send();
    const data1 = JSON.parse(data1Request.responseText).data;

    const data2Request = new XMLHttpRequest();
    data2Request.open('GET', `data/${JSON.parse(data1Request.responseText).data_location}`, false);
    data2Request.send();
    const data2 = JSON.parse(data2Request.responseText).data;

    const data3Request = new XMLHttpRequest();
    data3Request.open('GET', 'data/data3.json', false);
    data3Request.send();
    const data3 = JSON.parse(data3Request.responseText).data;

    const processedData = [...processData(data1), ...processData(data2), ...processData(data3)];
    updateTable(processedData);
}

// Fetch and display data using asynchronous XMLHttpRequest with callbacks
function fetchDataAsync() {
    const referenceRequest = new XMLHttpRequest();
    referenceRequest.open('GET', 'data/reference.json', true);
    referenceRequest.onload = function () {
        const referenceData = JSON.parse(referenceRequest.responseText);

        const data1Request = new XMLHttpRequest();
        data1Request.open('GET', `data/${referenceData.data_location}`, true);
        data1Request.onload = function () {
            const data1 = JSON.parse(data1Request.responseText).data;

            const data2Request = new XMLHttpRequest();
            data2Request.open('GET', `data/${JSON.parse(data1Request.responseText).data_location}`, true);
            data2Request.onload = function () {
                const data2 = JSON.parse(data2Request.responseText).data;

                const data3Request = new XMLHttpRequest();
                data3Request.open('GET', 'data/data3.json', true);
                data3Request.onload = function () {
                    const data3 = JSON.parse(data3Request.responseText).data;

                    const processedData = [...processData(data1), ...processData(data2), ...processData(data3)];
                    updateTable(processedData);
                };
                data3Request.send();
            };
            data2Request.send();
        };
        data1Request.send();
    };
    referenceRequest.send();
}

// Fetch and display data using Fetch API with Promises
function fetchDataWithFetch() {
    fetch('data/reference.json')
        .then(response => response.json())
        .then(referenceData => fetch(`data/${referenceData.data_location}`))
        .then(response => response.json())
        .then(data1 => {
            const nextFile = data1.data_location;
            const processedData1 = processData(data1.data);

            return fetch(`data/${nextFile}`).then(response => response.json())
                .then(data2 => {
                    const processedData2 = processData(data2.data);

                    return fetch('data/data3.json').then(response => response.json())
                        .then(data3 => {
                            const processedData3 = processData(data3.data);
                            const finalData = [...processedData1, ...processedData2, ...processedData3];
                            updateTable(finalData);
                        });
                });
        });
}
