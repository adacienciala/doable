import { createContext, Dispatch, SetStateAction, useState } from "react";

export const HeaderContext = createContext<
  [string, Dispatch<SetStateAction<string>>]
>(["Welcome", () => undefined]);

export const HeaderContextProvider = (props: any) => {
  const [headerText, setHeaderText] = useState("Welcome");

  return (
    <HeaderContext.Provider value={[headerText, setHeaderText]}>
      {props.children}
    </HeaderContext.Provider>
  );
};
