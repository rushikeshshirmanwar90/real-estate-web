import { MapPin, Ruler, WavesIcon, Wifi, SquareParking, VolleyballIcon } from "lucide-react";

const ProjectCard = () => {
    return (
        <div className="w-[68rem] bg-white rounded-2xl shadow-xl overflow-hidden flex">
            {/* Image Section */}
            <div className="w-1/2 relative">
                <img
                    src="https://res.cloudinary.com/dlcq8i2sc/image/upload/v1736101192/zecgarxhsduxqobi1szb.jpg"
                    alt="Luxury Suite Villa"
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-white text-gray-800 text-sm font-bold px-3 py-1 rounded-lg shadow">
                    OnGoing
                </div>
            </div>

            {/* Content Section */}
            <div className="w-1/2 p-5 flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Luxury Suite Villa</h2>
                    <p className="text-gray-600 flex items-center gap-2 mt-1">
                        <MapPin className="text-red-500 w-4 h-4" /> Los Angeles City, CA, USA
                    </p>

                    <p className="text-gray-500 text-sm mt-3">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim iste quis natus.
                    </p>

                    <div className="mt-3 flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
                            <Ruler className="w-4 h-4" /> 1200 sq
                        </div>
                    </div>

                    <div className="mt-3 flex gap-2 flex-wrap">
                        <div className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-700">
                            <WavesIcon className="w-4 h-4" /> Swimming Pool
                        </div>
                        <div className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-700">
                            <Wifi className="w-4 h-4" /> Wifi
                        </div>
                        <div className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-700">
                            <SquareParking className="w-4 h-4" /> Parking area
                        </div>
                        <div className="bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-2 text-gray-700">
                            <VolleyballIcon className="w-4 h-4" /> Playing Ground
                        </div>
                    </div>


                </div>

                {/* Button */}
                <button className="bg-[#073B3A] text-white text-center py-2 rounded-xl mt-3 hover:bg-[#073b3aed] transition">
                    View Project
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;
