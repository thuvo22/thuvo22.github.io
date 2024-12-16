console.log("WHATUPPPPPPPPP");

let svgTagValue = `Add Tag`;
let svgValue = `Estimate Price`;

function attachAutocompleteToElement(querySelector) {
    console.log("loaded buddy!");
    let inputElement = document.querySelector(querySelector);
    if (inputElement) {
        let autocomplete = new google.maps.places.Autocomplete(inputElement, { types: ['geocode'] });
        autocomplete.setFields(['address_components']);

        autocomplete.addListener('place_changed', function () {
            let place = autocomplete.getPlace();

            let streetNumber = '';
            let streetName = '';
            let city = '';
            let state = '';
            let zipcode = '';

            for (let i = 0; i < place.address_components.length; i++) {
                let component = place.address_components[i];
                switch (component.types[0]) {
                    case 'street_number':
                        streetNumber = component.long_name;
                        break;
                    case 'route':
                        streetName = component.long_name;
                        break;
                    case 'locality':
                        city = component.long_name;
                        break;
                    case 'administrative_area_level_1':
                        state = component.short_name;
                        break;
                    case 'postal_code':
                        zipcode = component.long_name;
                        break;
                }
            }

            document.querySelector('input[name="contact.address1"]').value = streetNumber + ' ' + streetName;
            document.querySelector('input[name="contact.city"]').value = city;
            document.querySelector('input[name="contact.state"]').value = state;
            document.querySelector('input[name="contact.postal_code"]').value = zipcode;

            // Dispatch 'input' events to ensure other listeners pick up the changes
            document.querySelector('input[name="contact.address1"]').dispatchEvent(new Event('input'));
            document.querySelector('input[name="contact.city"]').dispatchEvent(new Event('input'));
            document.querySelector('input[name="contact.state"]').dispatchEvent(new Event('input'));
            document.querySelector('input[name="contact.postal_code"]').dispatchEvent(new Event('input'));
        });
    } else {
        console.error("Element with ID " + querySelector + " not found.");
    }
}

function tryAttachAutocomplete(querySelector, retries = 3) {
    if (retries <= 0) {
        console.error("Failed to attach autocomplete after 3 attempts.");
        return;
    }

    let inputElement = document.querySelector(querySelector);
    if (inputElement) {
        attachAutocompleteToElement(querySelector);
    } else {
        console.warn(`Attempt failed. Retrying in 4000ms. Retries left: ${retries - 1}`);
        setTimeout(() => {
            tryAttachAutocomplete(querySelector, retries - 1);
        }, 4000);
    }
}

let querySelector = 'input[name="contact.address1"]';
tryAttachAutocomplete(querySelector, 6);



// this part keeps track of route changes so we can reattach the autocomplete to the address field
let currentURL = window.location.href;

setInterval(function () {
    if (currentURL !== window.location.href) {
        let querySelector = 'input[name="contact.address1"]';
        tryAttachAutocomplete(querySelector, 6);
        currentURL = window.location.href;
    }
}, 100); // Check every 100ms

console.log('routechange2.js loaded!');

function simulateTyping(inputSelector, text) {
    let inputField = document.querySelector(inputSelector);

    if (inputField) {
        // Set the value of the input field
        inputField.value = text;

        // Trigger 'input' event to mimic typing
        let inputEvent = new Event('input', { bubbles: true, cancelable: true });
        inputField.dispatchEvent(inputEvent);

        // Trigger 'keyup' event to mimic key release
        let keyupEvent = new KeyboardEvent('keyup', {
            key: text[text.length - 1], // Last character of the text
            keyCode: text.charCodeAt(text.length - 1),
            bubbles: true,
            cancelable: true,
        });
        inputField.dispatchEvent(keyupEvent);

        console.log(`Simulated typing: "${text}"`);
    } else {
        console.error("Input field not found!");
    }
}

function waitForDropdown(selector, callback) {
    let inputField = document.querySelector(selector);
    if (inputField) {
        callback(inputField);
    } else {
        setTimeout(() => waitForDropdown(selector, callback), 100); // Retry until available
    }
}
// Function to create and add a button on top of a target element
function addButtonAddTagAboveElement(containerSelector) {
    console.log("Attempting to add addButtonAddTagAboveElement!");

    let containerElement = document.querySelector(containerSelector);

    if (containerElement) {
        // Check if the button already exists
        let existingButton = containerElement.parentNode.querySelector('.custom-button-add-tag');
        if (!existingButton) {
            // Create a new button element if it doesn't exist
            let newButton = document.createElement('button');
            newButton.innerHTML = `
            <img src="https://storage.googleapis.com/msgsndr/UEW8ayn3dNsZG78pPsZw/media/675b8ee3299a3dd3d1006a2b.png" 
                 alt="Rocket" 
                 class="rocket-icon" 
                 style="width: 24px; height: 24px; display: inline-block;">
            <strong>Add Tag</strong>
        `; // Add SVG icon before the text
            newButton.className = 'custom-button-add-tag'; // Add the custom class

            // Add the click event listener to open the popup
            newButton.addEventListener('click', function () {
                // Add text to the input field
                let inputField = document.querySelector('.tag-input .relative input[type=text]');
                let dropdown = document.querySelector('.hl_contact-details-left .tag-group .tag-options');

                if (inputField) {
                    inputField.focus();
                    console.log("inputField:  ", inputField);
                    setTimeout(() => {
                        const tagText = "Whateverrrrr";
                        inputField.value = tagText;
                        console.log("Input value set to:", inputField.value);
                        let inputEvent = new Event('input', { bubbles: true, cancelable: true });
                        inputField.dispatchEvent(inputEvent);

                        // Dispatch a 'keyup' event for the last character
                        let keyupEvent = new KeyboardEvent('keyup', {
                            key: 'r', // Example: Last character of the input
                            keyCode: 'r'.charCodeAt(0),
                            code: 'KeyR',
                            bubbles: true,
                            cancelable: true,
                        });
                        inputField.dispatchEvent(keyupEvent);
                        // Ensure dropdown is visible
                        let waitForDropdown = setInterval(() => {
                            let dropdown = document.querySelector('.hl_contact-details-left .tag-group .tag-options');
                            if (dropdown && getComputedStyle(dropdown).display !== 'none') {
                                clearInterval(waitForDropdown); // Stop checking

                                console.log("Dropdown is visible. Attempting to click .add-new a...");

                                let addNewLink = dropdown.querySelector('.add-new a');
                                if (addNewLink) {
                                    addNewLink.click(); // Simulate clicking the link
                                    console.log("Clicked on .add-new a:", addNewLink.textContent);
                                } else {
                                    console.error(".add-new a link not found in the dropdown.");
                                }
                            } else {
                                console.log("Waiting for dropdown to appear...");
                            }
                        }, 100); // Check every 100ms
                        console.log("Dropdown logic triggered programmatically.");
                        // Dispatch the 'keydown' event for Enter
                        let enterEvent = new KeyboardEvent('keydown', {
                            key: "Enter",
                            keyCode: 13,
                            code: "Enter",
                            bubbles: true,
                            cancelable: true,
                        });
                        inputField.dispatchEvent(enterEvent);

                        console.log(`Simulated tag addition: "${tagText}"`);
                    }, 100); // Adjust delay as needed
                } else {
                    console.error("Input field not found!");
                }
            });

            // Insert the button as the previous sibling of the container element
            containerElement.parentNode.insertBefore(newButton, containerElement);
            console.log("Button added successfully!");
        } else {
            //console.log("Button already exists, not adding another.");
        }
    } else {
        console.error("Element with selector " + containerSelector + " not found.");
    }
}
// Function to create and add a button on top of a target element
function addButtonAboveElement(containerSelector) {
    //console.log("Attempting to add button!");

    let containerElement = document.querySelector(containerSelector);

    if (containerElement) {
        // Check if the button already exists
        let existingButton = containerElement.parentNode.querySelector('.custom-button-estimate');
        if (!existingButton) {
            // Create a new button
            let newButton = document.createElement('button');
            newButton.innerHTML = svgValue;
            newButton.className = 'custom-button-estimate';

            // Add click event
            newButton.addEventListener('click', function () {
                window.open('https://api.leadconnectorhq.com/widget/form/CZ3h71NsWEKSQHUokwI4', 'popupWindow', 'width=600,height=600,scrollbars=yes');
            });

            // Style the button to position it absolutely
            newButton.style.position = 'absolute';
            newButton.style.top = '10px'; // Adjust as needed
            newButton.style.left = '10px'; // Adjust as needed
            newButton.style.zIndex = '1000'; // Ensure it is above other elements

            // Append it directly to the parent element
            containerElement.parentNode.appendChild(newButton);
        } else {
            //console.log("Button already exists, not adding another.");
        }
    } else {
        console.error("Element with selector " + containerSelector + " not found.");
    }
}
function getFirstPhoneNumber() {
    // Find all elements with the Phone label
    const phoneContainers = Array.from(
        document.querySelectorAll('div.flex.items-center.justify-between')
    );

    for (const container of phoneContainers) {
        // Check if this container has a Phone label
        const label = container.querySelector('div.text-sm.font-normal.text-gray-500');
        if (label && label.textContent.trim() === 'Phone') {
            // Find the phone number within this container
            const phoneSpan = container.parentElement.querySelector(
                'span.truncate.text-sm.font-normal.text-gray-600'
            );

            if (phoneSpan) {
                return phoneSpan.textContent.trim(); // Return the phone number
            }
        }
    }

    console.warn("No phone number found.");
    return null; // Return null if no phone number is found
}

let isPanelOpen = false;
let slidingPanel;
function addSlidingButtonAboveElement(containerSelector) {
    console.log("Inside addSlidingButtonAboveElement");

    let containerElement = document.querySelector(containerSelector);

    if (containerElement) {
        // Check if the button already exists
        let existingButton = containerElement.parentNode.querySelector('.sliding-button');
        if (!existingButton) {
            // Create a new button
            let newButton = document.createElement('button');
            newButton.innerHTML = `
                <img src="https://storage.googleapis.com/msgsndr/UEW8ayn3dNsZG78pPsZw/media/675b8ee3299a3dd3d1006a2b.png" 
                     alt="Rocket" 
                     class="rocket-icon" 
                     style="width: 24px; height: 24px; display: inline-block;">
                <strong>Dispo Master</strong>
            `;
            newButton.className = 'sliding-button';

            // Add styles for spinning icon
            const style = document.createElement("style");
            style.textContent = `
                .rocket-icon.spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }
            `;
            document.head.appendChild(style);

            // Add click event for sliding panel
            newButton.addEventListener('click', function () {
                const rocketIcon = newButton.querySelector('.rocket-icon');

                // Add spin animation
                rocketIcon.classList.add('spin');

                // Simulate a result fetch
                setTimeout(() => {
                    // Stop spinning after the result is fetched
                    rocketIcon.classList.remove('spin');

                    // Toggle the sliding panel
                    if (!slidingPanel) {
                        slidingPanel = createSlidingPanel();
                        isPanelOpen = true;
                        slidingPanel.style.transform = 'translateX(0)';
                    } else {
                        if (isPanelOpen) {
                            slidingPanel.style.transform = 'translateX(100%)';
                            isPanelOpen = false;
                        } else {
                            slidingPanel.style.transform = 'translateX(0)';
                            isPanelOpen = true;
                        }
                    }
                }, 2000); // Simulate a 2-second wait
            });

            // Append the button to the parent element
            containerElement.parentNode.appendChild(newButton);
        } else {
            console.log("Button already exists, not adding another.");
        }
    } else {
        console.error("Element with selector " + containerSelector + " not found.");
    }
}



function createSlidingPanel() {
    //console.log("======> inside createSlidingPanel");
    // Create sliding panel
    const slidingPanel = document.createElement('div');
    slidingPanel.className = 'sliding-panel';
    slidingPanel.style.transform = 'translateX(100%)'; // Initially hidden

    slidingPanel.innerHTML = `
<div class="panel-header">
    <h2>Buy Box</h2>
    <button id="closePanel">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM6.854 4.146a.5.5 0 0 0-.708.708L7.293 6.5 4.146 9.646a.5.5 0 0 0 .708.708L8 7.707l3.146 3.147a.5.5 0 0 0 .708-.708L8.707 6.5l2.147-2.146a.5.5 0 0 0-.708-.708L8 5.793 6.854 4.146z"/>
        </svg>
    </button>
</div>
<div class="panel-tabs">
    <button class="tab active">Buy Box</button>
    <button class="tab">Additional Information</button>
</div>
<div class="panel-content">
    <div class="toggle-section">
        <label>Buy Box <div class="toggle"><input type="checkbox" checked /><span class="slider"></span></div></label>
        <label>Blacklist <div class="toggle"><input type="checkbox" /><span class="slider"></span></div></label>
        <label>Active Buyer <div class="toggle"><input type="checkbox" checked /><span class="slider"></span></div></label>
    </div>
    <button class="vip-button">Upgrade to VIP Buyer</button>
    <div class="criteria-section">
        <label>Strict Criteria</label>
        <select>
            <option value="">Select Value(s)</option>
        </select>
        <label>Location Preferences</label>
        <input type="text" placeholder="Enter location(s)" />
    </div>
    <div class="county-list">
        <table>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Restricted</th>
                    <th>Type</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Duval County (FL)</td>
                    <td><div class="toggle"><input type="checkbox" /><span class="slider"></span></div></td>
                    <td>County</td>
                    <td><button class="trash-btn">🗑</button></td>
                </tr>
                <tr>
                    <td>Nassau County (FL)</td>
                    <td><div class="toggle"><input type="checkbox" /><span class="slider"></span></div></td>
                    <td>County</td>
                    <td><button class="trash-btn">🗑</button></td>
                </tr>
                <!-- Add other rows similarly -->
            </tbody>
        </table>
    </div>
</div>
`;


    document.body.appendChild(slidingPanel);
    document.getElementById('closePanel').addEventListener('click', function () {
        console.log("Close button got clicked")
        slidingPanel.style.transform = 'translateX(100%)';
        isPanelOpen = false;
    });

    return slidingPanel; // Return the created panel
}

// Retry function to try attaching the button multiple times if the element isn't available yet
function tryAddButtonAbove(selector, retries = 3) {
    if (retries <= 0) {
        console.error("Failed to add button after 3 attempts.");
        return;
    }

    let containerElement = document.querySelector(selector);

    if (containerElement) {
        addSlidingButtonAboveElement(selector);
        //addButtonAboveElement(selector);
        //addButtonAddTagAboveElement(selector);
    } else {
        console.warn(`Attempt failed. Retrying in 4000ms. Retries left: ${retries - 1}`);
        setTimeout(() => {
            tryAddButtonAbove(selector, retries - 1);
        }, 4000);
    }
}

// Use the correct query selector for the div where the button will be placed above
let containerSelector = '#contact-details';
let convoSelector = '#central-panel-header';
let contact_justify_center = '.hl_conversations--message .hl_conversations--message-header-new .justify-between';
// Check if #contact-details exists
setInterval(() => {
    if (document.querySelector(containerSelector)) {
        //console.log("IN CONTACT LINK");
        tryAddButtonAbove(contact_justify_center, 6);
    } else {
        // Check if #central-panel-header exists
        //console.log("IN CONVO LINK");
        // Select all button elements
        tryAddButtonAbove(convoSelector, 6);
        console.warn(`${containerSelector} does not exist.`);
    }
}, 1000);

// This part keeps track of route changes and re-adds the button if the URL changes
let currentURL3 = window.location.href;


console.log('addButton.js loaded!');
console.log("--------->>>>>");
