from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json

def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    chrome_options.add_argument("--disable-notifications")
    chrome_options.add_argument("--disable-popup-blocking")
    try:
        driver = webdriver.Chrome(options=chrome_options)
        return driver
    except Exception as e:
        print(f"Error setting up WebDriver: {e}")
        return None

# Added vuln_count parameter to track lab counts per vulnerability
def Get_portswigger_Labs(driver, labs_elements, vuln_name, vuln_count):
    data = []
    try:
        lab_urls = [lab.find_element(By.CSS_SELECTOR, "a").get_attribute("href") for lab in labs_elements]
        for lab_Link in lab_urls:
            try:
                driver.get(lab_Link)
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
                try:
                    lab_Scenario = driver.find_element(By.CSS_SELECTOR, "h1").text.split("Lab: ", 1)[1].strip()
                except:
                    lab_Scenario = "Not found"
                try:
                    elements_between = driver.find_elements(By.XPATH,
                        "//div[@class='container-columns']/following-sibling::*[preceding-sibling::div[@class='container-columns'] and following-sibling::div[@class='container-buttons-left']]")
                    lab_description = '\n'.join(
                        element.text.strip() for element in elements_between if element.tag_name in ['p', 'code']
                    ) or "Description not found"
                except:
                    lab_description = "Error extracting description"
                data.append({"Lab scenario": lab_Scenario, "Lab Description": lab_description, "Vulnerability name": vuln_name})
                vuln_count[vuln_name] = vuln_count.get(vuln_name, 0) + 1  # Increment vulnerability count
            except Exception as e:
                print(f"Error processing lab at {lab_Link}: {e}")
                continue
    except Exception as e:
        print(f"Error retrieving lab links: {e}")
    return data  

# Added vuln_count dictionary to store the count of labs per vulnerability
def scrape_portswigger(driver):
    data = []
    vuln_count = {}
    portswigger_TargetPage = "https://portswigger.net/web-security/all-labs"
    try:
        driver.get(portswigger_TargetPage)
        WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "all-labs")))
        vulnerabilities = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div#all-labs h2")))
        for i, vulnerability in enumerate(vulnerabilities):
            vulnerability = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "div#all-labs h2")))[i]
            vulnerability_name = vulnerability.text.strip()
            following_labs = []
            try:
                next_sibling = vulnerability.find_element(By.XPATH, "following-sibling::*[1]")
                while next_sibling.tag_name != "h2":
                    if "widgetcontainer-lab-link" in next_sibling.get_attribute("class"):
                        following_labs.append(next_sibling)
                    try:
                        next_sibling = next_sibling.find_element(By.XPATH, "following-sibling::*[1]")
                    except:
                        break
            except:
                pass
            labs_data = Get_portswigger_Labs(driver, following_labs, vulnerability_name, vuln_count)  # Pass vuln_count
            data.extend(labs_data)
            driver.get(portswigger_TargetPage)
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "all-labs")))
        # Added summary print for lab counts per vulnerability
        print("\nSummary of Labs per Vulnerability:")
        for vuln, count in vuln_count.items():
            print(f"{vuln}: {count} labs")
    except Exception as e:
        print(f"Error in main scraping process: {e}")
    return data, vuln_count

# Updated main function to receive and store vulnerability count
def main():
    driver = setup_driver()
    if driver is None:
        print("Failed to setup WebDriver")
        return
    try:
        vulnerabilities, vuln_count = scrape_portswigger(driver)
        if vulnerabilities:
            with open('portswigger_vulnerabilities.json', 'w', encoding='utf-8') as f:
                json.dump(vulnerabilities, f, ensure_ascii=False, indent=2)
            print("Data successfully saved to portswigger_vulnerabilities.json")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        try:
            driver.quit()
        except:
            pass

if __name__ == "__main__":
    main()
