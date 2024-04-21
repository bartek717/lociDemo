'use client'
import { useState, useEffect } from 'react';
import { supabase } from '@/supabase';
import Image from 'next/image';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [subProducts, setSubProducts] = useState([]);
  const [activeProduct, setActiveProduct] = useState(null);


  useEffect(() => {
    const getProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');
      if (error) {
        console.log('Error fetching products:', error);
        return;
      }
      setProducts(data);
    };

    getProducts();
  }, []);

  // Function to fetch sub-products based on the product clicked
  useEffect(() => {
    if (!activeProduct) return;

    const getSubProducts = async () => {
      const { data, error } = await supabase
        .from('subProduct')
        .select('*')
        .eq('productId', activeProduct.id);

      if (error) {
        console.log('Error fetching subProducts:', error);
        return;
      }
      setSubProducts(data);
    };

    getSubProducts();
  }, [activeProduct]);

  const handleProductClick = (product) => {
    setActiveProduct(product); // set the active product which will trigger the subProducts fetch
  };

  return (
    <div>
      <h1>Home Page</h1>
      <div>
        <h2>Products</h2>
        {products.map((product) => (
          <div key={product.id} onClick={() => handleProductClick(product)}>
            {product.productName} - Click to see sub-products
          </div>
        ))}
      </div>
      {activeProduct && (
        <div>
          <h3>Sub-Products for {activeProduct.productName}</h3>
          {subProducts.length > 0 ? (
            subProducts.map((subProduct) => (
              <div key={subProduct.id}>
                {subProduct.colorwave}
                {subProduct.sizes}
              </div>
            ))
          ) : (
            <p>No sub-products found</p>
          )}
        </div>
      )}
    </div>
  );
}
