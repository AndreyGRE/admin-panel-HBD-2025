import CrudTable from '../components/CrudTable'

const SpeakersPage = () => {
  const columns = [
    { key: 'sort_order', title: 'Порядок' },
    { key: 'id', title: 'ID' },
    { key: 'image_url', title: 'Изображение' },
    { key: 'text1', title: 'Текст 1' },
    { key: 'text2', title: 'Текст 2' },
    { key: 'text3', title: 'Текст 3' },
    { key: 'video_url', title: 'Видео' },
  ]

  const formFields = [
    { name: 'sort_order', label: 'Порядок', type: 'number' },
    { name: 'image_url', label: 'URL изображения', type: 'url' },
    { name: 'text1', label: 'Текст 1', type: 'text' },
    { name: 'text2', label: 'Текст 2', type: 'text' },
    { name: 'text3', label: 'Текст 3', type: 'text' },
    { name: 'video_url', label: 'URL видео', type: 'url' },
  ]

  return <CrudTable endpoint="speakers" columns={columns} formFields={formFields} />
}

export default SpeakersPage