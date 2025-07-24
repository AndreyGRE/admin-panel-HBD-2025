import { useState, useEffect } from "react";
import ModalForm from "./ModalForm";

const CrudTable = ({ endpoint, columns, formFields }) => {
    const [data, setData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(
                `https://devnewlk2.gwd.ru:5000/api/${endpoint}`
            );
            if (!response.ok) throw new Error("Ошибка загрузки данных");
            const result = await response.json();
            setData(result);
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Не удалось загрузить данные");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [endpoint]);

    const handleDelete = async (id) => {
        if (!window.confirm("Вы уверены, что хотите удалить эту запись?"))
            return;

        try {
            const response = await fetch(
                `https://devnewlk2.gwd.ru:5000/api/${endpoint}/${id}`,
                {
                    method: "DELETE",
                }
            );
            if (!response.ok) throw new Error("Ошибка удаления");
            fetchData();
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Не удалось удалить запись");
        }
    };

    const handleSubmit = async (formData) => {
        const url = currentItem
            ? `https://devnewlk2.gwd.ru:5000/api/${endpoint}/${currentItem.id}`
            : `https://devnewlk2.gwd.ru:5000/api/${endpoint}`;

        const method = currentItem ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Ошибка сохранения");

            setIsModalOpen(false);
            setCurrentItem(null);
            fetchData();
        } catch (error) {
            console.error("Ошибка:", error);
            alert("Не удалось сохранить данные");
        }
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-xl font-semibold text-gray-800">
                    Управление данными
                </h2>
                <button
                    onClick={() => {
                        setCurrentItem(null);
                        setIsModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                    Добавить
                </button>
            </div>

            {isLoading ? (
                <div className="p-8 text-center">Загрузка...</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {columns.map((column) => (
                                    <th
                                        key={column.key}
                                        scope="col"
                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                    >
                                        {column.title}
                                    </th>
                                ))}
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Действия
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {data.map((item) => (
                                <tr key={item.id}>
                                    {columns.map((column) => (
                                        <td
                                            key={column.key}
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                        >
                                            {column.key === "image_url" ? (
                                                <img
                                                    src={item[column.key]}
                                                    alt=""
                                                    className="h-10 w-10 rounded-full"
                                                />
                                            ) : (
                                                item[column.key]
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => {
                                                setCurrentItem(item);
                                                setIsModalOpen(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-900 mr-3"
                                        >
                                            Редактировать
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(item.id)
                                            }
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ModalForm
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setCurrentItem(null);
                }}
                onSubmit={handleSubmit}
                fields={formFields}
                initialData={currentItem}
                title={currentItem ? "Редактирование" : "Добавление"}
            />
        </div>
    );
};

export default CrudTable;
