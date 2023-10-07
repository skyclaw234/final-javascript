async function myFunction() {
    let cart = [];

    // Get references to the cart list and total price elements
    const cartList = document.getElementById("cart-list");
    const totalPriceElement = document.getElementById("total-price");
    const taxesElement = document.getElementById("taxes");
    const shippingElement = document.getElementById("shipping");
    const subtotalList = document.getElementById("subtotal-list"); // Add this line

    // Define tax rate and initial shipping cost
    const taxRate = 0.08; // 8% sales tax (adjust as needed)
    let shippingCost = 5.00; // Initial shipping cost (adjust as needed)
    const freeShippingThreshold = 35.00; // Free shipping threshold ($35 or more)

    // Get references to all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    // Function to toggle between light and dark modes
function toggleMode() {
  const body = document.body;
  if (body.classList.contains("light-mode")) {
      // Switch to dark mode
      body.classList.remove("light-mode");
      body.classList.add("dark-mode");
  } else {
      // Switch to light mode
      body.classList.remove("dark-mode");
      body.classList.add("light-mode");
  }
}

// Add a click event listener to the mode toggle button
document.getElementById("mode-toggle").addEventListener("click", toggleMode);

// Call the toggleMode function when the page loads to set the initial mode
window.addEventListener("load", toggleMode);

    // Add click event listeners to the "Add to Cart" buttons
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", () => {
            // Get the product name, price, and image source from the button's data attributes
            const name = button.getAttribute("data-name");
            const price = parseFloat(button.getAttribute("data-price"));
            const imageSrc = button.closest(".product").querySelector("img").getAttribute("src");

            // Check if the item is already in the cart
            const existingItem = cart.find((item) => item.name === name);

            if (existingItem) {
                // If the item is already in the cart, increase its quantity
                existingItem.quantity++;
            } else {
                // If the item is not in the cart, add it with quantity 1
                const newItem = {
                    name: name,
                    price: price,
                    quantity: 1,
                    imageSrc: imageSrc, // Add image source to the cart item
                };
                cart.push(newItem);
            }

            // Update the cart and total price
            updateCart();
        });
    });

    // Function to update the cart and total price
    function updateCart() {
        // Clear the cart list
        cartList.innerHTML = "";
      
        // Initialize the total price, taxes, and shipping
        let totalPrice = 0;
        let taxes = 0;
        let shipping = 0;
      
        // Calculate the subtotal
        let subtotal = 0;
        cart.forEach((item) => {
          subtotal += item.price * item.quantity;
        });
      
        // Update the subtotal element
        const subtotalElement = document.getElementById("subtotal");
        subtotalElement.textContent = subtotal.toFixed(2);
      
        // Loop through the items in the cart
        cart.forEach((item, index) => {
          const listItem = document.createElement("li");
          listItem.innerHTML = `
                      <div class="cart-item">
                          <img src="${item.imageSrc}" alt="${item.name}" class="cart-item-image">
                          <div class="cart-item-details">
                              ${item.name} - $${(item.price * item.quantity).toFixed(2)} x
                              <input type="number" value="${item.quantity}" data-index="${index}" min="1">
                              <button class="remove-from-cart" data-index="${index}">Remove</button>
                          </div>
                      </div>
                  `;
          cartList.appendChild(listItem);
      
          // Update quantity when input changes
          const quantityInput = listItem.querySelector("input");
          quantityInput.addEventListener("change", (event) => {
            const newIndex = parseInt(event.target.getAttribute("data-index"));
            const newQuantity = parseInt(event.target.value);
            cart[newIndex].quantity = newQuantity;
            updateCart();
          });
      
          // Remove item from cart
          const removeButton = listItem.querySelector(".remove-from-cart");
          removeButton.addEventListener("click", (event) => {
            const removeIndex = parseInt(event.target.getAttribute("data-index"));
            cart.splice(removeIndex, 1);
            updateCart();
          });
      
          // Update the total price
          totalPrice += item.price * item.quantity;
        });
      
        // Calculate taxes
        taxes = totalPrice * taxRate;
      
        // Calculate shipping based on the total price
        if (totalPrice > freeShippingThreshold) {
          shipping = 0; // Free shipping if the total is over $35
        } else {
          shipping = shippingCost; // Standard shipping cost
        }
      
        // Update the total price element
        const totalWithTaxesAndShipping = subtotal + taxes + shipping;
        totalPriceElement.textContent = totalWithTaxesAndShipping.toFixed(2);
      
        // Display taxes and shipping
        taxesElement.textContent = `Taxes (AZ 8%): $${taxes.toFixed(2)}`;
        shippingElement.textContent = `Shipping (Free over $35): $${shipping.toFixed(2)}`;
      }      
}
function submitForm(event) {
  event.preventDefault();
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const email = document.getElementById("email").value;
  const number = document.getElementById("number").value;
  const contactMethod = document.querySelector("input[name='user-recommend']:checked").value;
  const comments = document.getElementById("comments").value;

  // Validate email using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
      document.getElementById("email-error").textContent = "Invalid email address";
      return;
  }

  // Validate phone number (optional) using a regular expression
  const phoneRegex = /^\d{9,15}$/;
  if (number && !phoneRegex.test(number)) {
      document.getElementById("phone-error").textContent = "Invalid phone number";
      return;
  }

  // Clear any previous error messages
  document.getElementById("email-error").textContent = "";
  document.getElementById("phone-error").textContent = "";

  // Display the thank you message with submitted info
  document.getElementById("submitted-name").textContent = `${firstName} ${lastName}`;
  
  // Display both email and phone inputs
  document.getElementById("submitted-contact-method").textContent = contactMethod;
  document.getElementById("submitted-contact-info").textContent = "Email: " + email + " | Phone: " + number;
  
  document.getElementById("submitted-comments").textContent = "Comments: " + comments;

  // Show the thank you message and reset the form
  document.getElementById("survey-form").reset();
  document.getElementById("thank-you-message").style.display = "block";
}


// Define an array to store the items in the cart