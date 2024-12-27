function fetchExchangeRatesRawData() {
  const apiKey = "YOUR_API_KEY"; 
  const endpoint = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
  
  
  try {
    const response = UrlFetchApp.fetch(endpoint);
    if (response.getResponseCode() !== 200) {
      throw new Error("API call failed with status code: " + response.getResponseCode());
    }

    const data = JSON.parse(response.getContentText());
    if (data.result !== "success") {
      throw new Error("API call failed: " + data.result);
    }

    const rates = data.conversion_rates;
    const currentDate = new Date().toISOString().split("T")[0]; 
    const lastUpdatedTimestamp = new Date(data.time_last_update_unix * 1000).toISOString();
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = spreadsheet.getActiveSheet(); 
    
    const sheetData = sheet.getDataRange().getValues();
     if (sheetData.length === 1 && sheetData[0].length === 1 && sheetData[0][0] === "") {
      sheet.appendRow(["Date", "Base Currency", "Target Currency", "Conversion Rate", "Last Updated Timestamp"]);
    }
    const baseCurrency='USD'
    for (const [targetCurrency, rate] of Object.entries(rates)) {
      sheet.appendRow([currentDate, baseCurrency, targetCurrency, rate, lastUpdatedTimestamp]);
    }

    return "Raw data successfully fetched and written to the sheet!";
  } catch (error) {
    Logger.log(error);
    return "Error: " + error.message;
  }
}
function fetchExchangeRateHistory() {
  // Replace this with your API key
  const apiKey = "YOUR_API_KEY";
  
  // Base URL for the API
  const baseUrl = "https://v6.exchangerate-api.com/v6/";
  
  // Specify the base currency and end date
  const baseCurrency = "USD";
  const endDate = new Date(2024, 11, 27); // December 27, 2024 (months are 0-indexed)
  const startYear = 2020; // Start fetching data from 2020
  
  // Get the active sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Set headers in the first row
  sheet.getRange("A1:E1").setValues([["Date", "Base Currency", "Target Currency", "Conversion Rate", "Last Updated Timestamp"]]);
  
  let row = 2; // Start populating from the second row
  
  for (let year = startYear; year <= endDate.getFullYear(); year++) {
    for (let month = 1; month <= 12; month++) {
      for (let day = 1; day <= 31; day++) {
        try {
          // Stop fetching data if the date exceeds December 27, 2024
          const currentDate = new Date(year, month - 1, day); // Month is 0-indexed
          if (currentDate > endDate) break;

          // Format month and day as two digits
          const formattedMonth = month.toString().padStart(2, "0");
          const formattedDay = day.toString().padStart(2, "0");
          
          // Build the API URL
          const url = `${baseUrl}${apiKey}/history/${baseCurrency}/${year}/${formattedMonth}/${formattedDay}`;
          
          // Fetch data from the API
          const response = UrlFetchApp.fetch(url);
          const jsonData = JSON.parse(response.getContentText());
          
          // Extract rates and last updated timestamp
          const rates = jsonData.conversion_rates;
          const lastUpdated = jsonData.time_last_update_utc; // Timestamp of the last update
          
          // Populate the sheet with rates
          for (let [currency, rate] of Object.entries(rates)) {
            const formattedDate = `${year}-${formattedMonth}-${formattedDay}`;
            sheet.getRange(row, 1, 1, 5).setValues([[formattedDate, baseCurrency, currency, rate, lastUpdated]]);
            row++;
          }
        } catch (e) {
          Logger.log(`Error fetching data for ${year}-${month}-${day}: ${e.message}`);
          // Skip invalid dates (e.g., February 30)
          continue;
        }
      }
    }
  }

  Logger.log("Data fetching completed!");
}
