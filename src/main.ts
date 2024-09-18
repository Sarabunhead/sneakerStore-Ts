import './style.css'
import axios from "axios";
import Notifier from "ts-notifier";
import "ts-notifier/target/notifier.min.css";

const notifier = new Notifier({
   theme: "default",
   position: "top-right" 
 });

document.getElementById("myForm")!.addEventListener("submit", async function(event: Event): Promise<void> {
   event.preventDefault()
   const username: string = (document.getElementById("username") as HTMLInputElement).value;
   const password: string = (document.getElementById("password") as HTMLInputElement).value;

   try {
      const response = await axios.post<{token: string}>("http://localhost:3000/auth/login", {username, password});

      const token: string = response.data.token;
      localStorage.setItem("authToken", token);
      localStorage.setItem("username", username);

      notifier.post("Login successful",{
         type: "error",
         delay: 6000,
         animationShowClass: "notifier__item--animation-show",
         animationHideClass: "notifier__item--animation-hide"
      })

     window.location.href = "home.html";
   } catch(error) {
      notifier.post("Login failed",{
         type: "error",
         delay: 6000,
         animationShowClass: "notifier__item--animation-show",
         animationHideClass: "notifier__item--animation-hide"
      })

     console.log(error);
   }
})