// export const API_BASE_URL = (() => {
//     // const value = process.env.NEXT_PUBLIC_API_BASE_URL;

//     let value;

//     if(typeof window !== undefined) {
//         value = process.env.NEXT_PUBLIC_API_BASE_URL;
//     } else {
//         value = process.env.NEXT_DEV_API_BASE_URL;
//     }
    
//     if(!value) {
//         throw new Error("NEXT_PUBLIC_API_BASE_URL or NEXT_DEV_API_BASE_URL is not defined!");
//     }

//     return value;
// })();

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL!;