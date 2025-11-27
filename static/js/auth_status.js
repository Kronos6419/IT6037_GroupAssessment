document.addEventListener("DOMContentLoaded", function () {
    const auth_status_span = document.getElementById("auth_status");
    const auth_area = document.getElementById("auth_area");

    let login_button = null;
    let logout_button = null;

    if (auth_area) {
        login_button = auth_area.querySelector('button[onclick="open_login()"]');
        logout_button = auth_area.querySelector('button[onclick="logout_user()"]');
    }

    fetch("/api/auth/me/")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            if (auth_status_span) {
                if (data.isAuthenticated) {
                    const role_text = data.role || "student";
                    auth_status_span.textContent =
                        "Logged in as " + data.username + " (" + role_text + ")";
                } else {
                    auth_status_span.textContent = "Not logged in";
                }
            }

            if (login_button) {
                login_button.style.display = data.isAuthenticated
                    ? "none"
                    : "inline-block";
            }
            if (logout_button) {
                logout_button.style.display = data.isAuthenticated
                    ? "inline-block"
                    : "none";
            }
        })
        .catch(function (error) {
            console.error("Error fetching /api/auth/me/:", error);
            if (auth_status_span) {
                auth_status_span.textContent = "Status unavailable";
            }
        });
});
