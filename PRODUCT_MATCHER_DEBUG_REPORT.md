# Product Matcher Feature — Debug & Architectural Review Report

**Date**: 2026-08-30  
**Repository**: [https://github.com/devarjun345/ManakAI](https://github.com/devarjun345/ManakAI)  
**Feature**: Product Matcher (`RecommendPage.tsx`, `ProductStepIndicator.tsx`, `ProductFormStep1.tsx`, `recommendProduct API`)  
**Status**: **RESOLVED & VERIFIED** (0 errors in build and lint)

---

## 1. Issue Found & Trace Analysis

### Reported Error
`Cannot update a component (RecommendPage) while rendering a different component (ProductStepIndicator)`

### Component Trace & Stack
```
ProductStepIndicator (rendering JSX)
  ↳ evaluates line 27: canNavigateToStep(step.number)
    ↳ calls inline function passed via props from RecommendPage
      ↳ calls validateStep1() / validateStep2()
        ↳ invokes setErrors(errs) inside validateStep1()
          ❌ React Error: setState invoked during component render cycle
```

---

## 2. Root Cause & Rationale

- **Root Cause**: `validateStep1()` and `validateStep2()` were impure functions that executed `setErrors(errs)` to update UI error state.
- **Why It Happened**: `ProductStepIndicator` evaluated `canNavigateToStep` during its own render cycle to determine if stepper buttons should be enabled/disabled. Because `canNavigateToStep` invoked `validateStep1()`, `setErrors()` was called during the render phase of `ProductStepIndicator`, attempting to mutate state on `RecommendPage` while `ProductStepIndicator` was rendering.

---

## 3. Files Modified & Lines Changed

### A. [`frontend/src/pages/RecommendPage.tsx`](file:///d:/Manak%20AI/ManakAI/frontend/src/pages/RecommendPage.tsx)
- **Lines 39–89**: Refactored step validation into pure functions (`isStep1Valid`, `isStep2Valid`) and event-driven error state handlers (`validateAndSetErrorsStep1`, `validateAndSetErrorsStep2`).
- **Lines 84 border–90**: Created a pure, memoized `canNavigateToStep` callback using `useCallback` that checks validity without mutating `errors` state.
- **Lines 113–150**: Connected `handleFindRelevantStandards` to live `recommendProduct()` API call with `RecommendationResult` model mapping.
- **Lines 275–280**: Passed the memoized pure `canNavigateToStep` function to `ProductStepIndicator`.

---

## 4. Code Comparison (Before vs After)

### Before (Impure function calling `setErrors` during render):
```tsx
// ❌ Impure validation mutating state during render
const validateStep1 = (): boolean => {
  const errs: Partial<Record<keyof ProductFormData, string>> = {};
  if (!formData.name.trim()) errs.name = 'Product name is required';
  setErrors(errs); // <--- Triggers state update during render when evaluated by Stepper!
  return Object.keys(errs).length === 0;
};

<ProductStepIndicator
  currentStep={currentStep}
  onStepClick={handleEditStep}
  canNavigateToStep={(step) => {
    if (step === 1) return true;
    if (step === 2) return validateStep1(); // <--- Executed inside JSX render of child!
    return false;
  }}
/>
```

### After (Pure validation functions & event-driven error updates):
```tsx
// ✅ Pure validation check for render-time checks
const isStep1Valid = useCallback((data: ProductFormData): boolean => {
  if (!data.name.trim()) return false;
  if (!data.category) return false;
  if (!data.description.trim() || data.description.trim().length < 5) return false;
  return true;
}, []);

// ✅ Event-triggered validation for form submit actions only
const validateAndSetErrorsStep1 = (): boolean => {
  const errs: Partial<Record<keyof ProductFormData, string>> = {};
  if (!formData.name.trim()) errs.name = 'Product name is required';
  setErrors(errs);
  return Object.keys(errs).length === 0;
};

const canNavigateToStep = useCallback((step: number): boolean => {
  if (step === 1) return true;
  if (step === 2) return isStep1Valid(formData);
  if (step === 3) return isStep1Valid(formData) && isStep2Valid(formData);
  return false;
}, [formData, isStep1Valid, isStep2Valid]);

<ProductStepIndicator
  currentStep={currentStep}
  onStepClick={handleEditStep}
  canNavigateToStep={canNavigateToStep}
/>
```

---

## 5. React Best Practices Applied

1. **Pure Render Functions**: Render-time callbacks passed to child components evaluate state without side effects.
2. **Event-Driven State Updates**: `setErrors` is invoked strictly in response to user actions (`handleNextFromStep1`, `handleNextFromStep2`).
3. **Memoized Handlers**: `handleFieldChange`, `isStep1Valid`, `isStep2Valid`, and `canNavigateToStep` use `useCallback` to prevent unnecessary re-evaluations and child component re-renders.

---

## 6. API Verification & Integration

- **Endpoint**: `POST /api/recommend`
- **Request Payload**:
  ```json
  {
    "product_name": "LED Bulb",
    "industry": "Electrical",
    "description": "Self-Ballasted LED Bulb 9W"
  }
  ```
- **Response Handling**: Mapped `RecommendationItem[]` to `RecommendationResult[]` with `confidenceLevel`, `alignedPoints`, `whyRelevant`, and official source URL references.
- **UI States**: Verified loading indicator, error retry alert banner, empty recommendations state, and successful recommendation rendering.

---

## 7. Build Results (`npm run build`)

```bash
npm run build
```
```
> frontend@0.0.0 build
> tsc -b && vite build

vite v8.2.2 building client environment for production...
✓ 2288 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.45 kB │ gzip:   0.29 kB
dist/assets/index-Bvlv0iMZ.css   66.09 kB │ gzip:  11.69 kB
dist/assets/index-CxL_PV7t.js   685.82 kB │ gzip: 178.61 kB

✓ built in 1.22s
```
- **Result**: **PASS** (0 errors).

---

## 8. Lint Results (`npm run lint`)

```bash
npm run lint
```
```
Found 7 warnings and 0 errors.
Finished in 185ms on 80 files with 116 rules using 16 threads.
```
- **Result**: **PASS** (0 errors).

---

## 9. Verification Checklist

- [x] **No render-loop errors**: Zero `Cannot update a component while rendering another component` warnings.
- [x] **No infinite re-renders**: Pure validation functions eliminate cascading render loops.
- [x] **Frontend fully connected to backend**: `POST /api/recommend` receives product payloads and returns live recommendations.
- [x] **Build passes**: `tsc -b && vite build` completed in 1.22s.
- [x] **Lint passes**: 0 errors across 80 files.
