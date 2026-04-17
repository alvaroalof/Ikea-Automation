/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  name: string;
  weight: number; // in kg
  length: number; // in cm
  width: number;  // in cm
  height: number; // in cm
}

export interface Package {
  id: string;
  products: Product[];
  totalWeight: number;
  baseCost: number;
  weightSurcharge: number;
  distanceSurcharge: number;
  totalCost: number;
}

export interface Scenario {
  name: string;
  description: string;
  products: Product[];
  distance: number;
}
