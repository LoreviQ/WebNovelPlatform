$(document).ready(function () {
    function fetchData() {
        $.ajax({
            url: "/api/data", // Local API endpoint
            method: "GET",
            success: function (response) {
                displayData(response);
            },
            error: function (error) {
                console.log("Error fetching data:", error);
                $("#data-container").html(
                    '<div class="alert alert-danger">Error fetching data</div>'
                );
            },
        });
    }

    function displayData(data) {
        let html = '<div class="list-group">';
        data.forEach((item) => {
            html += `<div class="list-group-item">
                        <h5>${item.title}</h5>
                        <p>${item.description}</p>
                    </div>`;
        });
        html += "</div>";
        $("#data-container").html(html);
    }

    // Fetch data when the page loads
    fetchData();
});
