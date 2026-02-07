# Shokupan Slope - Backend Setup (Google Apps Script)

We use Google Apps Script to handle both **Waitlist** signups and **Orders** for free.

## Step 1: Prepare the Google Sheet
1.  Create a new Google Sheet named "Shokupan Slope Data".
2.  **Tab 1 Name**: `Waitlist`
    - Header Row: `Date`, `Email`
3.  **Tab 2 Name**: `Orders`
    - Header Row: `Date`, `Order ID`, `Name`, `Email`, `Phone`, `Classic Qty`, `Matcha Qty`, `Fulfillment`, `Notes`

## Step 2: Add the Script
1.  **Extensions** > **Apps Script**.
2.  Paste this code (fully replaces any previous code):

```javascript
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
      
      sheet.appendRow([timestamp, orderId, data.name, data.email, data.phone, data.classic, data.matcha, data.fulfillment, data.notes]);
      
      // Admin Alert
      MailApp.sendEmail({
        to: EMAIL_RECIPIENT,
        subject: "🍞 Order " + orderId + " (" + data.name + ")",
        htmlBody: "New Order: <b>" + orderId + "</b><br>Customer: " + data.name + "<br>Items: " + data.classic + " Classic, " + data.matcha + " Matcha<br>Method: " + data.fulfillment
      });

      // Customer Email
      if (data.email) {
         sendCustomerEmail(data, orderId);
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

function sendCustomerEmail(data, orderId) {
  var subject = "Order Confirmed: " + orderId;
  var total = (data.classic * 14) + (data.matcha * 18);
  
  // Dynamic Instructions based on method
  var instructions = "";
  
  if (data.fulfillment.indexOf("pickup") > -1) {
     var day = data.fulfillment.indexOf("tue") > -1 ? "Tuesday" : "Sunday";
     instructions = 
       "<h3>Next Steps:</h3>" +
       "<p>Please pick up your order on <strong>" + day + " between 9am - 2pm</strong>.</p>" +
       "<p><strong>Address:</strong> 123 7th Ave, Brooklyn (South Slope)</p>" +
       "<p><em>Payment: Cash or Venmo upon arrival.</em></p>";
  } else {
     instructions = 
       "<h3>Next Steps:</h3>" +
       "<p>We will deliver your order this <strong>Saturday</strong>.</p>" +
       "<p>We'll text you an ETA on the morning of delivery.</p>" +
       "<p><em>Payment: Cash or Venmo at the door.</em></p>";
      if (total < 42) total += " + $6 Shipping";
  }

  // HTML Template (Concatenated strings for safety)
  var htmlBody = 
    "<div style=\"font-family: 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #333;\">" +
      "<div style=\"background-color: #C27829; padding: 20px; text-align: center; color: white; border-radius: 8px 8px 0 0;\">" +
        "<h1 style=\"margin: 0; font-family: 'Georgia', serif;\">Shokupan Slope</h1>" +
      "</div>" +
      
      "<div style=\"padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px;\">" +
        "<p>Hi " + data.name + ",</p>" +
        "<p>Thank you for your order! We accepted your request and will start baking soon.</p>" +
        
        "<table style=\"width: 100%; border-collapse: collapse; margin: 20px 0;\">" +
          "<tr style=\"border-bottom: 1px solid #eee;\">" +
            "<td style=\"padding: 10px 0;\"><strong>Order ID</strong></td>" +
            "<td style=\"padding: 10px 0; text-align: right;\">" + orderId + "</td>" +
          "</tr>" +
          "<tr style=\"border-bottom: 1px solid #eee;\">" +
            "<td style=\"padding: 10px 0;\">Classic Shokupan</td>" +
            "<td style=\"padding: 10px 0; text-align: right;\">" + data.classic + " x $14</td>" +
          "</tr>" +
          "<tr style=\"border-bottom: 1px solid #eee;\">" +
            "<td style=\"padding: 10px 0;\">Matcha Swirl</td>" +
            "<td style=\"padding: 10px 0; text-align: right;\">" + data.matcha + " x $18</td>" +
          "</tr>" +
          "<tr style=\"border-bottom: 2px solid #C27829;\">" +
            "<td style=\"padding: 10px 0;\"><strong>Estimated Total</strong></td>" +
            "<td style=\"padding: 10px 0; text-align: right;\"><strong>$" + total + "</strong></td>" +
          "</tr>" +
        "</table>" +

        "<div style=\"background-color: #FDFBF7; padding: 15px; border-radius: 4px; border-left: 4px solid #C27829;\">" +
          instructions +
        "</div>" +

        "<p style=\"margin-top: 30px; font-size: 12px; color: #888; text-align: center;\">" +
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



// --- MANUAL TEST FUNCTION ---
// 1. Select 'testSystem' from the dropdown at the top.
// 2. Click 'Run'.
// 3. View the logs (CRTL + Enter) to see if it works.
function testSystem() {
  Logger.log("1. Starting System Test...");
  
  try {
    var doc = SpreadsheetApp.getActiveSpreadsheet();
    if (!doc) throw new Error("Could not find Spreadsheet. Are you running this INSIDE the Sheet's Apps Script?");
    Logger.log("2. Spreadsheet found: " + doc.getName());
    
    var sheet = doc.getSheetByName("Orders");
    if (!sheet) throw new Error("Could not find tab 'Orders'. Check capitalization!");
    Logger.log("3. 'Orders' tab found.");
    
    var sheet2 = doc.getSheetByName("Waitlist");
    if (!sheet2) throw new Error("Could not find tab 'Waitlist'. Check capitalization!");
    Logger.log("4. 'Waitlist' tab found.");
    
    var quota = MailApp.getRemainingDailyQuota();
    Logger.log("5. Email Quota remaining: " + quota);
    
    MailApp.sendEmail({
      to: EMAIL_RECIPIENT,
      subject: "✅ Shokupan System Test",
      body: "If you see this, email is working!"
    });
    Logger.log("6. Test Email Sent.");
    
    Logger.log("SUCCESS! All systems go. The issue is likely the 'postData' or the Web App Event itself.");
    
  } catch (e) {
    Logger.log("❌ FAILURE: " + e.toString());
  }
}
```

## Step 3: Deploy
1.  **Deploy** > **Manage Deployments**.
2.  Edit the existing deployment -> **New Version**.
3.  **Deploy**.
