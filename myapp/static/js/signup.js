const sendOtpBtn = document.querySelector("#sendOtpBtn");
const otpFeedBackArea = document.querySelector(".OTPStatusFeedBackArea");
const verifyOTPFeedback = document.querySelector(".OTPFeedBackArea");
const verifyOtpBtn = document.querySelector("#verifyOtpBtn");
const emailField = document.querySelector("#emailid");
const passwordField = document.querySelector("#password");
const emailFeedBackArea = document.querySelector(".emailFeedBackArea");
const passwordFeedBackArea = document.querySelector(".passwordFeedBackArea");

// email validations
emailField.addEventListener("keyup", (e) => {
  const emailVal = e.target.value;

  emailField.classList.remove("is-invalid");
  emailFeedBackArea.style.display = "none";

  if (emailVal.length > 0) {
    fetch("/validate-email/", {
      body: JSON.stringify({ email: emailVal }),
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.email_error) {
          sendOtpBtn.disabled = true;
          emailField.classList.add("is-invalid");
          emailFeedBackArea.style.display = "block";
          emailFeedBackArea.innerHTML = `<p class="text-center" style="color:red;">${data.email_error}</p>`;
        } else if (data.email_pattern_error) {
          sendOtpBtn.disabled = true;
          emailField.classList.add("is-invalid");
          emailFeedBackArea.style.display = "block";
          emailFeedBackArea.innerHTML = `<p class="text-center" style="color:red;">${data.email_pattern_error}</p>`;
        } else {
          sendOtpBtn.removeAttribute("disabled");
        }
      });
  }
});

passwordField.addEventListener("keyup", (e) => {
  const passwordVal = e.target.value;

  passwordField.classList.remove("is-invalid");
  passwordFeedBackArea.style.display = "none";

  if (passwordVal.length > 0) {
    fetch("/validate-password/", {
      body: JSON.stringify({
        password: passwordVal,
      }),
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.password_error) {
          sendOtpBtn.disabled = true;
          passwordField.classList.add("is-invalid");
          passwordFeedBackArea.style.display = "block";
          passwordFeedBackArea.innerHTML = `<p class="text-center" style="color:red;">${data.password_error}</p>`;
        } else {
          sendOtpBtn.removeAttribute("disabled");
        }
      });
  }
});
// function to send OTP
function sendOTP() {
  sendOtpBtn.innerHTML =
    '<div class="spinner-border text-light" role="status"><span class="sr-only">Loading...</span></div>';
  let email = $("#emailid").val();
  let fname = $("#firstname").val();
  let lname = $("#lastname").val();
  let password = $("#password").val();
  let contact = $("#contact").val();
  let role = $("#role").val();
  let branch = $("#branch").val();
  if (
    email !== "" &&
    fname !== "" &&
    lname !== "" &&
    password !== "" &&
    contact !== "" &&
    role !== null &&
    branch !== null
  ) {
    otpFeedBackArea.style.display = "none";
    $.ajax({
      url: "/send-otp/",
      type: "GET",
      data: {
        email: email,
        fname: fname,
      },
      success: function (data) {
        sendOtpBtn.innerHTML = "Send OTP";
        if (data.otp_error) {
          otpFeedBackArea.style.display = "block";
          otpFeedBackArea.innerHTML = `<p class='alert alert-danger'>${data.otp_error}</p>`;
        } else {
          otpFeedBackArea.style.display = "block";
          otpFeedBackArea.innerHTML = `<p class='alert alert-success'>${data.otp_sent}</p>`;
          $("#sendOtpBtn").hide();
          $("#afterOTP").slideDown(1000);
        }
      },
    });
  } else {
    sendOtpBtn.innerHTML = "Send OTP";
    otpFeedBackArea.style.display = "block";
    otpFeedBackArea.innerHTML = `<p class='alert alert-danger'>Fields are empty.</p>`;
  }
}

function verifyOTP() {
  let otp = $("#otp").val();
  let email = $("#emailid").val();
  $.ajax({
    url: "/check-otp/",
    type: "GET",
    data: {
      email: email,
      otp: otp,
    },
    success: function (data) {
      if (data.otp_mismatch) {
        verifyOTPFeedback.style.display = "block";
        verifyOTPFeedback.innerHTML = `<p class="text-center" style="color:red;">${data.otp_mismatch}</p>`;
      } else {
        verifyOtpBtn.removeAttribute("disabled");
        otpFeedBackArea.style.display = "none";
        verifyOtpBtn.innerHTML =
          '<div class="spinner-border text-light" role="status"><span class="sr-only">Loading...</span></div>';
        document.getElementById("signupForm").submit();
      }
    },
  });
}
