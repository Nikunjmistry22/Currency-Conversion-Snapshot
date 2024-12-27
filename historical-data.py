import csv
import requests
from datetime import datetime, timedelta

def fetch_exchange_rate_history(api_key, base_currency, start_year, end_date, output_file):
    base_url = "https://v6.exchangerate-api.com/v6/"    
    with open(output_file, mode="w", newline="", encoding="utf-8") as csv_file:
        writer = csv.writer(csv_file)
        
        writer.writerow(["Date", "Base Currency", "Target Currency", "Conversion Rate", "Last Updated Timestamp"])
        
        current_date = datetime(start_year, 1, 1)
        while current_date <= end_date:
            try:
                formatted_date = current_date.strftime("%Y/%m/%d")
                formatted_output_date = current_date.strftime("%Y-%m-%d")
                
                url = f"{base_url}{api_key}/history/{base_currency}/{formatted_date}"
                response = requests.get(url)
                response.raise_for_status()
                json_data = response.json()
                
                rates = json_data.get("conversion_rates", {})
                last_updated = json_data.get("time_last_update_utc", "")
                
                for target_currency, rate in rates.items():
                    writer.writerow([formatted_output_date, base_currency, target_currency, rate, last_updated])
            
            except Exception as e:
                print(f"Error fetching data for {formatted_output_date}: {e}")
            
            current_date += timedelta(days=1)
    print("Data fetching completed!")

# Parameters
api_key = "Your-API-Key"  
base_currency = "USD"
start_year = 2020 
''' 
Enter the year from when you want historical data 
Note: This is a pro plan So use accordingly
'''
end_date = datetime(2024, 12, 26)  
output_file = "exchange_rate_history.csv"

fetch_exchange_rate_history(api_key, base_currency, start_year, end_date, output_file)
