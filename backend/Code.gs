var EMAIL_RECIPIENT = "illya.naumov@gmail.com"; 

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date();

    if (data.type === "order") {
      var sheet = doc.getSheetByName("Orders");
      var orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000); 
      
      // Calculate totals server-side for security/accuracy
      var classicPrice = 14;
      var specialtyPrice = 18;
      var classicQty = parseInt(data.classic) || 0;
      var specialtyQty = parseInt(data.matcha) || 0; // 'matcha' is currently the key for specialty
      var totalItems = classicQty + specialtyQty;
      
      var subtotal = (classicQty * classicPrice) + (specialtyQty * specialtyPrice);
      var deliveryFee = 0;
      
      // Delivery Logic: $6 unless 3+ items
      if (data.fulfillment.indexOf("delivery") > -1) {
        if (totalItems < 3) {
            deliveryFee = 6;
        }
      }
      
      var finalTotal = subtotal + deliveryFee;
      
      sheet.appendRow([timestamp, orderId, data.name, data.email, data.phone, classicQty, specialtyQty, data.fulfillment, data.notes, finalTotal]);
      
      // Admin Alert
      MailApp.sendEmail({
        to: EMAIL_RECIPIENT,
        subject: "🍞 Order " + orderId + " (" + data.name + ")",
        htmlBody: "New Order: <b>" + orderId + "</b><br>Customer: " + data.name + "<br>Items: " + classicQty + " Classic, " + specialtyQty + " Specialty<br>Total: $" + finalTotal + "<br>Method: " + data.fulfillment
      });

      // Customer Email
      if (data.email) {
         sendCustomerEmail(data, orderId, finalTotal, deliveryFee);
      }

      return ContentService.createTextOutput(JSON.stringify({ "result": "success", "orderId": orderId })).setMimeType(ContentService.MimeType.JSON);
      
    } else {
      var sheet = doc.getSheetByName("Waitlist");
      sheet.appendRow([timestamp, data.email]);
      return ContentService.createTextOutput(JSON.stringify({ "result": "success" })).setMimeType(ContentService.MimeType.JSON);
    }

  } catch (e) {
    // --- DEBUGGING: Email the error to yourself ---
    MailApp.sendEmail({
      to: EMAIL_RECIPIENT,
      subject: "⚠️ Script Error: Shokupan Slope",
      htmlBody: "<b>Error Message:</b> " + e.toString() + "<br><b>Stack:</b> " + e.stack
    });
    // ----------------------------------------------
    
    return ContentService.createTextOutput(JSON.stringify({ "result": "error", "error": e.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function sendCustomerEmail(data, orderId, total, deliveryFee) {
  var subject = "Order Confirmed: " + orderId;
  
  // Dynamic Instructions based on method
  var instructions = "";
  var fulfillmentText = "";
  
  if (data.fulfillment.indexOf("pickup") > -1) {
     var day = data.fulfillment.indexOf("tue") > -1 ? "Tuesday" : "Sunday";
     fulfillmentText = "Pickup (" + day + ")";
     instructions = 
       "<h3 style='color: #4A6741; margin-top: 0;'>Pickup Instructions</h3>" +
       "<p>Please pick up your order on <strong>" + day + " between 9am - 2pm</strong>.</p>" +
       "<p><strong>Address:</strong> 123 7th Ave, Brooklyn (South Slope)</p>" +
       "<p><em>Payment: Cash or Venmo upon arrival.</em></p>";
  } else {
     fulfillmentText = "Delivery (Saturday)";
     instructions = 
       "<h3 style='color: #4A6741; margin-top: 0;'>Delivery Instructions</h3>" +
       "<p>We will deliver your order this <strong>Saturday</strong>.</p>" +
       "<p>We'll text you an ETA on the morning of delivery.</p>" +
       "<p><em>Payment: Cash or Venmo at the door.</em></p>";
  }

  // HTML Template
  // Colors: Matcha (#4A6741), Crust (#C27829), Flour (#FDFBF7)
  var htmlBody = 
    "<div style=\"font-family: 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #444; background-color: #FDFBF7;\">" +
      // Header
      "<div style=\"background-color: #4A6741; padding: 30px; text-align: center; color: white;\">" +
        "<h1 style=\"margin: 0; font-family: 'Georgia', serif; font-size: 28px;\">Shokupan Slope</h1>" +
        "<p style=\"margin: 5px 0 0; opacity: 0.9; font-style: italic;\">The sound of softness.</p>" +
      "</div>" +
      
      "<div style=\"padding: 30px; background-color: white; border: 1px solid #eee; border-top: none;\">" +
        "<p style=\"font-size: 16px;\">Hi " + data.name + ",</p>" +
        "<p style=\"line-height: 1.5;\">Thank you for your order! We accepted your request and will start baking soon.</p>" +
        
        // Order Table
        "<table style=\"width: 100%; border-collapse: collapse; margin: 25px 0;\">" +
          "<tr style=\"border-bottom: 1px solid #eee; color: #888; font-size: 12px; text-transform: uppercase;\">" +
            "<td style=\"padding: 10px 0;\">Item</td>" +
            "<td style=\"padding: 10px 0; text-align: right;\">Price</td>" +
          "</tr>" +
          "<tr style=\"border-bottom: 1px solid #eee;\">" +
            "<td style=\"padding: 15px 0;\"><strong>Classic Shokupan</strong><br><span style=\"font-size: 12px; color: #888;\">Qty: " + data.classic + "</span></td>" +
            "<td style=\"padding: 15px 0; text-align: right;\">$" + (data.classic * 14) + "</td>" +
          "</tr>" +
          "<tr style=\"border-bottom: 1px solid #eee;\">" +
            "<td style=\"padding: 15px 0;\"><strong>Specialty Loaf</strong><br><span style=\"font-size: 12px; color: #888;\">Qty: " + data.matcha + "</span></td>" +
            "<td style=\"padding: 15px 0; text-align: right;\">$" + (data.matcha * 18) + "</td>" +
          "</tr>";
          
    if (deliveryFee > 0) {
        htmlBody += "<tr style=\"border-bottom: 1px solid #eee;\">" +
            "<td style=\"padding: 15px 0;\">Local Delivery</td>" +
            "<td style=\"padding: 15px 0; text-align: right;\">$6</td>" +
          "</tr>";
    } else if (data.fulfillment.indexOf("delivery") > -1) {
         htmlBody += "<tr style=\"border-bottom: 1px solid #eee;\">" +
            "<td style=\"padding: 15px 0;\">Local Delivery</td>" +
            "<td style=\"padding: 15px 0; text-align: right; color: #4A6741;\">Free</td>" +
          "</tr>";
    }

    htmlBody += "<tr style=\"border-top: 2px solid #4A6741;\">" +
            "<td style=\"padding: 15px 0; font-size: 18px;\"><strong>Total</strong></td>" +
            "<td style=\"padding: 15px 0; text-align: right; font-size: 18px; color: #4A6741;\"><strong>$" + total + "</strong></td>" +
          "</tr>" +
        "</table>" +

        // Instructions Box
        "<div style=\"background-color: #FDFBF7; padding: 20px; border-radius: 8px; border-left: 4px solid #4A6741;\">" +
          instructions +
        "</div>" +

        "<p style=\"margin-top: 30px; font-size: 12px; color: #888; text-align: center;\">" +
          "Order ID: " + orderId + "<br>" +
          "Questions? Reply to this email.<br>" +
          "Made with ❤️ in Brooklyn." +
        "</p>" +
      "</div>" +
    "</div>";

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    name: "Shokupan Slope Team",
    htmlBody: htmlBody
  });
}
