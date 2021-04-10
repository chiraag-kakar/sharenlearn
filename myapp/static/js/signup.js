const sendOtpBtn = document.querySelector("#sendOtpBtn");
const otpFeedBackArea = document.querySelector(".OTPStatusFeedBackArea");
const verifyOTPFeedback = document.querySelector(".OTPFeedBackArea");
const verifyOtpBtn = document.querySelector("#verifyOtpBtn");

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
