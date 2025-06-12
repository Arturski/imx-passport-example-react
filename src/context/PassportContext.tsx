import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { passportInstance } from "../utils/passport";
import { Provider } from "@imtbl/sdk/passport";


interface PassportContextState {
  passportProvider?: Provider 
}

export const PassportContext = createContext<PassportContextState>({});

export interface PassportContext {
  children: ReactNode;
}

export function PassportContextProvider({ children }: PassportContext) {
  const [passportProvider, setPassportProvider] = useState<Provider>();

  useEffect(() => {
    (async () => setPassportProvider(await passportInstance.connectEvm({ announceProvider: false })))()
  }, []);

  const contextValue = useMemo(() => (
    {
      passportProvider
    }
  ), [passportProvider]);

  return (
    <PassportContext.Provider value={contextValue}>
      {children}
    </PassportContext.Provider>
  )
}