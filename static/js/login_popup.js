function open_login() {
    let overlay = document.getElementById("login_overlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "login_overlay";
        overlay.className = "modal_overlay";

        overlay.innerHTML = `
            <div class="modal_window" id="login_modal">
                <h2>Login</h2>

                <div id="login_error" class="login_error_box" style="display:none;"></div>

                <label for="login_email">Email</label>
                <input type="email" id="login_email" placeholder="Enter your email">

                <label for="login_password">Password</label>
                <input type="password" id="login_password" placeholder="Enter your password">

                <div class="button_group">
                    <button id="login_submit_btn" type="button">Login</button>
                    <button id="login_cancel_btn" type="button">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) {
                close_login();
            }
        });

        document
            .getElementById("login_cancel_btn")
            .addEventListener("click", close_login);

        document
            .getElementById("login_submit_btn")
            .addEventListener("click", submit_login);
    }

    overlay.style.display = "flex";
}

function close_login() {
    const overlay = document.getElementById("login_overlay");
    if (overlay) {
        overlay.style.display = "none";
    }
}

async function submit_login() {
    const email = document.getElementById("login_email").value.trim();
    const password = document.getElementById("login_password").value;
    const error_box = document.getElementById("login_error");

    if (!email || !password) {
        error_box.style.display = "block";
        error_box.textContent = "Please enter both email and password.";
        return;
    }

    try {
        const response = await fetch("/api/auth/login/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email, password: password }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            error_box.style.display = "block";
            error_box.textContent = data.error || "Login failed.";
            return;
        }

        window.location.reload();
    } catch (err) {
        error_box.style.display = "block";
        error_box.textContent = "Network error. Please try again.";
    }
}

async function logout_user() {
    try {
        await fetch("/api/auth/logout/", { method: "POST" });
    } catch (err) {
        console.error("Logout error:", err);
    } finally {
        window.location.reload();
    }
}

window.open_login = open_login;
window.close_login = close_login;
window.submit_login = submit_login;
window.logout_user = logout_user;
