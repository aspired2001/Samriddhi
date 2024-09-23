import { createContext, useState } from "react";
const GlobalContext = createContext<any>({});
import { toast } from "react-toastify";
let url = import.meta.env.VITE_URL;

const GlobalState = (props: any) => {
  const [loading, setLoading] = useState(false);
  const toastMessage = (message: string, type: string) => {
    if (type === "success") toast.success(message);
    else if (type === "error") toast.error(message);
    else if (type === "warning") toast.warning(message);
    else toast.info(message);
  };

 const getSchemes = async (
   income: number,
   age: number,
   urban_rural: string
 ) => {
   try {
     const response = await fetch(`${url}/api/flask/getSchemes`, {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ income, age, urban_rural }),
     });

     // Ensure you handle non-JSON responses or invalid status codes
     if (!response.ok) {
       toastMessage("Failed to fetch schemes", "error");
       return false;
     }

     const data = await response.json();

     // Check for applicable_schemes explicitly
     if (
       data &&
       data.applicable_schemes &&
       data.applicable_schemes.length > 0
     ) {
       toastMessage(data.info || "Schemes fetched successfully", "success");
       return data.applicable_schemes;
     } else {
       toastMessage(data.error || "No applicable schemes found", "warning");
       return false;
     }
   } catch (error) {
     console.error("Error in getSchemes:", error);
     toastMessage("Something went wrong!", "error");
     return false;
   }
 };

  const chatbot = async (question: string) => {
    try {
      const response = await fetch(`${url}/api/flask/chatbot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question }),
      });

      const data = await response.json();
      if (data) {
        toastMessage(data.info, "success");
        return data.answer;
      } else {
        toastMessage(data.error, "error");
        return false;
      }
    } catch (error) {
      console.log(error);
      toastMessage("Something went wrong!", "error");
    }
  }

  const maxLoan = async (income: number, age: number, dependent: number) => {
    try {
      const response = await fetch(`${url}/api/flask/maxLoan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ income, age, dependent }),
      });

      const data = await response.json();
      if (data) {
        toastMessage(data.info, "success");
        return data.max_loan;
      } else {
        toastMessage(data.error, "error");
        return false;
      }
    } catch (error) {
      console.log(error);
      toastMessage("Something went wrong!", "error");
    }
  }


  return (
    <GlobalContext.Provider value={{ toastMessage, loading, setLoading, getSchemes, chatbot, maxLoan }}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalContext;
export { GlobalState };
