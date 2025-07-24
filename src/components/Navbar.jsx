const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'guests', name: 'Гости' },
    { id: 'speakers', name: 'Спикеры' },
    { id: 'invited_speakers', name: 'Приглашенные спикеры' },
    { id: 'tickets', name: 'Билеты' },
  ]

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between">
          <div className="flex space-x-4">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-4 font-medium text-sm ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar