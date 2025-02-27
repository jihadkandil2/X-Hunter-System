from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import json
import time
import requests

def setup_driver():
    # Set up Chrome options
    chrome_options = Options()
    
    chrome_options.add_argument("--start-maximized")  # Start maximized
    chrome_options.add_argument("--disable-notifications")  # Disable notifications
    chrome_options.add_argument("--disable-popup-blocking")  # Disable popup blocking 
    
    try:
        # Initialize the Chrome WebDriver with options
        driver = webdriver.Chrome(options=chrome_options)
        return driver
    except Exception as e:
        print(f"Error setting up WebDriver: {e}")
        return None


def Get_portswigger_Labs(driver, labs_elements):
    data = []
    lab_count = 0  # Initialize lab counter
    try:
        #[6] Store all URLs first to avoid stale element issues 
        lab_urls = []
        for lab in labs_elements:
            try:
                lab_link = lab.find_element(By.CSS_SELECTOR, "a").get_attribute("href")
                lab_urls.append(lab_link)

            except Exception as e:
                print("Could not retrieve lab link:", e)

    
        #[7]- loop on al links get data inside it [description , scenario]
        for lab_Link in lab_urls:
            try:
                #[8]- Navigate to lab page
                driver.get(lab_Link)

                #[9]- Wait for page load with explicit wait
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.TAG_NAME, "body"))   #untill  all body loaded 
                )
                
                #[10]- Get lab Scenario (text after "Lab: ")
                try:
                    lab_Scenario_element = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "h1"))
                    )
                    # Extract the text after "Lab: "
                    lab_Scenario = lab_Scenario_element.text.split("Lab: ", 1)[1].strip() #take second part which is my scenario 
                except Exception as e:
                    lab_Scenario = "Not found"
                    print(f"Could not find lab title: {e}")
                
                #[11]- Get lab description (combining all p and code elements which is between container-columns and the div with class container-buttons-left)
                try:
                    # Define a default value for lab_description
                    lab_description = "Description not available"

                    # Extract elements between container-columns and container-buttons-left
                    elements_between = driver.find_elements(
                        By.XPATH,
                        "//div[@class='container-columns']/following-sibling::*[preceding-sibling::div[@class='container-columns'] and following-sibling::div[@class='container-buttons-left']]"
                    )

                    # Filter <p> and <code> elements
                    lab_description = '\n'.join(
                        element.text.strip()
                        for element in elements_between
                        if element.tag_name in ['p', 'code']
                    )

                    if not lab_description.strip():
                        lab_description = "Description not found"
                except Exception as e:
                    lab_description = "Error extracting description"
                    print(f"Description extraction error: {e}")

                # Add the data
                data.append({
                    "Lab scenario": lab_Scenario,
                    "Lab Description": lab_description
                })
                lab_count += 1  # Increment counter for each lab scraped
                
            except Exception as e:
                print(f"Error processing lab at {lab_Link}: {e}")
                continue
                
    except Exception as e:
        print(f"Error retrieving lab links: {e}")
    print(f"Total number of labs scraped: {lab_count}")  # Print the total count
    return data  

def scrape_portswigger(driver):
    data = []
    
    # [1]- Get link of portswigger
    portswigger_TargetPage = "https://portswigger.net/web-security/all-labs"
    
    try:
        #[2]- Initial page load get page
        driver.get(portswigger_TargetPage)
        
        #[3]- Wait for the main content to load
        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.ID, "all-labs"))
        )
        
        #[3.1] Locate the main section with vulnerabilities
        vulnerabilities = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div#all-labs h2"))
        )
        
        
        #[4]- get labs associated with each vulnerability
        for i, vulnerability in enumerate(vulnerabilities):
            # Dynamically locate vulnerability element by re-fetching it
            vulnerability = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div#all-labs h2"))
            )[i]  # Re-fetch by index
            
            vulnerability_name = vulnerability.text.strip()
            #[4.1]- Use XPath to find all subsequent lab divs until the next <h2> or end
            following_labs = []
            next_sibling = vulnerability.find_element(By.XPATH, "following-sibling::*[1]") #to find direct next siblings which is [class="widgetcontainer-lab-link is-solved"]
            
            
            # Collect all lab divs that come after this <h2> and before the next <h2> [output of this loop list of related labs of specific vuln]
            while next_sibling.tag_name != "h2":
                if "widgetcontainer-lab-link" in next_sibling.get_attribute("class"):
                    following_labs.append(next_sibling)
                try:
                    next_sibling = next_sibling.find_element(By.XPATH, "following-sibling::*[1]")
                except:
                    break

            #[5-12] Get labs only associated with this vulnerability
            labs_data = Get_portswigger_Labs(driver, following_labs)
            
            #[13]- Add vulnerability name to each lab entry
            for lab in labs_data:
                lab["Vulnerability name"] = vulnerability_name
                data.append(lab)
            
            # Return to main page and wait for content to load
            driver.get(portswigger_TargetPage)
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.ID, "all-labs"))
            )
            #refresh vulnerability list
            vulnerabilities = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div#all-labs h2"))
            )
            for item in data:
                print("Lab Scenario:", item.get("Lab scenario", "N/A"))
                print("Lab Description:", item.get("Lab Description", "N/A"))
                print("Vulnerability Name:", item.get("Vulnerability name", "N/A"))
                print("-" * 30)  # Separator for readability    
            

    except Exception as e:
        print(f"Error in main scraping process: {e}")
            
    return data

         

def main():
    # Setup driver
    driver = setup_driver()
    
    if driver is None:
        print("Failed to setup WebDriver")
        return
    
    try:
        # Scrape data
        vulnerabilities = scrape_portswigger(driver)  # Replace with function to scrape PortSwigger site
        
        if vulnerabilities is not None:
            # Save to JSON file
            with open('portswigger_vulnerabilities2.json', 'w', encoding='utf-8') as f:
                json.dump(vulnerabilities, f, ensure_ascii=False, indent=2)
            print("Data successfully saved to portswigger_vulnerabilities.json")
        
    except Exception as e:
        print(f"An error occurred: {e}")
    
    finally:
        # Always close the driver
        try:
            driver.quit()
        except:
            pass

if __name__ == "__main__":
    main()