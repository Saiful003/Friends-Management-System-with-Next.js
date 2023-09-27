function passwordResetTemplate(linkUrl) {
  return `<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Template</title>

    <style>
          
      .email-template_container {
        border: 2px solid #10b981;
        padding: 17px;
        min-height: 269px;
        text-align: center;
        border-radius: 4px;
        max-width: 300px;
      }
      h2.email-template_heading {
        font-size: 30px;
        color: #10b981;
        letter-spacing: 4.5px;
        margin-bottom: 24px;
      }
      p.email-template_text {
        font-size: 20px;
        margin-bottom: 48px;
        color: #10b981;
      }
      p.email-template_otp-number {
        font-size: 50px;
        letter-spacing: 16px;
        color: #10b981;
      }
      .reset_btn {
        text-decoration: none;
        padding: 14.5px;
        color: #ffffff !important;
        background: #10b981;
        border: none;
        border-radius: 7px;
        font-weight: bold;
      }

    </style>

  </head>
  <body>
      <div class="email-template_container">
      <h2 class="email-template_heading">FMS</h2>
      <p class="email-template_text">
        Click this button to reset your password
      </p>

      <div class="email-template_body">
        <a class="reset_btn" href=${linkUrl}>Reset Password Now</a>
      </div>
    </div>

  </body>
</html>`;
}

export default passwordResetTemplate;
