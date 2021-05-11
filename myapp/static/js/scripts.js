// NAVIGATION MOBILE
const navBtn = document.querySelector(".nav-btn");
const navList = document.querySelector(".nav-list");
navBtn.addEventListener("click", function () {
  navList.classList.toggle("view");
});

// FOCUS INPUTS
const inputs = document.querySelectorAll(".input-field > *");
inputs.forEach(function (input) {
  input.addEventListener("focus", function () {
    this.parentElement.classList.add("focusing");
  });
  input.addEventListener("blur", function () {
    this.parentElement.classList.remove("focusing");
  });
});

if (document.querySelector(".signup-form")) {
  document
    .querySelector(".signup-form")
    .addEventListener("submit", async function (event) {
      if (!(await validate_form(this))) event.preventDefault();
    });
}

if (document.querySelector(".login-form")) {
  document
    .querySelector(".login-form")
    .addEventListener("submit", async function (event) {
      if (!(await validate_form(this))) event.preventDefault();
    });
}

if (document.querySelector(".contact-form")) {
  document
    .querySelector(".contact-form")
    .addEventListener("submit", async function (event) {
      if (!(await validate_form(this))) event.preventDefault();
    });
}

if (document.querySelector(".edit-profile-form")) {
  document
    .querySelector(".edit-profile-form")
    .addEventListener("submit", async function (event) {
      if (!(await validate_form(this))) event.preventDefault();
    });
}

if (document.querySelector(".upload-new-form")) {
  document
    .querySelector(".input-field.file-input")
    .addEventListener("click", function () {
      this.querySelector("input[type='file']").click();
    });
  document.getElementById("file").addEventListener("change", function () {
    document.querySelector(".selected-file").textContent = this.files.item(0)
      ? this.files.item(0).name
      : "";
    document.getElementById("ftype").value = this.files.item(0)
      ? this.files.item(0).name.split(".").pop()
      : "";
  });
  document
    .querySelector(".upload-new-form")
    .addEventListener("submit", async function (event) {
      if (!(await validate_form(this))) event.preventDefault();
    });
}

// VALIDATE FORM
async function validate_form(form) {
  const removeSpans = () => {
    if (document.querySelector("form .input-group .invalid")) {
      const spans = document.querySelectorAll("form .input-group .invalid");
      spans.forEach((span) => span.remove());
    }
  };
  const inputs = [...form.querySelectorAll("input[type]")];
  const selects = [...form.querySelectorAll("select")];
  const areas = [...form.querySelectorAll("textarea")];
  const fields = inputs.concat(selects.concat(areas));
  console.log(fields);
  try {
    const validationResponse = await validation(fields);
    if (validationResponse) return true;
  } catch (err) {
    removeSpans();
    const elem = document.querySelector(`[name = ${err.name}]`);
    elem.focus();
    const span = document.createElement("span");
    span.classList.add("invalid");
    span.textContent = err.error;
    elem.parentElement.parentElement.appendChild(span);
    return false;
  }
}

function validation(fields) {
  const validate = (field) => {
    const type = field.dataset.type;
    const value = field.value;
    const name = field.name;
    const valid = field.validity && field.validity.valid;
    const res = { name, error: null };
    if (
      type === "text" ||
      type === "email" ||
      type === "tel" ||
      type === "password"
    ) {
      if (!value.trim()) {
        return { ...res, error: "Please fill this field" };
      } else {
        if (type === "email")
          return valid
            ? res
            : { ...res, error: "Looks like this is not an email" };
        else if (type === "tel")
          return value.length === 10 && value.split("").every((n) => !isNaN(n))
            ? res
            : {
                ...res,
                error: "Please enter your valid 10 digit mobile number",
              };
        else if (type === "password")
          return value.length >= 8
            ? res
            : { ...res, error: "Password must be atleast 8 characters" };
        else return res;
      }
    } else if (type === "select")
      return value != "0" ? res : { ...res, error: "Please fill this field" };
    else if (type === "file") {
      const supported = [
        "pdf",
        "docx",
        "pptx",
        "jpg",
        "jpeg",
        "png",
        "md",
        "svg",
        "txt",
        "zip",
      ];
      const file = field.files.item(0);
      return file
        ? supported.includes(file.name.split(".").pop().toLowerCase())
          ? Math.round(file.size / 1024) >= 7600
            ? { ...res, error: "Select File less than 7.5MB" }
            : res
          : { ...res, error: "Unsupported File Format" }
        : { ...res, error: "Please Select a File" };
    } else return res;
  };
  return new Promise((resolve, reject) => {
    for (let field of fields) {
      const res = validate(field);
      if (res.error) {
        return reject(res);
      }
    }
    resolve(true);
  });
}

// THEME SWITCHER

document.querySelectorAll(".theme-switcher").forEach((btn) => {
  btn.addEventListener("click", function () {
    document.body.classList.toggle("light-theme");
    updateSVGs();
    localStorage.setItem(
      "theme",
      localStorage.getItem("theme") === "light" ? "dark" : "light"
    );
  });
});

function updateSVGs() {
  const changetheme = (element) => {
    const currColor = element.getAttribute("fill");
    element.setAttribute("fill", element.dataset.opposite);
    element.dataset.opposite = currColor;
  };
  const elements = document.querySelectorAll("[data-opposite]");
  elements.forEach((element) => {
    if (
      !(
        element.hasAttribute("data-sticky-dark") &&
        document.querySelector("header.sticky") &&
        document.querySelector("header.sticky").contains(element)
      )
    ) {
      changetheme(element);
    } else {
      const currColor = element.getAttribute("fill");
      console.log("secial");
      if (localStorage.getItem("theme") === "dark") {
        let currColor = element.getAttribute("fill");
        element.setAttribute("fill", element.dataset.stickyDark);
        element.dataset.stickyDark = currColor;
        changetheme(element);
        currColor = element.getAttribute("fill");
        element.setAttribute("fill", element.dataset.stickyLight);
        element.dataset.stickyLight = currColor;
      } else {
        let currColor = element.getAttribute("fill");
        element.setAttribute("fill", element.dataset.stickyLight);
        element.dataset.stickyLight = currColor;
        changetheme(element);
        currColor = element.getAttribute("fill");
        element.setAttribute("fill", element.dataset.stickyDark);
        element.dataset.stickyDark = currColor;
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  if (
    localStorage.getItem("theme") &&
    localStorage.getItem("theme") === "light"
  ) {
    document.body.classList.add("light-theme");
    updateSVGs();
  } else {
    localStorage.setItem("theme", "dark");
  }

  let found = false;
  window.addEventListener("scroll", function () {
    if (this.scrollY > 20) {
      document.querySelector("header").classList.add("sticky");
      if (!found) {
        found = true;
        updateStickySVGs();
      }
    } else {
      if (this.scrollY === 0) {
        document.querySelector("header").classList.remove("sticky");
        found = false;
        updateStickySVGs();
      }
    }
  });
});

function updateStickySVGs() {
  document.querySelectorAll("[data-sticky-dark]").forEach((element) => {
    const theme = localStorage.getItem("theme");
    const currColor = element.getAttribute("fill");
    if (theme === "dark") {
      element.setAttribute("fill", element.dataset.stickyDark);
      element.dataset.stickyDark = currColor;
    } else {
      element.setAttribute("fill", element.dataset.stickyLight);
      element.dataset.stickyLight = currColor;
    }
  });
}

//PROFLE FEATURE
if (document.getElementById("avatar")) {
  const avatarInput = document.getElementById("avatar");
  document.querySelector(".avatar").addEventListener("click", function (e) {
    console.log(e.target.classList.contains("cross"));
    if (!e.target.classList.contains("cross")) avatarInput.click();
  });

  avatarInput.addEventListener("click", function (e) {
    e.stopPropagation();
  });

  avatarInput.addEventListener("change", function () {
    const validate_profile = (file) => {
      const supported = ["png", "jpg", "jpeg"];
      return file
        ? supported.includes(file.name.split(".").pop().toLowerCase())
          ? Math.round(file.size / 1024) >= 5000
            ? "Select File less than 5MB"
            : "maybe"
          : "Unsupported File"
        : "Please Select a File";
    };
    const file = this.files.item(0);
    const valMsg = validate_profile(file);
    if (valMsg === "maybe") {
      const formData = new FormData();
      formData.append("profile", file);
      fetch(u, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRFToken": t,
        },
        body: formData,
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          if (data.message === "OK") {
            document.querySelector(
              ".avatar"
            ).style.backgroundImage = `url(${data.url})`;
            document.querySelector(".img-msg").classList.remove("notok");
            document.querySelector(".img-msg").classList.remove("disappear");
            document.querySelector(".img-msg").classList.add("ok");
            document.querySelector(".img-msg").textContent = "Updated";
            if (!document.querySelector("button.cross")) {
              const btn = document.createElement("button");
              btn.classList.add("cross");
              btn.style.display = "initial";
              btn.setAttribute("title", "Delete Profile Picture");
              btn.innerHTML = `<svg class="cross" width="6" height="7" viewBox="0 0 6 7" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6.14717L3.704 3.49417L5.977 0.818417L5.269 0L2.9965 2.67692L0.7025 0.0268333L0 0.846417L2.2965 3.50175L0.023 6.18042L0.7255 7L3.003 4.319L5.2985 6.97317L6 6.14717Z" fill="#C2C2C2" data-opposite="hsla(0, 0%, 8%, 0.76)"/></svg>`;
              document.querySelector(".avatar").appendChild(btn);
            } else {
              document.querySelector("button.cross").style.display = "initial";
            }
            setTimeout(() => {
              document.querySelector(".img-msg").classList.add("disappear");
            }, 3000);
          } else if (data.message === "notlogin") {
            window.location.href = l;
          }
        });
    } else {
      document.querySelector(".img-msg").classList.remove("ok");
      document.querySelector(".img-msg").classList.remove("disappear");
      document.querySelector(".img-msg").classList.add("notok");
      document.querySelector(".img-msg").textContent = valMsg;
      setTimeout(() => {
        document.querySelector(".img-msg").classList.add("disappear");
      }, 3000);
    }
  });

  if (document.querySelector("button.cross")) {
    document
      .querySelector("button.cross")
      .addEventListener("click", function () {
        fetch(u_d, {
          method: "POST",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": t,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "OK") {
              document.querySelector(
                ".avatar"
              ).style.backgroundImage = `var(--icon-avatar)`;
              document.querySelector(".img-msg").classList.remove("notok");
              document.querySelector(".img-msg").classList.remove("disappear");
              document.querySelector(".img-msg").classList.add("ok");
              document.querySelector(".img-msg").textContent = "Deleted";
              document.querySelector(".cross").style.display = "none";
              setTimeout(() => {
                document.querySelector(".img-msg").classList.add("disappear");
              }, 3000);
            } else if (data.message === "notlogin") {
              window.location.href = l;
            }
          });
      });
  }
}
