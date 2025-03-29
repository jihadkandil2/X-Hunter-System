from httpx import TimeoutException
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import sys

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

def get_difficulty_level(element):
    class_name = element.get_attribute("class")
    #DEPUG
    #print(f"Debug - Class Name: {class_name}")  # Verify this output
    
    if "label-light-green-small" in class_name: 
        return "Easy"
    elif "label-light-blue-small" in class_name: 
        return "Medium"
    elif "label-purple-small" in class_name: 
        return "Hard"
    return "Unknown difficulty"
def extract_solution_content(driver):
    #DEPUG
    # driver.get("https://portswigger.net/web-security/cross-site-scripting/dom-based/lab-dom-xss-reflected")
    try:
        # XPath that:
        # 1) Finds a div with classes "component-solution expandable-container"
        # 2) Looks inside for a <details> that has a <h4> containing the text "Solution"
        # 3) Then finds the nested <div class="content"> <div> block
        xpath_expr = (
            "//div[contains(@class, 'component-solution') "
            "and contains(@class, 'expandable-container')]"
            "//details[.//h4[contains(., 'Solution')]]"
            "//div[@class='content']/div"
        )

        content_div = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH, xpath_expr))
        )

        # Grab the raw text from the container
        full_text = driver.execute_script(
            "return arguments[0].textContent;", 
            content_div 
        )
        #DEPUG
        # print(full_text)


        # Split into lines and strip out empty ones
        lines = [line.strip() for line in full_text.split("\n") if line.strip()]
        #DEPUG
        # print(f"lines: %s" % lines)
        # driver.close()


        # Number each line and create the final list of steps
        steps = [f"{i+1}.{line}" for i, line in enumerate(lines)]

        # DEPUG
        # print("Extracted Steps:")
        # for s in steps:
        #     print(s)

        return steps if steps else ["No solution steps found in the lab"]

    except Exception as e:
        print(f"Error: {str(e)}")
        return ["Content extraction failed"]


        
def Get_portswigger_Labs(driver, labs_elements, vuln_name, vuln_count):
    data = []
    try:
        lab_urls = [lab.find_element(By.CSS_SELECTOR, "a").get_attribute("href") for lab in labs_elements]
        for lab_Link in lab_urls:
            try:
                driver.get(lab_Link)
                WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.TAG_NAME, "body")))
                
                # Extract lab scenario:-
                #----------------------
                try:
                    lab_Scenario = driver.find_element(By.CSS_SELECTOR, "h1").text.split("Lab: ", 1)[1].strip()
                except:
                    lab_Scenario = "Not found"
                
                # Extract difficulty level:(done)
                #--------------------------------
                try:
                    # First try the direct class match (most specific)
                    level_element = WebDriverWait(driver, 20).until(
                        EC.presence_of_element_located((
                            By.CSS_SELECTOR, 
                            "span.label-light-green-small, span.label-light-blue-small, span.label-purple-small"
                        ))
                    )
                    #DEPUG
                    #print(f"Found via direct class. Text: {level_element.text}")
                    # Success case
                    lab_level = get_difficulty_level(level_element)
                    #DEPUG
                    #print(f"Extracted difficulty: {lab_level}")
                except Exception as e:
                    #print(f"Difficulty level error: {e}")
                    lab_level = "Unknown difficulty"
                
                # Extract solution steps:(done)
                #------------------------------
                solution_steps = extract_solution_content(driver)
                
                # Extract description:
                #----------------------
                try:
                    elements_between = driver.find_elements(By.XPATH,
                        "//div[@class='container-columns']/following-sibling::*[preceding-sibling::div[@class='container-columns'] and following-sibling::div[@class='container-buttons-left']]")
                    lab_description = '\n'.join(
                        element.text.strip() for element in elements_between if element.tag_name in ['p', 'code']
                    ) or "Description not found"
                except:
                    lab_description = "Error extracting description"
                
                ######################################################################################################################################################
                lab_data = {
                    "Lab scenario": lab_Scenario,
                    "Lab Description": lab_description,
                    "Difficulty Level": lab_level,
                    "Solution Steps": solution_steps,
                    "Vulnerability name": vuln_name
                }
                #DEPUG
                # print ("================================")
                # print(lab_data[0].description)
                # print(lab_data[0].solution_steps)
                # print(lab_data[0].vulnerability_name)
                # print(lab_data[0].difficulty_level)
                # print(lab_data[0].lab_scenario)
                # print ("================================")
                # # Print immediately after collection
                # print("\n" + "="*50)
                # print(f"DEBUG - Lab Data for: {lab_Link}")
                # print(json.dumps(lab_data, indent=2, ensure_ascii=False))
                # print("="*50 + "\n")
                
                data.append(lab_data)
                vuln_count[vuln_name] = vuln_count.get(vuln_name, 0) + 1
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
            with open('portswigger_vulnerabilities_Level3.json', 'w', encoding='utf-8') as f:
                json.dump(vulnerabilities, f, ensure_ascii=False, indent=2)
            print("Data successfully saved to portswigger_vulnerabilities_Level3.json")
    except Exception as e:
        print(f"An error occurred: {e}")
    finally:
        try:
            driver.quit()
        except:
            pass

if __name__ == "__main__":
    main()
