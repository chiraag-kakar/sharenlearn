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
