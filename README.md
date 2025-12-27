

# Share N Learn

<!-- Banner -->

<p align="center">
  <a href="https://github.com/chiraag-kakar/sharenlearn/" title="ShareNLearn">
    <img src="./banner.svg" width="800" height="700" alt="Share N Learn Banner">
  </a>
</p>

<!-- Status Badges -->

<p align="center">
  <img src="https://img.shields.io/github/license/chiraag-kakar/sharenlearn?style=for-the-badge" />
  <img src="https://img.shields.io/tokei/lines/github/chiraag-kakar/sharenlearn?label=Lines%20of%20Code&style=for-the-badge" />
  <img src="https://img.shields.io/github/issues-raw/chiraag-kakar/sharenlearn?style=for-the-badge" />
  <img src="https://img.shields.io/github/issues-closed/chiraag-kakar/sharenlearn?style=for-the-badge" />
  <a href="https://github.com/chiraag-kakar/sharenlearn/pulls">
    <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge" />
  </a>
  <img src="https://img.shields.io/github/forks/chiraag-kakar/sharenlearn?style=for-the-badge" />
  <img src="https://img.shields.io/github/stars/chiraag-kakar/sharenlearn?style=for-the-badge" />
  <a href="https://sharenlearn.herokuapp.com">
    <img src="https://img.shields.io/website?style=for-the-badge&url=https://sharenlearn.herokuapp.com" />
  </a>
</p>

---

## Overview

**Share N Learn** is a centralized, role-agnostic platform designed for students and faculty to securely upload, manage, and share academic resources. The platform supports a wide range of study materials and ensures controlled access for registered users.

---

## Objectives

* Provide a secure and scalable content-sharing platform for academic institutions
* Reduce reliance on informal and fragmented channels such as social media
* Enable efficient dissemination of coursework-related resources
* Lay the groundwork for future expansion into a full-fledged academic e-library

---

## Technology Stack

* **Frontend:** HTML, CSS, JavaScript
* **Backend:** Python, Django Framework

  * Django Documentation: [https://docs.djangoproject.com/en/3.1/](https://docs.djangoproject.com/en/3.1/)

---

## Getting Started

The following instructions will help you set up the project locally for development and testing.

### Prerequisites (Windows)

* Python 3.7 or later
* Git
* A code editor (VS Code, Sublime Text, or Atom recommended)

---

## Local Development Setup

### 1. Install Python

Download and install Python 3.7+ from the official site:
[https://www.python.org/downloads/](https://www.python.org/downloads/)

Ensure **“Add Python to PATH”** is selected during installation.

Verify installation:

```bash
python --version
```

---

### 2. Install Git

Download Git from:
[https://git-scm.com/downloads](https://git-scm.com/downloads)

---

### 3. Fork and Clone the Repository

Fork the repository from GitHub, then clone your fork:

```bash
git clone https://github.com/<your-github-username>/sharenlearn.git
cd sharenlearn
```

Add the upstream repository:

```bash
git remote add upstream https://github.com/chiraag-kakar/sharenlearn.git
```

---

### 4. Set Up a Virtual Environment

Install `virtualenv`:

```bash
pip install virtualenv
```

Create and activate the virtual environment:

```bash
virtualenv myvenv -p python3.7
myvenv\Scripts\activate
```

Deactivate when needed:

```bash
deactivate
```

---

### 5. Install Dependencies

Ensure the virtual environment is active, then run:

```bash
pip install -r requirements.txt
```

---

### 6. Database Setup

Apply migrations:

```bash
python manage.py makemigrations
python manage.py migrate
```

Create a superuser for admin access:

```bash
python manage.py createsuperuser
```

---

### 7. Run the Development Server

```bash
python manage.py runserver
```

The application will be available at:
[http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## Development Best Practices

* Keep your local `master` branch in sync with upstream:

```bash
git pull upstream master
```

* Always create a feature branch for changes:

```bash
git checkout -b <feature-branch-name>
```

* Never commit directly to `master`

---

## Contributing

Contributions are welcome and appreciated.

Before contributing:

* Review the [Contributing Guidelines](./Contributing.md)
* Review the [Code of Conduct](./code_of_conduct.md)

### Contribution Workflow

```bash
git checkout -b <your-branch-name>
git add .
git commit -m "Descriptive commit message"
git push origin <your-branch-name>
```

Open a Pull Request:
[https://github.com/chiraag-kakar/sharenlearn/pulls](https://github.com/chiraag-kakar/sharenlearn/pulls)

For major changes, please open an issue first to discuss the proposal.

---

## Contributors

<p align="center">
  <a href="https://github.com/chiraag-kakar/sharenlearn/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=chiraag-kakar/sharenlearn" />
  </a>
</p>

---

## License

This project is licensed under the MIT License.
See the [LICENSE](./LICENSE) file for details.

---

<p align="center">
  Maintained by <strong>Chiraag Kakar</strong>
</p>
<p align="center">
  <a href="https://github.com/chiraag-kakar/">
    <img src="https://user-images.githubusercontent.com/58631762/120077716-60cded80-c0c9-11eb-983d-80dfa5862d8a.png" width="20" />
  </a>
</p>

---
