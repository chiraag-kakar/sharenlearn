![](https://github.com/chiraag-kakar/sharenlearn/blob/master/banner.png)


![](https://img.shields.io/github/license/chiraag-kakar/sharenlearn?style=for-the-badge)
![](https://img.shields.io/tokei/lines/github/chiraag-kakar/sharenlearn?label=Lines%20of%20Code&style=for-the-badge)
![](https://img.shields.io/github/issues-raw/chiraag-kakar/sharenlearn?color=orange&style=for-the-badge)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/chiraag-kakar/sharenlearn/pulls)
![](https://img.shields.io/github/issues-pr/chiraag-kakar/sharenlearn?style=for-the-badge)
![](https://img.shields.io/github/commit-activity/y/chiraag-kakar/sharenlearn?style=for-the-badge)


**Share N Learn is a Common Platform for Students & Faculties to upload and share - files including study material which will be accessible to all the registered members.
 built using [Django](https://docs.djangoproject.com/en/3.1/) Framework.**

                                      😃Hit that ⭐ button to show some ❤️           

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
```
Any Code Editor (VS Code preferred)
Python version 3.7 or higher
Latest version of Git
A PythonAnywhere Account (for deploying the project on a live system)
```

### Development Environment Setup : Windows
**Step 1** : Downloading and Installing the Code Editor

| **Code Editor** | **Link** 	|
|-	|-	|
| Visual Studio Code 	| [Download it from here](https://code.visualstudio.com/)	|
| Sublime Text 3 	| [Download it from here](https://www.sublimetext.com/3) |
| Atom 	| [Download it from here](https://atom.io/)	|

---
**Step 2** : Installing Python
* Click on [Download Python](https://www.python.org/downloads/windows/).
* Click on the "Latest Python 3 Release - Python x.x.x" link.
   * * Download the Windows x86-64 executable installer for 64-bit version of Windows
   * * Download the Windows x86 executable installer for 32-bit version of Windows.


* Make sure to check "Add Python 3.x to Path" in the setup window of the Installer.

Verify the installation from the command prompt using following command :
```
python --version
```
And the installed version of python will be printed.


---
**Step 3**: Creating Project Directory 


(Note : We are creating project directory in the desktop for ease of access)

```
cd desktop

mkdir myproject

cd myproject
```
---
**Step 4**: Fork the Repository Cloning Repository using Git
```
git clone https://github.com/chiraag-kakar/sharenlearn.git
```
Note: The cloned repo directory need to be renamed as "sharenlearn".

---
**Step 5**: Creating Virtual Environment

Change the directory to the required one where the virtual environment will be created :
```
cd sharenlearn
```
Creating Virtual Environment named "myvenv" :
```
python -m venv myvenv
```
Activating "myvenv" :
```
myvenv\Scripts\activate
```
Command to deactivate "myvenv" :
```
deactivate
```
---
**Step 6**: Installing Requirements


Note: Virtual Environment should be activated.


Upgrading pip to the latest version :
```
python -m pip install --upgrade pip
```


Installing requirements :
```
pip install -r requirements.txt
```
**Step 7**: Creating Superuser and making database migrations to access the default Admin Panel
```
python manage.py createsuperuser
```
```
python manage.py makemigrations
python manage.py migrate
```

---
**Step 8**: Running the Project in local server


Note: Virtual Environment should be activated.


Run the following command in the terminal :
```
python manage.py runserver
```

## Congratulations for setting up the project locally.


---

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
