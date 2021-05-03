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

document
  .querySelector(".signup-form")
  .addEventListener("submit", async function (event) {
    console.log(await validate_form());
    if (!(await validate_form())) event.preventDefault();
  });

// VALIDATE FORM - SIGNUP
async function validate_form() {
  const removeSpans = () => {
    if (document.querySelector("form .input-group .invalid")) {
      const spans = document.querySelectorAll("form .input-group .invalid");
      spans.forEach((span) => span.remove());
    }
  };
  const fname = document.getElementById("fname");
  const lname = document.getElementById("lname");
  const email = document.getElementById("email");
  const contact = document.getElementById("contact");
  const password = document.getElementById("password");
  const dept = document.getElementById("dept");
  const role = document.getElementById("role");
  try {
    const validationResponse = await validation([
      fname,
      lname,
      email,
      contact,
      password,
      dept,
      role,
    ]);
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
    else return null;
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
