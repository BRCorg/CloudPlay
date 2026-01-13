import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Fait le typage de useDispatch pour notre store
// On démontre que mon dispatch peut gérer toutes les actions de mon store
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Fait le typage de useSelector pour notre store
// Il lit l’état du store pour le composant
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
