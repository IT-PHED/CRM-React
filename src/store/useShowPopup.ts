import { create } from "zustand";

type options =
    | "view-customer-count"
    | null;

interface GlobalStoreInterface {
    showPopup: options;
}

interface Action extends GlobalStoreInterface {
    setShowPopup: (value: options) => void;
}

const INITIAL_STATE: GlobalStoreInterface = {
    showPopup: null,
};

export const useShowPopup = create<Action>((set) => ({
    ...INITIAL_STATE,
    setShowPopup: (value) => set({ showPopup: value }),
}));
