# Monke Library, A SPA with Django Backend

A Single Page Application (SPA) for managing student reference articles in Art, Math, and Technology, built with Django (backend) and JavaScript (frontend).

This system supports Students, Tutors, and Admins with role based UI and functionality.

<br>

## Features
### Frontend (SPA)

Login popup (AJAX, no page reload)

#### Role-based UI controls:

Students: browse + search + filter articles

Tutors: all above + add + edit articles

Admins: all above + delete articles

#### Popup modals for:

Login

Add Article

Edit Article

Delete Confirmation

#### More Features:

Live validation inside popups

JSON data embedded directly into the page for category selection

Responsive layout (desktop + mobile)

### Backend (Django)

Custom Role model (Student, Tutor, Admin)

Django session based authentication (no HTML login pages)

JSON API endpoints for auth + article CRUD

Queries + filtering through Django ORM

Uses SQLite by default

<br>

## Installation & Setup 
### Install dependencies

#### Create your environment:

python -m venv env <br>
env\Scripts\Activate.ps1

#### Install requirements:

pip install -r requirements.txt

#### Create / login template admin user
##### For creation
python manage.py createsuperuser 

##### For logging in using template admin
username: admin  <br>
password: monkeadmin@library123

##### For logging in using template tutor
username: tutor1 <br>
password: monketutor@library123

##### For logging in using template student
username: student1 <br>
password: monkestudent@library123

<br>

## Run the server
python manage.py runserver


### Visit the SPA:

http://127.0.0.1:8000/


### Admin panel:

http://127.0.0.1:8000/admin/

<br>

## User Roles
#### Student

Browse/search/filter articles

No editing allowed

#### Tutor

Everything students can do

Can Add Article

Can Edit Article (popup)

#### Admin

Everything tutors can do

Can Delete Article (confirmation popup)

### Roles are set through (admin panel):

Admin -> Users -> Role (dropdown)

<br>

## API Endpoints (JSON)
### ▶ Authentication
Method	Endpoint	Description <br>
POST	/api/auth/login/	Log in via JSON (email, password) <br>
POST	/api/auth/logout/	Log out user <br>
GET	/api/auth/me/	Returns { isAuthenticated, username, role } <br>

### ▶ Articles
Method	Endpoint	Role	Description <br>
POST	/api/articles/add/	Tutor/Admin	Create article <br> 
GET	/api/articles/id/	Tutor/Admin	Get article for editing <br>
POST	/api/articles/id/edit/	Tutor/Admin	Update article <br>
POST	/api/articles/id/delete/	Admin	Delete article <br>

#### All popups use these endpoints using AJAX fetch(). 

<br>

## Popup System (Frontend Logic)
1. Login Popup

Triggered via “Login” button

Uses open_login() from login_popup.js

Submits via AJAX -> reload only on success

Displays inline errors <br><br>


2. Add Article Popup

Triggered via “Add Article”

Category list is passed from Django -> JSON script tag

Saves via api/articles/add/

Required fields: name, type, category <br><br>


3. Edit Article Popup

Triggered via .edit_article_button

Preloads fields via api/articles/id/

Updates via api/articles/id/edit/ <br><br>


4. Delete Confirmation

Triggered via .delete_article_button

Uses small modal with two buttons

Only Admin can delete <br><br>

<br>

## Styling

static.css -> Layout, article cards, header, buttons

popup.css -> Modal overlays + popup layout

Fully responsive

<br>

## Testing Guide
### Student

Can see articles

Can search and filter

Cannot add/edit/delete

### Tutor

Add Article works

Edit Article works

No delete button

### Admin

Add/Edit/Delete all work

Delete popup confirms before removing

<br>

## Credits

Development: Monke Team
Languages Used: Django, Vanilla JS, HTML, CSS
For: Whitecliffe College – IT6037 Group Assessment