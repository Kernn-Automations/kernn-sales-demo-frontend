// manufacturingReducer.js

export const MANUFACTURING_ACTIONS = {
  INIT_STATE: "INIT_STATE",

  // Recipes
  ADD_RECIPE: "ADD_RECIPE",
  UPDATE_RECIPE: "UPDATE_RECIPE",
  TOGGLE_RECIPE_STATUS: "TOGGLE_RECIPE_STATUS",

  // Production
  CREATE_PRODUCTION: "CREATE_PRODUCTION",
  START_PRODUCTION: "START_PRODUCTION",
  COMPLETE_PRODUCTION: "COMPLETE_PRODUCTION",
  CANCEL_PRODUCTION: "CANCEL_PRODUCTION",

  // Stock Ledger
  ADD_STOCK_TRANSACTION: "ADD_STOCK_TRANSACTION",

  // Derived / Cache
  UPDATE_STOCK_BALANCES: "UPDATE_STOCK_BALANCES",

  // UI
  SET_UI_STATE: "SET_UI_STATE",
  SET_ERROR: "SET_ERROR",
  CLEAR_ERROR: "CLEAR_ERROR",
};

export function manufacturingReducer(state, action) {
  switch (action.type) {
    /* ----------------------------- */
    /* INITIALIZATION */
    /* ----------------------------- */
    case MANUFACTURING_ACTIONS.INIT_STATE: {
      return {
        ...action.payload,
      };
    }

    /* ----------------------------- */
    /* RECIPES */
    /* ----------------------------- */
    case MANUFACTURING_ACTIONS.ADD_RECIPE: {
      const recipe = action.payload;

      return {
        ...state,
        recipes: {
          byId: {
            ...state.recipes.byId,
            [recipe.id]: recipe,
          },
          allIds: [...state.recipes.allIds, recipe.id],
        },
      };
    }

    case MANUFACTURING_ACTIONS.UPDATE_RECIPE: {
      const { id, updates } = action.payload;

      if (!state.recipes.byId[id]) return state;

      return {
        ...state,
        recipes: {
          ...state.recipes,
          byId: {
            ...state.recipes.byId,
            [id]: {
              ...state.recipes.byId[id],
              ...updates,
            },
          },
        },
      };
    }

    case MANUFACTURING_ACTIONS.TOGGLE_RECIPE_STATUS: {
      const id = action.payload;

      const recipe = state.recipes.byId[id];
      if (!recipe) return state;

      return {
        ...state,
        recipes: {
          ...state.recipes,
          byId: {
            ...state.recipes.byId,
            [id]: {
              ...recipe,
              isActive: !recipe.isActive,
            },
          },
        },
      };
    }

    /* ----------------------------- */
    /* PRODUCTION */
    /* ----------------------------- */
    case MANUFACTURING_ACTIONS.CREATE_PRODUCTION: {
      const production = action.payload;

      return {
        ...state,
        productions: {
          byId: {
            ...state.productions.byId,
            [production.id]: production,
          },
          allIds: [...state.productions.allIds, production.id],
        },
      };
    }

    case MANUFACTURING_ACTIONS.START_PRODUCTION: {
      const { id, timestamp } = action.payload;
      const production = state.productions.byId[id];
      if (!production) return state;

      return {
        ...state,
        productions: {
          ...state.productions,
          byId: {
            ...state.productions.byId,
            [id]: {
              ...production,
              status: "IN_PROGRESS",
              timestamps: {
                ...production.timestamps,
                startedAt: timestamp,
              },
            },
          },
        },
      };
    }

    case MANUFACTURING_ACTIONS.COMPLETE_PRODUCTION: {
      const { id, completionData } = action.payload;
      const production = state.productions.byId[id];
      if (!production) return state;

      return {
        ...state,
        productions: {
          ...state.productions,
          byId: {
            ...state.productions.byId,
            [id]: {
              ...production,
              status: "COMPLETED",
              timestamps: {
                ...production.timestamps,
                completedAt: completionData.completedAt,
              },
              actuals: completionData.actuals,
            },
          },
        },
      };
    }

    case MANUFACTURING_ACTIONS.CANCEL_PRODUCTION: {
      const { id, reason } = action.payload;
      const production = state.productions.byId[id];
      if (!production) return state;

      return {
        ...state,
        productions: {
          ...state.productions,
          byId: {
            ...state.productions.byId,
            [id]: {
              ...production,
              status: "CANCELLED",
              audit: {
                ...production.audit,
                notes: reason,
              },
            },
          },
        },
      };
    }

    /* ----------------------------- */
    /* STOCK LEDGER */
    /* ----------------------------- */
    case MANUFACTURING_ACTIONS.ADD_STOCK_TRANSACTION: {
      return {
        ...state,
        stockLedger: {
          ...state.stockLedger,
          entries: [...state.stockLedger.entries, action.payload],
        },
      };
    }

    /* ----------------------------- */
    /* STOCK BALANCES (CACHED) */
    /* ----------------------------- */
    case MANUFACTURING_ACTIONS.UPDATE_STOCK_BALANCES: {
      return {
        ...state,
        stockBalances: action.payload,
      };
    }

    /* ----------------------------- */
    /* UI */
    /* ----------------------------- */
    case MANUFACTURING_ACTIONS.SET_UI_STATE: {
      return {
        ...state,
        ui: {
          ...state.ui,
          ...action.payload,
        },
      };
    }

    case MANUFACTURING_ACTIONS.SET_ERROR: {
      return {
        ...state,
        ui: {
          ...state.ui,
          lastError: action.payload,
        },
      };
    }

    case MANUFACTURING_ACTIONS.CLEAR_ERROR: {
      return {
        ...state,
        ui: {
          ...state.ui,
          lastError: null,
        },
      };
    }

    /* ----------------------------- */
    default:
      return state;
  }
}
