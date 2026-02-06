// ManufacturingRoutes.jsx
import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ManufacturingHome from "./ManufacturingHome";

// Recipes
import RecipeList from "./recipes/RecipeList";
import RecipeForm from "./recipes/RecipeForm";
import RecipeView from "./recipes/RecipeView";
import RecipeExplain from "./recipes/RecipeExplain";

// Production
import ProductionList from "./production/ProductionList";
import ProductionCreate from "./production/ProductionCreate";
import ProductionExecute from "./production/ProductionExecute";
import ProductionView from "./production/ProductionView";
import ProductionExplain from "./production/ProductionExplain";

import { ManufacturingProvider } from "./context/ManufacturingContext";

/**
 * ManufacturingRoutes
 *
 * Mirrors real manufacturing lifecycle:
 *
 * 1. Understand manufacturing logic (Explain)
 * 2. Define transformation rules (Recipes)
 * 3. Create production batches
 * 4. Execute & complete batches
 * 5. Review immutable audit trail
 *
 * Backend APIs will replace mock data later.
 * Routing structure will NOT change.
 */

function ManufacturingRoutes() {
  return (
    <ManufacturingProvider>
      <Suspense
        fallback={
          <div style={{ padding: 40 }}>Loading Manufacturing Module…</div>
        }
      >
        <Routes>
          {/* ============================= */}
          {/* ENTRY / CONTROL CENTER */}
          {/* ============================= */}
          <Route index element={<ManufacturingHome />} />

          {/* ============================= */}
          {/* EDUCATIONAL / DEMO EXPLAINERS */}
          {/* ============================= */}
          <Route path="recipes/explain" element={<RecipeExplain />} />
          <Route path="production/explain" element={<ProductionExplain />} />

          {/* ============================= */}
          {/* RECIPES DOMAIN */}
          {/* ============================= */}
          <Route path="recipes" element={<RecipeList />} />
          <Route path="recipes/new" element={<RecipeForm />} />
          <Route path="recipes/:id" element={<RecipeView />} />

          {/* ============================= */}
          {/* PRODUCTION DOMAIN */}
          {/* ============================= */}
          <Route path="production" element={<ProductionList />} />
          <Route path="production/new" element={<ProductionCreate />} />

          {/* Execute MUST be batch-specific */}
          <Route
            path="production/:id/execute"
            element={<ProductionExecute />}
          />

          <Route path="production/:id" element={<ProductionView />} />

          {/* ============================= */}
          {/* SAFETY */}
          {/* ============================= */}
          <Route path="*" element={<Navigate to="/manufacturing" replace />} />
        </Routes>
      </Suspense>
    </ManufacturingProvider>
  );
}

export default ManufacturingRoutes;
