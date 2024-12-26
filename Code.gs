function fetchExchangeRatesRawData(baseCurrency='USD') {
  const apiKey = "Your-API-Key"; 
  const endpoint = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`;
  
  
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
    for (const [targetCurrency, rate] of Object.entries(rates)) {
      sheet.appendRow([currentDate, baseCurrency, targetCurrency, rate, lastUpdatedTimestamp]);
    }

    return "Raw data successfully fetched and written to the sheet!";
  } catch (error) {
    Logger.log(error);
    return "Error: " + error.message;
  }
}
