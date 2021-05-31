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

// if (document.querySelector(".login-form")) {
//   document
//     .querySelector(".login-form")
//     .addEventListener("submit", async function (event) {
//       if (!(await validate_form(this))) event.preventDefault();
//     });
// }

// if (document.querySelector(".contact-form")) {
//   document
//     .querySelector(".contact-form")
//     .addEventListener("submit", async function (event) {
//       if (!(await validate_form(this))) event.preventDefault();
//     });
// }

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
    document.documentElement.classList.toggle("light-theme");
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
    document.documentElement.classList.add("light-theme");
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
              btn.addEventListener("click", deleteProfile);
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
      .addEventListener("click", deleteProfile);
  }
}

function deleteProfile(e) {
  e.stopPropagation();
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
}

if (document.querySelector(".as-st")) {
  const updateStatus = (id, job) => {
    const formData = new FormData();
    formData.append("job", job);
    formData.append("id", id);
    fetch(a_s, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": t,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") window.location.href = a_d;
        else if (data.message === "notlogin") window.location.href = lg;
        else if (data.message === "notstaff") window.location.href = p;
        else window.location.href = a_d;
      });
  };
  if (document.querySelector(".as-st.accept")) {
    document.querySelectorAll(".as-st.accept").forEach((btn) => {
      btn.addEventListener("click", function () {
        updateStatus(this.dataset.id, "accept");
      });
    });
  }
  if (document.querySelector(".as-st.reject")) {
    document.querySelectorAll(".as-st.reject").forEach((btn) => {
      btn.addEventListener("click", function () {
        updateStatus(this.dataset.id, "reject");
      });
    });
  }
}

function filterFeat(swtch) {
  if (swtch === "on") {
    document.querySelector(".filters").classList.add("on");
    document.querySelector(".clear-filters").classList.add("on");
  } else {
    document.querySelector(".filters").classList.remove("on");
    document.querySelector(".clear-filters").classList.remove("on");
  }
}

function backToNormal() {
  document.querySelectorAll("filters .active").forEach((active) => {
    active.classList.remove("active");
  });
  if (document.getElementById("search"))
    document.getElementById("search").value = "";
  document.getElementById("branch").textContent = "Branch";
  document.getElementById("ftype").textContent = "File Type";
  document.querySelector(".emsg").classList.remove("view");
  if (document.getElementById("status"))
    document.getElementById("status").textContent = "Status";
  if (document.querySelector(".none")) {
    document.querySelectorAll(".none").forEach((none) => {
      none.classList.remove("none");
    });
  }
}

function filterNotes() {
  let foundNote = false;
  const isequal = (a, b, c = false) => {
    if (b === "File Type" || b === "Branch" || b === "Status" || b === "") {
      return true;
    }
    if (c) return a.trim().toLowerCase().indexOf(b.trim()) !== -1;
    return a.trim() === b.trim();
  };
  if (document.querySelector(".note")) {
    document.querySelectorAll(".note").forEach((note) => {
      const type = note.querySelector(".note-type").textContent;
      const branch = note.querySelector(".note-dept").textContent;
      const title = note.querySelector(".note-title").textContent;
      const status = note.querySelector(".note-status").textContent;
      if (
        isequal(type, document.getElementById("ftype").textContent) &&
        (document.getElementById("status")
          ? isequal(status, document.getElementById("status").textContent)
          : true) &&
        isequal(branch, document.getElementById("branch").textContent)
      ) {
        foundNote = true;
        note.classList.remove("none");
      } else {
        note.classList.add("none");
      }
    });
  }
  return foundNote;
}

// FILTERS
if (
  document.querySelector(".filters") &&
  document.querySelectorAll(".note").length > 0
) {
  const dropdownItems = document.querySelectorAll(".dropdown li");
  dropdownItems.forEach((item) => {
    const oText = item.parentElement.previousElementSibling.textContent;
    item.addEventListener("click", function () {
      if (item.parentElement.querySelector(".dropdown li.active")) {
        item.parentElement
          .querySelector(".dropdown li.active")
          .classList.remove("active");
      }
      this.classList.add("active");
      filterFeat("on");
      this.parentElement.previousElementSibling.textContent =
        this.textContent === "All" ? oText : this.textContent;
      if (!filterNotes()) {
        document.querySelector(".emsg").classList.add("view");
      } else document.querySelector(".emsg").classList.remove("view");
    });
  });
  if (document.getElementById("search")) {
    document.getElementById("search").addEventListener("input", function () {
      filterFeat("on");
      if (!filterNotes()) {
        document.querySelector(".emsg").classList.add("view");
      } else document.querySelector(".emsg").classList.remove("view");
    });
  }
  document
    .querySelector(".clear-filters")
    .addEventListener("click", function () {
      filterFeat("off");
      backToNormal();
    });
}

//close details

if (document.querySelector("details")) {
  document.querySelectorAll("details").forEach((det) => {
    det.addEventListener("click", function () {
      document.querySelectorAll("details[open]").forEach((det) => {
        if (this !== det) {
          det.removeAttribute("open");
        }
      });
    });
  });
  document.querySelectorAll("details .dropdown li").forEach((li) => {
    li.addEventListener("click", function () {
      this.parentElement.parentElement.removeAttribute("open");
    });
  });
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    if (document.querySelector("details")) {
      document.querySelectorAll("details[open]").forEach((det) => {
        det.removeAttribute("open");
      });
    }
  }
});

// Manage Users

if (document.getElementById("user-action")) {
  document.querySelectorAll("#user-action button[data-job]").forEach((btn) => {
    const job = btn.dataset.job;
    const id = btn.dataset.id;
    btn.addEventListener("click", function () {
      if (job === this.dataset.job && id === this.dataset.id) {
        const formData = new FormData();
        formData.append("uid", this.dataset.id);
        this.textContent = "Working..";
        this.style.pointerEvents = "none";
        fetch(`/manage_users/${this.dataset.job}`, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": t,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "notlogin") {
              window.location.href = l;
            } else if (data.message === "notsuperuser") {
              window.location.href = p;
            } else if (data.message === "success") {
              window.location.href = sa_d;
            } else {
              window.location.href = sa_d;
            }
          });
      }
    });
  });
}

// Alert box
if (document.getElementById("logout-btn")) {
  document.getElementById("logout-btn").addEventListener("click", function () {
    document.querySelector(".alert-box").classList.add("view");
    document.querySelector(".win").classList.add("view");
    document
      .getElementById("cancel-logout")
      .addEventListener("click", function () {
        document.querySelector(".alert-box").classList.remove("view");
        document.querySelector(".win").classList.remove("view");
      });
    document
      .getElementById("confirm-logout")
      .addEventListener("click", function () {
        window.location.href = "/logout";
      });
  });
}

//Forgot Password
if (document.querySelector("form.f-password-form")) {
  const setDefaults = () => {
    if (document.querySelector(".check-otp")) {
      document.querySelector(".check-otp").classList.add("hide");
      setTimeout(() => {
        document.querySelector(".check-otp").classList.add("remove");
      }, 400);
      const otpBtn = document.getElementById("check-otp");
      otpBtn.classList.remove("done");
      otpBtn.textContent = "Submit OTP";
      otpBtn.removeAttribute("disabled");
      otpBtn.style.pointerEvents = "all";
      const otpField = document.getElementById("otp");
      otpField.value = "";
      otpField.removeAttribute("disabled");
      otpField.parentElement.classList.remove("disabled");
    }
    if (document.querySelector(".change-password")) {
      document.querySelector(".change-password").classList.add("hide");
      setTimeout(() => {
        document.querySelector(".change-password").classList.add("remove");
      }, 400);
      const cpBtn = document.getElementById("change-password");
      cpBtn.classList.remove("done");
      cpBtn.textContent = "Change Password";
      cpBtn.removeAttribute("disabled");
      cpBtn.style.pointerEvents = "all";
      const cpField = document.getElementById("password");
      cpField.value = "";
      cpField.removeAttribute("disabled");
      cpField.parentElement.classList.remove("disabled");
    }
  };
  let email = "";
  let otp = "";
  let nP = "";
  document
    .getElementById("send-otp")
    .addEventListener("click", async function () {
      if (
        await validate_field([
          this.parentElement.previousElementSibling.querySelector("#email"),
        ])
      ) {
        setDefaults();
        const ipField =
          this.parentElement.previousElementSibling.querySelector(
            ".input-field"
          );
        const emField = ipField.querySelector("#email");
        email = emField.value;
        otp = "";
        nP = "";
        const formData = new FormData();
        formData.append("email", email);
        const span = document.createElement("span");
        span.classList.add("invalid");
        this.parentElement.previousElementSibling.appendChild(span);
        span.textContent = "Trying to Send OTP..";
        fetch(f_p, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": t,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "success") {
              span.innerHTML = `<i style="color: var(--clr-success);font-style: normal;">OTP Sent</i>`;
              ipField.classList.add("disabled");
              emField.setAttribute("disabled", "disabled");
              this.textContent = "Resend OTP";
              document.querySelector(".check-otp").classList.remove("remove");
              setTimeout(() => {
                document.querySelector(".check-otp").classList.remove("hide");
              }, 400);
            } else if (data.message === "notfound") {
              span.textContent = "Please Signup";
            } else if (data.message === "erroronotp") {
              span.textContent = "Error while sending OTP";
            } else {
              span.textContent = "Please Try Again Later";
            }
          });
      }
    });
  document
    .getElementById("check-otp")
    .addEventListener("click", async function () {
      if (
        await validate_field([
          this.parentElement.previousElementSibling.querySelector("#otp"),
        ])
      ) {
        const ipField =
          this.parentElement.previousElementSibling.querySelector(
            ".input-field"
          );
        const otpField = ipField.querySelector("#otp");
        otp = otpField.value;
        nP = "";
        const formData = new FormData();
        formData.append("otp", otp);
        formData.append("email", email);
        const span = document.createElement("span");
        span.classList.add("invalid");
        this.parentElement.previousElementSibling.appendChild(span);
        span.textContent = "Verifing OTP..";
        fetch(c_o, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": t,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "success") {
              span.innerHTML = `<i style="color: var(--clr-success);font-style: normal;">OTP Verified</i>`;
              ipField.classList.add("disabled");
              otpField.setAttribute("disabled", "disabled");
              this.textContent = "OTP Verified";
              this.setAttribute("disabled", "disabled");
              this.classList.add("done");
              this.style.pointerEvents = "none";
              document
                .querySelector(".change-password")
                .classList.remove("remove");
              setTimeout(() => {
                document
                  .querySelector(".change-password")
                  .classList.remove("hide");
              }, 400);
            } else if (data.message === "wrong") {
              span.textContent = "OTP Entered Wrong";
            } else if (data.message === "notfound") {
              span.textContent = "Please Signup";
            } else {
              span.textContent = "OTP Verification Failed. Try again";
            }
          });
      }
    });
  document
    .getElementById("change-password")
    .addEventListener("click", async function () {
      if (
        await validate_field([
          this.parentElement.previousElementSibling.querySelector("#password"),
        ])
      ) {
        const ipField =
          this.parentElement.previousElementSibling.querySelector(
            ".input-field"
          );
        const passField = ipField.querySelector("#password");
        nP = passField.value;
        const formData = new FormData();
        formData.append("otp", otp);
        formData.append("email", email);
        formData.append("np", nP);
        const span = document.createElement("span");
        span.classList.add("invalid");
        this.parentElement.previousElementSibling.appendChild(span);
        span.textContent = "Working on it..";
        fetch(s_n_p, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": t,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "success") {
              span.innerHTML = `<i style="color: var(--clr-success);font-style: normal;">Password Changed</i>`;
              const sendotpBtn = document.getElementById("send-otp");
              sendotpBtn.setAttribute("disabled", "disabled");
              sendotpBtn.pointerEvents = "none";
              sendotpBtn.textContent = "OTP Sent";
              sendotpBtn.classList.add("done");
              this.textContent = "Password Changed";
              this.setAttribute("disabled", "disabled");
              this.classList.add("done");
              this.style.pointerEvents = "none";
              setTimeout(() => {
                window.location.href = l;
              }, 900);
            } else if (data.message === "cantset") {
              span.textContent = "Failed. Try Again";
            } else if (data.message === "notfound") {
              span.textContent = "Please Signup";
            } else {
              span.textContent = "Password Change Failed. Try again";
            }
          });
      }
    });
}

// Login

// Login
if (document.querySelector(".login-form")) {
  document
    .getElementById("login-btn")
    .addEventListener("click", async function () {
      if (
        await validate_field([
          document.querySelector("#email"),
          document.querySelector("#password"),
        ])
      ) {
        const ipFields = document.querySelectorAll(".input-field");
        ipFields[0].querySelector("[data-type]").focus();
        const emField = document.getElementById("email");
        const passField = document.getElementById("password");
        const email = emField.value;
        const password = passField.value;
        const cap = grecaptcha.getResponse();
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("g-recaptcha-response", cap);
        const span = document.createElement("span");
        span.classList.add("invalid");
        span.textContent = "Working on it..";
        ipFields[0].parentElement.appendChild(span);
        fetch(l, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": t,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message == "caperror") {
              span.textContent = "Captcha Verification Failed";
            } else if (data.message === "mailsent") {
              span.textContent = "Please check your email";
            } else if (data.message === "erroronotp") {
              span.textContent = "Error sending verification mail";
              this.textContent = "Resend Mail";
            } else if (data.message === "notfound") {
              span.textContent = "Error, please signup";
            } else if (data.message === "success") {
              span.textContent = "";
              ipFields.forEach((ipField) => {
                ipField.classList.add("disabled");
              });
              emField.setAttribute("disabled", "disabled");
              passField.setAttribute("disabled", "disabled");
              this.style.pointerEvents = "none";
              setTimeout(() => {
                window.location.href = l;
              }, 100);
            } else if (data.message === "wrong") {
              span.textContent = "Invalid Credentials";
            } else {
              span.textContent = "Error while signing up";
            }
          });
      }
    });
}

async function validate_field(field) {
  const removeSpans = () => {
    if (document.querySelector("form .input-group .invalid")) {
      const spans = document.querySelectorAll("form .input-group .invalid");
      spans.forEach((span) => span.remove());
    }
  };
  try {
    const validationResponse = await validation(field);
    if (validationResponse) {
      removeSpans();
      return true;
    }
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

// change password link button
if (document.getElementById("c-pass-btn")) {
  const Otext = document.getElementById("c-pass-btn").textContent;
  document.getElementById("c-pass-btn").addEventListener("click", function () {
    this.textContent = "Sending mail to your email address..";
    this.setAttribute("disabled", "disabled");
    this.style.pointerEvents = "none";
    this.style.color = "var(--clr-error)";
    fetch(c_p, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": t,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message == "success") {
          this.innerHTML = `<i style="color: var(--clr-success);font-style: normal;">Check your mail for instructions</i>`;
        } else {
          this.textContent = "Error sending mail. Try Again";
        }
        setTimeout(() => {
          this.textContent = Otext;
          this.style.pointerEvents = "all";
          this.removeAttribute("disabled");
          this.style.color = "";
        }, 1500);
      });
  });
}

// change password
if (document.querySelector("form.change-password-form")) {
  let cP = "";
  let nP = "";
  document
    .getElementById("check-c-password")
    .addEventListener("click", async function () {
      if (
        await validate_field([
          this.parentElement.previousElementSibling.querySelector(
            "#c-password"
          ),
        ])
      ) {
        const ipField =
          this.parentElement.previousElementSibling.querySelector(
            ".input-field"
          );
        const cPField = ipField.querySelector("#c-password");
        cP = cPField.value;
        nP = "";
        const formData = new FormData();
        formData.append("cp", cP);
        const span = document.createElement("span");
        span.classList.add("invalid");
        this.parentElement.previousElementSibling.appendChild(span);
        span.textContent = "Checking your password..";
        fetch(c_u_p, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": t,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "success") {
              span.innerHTML = `<i style="color: var(--clr-success);font-style: normal;">Password Verified</i>`;
              ipField.classList.add("disabled");
              cPField.setAttribute("disabled", "disabled");
              this.textContent = "Password Verified";
              this.setAttribute("disabled", "disabled");
              this.classList.add("done");
              this.style.pointerEvents = "none";
              document
                .querySelector(".set-n-password")
                .classList.remove("remove");
              setTimeout(() => {
                document
                  .querySelector(".set-n-password")
                  .classList.remove("hide");
              }, 400);
            } else if (data.message === "wrong") {
              span.textContent = "Invalid Password";
            } else {
              span.textContent = "Please Try Again!";
            }
          });
      }
    });
  document
    .getElementById("set-n-password")
    .addEventListener("click", async function () {
      if (
        await validate_field([
          this.parentElement.previousElementSibling.querySelector(
            "#n-password"
          ),
        ])
      ) {
        const ipField =
          this.parentElement.previousElementSibling.querySelector(
            ".input-field"
          );
        const nPField = ipField.querySelector("#n-password");
        nP = nPField.value;
        const formData = new FormData();
        formData.append("cp", cP);
        formData.append("np", nP);
        const span = document.createElement("span");
        span.classList.add("invalid");
        this.parentElement.previousElementSibling.appendChild(span);
        span.textContent = "Setting new Password..";
        fetch(s_u_p, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": t,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "success") {
              span.innerHTML = `<i style="color: var(--clr-success);font-style: normal;">Password Changed</i>`;
              ipField.classList.add("disabled");
              nPField.setAttribute("disabled", "disabled");
              this.textContent = "Done";
              this.setAttribute("disabled", "disabled");
              this.classList.add("done");
              this.style.pointerEvents = "none";
              setTimeout(() => {
                window.location.href = l;
              }, 100);
            } else if (data.message === "wrong") {
              span.textContent = "Something went wrong.";
            } else {
              span.textContent = "Please try again";
            }
          });
      }
    });
}

// Contact form
if (document.querySelector("form.contact-form")) {
  let email = "";
  const requiresOTP = document.getElementById("otp");
  console.log(requiresOTP);
  document
    .getElementById("contact-form-btn")
    .addEventListener("click", async function () {
      if (
        requiresOTP &&
        document.querySelector(".otp-field").classList.contains("remove")
      ) {
        document.querySelector(".otp-field").classList.remove("remove");
        setTimeout(() => {
          document.querySelector(".otp-field").classList.remove("hide");
        });
        document.querySelector(".form-footer").classList.add("expanded");
      }
      if (
        (await validate_field([
          document.getElementById("name"),
          document.getElementById("email"),
          document.getElementById("subject"),
          document.getElementById("message"),
        ])) &&
        (requiresOTP ? await validate_field([requiresOTP]) : true)
      ) {
        const ipFields = document.querySelectorAll(".input-field");
        const nmField = document.getElementById("name");
        const emField = document.getElementById("email");
        const sbField = document.getElementById("subject");
        const msgField = document.getElementById("message");
        const name = nmField.value;
        email = emField.value;
        const subject = sbField.value;
        const message = msgField.value;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("subject", subject);
        formData.append("message", message);
        if (requiresOTP) {
          const otp = requiresOTP.value;
          formData.append("otp", otp);
        }
        const span = document.createElement("span");
        span.classList.add("invalid");
        span.textContent = "Working on it..";
        ipFields[0].parentElement.appendChild(span);
        fetch(c, {
          method: "POST",
          cache: "no-cache",
          headers: {
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRFToken": t,
          },
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.message === "success") {
              span.textContent = "";
              ipFields.forEach((ipField) => {
                ipField.classList.add("disabled");
                ipField.children[0].setAttribute("disabled", "disabled");
              });
              this.style.pointerEvents = "none";
              this.classList.add("done");
              this.textContent = "Messaged";
              setTimeout(() => {
                window.location.href = c;
              }, 100);
            } else if (data.message === "emwrong") {
              span.textContent = "Looks like email is not valid";
            } else if (data.message === "otperror") {
              span.textContent = "OTP Entered Wrong";
            } else {
              span.textContent = "Please Try Again";
            }
          });
      }
    });
}

if (document.querySelector(".email-for-otp")) {
  document
    .querySelector(".email-for-otp")
    .addEventListener("input", async function () {
      if (await validate_field([this])) {
        document.querySelector(".ask-otp").classList.add("view");
      } else {
        document.querySelector(".ask-otp").classList.remove("view");
      }
    });
  const Otext = document.getElementById("ask-otp").textContent;
  document.getElementById("ask-otp").addEventListener("click", function () {
    this.textContent = "Sending OTP..";
    this.setAttribute("disabled", "disabled");
    this.style.pointerEvents = "none";
    this.style.color = "var(--clr-error)";
    const formData = new FormData();
    formData.append("email", document.getElementById("email").value);
    fetch(s_o, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": t,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message == "success") {
          this.innerHTML = `<i style="color: var(--clr-success);font-style: normal;">OTP Sent</i>`;
          document.querySelector(".otp-field").classList.remove("remove");
          setTimeout(() => {
            document.querySelector(".otp-field").classList.remove("hide");
          }, 400);
          document.querySelector(".form-footer").classList.add("expanded");
          document.getElementById("email").setAttribute("disabled", "disabled");
          document
            .getElementById("email")
            .parentElement.classList.add("disabled");
        } else {
          this.textContent = "Please Try Again";
        }
        setTimeout(() => {
          this.textContent = Otext;
          this.style.pointerEvents = "all";
          this.removeAttribute("disabled");
          this.style.color = "";
        }, 1500);
      });
  });
}

// TOGGLE PASSWORD

if (document.getElementById("password")) {
  const toggleBtn = document.querySelectorAll(
    "#password + .toggle-password-btn"
  );
  toggleBtn.forEach((btn) => {
    btn.addEventListener("click", function () {
      this.previousElementSibling.setAttribute(
        "type",
        this.previousElementSibling.getAttribute("type") === "text"
          ? "password"
          : "text"
      );
      // cross in svg
      this.querySelector("#cross").style.display =
        this.querySelector("#cross").style.display === "none"
          ? "initial"
          : "none";
      // focus the input
      this.previousElementSibling.focus();
    });
  });
}

// Scroll to top button

window.addEventListener("scroll", function () {
  const topBtn = document.getElementById("top-btn");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    topBtn.classList.add("view");
  } else {
    topBtn.classList.remove("view");
  }
});

document.getElementById("top-btn").addEventListener("click", function () {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
});

// FIX FOCUS ISSUE DUE TO STICKY HEADER

const body = document.body || document.documentElement;
const header = document.querySelector("header");
body.addEventListener("focusin", function (e) {
  const pos1 = header.getBoundingClientRect().bottom;
  const pos2 = e.target.getBoundingClientRect().top;
  if (e.target.parentElement.classList.contains("input-field") && pos2 < pos1) {
    window.scrollBy(0, pos2 - pos1 - 80);
  }
});

window.addEventListener("dfMessengerLoaded", function (e) {
  if (document.querySelector("df-messenger")) {
    const chat = document
      .querySelector("df-messenger")
      .shadowRoot.querySelector("df-messenger-chat");
    let sheet = new CSSStyleSheet();
    sheet.replaceSync(
      `div.chat-wrapper[opened="true"] { height: 450px; border-radius: 6px; text-align: left; } @media screen and (max-width: 500px) { div.chat-wrapper[opened="true"] { height: 100%; border-radius: 0px; } } @media screen and (max-height: 400px) { div.chat-wrapper[opened="true"] { height: 100%; border-radius: 0px; } .expanded > #widgetIcon { visibility: hidden; } }`
    );
    chat.shadowRoot.adoptedStyleSheets = [sheet];
    document
      .querySelector("df-messenger")
      .shadowRoot.querySelector("#widgetIcon").style.right = "77px";
  }
});

// Like
if (document.getElementById("like-it")) {
  const likeBtn = document.getElementById("like-it");
  const disLikeBtn = document.getElementById("dislike-it");
  const likeCount = document.getElementById("like-count");
  const disLikeCount = document.getElementById("dislike-count");
  const notLoginURL = likeBtn.dataset.notLogin;
  const nid = likeBtn.dataset.id;
  const l_url = likeBtn.dataset.url;
  const dl_url = disLikeBtn.dataset.url;
  likeBtn.addEventListener("click", function () {
    const formData = new FormData();
    formData.append("nid", nid);
    fetch(l_url, {
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
        if (data.message === "success") {
          disLikeBtn.classList.remove("tick");
          if (data.job === "like") likeBtn.classList.add("tick");
          else likeBtn.classList.remove("tick");
          likeCount.textContent = data.l_count;
          disLikeCount.textContent = data.dl_count;
        } else {
          window.location.href = notLoginURL;
        }
      });
  });
  disLikeBtn.addEventListener("click", function () {
    const formData = new FormData();
    formData.append("nid", nid);
    fetch(dl_url, {
      method: "POST",
      cache: "no-cache",
      headers: {
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": t,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "success") {
          likeBtn.classList.remove("tick");
          if (data.job === "dislike") disLikeBtn.classList.add("tick");
          else disLikeBtn.classList.remove("tick");
          likeCount.textContent = data.l_count;
          disLikeCount.textContent = data.dl_count;
        } else {
          window.location.href = notLoginURL;
        }
      });
  });
}

//new

if (document.querySelector(".nr")) {
  document.querySelectorAll(".nr").forEach((nr) => {
    const likeBtn = nr.querySelector("#like-it");
    const disLikeBtn = nr.querySelector("#dislike-it");
    const likeCount = nr.querySelector("#like-count");
    const disLikeCount = nr.querySelector("#dislike-count");
    const notLoginURL = likeBtn.dataset.notLogin;
    const nid = likeBtn.dataset.id;
    const l_url = likeBtn.dataset.url;
    const dl_url = disLikeBtn.dataset.url;
    likeBtn.addEventListener("click", function () {
      const formData = new FormData();
      formData.append("nid", nid);
      fetch(l_url, {
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
          if (data.message === "success") {
            disLikeBtn.classList.remove("tick");
            if (data.job === "like") likeBtn.classList.add("tick");
            else likeBtn.classList.remove("tick");
            likeCount.textContent = data.l_count;
            disLikeCount.textContent = data.dl_count;
          } else {
            window.location.href = notLoginURL;
          }
        });
    });
    disLikeBtn.addEventListener("click", function () {
      const formData = new FormData();
      formData.append("nid", nid);
      fetch(dl_url, {
        method: "POST",
        cache: "no-cache",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRFToken": t,
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "success") {
            likeBtn.classList.remove("tick");
            if (data.job === "dislike") disLikeBtn.classList.add("tick");
            else disLikeBtn.classList.remove("tick");
            likeCount.textContent = data.l_count;
            disLikeCount.textContent = data.dl_count;
          } else {
            window.location.href = notLoginURL;
          }
        });
    });
  });
}
