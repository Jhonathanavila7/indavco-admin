import { useState, useEffect } from 'react';
import { clientsAPI } from '../services/api';

const API_BASE = 'https://indavco-backend.onrender.com';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    order: 0
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const response = await clientsAPI.getAll();
      setClients(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando clientes:', error);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('isActive', formData.isActive);
    data.append('order', formData.order);
    
    if (logoFile) {
      data.append('logo', logoFile);
    }

    try {
      if (editingClient) {
        await clientsAPI.update(editingClient._id, data);
      } else {
        await clientsAPI.create(data);
      }
      
      loadClients();
      closeModal();
    } catch (error) {
      console.error('Error guardando cliente:', error);
      alert(error.response?.data?.message || 'Error al guardar el cliente');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await clientsAPI.delete(id);
        loadClients();
      } catch (error) {
        console.error('Error eliminando cliente:', error);
        alert('Error al eliminar el cliente');
      }
    }
  };

  const openModal = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({
        name: client.name,
        isActive: client.isActive,
        order: client.order
      });
      setLogoPreview(`${API_BASE}${client.logo}`);
    } else {
      setEditingClient(null);
      setFormData({
        name: '',
        isActive: true,
        order: 0
      });
      setLogoPreview(null);
    }
    setLogoFile(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingClient(null);
    setLogoFile(null);
    setLogoPreview(null);
  };

  if (loading) {
    return <div className="text-center py-12">Cargando clientes...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary">Gestión de Clientes</h1>
        <button
          onClick={() => openModal()}
          className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Lista de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {clients.length > 0 ? (
          clients.map((client) => (
            <div
              key={client._id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition"
            >
              <div className="flex justify-center mb-4">
                <img
                  src={`${API_BASE}${client.logo}`}
                  alt={client.name}
                  className="h-24 w-auto object-contain"
                />
              </div>
              
              <h3 className="text-lg font-bold text-secondary text-center mb-2">
                {client.name}
              </h3>

              <div className="text-center mb-4">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  client.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {client.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(client)}
                  className="flex-1 bg-primary hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(client._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-4 text-center py-12 text-gray-500">
            No hay clientes. Crea el primero.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-secondary mb-4">
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nombre del Cliente *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ej: Empresa XYZ"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Logo del Cliente * {editingClient && '(Dejar vacío para mantener actual)'}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!editingClient}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, GIF, WEBP (máx. 5MB)</p>
                </div>

                {logoPreview && (
                  <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                    <img
                      src={logoPreview}
                      alt="Vista previa"
                      className="h-32 w-auto object-contain"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Orden</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-gray-500 mt-1">Menor número aparece primero</p>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="mr-2"
                  />
                  <label className="text-gray-700">Cliente activo</label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    {editingClient ? 'Actualizar' : 'Crear'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 rounded-lg font-semibold transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
