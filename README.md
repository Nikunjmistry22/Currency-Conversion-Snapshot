# Currency-Conversion-Snapshot

This project fetches the snapshot of the exchange rates for a specified base currency, logs them into a Google Sheet, and provides a historical record of the exchange rates for different target currencies. The script pulls the data from the **ExchangeRate-API** and is scheduled to execute at regular intervals (.i.e.  once per day ).

## Features
- Fetches exchange rates for multiple target currencies.
- Logs the data into a Google Sheet, including the following details:
  - Date
  - Base Currency
  - Target Currency
  - Conversion Rate
  - Last Updated Timestamp
- Automatically appends new exchange rate data to the sheet.
- Option to add headers if no data exists.

## Prerequisites
1. A **Google Sheets** account.
2. An active **ExchangeRate-API** account and API key (you can obtain this from [ExchangeRate-API](https://www.exchangerate-api.com/)).
3. Google Apps Script enabled in your Google Sheets.

## Setup Instructions

### Step 1: Get an API Key
1. Go to [ExchangeRate-API](https://www.exchangerate-api.com/).
2. Sign up for a free account.
3. Obtain your **API key**.

### Step 2: Create the Google Sheet
1. Create a new **Google Sheet** where you want to store the exchange rate data.
2. Name the sheet as desired (e.g., "Exchange Rates").

### Step 3: Set Up the Google Apps Script
1. Open the Google Sheet where you want to log the exchange rates.
2. Go to **Extensions** > **Apps Script**.
3. Delete any default code, and paste the provided code into the script editor.
4. Replace `"YOUR_API_KEY"` in the script with your actual **API key** from **ExchangeRate-API**.
5. Save the script.

### Step 4: Set Up Triggers
If you want the script to run at specific intervals:
1. Click the **clock icon** in the Apps Script editor to open the **Triggers** panel.
2. Click on **+ Add Trigger**.
3. Set the function to **`fetchExchangeRatesRawData`** (or the name of your function).
4. Choose **Time-driven** for the event source.
5. Select the frequency you prefer (e.g., daily).
6. Save the trigger.

### Step 5: Authorize the Script
1. The first time you run the script, Google will ask for permission to access your Google Sheets and the internet.
2. Click **Review Permissions**, choose your Google account, and click **Allow**.

### Step 6: Test the Script
1. Run the script manually by clicking the **Run** button in the Apps Script editor.
2. Check your Google Sheet to see if the data is logged correctly.

## Data Format in Google Sheet

The script will log the following data into the Google Sheet:

| Date       | Base Currency | Target Currency | Conversion Rate | Last Updated Timestamp |
|------------|---------------|-----------------|-----------------|------------------------|
| 2024-12-26 | USD           | EUR             | 0.92            | 2024-12-26T14:00:00Z   |
| 2024-12-26 | USD           | GBP             | 0.75            | 2024-12-26T14:00:00Z   |

- **Date**: The current date when the exchange rate is fetched.
- **Base Currency**: The currency from which the conversion is made (e.g., USD).
- **Target Currency**: The currency to which the conversion is made (e.g., EUR).
- **Conversion Rate**: The rate of conversion between the base and target currencies.
- **Last Updated Timestamp**: The time when the exchange rate was last updated.

