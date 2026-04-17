/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Truck, 
  MapPin, 
  Scale, 
  Settings2, 
  ArrowRight, 
  ChevronRight, 
  Info,
  Layers,
  Repeat,
  Calculator,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product, Package as ShipmentPackage, Scenario } from './types';

// Constants based on business rules
const BASE_COST = 15.00;
const WEIGHT_LIMIT = 30.0;
const DISTANCE_LIMIT = 100.0;
const EXTRA_WEIGHT_COST = 1.00; // per kg
const EXTRA_DISTANCE_COST = 0.50; // per km

const DEFAULT_PRODUCTS: Product[] = [
  { id: '1', name: 'BILLY Librería', weight: 18.0, length: 80, width: 200, height: 28 },
  { id: '2', name: 'KALLAX Estantería', weight: 15.5, length: 77, width: 77, height: 39 },
  { id: '3', name: 'POÄNG Sillón', weight: 8.2, length: 94, width: 68, height: 82 },
  { id: '4', name: 'MALM Cómoda', weight: 25.0, length: 80, width: 100, height: 48 },
];

export default function App() {
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [distance, setDistance] = useState<number>(85);
  const [newProductName, setNewProductName] = useState('');
  const [newProductWeight, setNewProductWeight] = useState<number>(0);

  // Add Product
  const addProduct = () => {
    if (!newProductName || newProductWeight <= 0) return;
    const newProd: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: newProductName,
      weight: newProductWeight,
      length: 50, width: 50, height: 50 // Default dummy dims
    };
    setProducts([...products, newProd]);
    setNewProductName('');
    setNewProductWeight(0);
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Logic: One Large Package
  const singlePackageStats = useMemo(() => {
    const totalWeight = products.reduce((sum, p) => sum + p.weight, 0);
    const weightSurcharge = Math.max(0, totalWeight - WEIGHT_LIMIT) * EXTRA_WEIGHT_COST;
    const distanceSurcharge = Math.max(0, distance - DISTANCE_LIMIT) * EXTRA_DISTANCE_COST;
    const totalCost = BASE_COST + weightSurcharge + distanceSurcharge;

    return { totalWeight, weightSurcharge, distanceSurcharge, totalCost };
  }, [products, distance]);

  // Logic: Optimized Multi-Package (Greedy grouping under 30kg)
  const optimizedPackages = useMemo(() => {
    const sortedProducts = [...products].sort((a, b) => b.weight - a.weight);
    const pkgs: ShipmentPackage[] = [];
    
    let currentPkgProducts: Product[] = [];
    let currentPkgWeight = 0;

    sortedProducts.forEach((p) => {
      if (currentPkgWeight + p.weight <= WEIGHT_LIMIT) {
        currentPkgProducts.push(p);
        currentPkgWeight += p.weight;
      } else {
        // Close current and start new
        if (currentPkgProducts.length > 0) {
          pkgs.push(createPackageRecord(currentPkgProducts, currentPkgWeight, distance));
        }
        currentPkgProducts = [p];
        currentPkgWeight = p.weight;
      }
    });

    if (currentPkgProducts.length > 0) {
      pkgs.push(createPackageRecord(currentPkgProducts, currentPkgWeight, distance));
    }

    return pkgs;
  }, [products, distance]);

  function createPackageRecord(prods: Product[], weight: number, dist: number): ShipmentPackage {
    const wSurcharge = Math.max(0, weight - WEIGHT_LIMIT) * EXTRA_WEIGHT_COST;
    const dSurcharge = Math.max(0, dist - DISTANCE_LIMIT) * EXTRA_DISTANCE_COST;
    return {
      id: Math.random().toString(36).substr(2, 9),
      products: prods,
      totalWeight: weight,
      baseCost: BASE_COST,
      weightSurcharge: wSurcharge,
      distanceSurcharge: dSurcharge,
      totalCost: BASE_COST + wSurcharge + dSurcharge
    };
  }

  const multiPackageTotal = optimizedPackages.reduce((sum, p) => sum + p.totalCost, 0);
  const isMultiPackageBetter = multiPackageTotal < singlePackageStats.totalCost;

  return (
    <div className="min-h-screen bg-bg-main text-text-main font-sans p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-ikea-blue text-ikea-yellow font-black px-3 py-1 rounded text-2xl">
            IKEA
          </div>
          <h1 className="text-xl font-bold tracking-tight">Logistics Solutions Architect | Make.com</h1>
        </div>
        <div className="bg-[#E8F0FE] text-[#1967D2] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          Patrón: Iterator & Aggregator
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
        
        {/* Card 1: Reglas del Sistema */}
        <div className="bg-card-bg rounded-2xl p-6 border border-border-light shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-ikea-blue font-bold text-sm uppercase tracking-wider">
            <Info size={18} /> Reglas del Sistema
          </div>
          <ul className="space-y-3 text-sm flex-grow">
            <li className="flex items-start gap-2">
              <span className="text-ikea-blue">→</span>
              <span>Base: <strong className="font-bold">15.00€</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-ikea-blue">→</span>
              <span>Límite Peso: <strong className="font-bold">30kg</strong> (+1€/kg extra)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-ikea-blue">→</span>
              <span>Límite Distancia: <strong className="font-bold">100km</strong> (+0.50€/km extra)</span>
            </li>
          </ul>
          <div className="mt-4 text-[10px] text-text-muted italic leading-tight">
            *Optimización basada en reducción de bultos vs. recargos por peso.
          </div>
        </div>

        {/* Card 2: Configuración & Simulador (Span 2) */}
        <div className="md:col-span-2 bg-card-bg rounded-2xl p-6 border border-border-light shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-ikea-blue font-bold text-sm uppercase tracking-wider">
            <Settings2 size={18} /> Configuración & Simulador
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Make.com logic context */}
            <div className="space-y-4">
               <div>
                  <p className="text-[11px] font-bold mb-1">1. Iterator (JSON)</p>
                  <div className="bg-[#272822] text-[#F8F8F2] font-mono text-[11px] p-2 rounded border border-white/5">
                    {"{{1.items}}"}
                  </div>
               </div>
               <div>
                  <p className="text-[11px] font-bold mb-1">2. Aggregator (Grouping)</p>
                  <div className="bg-[#272822] text-[#F8F8F2] font-mono text-[11px] p-2 rounded border border-white/5">
                    {"sum({{2.weight}})"}
                  </div>
                  <p className="text-[9px] text-text-muted mt-1 uppercase">Source: Iterator. Group: Peso &lt; 30kg.</p>
               </div>
            </div>

            {/* Live Inputs */}
            <div className="space-y-3 bg-bg-main p-4 rounded-xl">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-text-muted uppercase tracking-tighter">Distancia (km)</label>
                <input 
                  type="number" 
                  value={distance} 
                  onChange={(e) => setDistance(Number(e.target.value))}
                  className="w-20 px-2 py-1 bg-white border border-border-light rounded font-mono text-sm outline-none focus:border-ikea-blue"
                />
              </div>
              <div className="space-y-2">
                <div className="flex gap-1">
                  <input 
                    placeholder="Nuevo prod."
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="flex-1 px-2 py-1 bg-white border border-border-light rounded text-xs outline-none"
                  />
                  <input 
                    type="number" placeholder="kg"
                    value={newProductWeight || ''}
                    onChange={(e) => setNewProductWeight(Number(e.target.value))}
                    className="w-12 px-2 py-1 bg-white border border-border-light rounded text-xs outline-none font-mono"
                  />
                  <button onClick={addProduct} className="bg-ikea-blue text-white px-2 rounded hover:bg-[#00449b] transition-colors">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="max-h-24 overflow-y-auto custom-scrollbar space-y-1">
                  {products.map(p => (
                    <div key={p.id} className="flex items-center justify-between text-[10px] bg-white p-1 px-2 rounded border border-gray-100 group">
                      <span className="truncate font-bold">{p.name} ({p.weight}kg)</span>
                      <button onClick={() => removeProduct(p.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Fórmula de Coste */}
        <div className="bg-card-bg rounded-2xl p-6 border border-border-light shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-ikea-blue font-bold text-sm uppercase tracking-wider">
            <Calculator size={18} /> Fórmula de Coste
          </div>
          <p className="text-[11px] text-text-muted mb-3 leading-tight">Copiar en módulo Tools / Variable:</p>
          <div className="bg-[#1a1a1a] text-[#F8F8F2] font-mono text-[11px] p-3 rounded-lg leading-relaxed mb-4 break-all">
            15 + if(sum_weight &gt; 30; sum_weight - 30; 0) * 1 + if(distancia &gt; 100; (distancia - 100) * 0.5; 0)
          </div>
          <div className="mt-auto flex items-center gap-3 p-3 bg-bg-main rounded-xl">
             <div className="p-2 bg-ikea-blue text-white rounded-lg">
                <Truck size={16} />
             </div>
             <div>
                <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Calculadora</p>
                <p className="text-sm font-black">{singlePackageStats.totalCost.toFixed(2)}€</p>
             </div>
          </div>
        </div>

        {/* Card 4: Matriz de Escenarios (Span 2x2) */}
        <div className="md:col-span-2 md:row-span-2 bg-card-bg rounded-2xl p-6 border border-border-light shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center gap-2 mb-6 text-ikea-blue font-bold text-sm uppercase tracking-wider">
            <Repeat size={18} /> Matriz de Escenarios & Eficiencia
          </div>
          
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-bg-main text-text-muted">
                  <th className="py-2 pr-2 font-bold uppercase tracking-wider">Escenario</th>
                  <th className="py-2 px-2 font-bold uppercase tracking-wider">Detalle</th>
                  <th className="py-2 px-2 font-bold uppercase tracking-wider">Peso</th>
                  <th className="py-2 px-2 font-bold uppercase tracking-wider">Dist.</th>
                  <th className="py-2 pl-2 font-bold uppercase tracking-wider text-right">Coste Final</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bg-main">
                <tr>
                  <td className="py-3 pr-2 font-bold">A: Ligero</td>
                  <td className="py-3 px-2">Lámpara, Mesa</td>
                  <td className="py-3 px-2">12kg</td>
                  <td className="py-3 px-2">45km</td>
                  <td className="py-3 pl-2 text-right font-bold text-accent-orange">15.00€</td>
                </tr>
                <tr>
                  <td className="py-3 pr-2 font-bold">B: Pesado</td>
                  <td className="py-3 px-2">Sofá 3 plazas</td>
                  <td className="py-3 px-2">42kg</td>
                  <td className="py-3 px-2">80km</td>
                  <td className="py-3 pl-2 text-right font-bold text-accent-orange">27.00€</td>
                </tr>
                <tr>
                  <td className="py-3 pr-2 font-bold">C: Crítico</td>
                  <td className="py-3 px-2 font-mono">Simulación Actual</td>
                  <td className="py-3 px-2 font-mono">{singlePackageStats.totalWeight.toFixed(1)}kg</td>
                  <td className="py-3 px-2 font-mono">{distance}km</td>
                  <td className="py-3 pl-2 text-right font-bold text-accent-orange">{singlePackageStats.totalCost.toFixed(2)}€</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-auto border-t border-dashed border-border-light pt-4">
            <div className="text-[12px] font-bold text-ikea-blue uppercase tracking-widest mb-4">Comparativa de Eficiencia</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-bg-main p-4 rounded-xl border border-transparent">
                <p className="text-[10px] font-bold text-text-muted mb-1">Opción 1: Un solo paquete grande</p>
                <div className="flex justify-between items-end">
                  <p className="text-xl font-black text-accent-orange font-mono">{singlePackageStats.totalCost.toFixed(2)}€</p>
                  {!isMultiPackageBetter && <CheckCircle2 size={16} className="text-ikea-blue mb-1" />}
                </div>
              </div>
              <div className={`bg-bg-main p-4 rounded-xl border ${isMultiPackageBetter ? 'border-green-500 bg-green-50/30' : 'border-transparent'}`}>
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] font-bold text-text-muted">Opción 2: Dividir en {optimizedPackages.length} bultos</p>
                  {isMultiPackageBetter && <span className="text-[8px] bg-green-500 text-white px-1 rounded uppercase font-bold">Recomendado</span>}
                </div>
                <div className="flex justify-between items-end">
                  <p className={`text-xl font-black font-mono ${isMultiPackageBetter ? 'text-green-600' : 'text-gray-400'}`}>
                    {multiPackageTotal.toFixed(2)}€
                  </p>
                  {isMultiPackageBetter && (
                    <p className="text-[10px] font-black text-green-600">
                      Ahorro {(((singlePackageStats.totalCost / multiPackageTotal) - 1) * 100).toFixed(0)}%
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Decisión Arquitectónica */}
        <div className="bg-card-bg rounded-2xl p-6 border border-border-light shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-ikea-blue font-bold text-sm uppercase tracking-wider">
            <Layers size={18} /> Decisión de Diseño
          </div>
          <p className="text-xs leading-relaxed text-text-muted mb-6">
            Es <strong className="text-text-main">más eficiente enviar varios paquetes</strong> cuando el excedente de peso supera el coste base de un nuevo envío (15€).
          </p>
          
          <div className="mt-auto bg-ikea-blue text-white p-4 rounded-2xl flex justify-between items-center">
            <div>
              <p className="text-[8px] opacity-70 uppercase font-black tracking-widest">Punto de Corte</p>
              <p className="text-xl font-black font-mono">45kg</p>
            </div>
            <div className="text-right">
              <p className="text-[8px] opacity-70 uppercase font-black tracking-widest">Estado</p>
              <p className="text-[10px] font-bold uppercase tracking-tighter">
                {isMultiPackageBetter ? 'Fragmentar' : 'Consolidar'}
              </p>
            </div>
          </div>
        </div>

      </main>
      
      {/* Footer */}
      <footer className="mt-8 max-w-7xl mx-auto py-6 border-t border-border-light text-center">
        <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-text-muted opacity-50 italic">
          IKEA Architect • Made with AI Design Patterns
        </p>
      </footer>
    </div>
  );
}
