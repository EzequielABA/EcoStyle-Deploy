import { useState } from 'react'
import { createUser } from '../services/api'

export default function ContactForm() {
  const [form, setForm] = useState({ nombre: '', correo: '', mensaje: '' })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setStatus('Enviando…')
      await createUser(form)
      setStatus('Gracias por contactarnos')
      setForm({ nombre: '', correo: '', mensaje: '' })
    } catch (error) {
      console.error(error)
      setStatus('Error al enviar. Intenta nuevamente.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid form-narrow reveal">
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required className="input" />
      <input name="correo" type="email" placeholder="Correo" value={form.correo} onChange={handleChange} required className="input" />
      <textarea name="mensaje" placeholder="Mensaje" value={form.mensaje} onChange={handleChange} rows={4} className="textarea" />
      <button type="submit" className="btn btn-primary">Enviar</button>
      {status && <p className="form-status">{status}</p>}
    </form>
  )
}