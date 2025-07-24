import CrudTable from '../components/CrudTable'

const TicketsPage = () => {
  const columns = [
    { key: 'sort_order', title: 'Порядок' },
    { key: 'id', title: 'ID' },
    { key: 'svg_icon', title: 'Иконка' },
    { key: 'name', title: 'Название' },
    { key: 'description', title: 'Описание' },
    { key: 'price', title: 'Цена' },
    { key: 'button_name', title: 'Текст кнопки' },
    { key: 'background_color', title: 'Цвет фона' },
    { key: 'is_active', title: 'Активен' },
  ]

  const formFields = [
    { name: 'sort_order', label: 'Порядок', type: 'number' },
    { name: 'svg_icon', label: 'SVG иконка', type: 'text' },
    { name: 'name', label: 'Название', type: 'text' },
    { name: 'description', label: 'Описание (через ;)', type: 'textarea' },
    { name: 'price', label: 'Цена', type: 'text' },
    { name: 'button_name', label: 'Текст кнопки', type: 'text' },
    { name: 'background_color', label: 'Цвет фона', type: 'color' },
    { name: 'is_active', label: 'Активен', type: 'checkbox' },
  ]

  return <CrudTable endpoint="tickets" columns={columns} formFields={formFields} />
}

export default TicketsPage