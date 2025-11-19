import { useState, useEffect } from 'react';
import { corporatePlansAPI } from '../services/api';

const CorporatePlans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    currency: 'USD',
    billingPeriod: 'monthly',
    description: '',
    features: [''],
    recommended: false,
    isActive: true,
    maxUsers: 0,
    support: 'básico'
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await corporatePlansAPI.getAll();
      setPlans(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error('Error cargando planes:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const cleanedData = {
        ...formData,
        features: formData.features.filter(feat => feat.trim() !== '')
      };

      if (editingPlan) {
        await corporatePlansAPI.update(editingPlan._id, cleanedData);
      } else {
        await corporatePlansAPI.create(cleanedData);
      }
      
      loadPlans();
      closeModal();
    } catch (error) {
      console.error('Error guardando plan:', error);
      alert('Error al guardar el plan');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este plan?')) {
      try {
        await corporatePlansAPI.delete(id);
        loadPlans();
      } catch (error) {
        console.error('Error eliminando plan:', error);
        alert('Error al eliminar el plan');
      }
    }
  };

  const openModal = (plan = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        billingPeriod: plan.billingPeriod,
        description: plan.description,
        features: plan.features.length > 0 ? plan.features : [''],
        recommended: plan.recommended,
        isActive: plan.isActive,
        maxUsers: plan.maxUsers || 0,
        support: plan.support
      });
    } else {
      setEditingPlan(null);
      setFormData({
        name: '',
        price: 0,
        currency: 'USD',
        billingPeriod: 'monthly',
        description: '',
        features: [''],
        recommended: false,
        isActive: true,
        maxUsers: 0,
        support: 'básico'
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingPlan(null);
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  if (loading) {
    return <div className="text-center py-12">Cargando planes...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-secondary">Gestión de Planes Corporativos</h1>
        <button
          onClick={() => openModal()}
          className="bg-primary hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          + Nuevo Plan
        </button>
      </div>

      {/* Lista de planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div
              key={plan._id}
              className={`bg-white rounded-lg shadow-md p-6 ${
                plan.recommended ? 'ring-4 ring-accent' : ''
              }`}
            >
              {plan.recommended && (
                <div className="bg-accent text-white text-center py-1 rounded mb-4 font-semibold">
                  ⭐ Recomendado
                </div>
              )}

              <h3 className="text-2xl font-bold text-secondary mb-2">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary">${plan.price}</span>
                <span className="text-gray-600 ml-2">
                  {plan.currency} / {plan.billingPeriod === 'monthly' ? 'mes' : plan.billingPeriod === 'yearly' ? 'año' : 'único'}
                </span>
              </div>

              <p className="text-gray-600 mb-4">{plan.description}</p>

              <div className="mb-4">
                <h4 className="font-semibold text-secondary mb-2">Características:</h4>
                <ul className="space-y-1 text-sm">
                  {plan.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-start text-gray-600">
                      <span className="text-success mr-2">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {plan.features.length > 4 && (
                    <li className="text-gray-500">+{plan.features.length - 4} más...</li>
                  )}
                </ul>
              </div>

              <div className="mb-4 text-sm text-gray-500">
                {plan.maxUsers > 0 && <div>👥 Hasta {plan.maxUsers} usuarios</div>}
                <div>🎧 Soporte {plan.support}</div>
              </div>

              <div className="mb-4">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  plan.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {plan.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openModal(plan)}
                  className="flex-1 bg-primary hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition text-sm"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(plan._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No hay planes. Crea el primero.
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-secondary mb-4">
                {editingPlan ? 'Editar Plan' : 'Nuevo Plan'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Nombre del Plan *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Precio *</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Moneda</label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="USD">USD</option>
                      <option value="COP">COP</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Período</label>
                    <select
                      value={formData.billingPeriod}
                      onChange={(e) => setFormData({ ...formData, billingPeriod: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="monthly">Mensual</option>
                      <option value="yearly">Anual</option>
                      <option value="one-time">Pago único</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Descripción *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Características *</label>
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Característica"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-primary hover:text-blue-700 font-semibold"
                  >
                    + Agregar característica
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Máx. Usuarios</label>
                    <input
                      type="number"
                      value={formData.maxUsers}
                      onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Soporte</label>
                    <select
                      value={formData.support}
                      onChange={(e) => setFormData({ ...formData, support: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="básico">Básico</option>
                      <option value="prioritario">Prioritario</option>
                      <option value="24/7">24/7</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.recommended}
                      onChange={(e) => setFormData({ ...formData, recommended: e.target.checked })}
                      className="mr-2"
                    />
                    <label className="text-gray-700">Plan recomendado</label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                      className="mr-2"
                    />
                    <label className="text-gray-700">Plan activo</label>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                  >
                    {editingPlan ? 'Actualizar' : 'Crear'}
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

export default CorporatePlans;