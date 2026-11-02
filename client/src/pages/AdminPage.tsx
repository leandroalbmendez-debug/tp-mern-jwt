import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { api, getErrorMessage } from "../api/axios";
import type { Currency, Product } from "../types";
import { formatPrice } from "../utils/format";

// El formulario guarda todo como string (así vienen de los inputs); el backend valida y convierte
const emptyForm = { name: "", description: "", price: "", currency: "ARS" as Currency, stock: "" };
type ProductForm = typeof emptyForm;

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null); // null = creando, id = editando
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadProducts = async () => {
    try {
      const { data } = await api.get<Product[]>("/products");
      setProducts(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Un solo handler para todos los inputs: usa el atributo name como clave
  const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
        setMessage("Producto actualizado");
      } else {
        await api.post("/products", form);
        setMessage("Producto creado");
      }
      resetForm();
      await loadProducts();
    } catch (err) {
      setError(getErrorMessage(err)); // 400 validación, 403 si no es admin, etc.
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description ?? "",
      price: String(product.price),
      currency: product.currency,
      stock: String(product.stock),
    });
  };

  const handleDelete = async (product: Product) => {
    if (!confirm(`¿Borrar "${product.name}"?`)) return;
    setError("");
    setMessage("");
    try {
      await api.delete(`/products/${product._id}`);
      setMessage("Producto borrado");
      if (editingId === product._id) resetForm();
      await loadProducts();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <section>
      <h1>Panel de administración</h1>
      {error && <p className="alert error">{error}</p>}
      {message && <p className="alert success">{message}</p>}

      <form className="card form admin-form" onSubmit={handleSubmit}>
        <h2>{editingId ? "Editar producto" : "Nuevo producto"}</h2>
        <div className="form-row">
          <label>
            Nombre
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Descripción
            <input name="description" value={form.description} onChange={handleChange} />
          </label>
        </div>
        <div className="form-row">
          <label>
            Precio
            <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required />
          </label>
          <label>
            Moneda
            <select name="currency" value={form.currency} onChange={handleChange}>
              <option value="ARS">ARS</option>
              <option value="USD">USD</option>
            </select>
          </label>
          <label>
            Stock
            <input name="stock" type="number" min="0" step="1" value={form.stock} onChange={handleChange} required />
          </label>
        </div>
        <div className="actions">
          <button type="submit">{editingId ? "Guardar cambios" : "Crear producto"}</button>
          {editingId && (
            <button type="button" className="btn-secondary" onClick={resetForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product.name}</td>
                <td>{formatPrice(product.price, product.currency)}</td>
                <td>{product.stock}</td>
                <td className="actions">
                  <button className="btn-secondary" onClick={() => handleEdit(product)}>
                    Editar
                  </button>
                  <button className="btn-danger" onClick={() => handleDelete(product)}>
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={4} className="muted">
                  No hay productos. Creá el primero con el formulario.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
