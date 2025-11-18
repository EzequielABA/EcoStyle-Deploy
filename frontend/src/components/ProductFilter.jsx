export default function ProductFilter({ filters, categories = [], onChange, onSubmit, onClear }) {
  const emitChange = (campo, valor) => {
    // Compatibilidad: si onChange espera (campo, valor), úsalo; de lo contrario pasa el objeto completo
    if (typeof onChange === 'function') {
      if (onChange.length >= 2) {
        onChange(campo, valor)
      } else {
        onChange({ ...filters, [campo]: valor })
      }
    }
  }

  const handleInput = (e) => {
    const { name, value } = e.target
    let v = value
    if (name === 'precio_min' || name === 'precio_max') {
      v = value === '' ? '' : value
    }
    emitChange(name, v)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (typeof onSubmit === 'function') onSubmit(filters)
  }

  const handleClear = () => {
    if (typeof onClear === 'function') {
      onClear()
    } else {
      // Defaults de filtros usados en Products.jsx
      emitChange('buscar', '')
      emitChange('categoria', '')
      emitChange('precio_min', '')
      emitChange('precio_max', '')
      emitChange('orden', 'nombre_asc')
    }
  }

  const resolveCategoryOption = (cat) => {
    if (cat && typeof cat === 'object') {
      return { value: cat.id ?? cat.value ?? '', label: cat.nombre ?? cat.label ?? '' }
    }
    return { value: cat ?? '', label: String(cat ?? '') }
  }

  return (
    <form onSubmit={handleSubmit} className="filters-container">
      {/* Búsqueda */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={filters.buscar || ''}
          onChange={(e) => emitChange('buscar', e.target.value)}
          className="search-input"
        />
        <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      </div>

      {/* Fila de filtros */}
      <div className="filters-row">
        {/* Categoría */}
        <select
          value={filters.categoria || ''}
          onChange={(e) => emitChange('categoria', e.target.value)}
          className="filter-select"
        >
          <option value="">Todas las categorías</option>
          {categories.map((cat, idx) => {
            const opt = resolveCategoryOption(cat)
            return (
              <option key={opt.value || idx} value={opt.value}>{opt.label}</option>
            )
          })}
        </select>

        {/* Precio mínimo */}
        <input
          type="number"
          placeholder="Precio mín."
          value={filters.precio_min || ''}
          onChange={handleInput}
          name="precio_min"
          className="filter-input"
          min="0"
          step="0.01"
        />

        {/* Precio máximo */}
        <input
          type="number"
          placeholder="Precio máx."
          value={filters.precio_max || ''}
          onChange={handleInput}
          name="precio_max"
          className="filter-input"
          min="0"
          step="0.01"
        />

        {/* Orden */}
        <select
          value={filters.orden || 'nombre_asc'}
          onChange={(e) => emitChange('orden', e.target.value)}
          className="filter-select"
        >
          <option value="nombre_asc">Nombre A-Z</option>
          <option value="nombre_desc">Nombre Z-A</option>
          <option value="precio_asc">Precio menor</option>
          <option value="precio_desc">Precio mayor</option>
          <option value="fecha_desc">Más recientes</option>
        </select>

        {/* Acciones */}
        <div className="filter-actions">
          <button type="button" onClick={handleClear} className="btn btn-outline btn-sm">
            Limpiar
          </button>
          <button type="submit" className="btn btn-primary btn-sm">
            Aplicar
          </button>
        </div>
      </div>
    </form>
  )
}