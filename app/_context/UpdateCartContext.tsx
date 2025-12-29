import { createContext, Dispatch, SetStateAction } from "react";

export interface UpdateCartContextType {
    updateCart: boolean;
    setUpdateCart: Dispatch<SetStateAction<boolean>>;
}

export const UpdateCartContext = createContext<UpdateCartContextType | null>(null);
