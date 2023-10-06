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
} // Define an array to store the items in the cart