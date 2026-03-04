/* eslint-disable prettier/prettier */
import LayoutDashboard from '@/app/layouts/AdminLayout';


export default function Denegado({ title, message }) {
    return (
        <LayoutDashboard>
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h2 className="mb-6 text-2xl leading-tight font-semibold">
                                {title}
                            </h2>
                            <p>{message}</p>
                        </div>
                    </div>
                </div>
            </div>
        </LayoutDashboard>
    );
}


