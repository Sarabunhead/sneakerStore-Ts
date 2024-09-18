const productContainer: HTMLElement | null = document.getElementById("productContainer");
const search: HTMLElement | null = document.getElementById("search");

document.addEventListener('DOMContentLoaded', function() {
   const username: string | null = localStorage.getItem('username');
   displayGreeting(username);
   showProducts(); // Show all products initially
});

function getGreeting() : string {
   const now: Date = new Date();
   const hours: number = now.getHours();
   let greeting: string;
   if (hours < 12) {
       greeting = "Good Morning &#128075;";
   } else if (hours < 18) {
       greeting = "Good Afternoon &#128075;";
   } else {
       greeting = "Good Evening &#128075;";
   }
   return greeting;
}

function displayGreeting(username: string | null): void {
   const greetingContainer: HTMLElement | null = document.getElementById("greetingContainer");
   const greeting: string = getGreeting();
   if (greetingContainer){
      greetingContainer.innerHTML = `
      <p class="text-xl text-gray-500">${greeting}</p>
      <p class="text-xl font-bold mt-2">Hello, ${username}!</p>
      `;
   }
}

async function getProducts(): Promise<any | null> {
   const token: string | null = localStorage.getItem('authToken');
   if (!token) {
       alert('Please log in first.');
       return null;
   }

   try {
       const res = await fetch('http://localhost:3000/sneaker?page=1&limit=1000', {
           method: 'GET',
           headers: {
               'Accept': '*/*',
               'Authorization': `Bearer ${token}`
           }
       });

       const data = await res.json();
       return data;
   } catch (error) {
       console.error('Error fetching products:', error);
       return null;
   }
}

async function showProducts(products: any | null = null): Promise<void> {
    if (!products) {
        products = await getProducts();
        if (!products) return;
        products = products.data;
    } else {
        products = products.data;
    }

    if (productContainer){
        productContainer.innerHTML = ''; // Clear existing products
        products.forEach((product: any) => {
        const productElement: HTMLElement = document.createElement('div');
        productElement.className = 'w-1/2 p-2'; 
        productElement.innerHTML = `
            <div class="product border p-4 bg-white shadow-sm rounded">
                <h2 class="text-xl font-bold">${product.name}</h2>
                <img class="shoeImage w-full h-48 object-cover mt-2" src="${product.imageURL}" alt="${product.name}" data-id="${product.id}" style="cursor: pointer;">
                <p class="text-gray-900 font-semibold">Price: $${product.price}</p>
            </div>
        `;
        productContainer.appendChild(productElement);

        
    });
    
    // Attach click event listeners to the images after they are added to the DOM
    document.querySelectorAll('.shoeImage').forEach(image: HTMLElement => {
        image.addEventListener('click', function() {
            const productId: string | null = this.getAttribute('data-id');
            const token: string | null = localStorage.getItem('authToken');
            
            if (!token) {
                alert('Please log in first.');
                return;
            }
            
            // Open the new page with the product ID as a query parameter
            window.open(`product.html?id=${productId}`, "_blank");
    });
        });
    }
}