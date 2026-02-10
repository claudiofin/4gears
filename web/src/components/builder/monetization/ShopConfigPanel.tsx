
import React, { useState } from 'react';
import { ShoppingBag, Plus, Trash2, Edit2, Check, DollarSign, Image as ImageIcon } from 'lucide-react';
import { ThemeConfig, ShopConfig, Product } from '@/types/builder';
import { ImageUploadControl } from '@/components/inspector/controls/ImageUploadControl';

interface ShopConfigPanelProps {
    config: ThemeConfig;
    onUpdate: (config: ThemeConfig | ((prev: ThemeConfig) => ThemeConfig)) => void;
}

export const ShopConfigPanel: React.FC<ShopConfigPanelProps> = ({ config, onUpdate }) => {
    const defaultShopConfig: ShopConfig = {
        enabled: true,
        layout: 'grid',
        currency: '€',
        products: []
    };

    const shopConfig = config.shop || defaultShopConfig;

    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const updateShopConfig = (updates: Partial<ShopConfig>) => {
        onUpdate((prev) => ({
            ...prev,
            shop: {
                ...(prev.shop || defaultShopConfig),
                ...updates
            }
        }));
    };

    const handleAddProduct = () => {
        const newProduct: Product = {
            id: crypto.randomUUID(),
            name: 'New Product',
            price: 19.99,
            status: 'draft',
            category: 'merch',
            image: ''
        };

        updateShopConfig({
            products: [...shopConfig.products, newProduct]
        });
        setEditingProduct(newProduct);
    };

    const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
        const updatedProducts = shopConfig.products.map(p =>
            p.id === id ? { ...p, ...updates } : p
        );
        updateShopConfig({ products: updatedProducts });

        if (editingProduct && editingProduct.id === id) {
            setEditingProduct({ ...editingProduct, ...updates });
        }
    };

    const handleDeleteProduct = (id: string) => {
        updateShopConfig({
            products: shopConfig.products.filter(p => p.id !== id)
        });
        if (editingProduct?.id === id) setEditingProduct(null);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black text-slate-200 tracking-tight">Merchandising</h2>
                    <p className="text-xs text-slate-500 mt-1">Manage your club store</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase">Active</span>
                    <button
                        onClick={() => updateShopConfig({ enabled: !shopConfig.enabled })}
                        className={`w-12 h-6 rounded-full relative transition-colors ${shopConfig.enabled ? 'bg-indigo-500' : 'bg-slate-700'}`}
                    >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${shopConfig.enabled ? 'left-7' : 'left-1'}`} />
                    </button>
                </div>
            </div>

            {/* General Settings */}
            <section className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Currency</label>
                        <select
                            value={shopConfig.currency}
                            onChange={(e) => updateShopConfig({ currency: e.target.value })}
                            className="w-full bg-slate-800 text-sm text-white px-3 py-2 rounded-lg border border-slate-700 focus:border-indigo-500 outline-none"
                        >
                            <option value="€">EUR (€)</option>
                            <option value="$">USD ($)</option>
                            <option value="£">GBP (£)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Layout</label>
                        <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                            {['grid', 'list'].map((layout) => (
                                <button
                                    key={layout}
                                    onClick={() => updateShopConfig({ layout: layout as any })}
                                    className={`flex-1 py-1.5 rounded text-xs font-bold uppercase transition-all ${shopConfig.layout === layout ? 'bg-indigo-500 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                >
                                    {layout}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <div className="h-px bg-slate-800" />

            {/* Product List */}
            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <ShoppingBag size={12} /> Products ({shopConfig.products?.length || 0})
                    </h3>
                    <button
                        onClick={handleAddProduct}
                        className="text-xs bg-indigo-500 text-white px-3 py-1.5 rounded-md font-bold hover:bg-indigo-400 transition-colors flex items-center gap-1"
                    >
                        <Plus size={12} /> Add Product
                    </button>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {shopConfig.products?.map((product) => (
                        <div
                            key={product.id}
                            className={`group relative flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${editingProduct?.id === product.id
                                    ? 'bg-slate-800 border-indigo-500 shadow-lg'
                                    : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                                }`}
                            onClick={() => setEditingProduct(product)}
                        >
                            <div className="w-10 h-10 rounded bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                                {product.image ? (
                                    <img src={product.image} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    <ImageIcon size={16} className="text-slate-600" />
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-slate-200 truncate">{product.name}</div>
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="font-mono text-emerald-400">{shopConfig.currency}{product.price}</span>
                                    <span>•</span>
                                    <span className="capitalize">{product.category}</span>
                                </div>
                            </div>

                            <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${product.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' :
                                    product.status === 'soldout' ? 'bg-rose-500/10 text-rose-400' :
                                        'bg-slate-700 text-slate-400'
                                }`}>
                                {product.status}
                            </div>
                        </div>
                    ))}

                    {shopConfig.products?.length === 0 && (
                        <div className="text-center py-8 border border-dashed border-slate-700 rounded-lg">
                            <ShoppingBag className="mx-auto text-slate-600 mb-2" size={24} />
                            <p className="text-xs text-slate-500">No products yet.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Product Editor */}
            {editingProduct && (
                <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-bold text-slate-400 uppercase">Editing Product</span>
                        <button
                            onClick={() => handleDeleteProduct(editingProduct.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded transition-colors"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <ImageUploadControl
                            label="Product Image"
                            value={editingProduct.image}
                            onChange={(url) => handleUpdateProduct(editingProduct.id, { image: url })}
                            aspectRatio="square"
                        />

                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-400 font-bold uppercase">Name</label>
                            <input
                                type="text"
                                value={editingProduct.name}
                                onChange={(e) => handleUpdateProduct(editingProduct.id, { name: e.target.value })}
                                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-400 font-bold uppercase">Price</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-slate-500 text-sm">{shopConfig.currency}</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={editingProduct.price}
                                        onChange={(e) => handleUpdateProduct(editingProduct.id, { price: parseFloat(e.target.value) })}
                                        className="w-full bg-slate-900 border border-slate-700 rounded pl-8 pr-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] text-slate-400 font-bold uppercase">Status</label>
                                <select
                                    value={editingProduct.status}
                                    onChange={(e) => handleUpdateProduct(editingProduct.id, { status: e.target.value as any })}
                                    className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="soldout">Sold Out</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setEditingProduct(null)}
                        className="w-full mt-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
                    >
                        Done Editing
                    </button>
                </div>
            )}
        </div>
    );
};
