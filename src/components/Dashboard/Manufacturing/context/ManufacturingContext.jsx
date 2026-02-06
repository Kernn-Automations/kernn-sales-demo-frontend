import React, { createContext, useContext, useEffect, useReducer } from "react";
import {
  manufacturingReducer,
  MANUFACTURING_ACTIONS,
} from "./manufacturingReducer";
import { initialManufacturingState } from "../utils/mockData";

/* ----------------------------------------
   CONTEXT
---------------------------------------- */
const ManufacturingContext = createContext(null);

/* ----------------------------------------
   STORAGE KEY (important for demo)
---------------------------------------- */
const STORAGE_KEY = "erp_manufacturing_demo_state";

/* ----------------------------------------
   PROVIDER
---------------------------------------- */
export function ManufacturingProvider({ children }) {
  const [state, dispatch] = useReducer(manufacturingReducer, undefined, () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error("Failed to parse manufacturing state", e);
      }
    }
    return initialManufacturingState;
  });

  /* ----------------------------------------
     PERSIST STATE (DEMO MODE)
     Later → replace with API sync
  ---------------------------------------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  /* ----------------------------------------
     RECIPE ACTIONS
  ---------------------------------------- */
  const addRecipe = (recipe) => {
    dispatch({
      type: MANUFACTURING_ACTIONS.ADD_RECIPE,
      payload: recipe,
    });
  };

  const updateRecipe = (id, updates) => {
    dispatch({
      type: MANUFACTURING_ACTIONS.UPDATE_RECIPE,
      payload: { id, updates },
    });
  };

  const toggleRecipeStatus = (id) => {
    dispatch({
      type: MANUFACTURING_ACTIONS.TOGGLE_RECIPE_STATUS,
      payload: id,
    });
  };

  /* ----------------------------------------
     PRODUCTION ACTIONS
  ---------------------------------------- */
  const createProduction = (production) => {
    dispatch({
      type: MANUFACTURING_ACTIONS.CREATE_PRODUCTION,
      payload: production,
    });
  };

  const startProduction = (id) => {
    dispatch({
      type: MANUFACTURING_ACTIONS.START_PRODUCTION,
      payload: {
        id,
        timestamp: new Date().toISOString(),
      },
    });
  };

  const completeProduction = (id, actuals) => {
    dispatch({
      type: MANUFACTURING_ACTIONS.COMPLETE_PRODUCTION,
      payload: {
        id,
        completionData: {
          completedAt: new Date().toISOString(),
          actuals,
        },
      },
    });
  };

  const cancelProduction = (id, reason) => {
    dispatch({
      type: MANUFACTURING_ACTIONS.CANCEL_PRODUCTION,
      payload: { id, reason },
    });
  };

  /* ----------------------------------------
     STOCK LEDGER
  ---------------------------------------- */
  const addStockTransaction = (entry) => {
    dispatch({
      type: MANUFACTURING_ACTIONS.ADD_STOCK_TRANSACTION,
      payload: entry,
    });
  };

  /* ----------------------------------------
     UI / ERROR
  ---------------------------------------- */
  const setError = (error) => {
    dispatch({
      type: MANUFACTURING_ACTIONS.SET_ERROR,
      payload: error,
    });
  };

  const clearError = () => {
    dispatch({
      type: MANUFACTURING_ACTIONS.CLEAR_ERROR,
    });
  };

  /* ----------------------------------------
     PUBLIC API
  ---------------------------------------- */
  const value = {
    state,

    // masters
    products: state.products,
    units: state.units,

    // normalized domains
    recipes: state.recipes,
    productions: state.productions,

    // stock
    stockLedger: state.stockLedger,
    stockBalances: state.stockBalances,

    // ui
    ui: state.ui,

    // actions
    addRecipe,
    updateRecipe,
    toggleRecipeStatus,

    createProduction,
    startProduction,
    completeProduction,
    cancelProduction,

    addStockTransaction,

    setError,
    clearError,
  };

  return (
    <ManufacturingContext.Provider value={value}>
      {children}
    </ManufacturingContext.Provider>
  );
}

/* ----------------------------------------
   HOOK
---------------------------------------- */
export function useManufacturing() {
  const ctx = useContext(ManufacturingContext);
  if (!ctx) {
    throw new Error(
      "useManufacturing must be used inside ManufacturingProvider",
    );
  }
  return ctx;
}
