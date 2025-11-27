// static/js/article_popup.js

// ---------- Helper to read category list from JSON script tag ----------

function get_category_list() {
    const script_tag = document.getElementById("category_data");
    if (!script_tag) {
        return [];
    }

    try {
        const text = script_tag.textContent || script_tag.innerText;
        return JSON.parse(text);
    } catch (err) {
        console.error("Could not parse category_data JSON:", err);
        return [];
    }
}

// =======================
// ADD ARTICLE POPUP
// =======================

function open_add_article() {
    let overlay = document.getElementById("add_article_overlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "add_article_overlay";
        overlay.className = "modal_overlay";

        const categories = get_category_list();

        let category_options_html = '<option value="">Select category</option>';
        categories.forEach(function (c) {
            category_options_html +=
                '<option value="' + c.id + '">' + c.name + "</option>";
        });

        overlay.innerHTML = `
            <div class="modal_window" id="add_article_modal">
                <h2>Add Article</h2>

                <div id="add_article_error" class="add_article_error_box" style="display:none;"></div>

                <label class="article_form_label" for="article_name">Name *</label>
                <input class="article_form_input" type="text" id="article_name" placeholder="Name">

                <label class="article_form_label" for="article_type">Type *</label>
                <input class="article_form_input" type="text" id="article_type" placeholder="Biography, Painting...">

                <label class="article_form_label" for="article_category">Category *</label>
                <select class="article_form_select" id="article_category">
                    ${category_options_html}
                </select>

                <label class="article_form_label" for="article_about">About</label>
                <textarea class="article_form_textarea" id="article_about" placeholder="Description, details, notes..."></textarea>

                <label class="article_form_label" for="article_born">Born</label>
                <input class="article_form_input" type="text" id="article_born" placeholder="1840">

                <label class="article_form_label" for="article_died">Died</label>
                <input class="article_form_input" type="text" id="article_died" placeholder="1926">

                <label class="article_form_label" for="article_nationality">Nationality</label>
                <input class="article_form_input" type="text" id="article_nationality">

                <label class="article_form_label" for="article_known_for">Known For</label>
                <input class="article_form_input" type="text" id="article_known_for">

                <label class="article_form_label" for="article_notable_work">Notable Work</label>
                <input class="article_form_input" type="text" id="article_notable_work">

                <label class="article_form_label" for="article_year">Year</label>
                <input class="article_form_input" type="text" id="article_year">

                <label class="article_form_label" for="article_medium">Medium</label>
                <input class="article_form_input" type="text" id="article_medium">

                <label class="article_form_label" for="article_dimensions">Dimensions</label>
                <input class="article_form_input" type="text" id="article_dimensions">

                <label class="article_form_label" for="article_location">Location</label>
                <input class="article_form_input" type="text" id="article_location">

                <label class="article_form_label" for="article_designed_by">Designed By</label>
                <input class="article_form_input" type="text" id="article_designed_by">

                <label class="article_form_label" for="article_developer">Developer</label>
                <input class="article_form_input" type="text" id="article_developer">

                <div class="button_group">
                    <button id="add_article_submit_btn" type="button">Save</button>
                    <button id="add_article_cancel_btn" type="button">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) {
                close_add_article();
            }
        });

        document
            .getElementById("add_article_cancel_btn")
            .addEventListener("click", close_add_article);

        document
            .getElementById("add_article_submit_btn")
            .addEventListener("click", submit_add_article);
    }

    overlay.style.display = "flex";
}

function close_add_article() {
    const overlay = document.getElementById("add_article_overlay");
    if (overlay) {
        overlay.style.display = "none";
    }
}

async function submit_add_article() {
    const error_box = document.getElementById("add_article_error");

    const name = document.getElementById("article_name").value.trim();
    const type = document.getElementById("article_type").value.trim();
    const category_id = document.getElementById("article_category").value;

    const about = document.getElementById("article_about").value.trim();
    const born = document.getElementById("article_born").value.trim();
    const died = document.getElementById("article_died").value.trim();
    const nationality = document.getElementById("article_nationality").value.trim();
    const known_for = document.getElementById("article_known_for").value.trim();
    const notable_work = document.getElementById("article_notable_work").value.trim();
    const year = document.getElementById("article_year").value.trim();
    const medium = document.getElementById("article_medium").value.trim();
    const dimensions = document.getElementById("article_dimensions").value.trim();
    const location = document.getElementById("article_location").value.trim();
    const designed_by = document.getElementById("article_designed_by").value.trim();
    const developer = document.getElementById("article_developer").value.trim();

    if (!name || !type || !category_id) {
        error_box.style.display = "block";
        error_box.textContent = "Name, Type and Category are required.";
        return;
    }

    try {
        const response = await fetch("/api/articles/add/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                type: type,
                category_id: category_id,
                about: about,
                born: born,
                died: died,
                nationality: nationality,
                known_for: known_for,
                notable_work: notable_work,
                year: year,
                medium: medium,
                dimensions: dimensions,
                location: location,
                designed_by: designed_by,
                developer: developer,
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            error_box.style.display = "block";
            error_box.textContent =
                data.error || "Could not save article. Please try again.";
            return;
        }

        window.location.reload();
    } catch (err) {
        console.error("Error adding article:", err);
        error_box.style.display = "block";
        error_box.textContent = "Network error. Please try again.";
    }
}

// EDIT ARTICLE POPUP

function open_edit_article(article_id) {
    let overlay = document.getElementById("edit_article_overlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "edit_article_overlay";
        overlay.className = "modal_overlay";

        const categories = get_category_list();

        let category_options_html = '<option value="">Select category</option>';
        categories.forEach(function (c) {
            category_options_html +=
                '<option value="' + c.id + '">' + c.name + "</option>";
        });

        overlay.innerHTML = `
            <div class="modal_window" id="edit_article_modal">
                <h2>Edit Article</h2>

                <div id="edit_article_error" class="add_article_error_box" style="display:none;"></div>

                <label class="article_form_label" for="edit_article_name">Name *</label>
                <input class="article_form_input" type="text" id="edit_article_name">

                <label class="article_form_label" for="edit_article_type">Type *</label>
                <input class="article_form_input" type="text" id="edit_article_type">

                <label class="article_form_label" for="edit_article_category">Category *</label>
                <select class="article_form_select" id="edit_article_category">
                    ${category_options_html}
                </select>

                <label class="article_form_label" for="edit_article_about">About</label>
                <textarea class="article_form_textarea" id="edit_article_about"></textarea>

                <label class="article_form_label" for="edit_article_born">Born</label>
                <input class="article_form_input" type="text" id="edit_article_born">

                <label class="article_form_label" for="edit_article_died">Died</label>
                <input class="article_form_input" type="text" id="edit_article_died">

                <label class="article_form_label" for="edit_article_nationality">Nationality</label>
                <input class="article_form_input" type="text" id="edit_article_nationality">

                <label class="article_form_label" for="edit_article_known_for">Known For</label>
                <input class="article_form_input" type="text" id="edit_article_known_for">

                <label class="article_form_label" for="edit_article_notable_work">Notable Work</label>
                <input class="article_form_input" type="text" id="edit_article_notable_work">

                <label class="article_form_label" for="edit_article_year">Year</label>
                <input class="article_form_input" type="text" id="edit_article_year">

                <label class="article_form_label" for="edit_article_medium">Medium</label>
                <input class="article_form_input" type="text" id="edit_article_medium">

                <label class="article_form_label" for="edit_article_dimensions">Dimensions</label>
                <input class="article_form_input" type="text" id="edit_article_dimensions">

                <label class="article_form_label" for="edit_article_location">Location</label>
                <input class="article_form_input" type="text" id="edit_article_location">

                <label class="article_form_label" for="edit_article_designed_by">Designed By</label>
                <input class="article_form_input" type="text" id="edit_article_designed_by">

                <label class="article_form_label" for="edit_article_developer">Developer</label>
                <input class="article_form_input" type="text" id="edit_article_developer">

                <div class="button_group">
                    <button id="edit_article_submit_btn" type="button">Save</button>
                    <button id="edit_article_cancel_btn" type="button">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) {
                close_edit_article();
            }
        });

        document
            .getElementById("edit_article_cancel_btn")
            .addEventListener("click", close_edit_article);

        document
            .getElementById("edit_article_submit_btn")
            .addEventListener("click", submit_edit_article);
    }

    // Store article id on submit button
    const submit_btn = document.getElementById("edit_article_submit_btn");
    submit_btn.dataset.articleId = article_id;

    overlay.style.display = "flex";

    // Fetch data and populate form
    fetch(`/api/articles/${article_id}/`)
        .then((response) => response.json())
        .then((data) => {
            if (data.error) {
                const error_box = document.getElementById("edit_article_error");
                error_box.style.display = "block";
                error_box.textContent = data.error;
                return;
            }

            document.getElementById("edit_article_name").value = data.name || "";
            document.getElementById("edit_article_type").value = data.type || "";
            document.getElementById("edit_article_category").value =
                data.category_id || "";
            document.getElementById("edit_article_about").value = data.about || "";
            document.getElementById("edit_article_born").value = data.born || "";
            document.getElementById("edit_article_died").value = data.died || "";
            document.getElementById("edit_article_nationality").value =
                data.nationality || "";
            document.getElementById("edit_article_known_for").value =
                data.known_for || "";
            document.getElementById("edit_article_notable_work").value =
                data.notable_work || "";
            document.getElementById("edit_article_year").value = data.year || "";
            document.getElementById("edit_article_medium").value = data.medium || "";
            document.getElementById("edit_article_dimensions").value =
                data.dimensions || "";
            document.getElementById("edit_article_location").value =
                data.location || "";
            document.getElementById("edit_article_designed_by").value =
                data.designed_by || "";
            document.getElementById("edit_article_developer").value =
                data.developer || "";
        })
        .catch((err) => {
            console.error("Error fetching article:", err);
            const error_box = document.getElementById("edit_article_error");
            error_box.style.display = "block";
            error_box.textContent = "Failed to load article.";
        });
}

function close_edit_article() {
    const overlay = document.getElementById("edit_article_overlay");
    if (overlay) {
        overlay.style.display = "none";
    }
}

async function submit_edit_article() {
    const error_box = document.getElementById("edit_article_error");
    const submit_btn = document.getElementById("edit_article_submit_btn");
    const article_id = submit_btn.dataset.articleId;

    const name = document.getElementById("edit_article_name").value.trim();
    const type = document.getElementById("edit_article_type").value.trim();
    const category_id = document
        .getElementById("edit_article_category")
        .value;

    const about = document.getElementById("edit_article_about").value.trim();
    const born = document.getElementById("edit_article_born").value.trim();
    const died = document.getElementById("edit_article_died").value.trim();
    const nationality = document
        .getElementById("edit_article_nationality")
        .value.trim();
    const known_for = document
        .getElementById("edit_article_known_for")
        .value.trim();
    const notable_work = document
        .getElementById("edit_article_notable_work")
        .value.trim();
    const year = document.getElementById("edit_article_year").value.trim();
    const medium = document.getElementById("edit_article_medium").value.trim();
    const dimensions = document
        .getElementById("edit_article_dimensions")
        .value.trim();
    const location = document
        .getElementById("edit_article_location")
        .value.trim();
    const designed_by = document
        .getElementById("edit_article_designed_by")
        .value.trim();
    const developer = document
        .getElementById("edit_article_developer")
        .value.trim();

    if (!name || !type || !category_id) {
        error_box.style.display = "block";
        error_box.textContent = "Name, Type and Category are required.";
        return;
    }

    try {
        const response = await fetch(`/api/articles/${article_id}/edit/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                type: type,
                category_id: category_id,
                about: about,
                born: born,
                died: died,
                nationality: nationality,
                known_for: known_for,
                notable_work: notable_work,
                year: year,
                medium: medium,
                dimensions: dimensions,
                location: location,
                designed_by: designed_by,
                developer: developer,
            }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            error_box.style.display = "block";
            error_box.textContent =
                data.error || "Could not update article. Please try again.";
            return;
        }

        window.location.reload();
    } catch (err) {
        console.error("Error updating article:", err);
        error_box.style.display = "block";
        error_box.textContent = "Network error. Please try again.";
    }
}

// DELETE ARTICLE POPUP

function open_delete_article(article_id) {
    let overlay = document.getElementById("delete_article_overlay");

    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "delete_article_overlay";
        overlay.className = "modal_overlay";

        overlay.innerHTML = `
            <div class="modal_window" id="delete_article_modal">
                <h2>Delete Article</h2>
                <p class="delete_warning_text">Are you sure you want to delete this article? This cannot be undone.</p>
                <div class="button_group">
                    <button id="delete_article_confirm_btn" class="delete_confirm_button" type="button">Delete</button>
                    <button id="delete_article_cancel_btn" type="button">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        overlay.addEventListener("click", function (e) {
            if (e.target === overlay) {
                close_delete_article();
            }
        });

        document
            .getElementById("delete_article_cancel_btn")
            .addEventListener("click", close_delete_article);

        document
            .getElementById("delete_article_confirm_btn")
            .addEventListener("click", submit_delete_article);
    }

    const confirm_btn = document.getElementById("delete_article_confirm_btn");
    confirm_btn.dataset.articleId = article_id;

    overlay.style.display = "flex";
}

function close_delete_article() {
    const overlay = document.getElementById("delete_article_overlay");
    if (overlay) {
        overlay.style.display = "none";
    }
}

async function submit_delete_article() {
    const confirm_btn = document.getElementById("delete_article_confirm_btn");
    const article_id = confirm_btn.dataset.articleId;

    try {
        const response = await fetch(`/api/articles/${article_id}/delete/`, {
            method: "POST",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            alert(data.error || "Could not delete article.");
            return;
        }

        window.location.reload();
    } catch (err) {
        console.error("Error deleting article:", err);
        alert("Network error. Please try again.");
    }
}

// Wire up Edit/Delete buttons after DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
    
    // Edit buttons
    document
        .querySelectorAll(".edit_article_button")
        .forEach(function (btn) {
            btn.addEventListener("click", function () {
                const id = this.dataset.articleId;
                if (id) {
                    open_edit_article(id);
                }
            });
        });

    // Delete buttons
    document
        .querySelectorAll(".delete_article_button")
        .forEach(function (btn) {
            btn.addEventListener("click", function () {
                const id = this.dataset.articleId;
                if (id) {
                    open_delete_article(id);
                }
            });
        });
});

window.open_add_article = open_add_article;
window.close_add_article = close_add_article;
window.submit_add_article = submit_add_article;

window.open_edit_article = open_edit_article;
window.close_edit_article = close_edit_article;
window.submit_edit_article = submit_edit_article;

window.open_delete_article = open_delete_article;
window.close_delete_article = close_delete_article;
window.submit_delete_article = submit_delete_article;
