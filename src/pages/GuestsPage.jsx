import CrudTable from '../components/CrudTable'

const GuestsPage = () => {
  const columns = [
    { key: 'sort_order', title: 'Порядок' },
    { key: 'id', title: 'ID' },
    { key: 'image_url', title: 'Изображение' },
    { key: 'name', title: 'Имя' },
    { key: 'text', title: 'Текст' },
  ]

  const formFields = [
    { name: 'sort_order', label: 'Порядок', type: 'number' },
    { name: 'image_url', label: 'URL изображения', type: 'url' },
    { name: 'name', label: 'Имя', type: 'text' },
    { name: 'text', label: 'Текст', type: 'textarea' },
  ]

  return <CrudTable endpoint="guests" columns={columns} formFields={formFields} />
}

export default GuestsPage