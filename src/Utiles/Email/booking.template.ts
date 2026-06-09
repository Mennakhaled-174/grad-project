export const bookingTemplate = (data: {
  fullname: string;
  phone: string;
  city: string;
  addressDetails: string;
  building: string;
  floor: string;
  apartment: string;

  date: Date;
  time: string;

  service: string;
  size: string;
  price: number;

  worker: {
    fullName: string;
    phone: string;
    nationalId: string;
    document?: boolean;
  };
}): string => `

<!DOCTYPE html>
<html>

<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }

    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #ddd;
    }

    .header {
      background: #007BFF;
      color: #fff;
      text-align: center;
      padding: 20px;
    }

    .body {
      padding: 20px;
      color: #333;
      line-height: 1.7;
    }

    .section {
      margin-bottom: 20px;
    }

    .title {
      color: #007BFF;
      font-size: 18px;
      margin-bottom: 10px;
    }

    .feedback-section {
      margin-top: 30px;
      padding: 20px;
      background-color: #f8f9ff;
      border-radius: 10px;
      text-align: center;
      font-size: 18px;
      line-height: 1.8;
    }

    .feedback-section a {
      color: #007BFF;
      font-weight: bold;
      text-decoration: none;
      font-size: 19px;
    }

    .footer {
      text-align: center;
      padding: 15px;
      background: #f4f4f4;
      font-size: 14px;
      color: #777;
    }
  </style>
</head>

<body>

  <div class="email-container">

    <div class="header">
      <h1>Booking Confirmation</h1>
    </div>

    <div class="body">

      <h2>Hello ${data.fullname}</h2>

      <p>Your booking has been confirmed successfully.</p>

      <div class="section">
        <div class="title">Booking Details</div>

        <p><strong>Service:</strong> ${data.service}</p>
        <p><strong>Size:</strong> ${data.size}</p>
        <p><strong>Price:</strong> ${data.price} EGP</p>
        <p><strong>Date:</strong> ${data.date}</p>
        <p><strong>Time:</strong> ${data.time}</p>
      </div>

      <div class="section">
        <div class="title">Address</div>

        <p><strong>City:</strong> ${data.city}</p>
        <p><strong>Address:</strong> ${data.addressDetails}</p>
        <p><strong>Building:</strong> ${data.building}</p>
        <p><strong>Floor:</strong> ${data.floor}</p>
        <p><strong>Apartment:</strong> ${data.apartment}</p>
      </div>

      <div class="section">
        <div class="title">Assigned Worker</div>

        <p><strong>Name:</strong> ${data.worker.fullName}</p>
        <p><strong>Phone:</strong> ${data.worker.phone}</p>
        <p><strong>National ID:</strong> ${data.worker.nationalId}</p>

        <p>
          <strong>Document:</strong>
          ${data.worker.document ? 'Verified' : 'Not Verified'}
        </p>
      </div>

      <div class="feedback-section">

        <p><strong>Your opinion matters to us ✨</strong></p>

        <p>
          Kindly fill out this short feedback form to help us improve
          our service and make your next experience even better.
        </p>

        <p>
          <a href="https://docs.google.com/forms/d/e/1FAIpQLScl-9hGVEUbavhh7Yu2M4s4a5anOmJAwwYGIgUPSdnck1EL1A/viewform?usp=publish-editor">
            Fill Feedback Form
          </a>
        </p>

        <p>Thank you for your time and support 💙</p>

      </div>

    </div>

    <div class="footer">
      Fel-Khedma Team
    </div>

  </div>

</body>

</html>
`;
