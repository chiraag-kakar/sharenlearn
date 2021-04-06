![](https://github.com/chiraag-kakar/sharenlearn/blob/master/banner.png)


[![](https://img.shields.io/github/license/chiraag-kakar/sharenlearn?style=for-the-badge)]()
[![](https://img.shields.io/tokei/lines/github/chiraag-kakar/sharenlearn?label=Lines%20of%20Code&style=for-the-badge)]()
[![](https://img.shields.io/github/issues-raw/chiraag-kakar/sharenlearn?color=orange&style=for-the-badge)]()
[![](https://img.shields.io/github/issues-closed/chiraag-kakar/sharenlearn?style=for-the-badge)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/chiraag-kakar/sharenlearn/pulls)
[![](https://img.shields.io/github/issues-pr-closed-raw/chiraag-kakar/sharenlearn?style=for-the-badge)]()
[![](https://img.shields.io/github/issues-pr/chiraag-kakar/sharenlearn?style=for-the-badge)]()
[![](https://img.shields.io/github/forks/chiraag-kakar/sharenlearn?style=for-the-badge)]()
[![](https://img.shields.io/github/stars/chiraag-kakar/sharenlearn?style=for-the-badge)]()
[![](https://img.shields.io/website?style=for-the-badge&url=https://sharenlearn.herokuapp.com)](https://sharenlearn.herokuapp.com)


**Share N Learn is a Common Platform for Students & Faculties to upload and share - files including all sorts of study material which will be accessible to all the registered members built using [Django](https://docs.djangoproject.com/en/3.1/) Framework.**

The **Goal** of the project is to create a secure and scalable platform common to both college students and faculties so that they can easily share the files / resources related to coursework , 
Competitive exams and others hence reducing the dependency on social media platforms.
In future the platform can also serve as an e-library for the college students.

**So let's grow together.**


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


<details><summary>Step 1 : Downloading and Installing the Code Editor</summary>
 
 
| **Code Editor** | **Link** 	|
|-	|-	|
| Visual Studio Code 	| [Download it from here](https://code.visualstudio.com/)	|
| Sublime Text 3 	| [Download it from here](https://www.sublimetext.com/3) |
| Atom 	| [Download it from here](https://atom.io/)	|


</details>


---


<details><summary>Step 2 : Installing Python 3.7</summary>
 
 
* **For Windows** :  Click on [Download Python3.7](https://www.python.org/downloads/release/python-379/).
   * * Download the Windows x86-64 executable installer for 64-bit version of Windows
   * * Download the Windows x86 executable installer for 32-bit version of Windows.


   * * Make sure to check "Add Python 3.7 to Path" in the setup window of the Installer.

Verify the installation from the command prompt using following command :
```
python3.7 --version
```
And the installed version of python will be printed.


</details>


---

<details><summary>Step 3 : Installing Git </summary>

Click on [Download Git](https://git-scm.com/downloads)

</details>


---


<details><summary>Step 4 : Fork the Repository </summary>

Click on ![Fork](https://user-images.githubusercontent.com/63921263/110382285-b07bba80-8080-11eb-8407-d354849c1753.png)
to fork [this Repo](https://github.com/chiraag-kakar/sharenlearn)

</details>


---



<details><summary>Step 5 : Creating Project Directory </summary>


(Note : We are creating project directory in the desktop for easey and fast access)

```
cd desktop

mkdir myproject

cd myproject
```

</details>


---


<details><summary>Step 6 : Cloning Repository using Git</summary>
 
 
```
$ git clone https://github.com/<your-github-username>/sharenlearn.git
```


</details>


---


<details><summary>Step 7 : Change directory to sharenlearn</summary>
 

```
$ cd sharenlearn
```


</details>


---


<details><summary>Step 8 : Add a reference to the original repository
</summary>
 

```
$ git remote add upstream https://github.com/chiraag-kakar/sharenlearn.git
```


</details>


---


<details><summary>Step 9 : Creating Virtual Environment</summary>

Install virtualenv 
```
$ pip3 install virtualenv
```
Creating Virtual Environment named "myvenv" :
```
$ virtualenv myvenv -p python3.7
```
Activating "myvenv" :
* For **Windows cmd** :
   ```
   > myvenv\Scripts\activate
   ```
Command to deactivate "myvenv" :
```
deactivate
```


</details>


---


<details><summary>Step 10 : Installing Requirements</summary>


Note: Virtual Environment should be activated.

Installing requirements :
```
pip install -r requirements.txt
```


</details>


---


<details><summary>Step 11 : Creating Superuser and making database migrations to access the default Admin Panel</summary>
 
 
```
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```


</details>


---


<details><summary>Step 12 : Running the Project in local server</summary>


Note: Virtual Environment should be activated.


Run the following command in the terminal :
```
python manage.py runserver
```


</details>


---


### 💡️ **Pro Tip!** 
  * Always keep your master branch in sync with the main repository (by running `$ git pull upstream master` on your local master branch). 
  * Always create a new branch before making any changes (`$ git checkout -b <new-branch-name>`), never ever make any changes directly on the master branch.


## Congratulations for setting up the project locally.


## Contributing

* Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.
* For major changes, please open an [issue](https://github.com/chiraag-kakar/sharenlearn/issues) first to discuss what you would like to change.


Note : 
* Please take a moment to review the [Contributing.md](https://github.com/chiraag-kakar/sharenlearn/blob/master/Contributing.md) and [Code of Conduct](./code_of_conduct.md) which provides the guidelines for contributing.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b <your_branch_name>`)
3. Stage your Changes (`git add .`) 
4. Commit your Changes (`git commit -m '<your_commit_message>'`)
5. Push to the Branch (`git push origin <your_branch_name>`)
6. Open a [Pull Request](https://github.com/chiraag-kakar/sharenlearn/pulls)


---

## Contributor
<table>
	<tr>
		<td>
			<a href="https://github.com/chiraag-kakar/sharenlearn/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=chiraag-kakar/sharenlearn" />
</a>
		</td>
	</tr>
</table>

## License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/chiraag-kakar/sharenlearn/blob/master/LICENSE) file for details.

## AUTHOR : [Chiraag Kakar](https://github.com/chiraag-kakar)

