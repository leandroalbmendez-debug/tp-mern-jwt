import { useEffect, useState } from "react";
import { api, getErrorMessage } from "../api/axios";
import type { Product } from "../types";
import { formatPrice } from "../utils/format";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get<Product[]>("/products") // el interceptor agrega el token: sin él, el backend responde 401
      .then((response) => setProducts(response.data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="center">Cargando productos...</p>;

  return (
    <section>
      <h1>Productos</h1>
      {error && <p className="alert error">{error}</p>}
      {!error && products.length === 0 && <p className="muted">Todavía no hay productos cargados.</p>}
      <div className="grid">
        {products.map((product) => (
          <article key={product._id} className="card product">
            <h3>{product.name}</h3>
            {product.description && <p className="muted">{product.description}</p>}
            <p className="price">{formatPrice(product.price, product.currency)}</p>
            <p className={product.stock > 0 ? "stock" : "stock out"}>
              {product.stock > 0 ? `Stock: ${product.stock}` : "Sin stock"}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
