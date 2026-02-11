import { motion, Variants } from 'framer-motion';

export const BuildingGrowth = () => {
    // Floor configuration
    const floors = 6;
    const windowsPerFloor = 4;

    const buildingVariants: Variants = {
        hidden: { height: 0 },
        visible: {
            height: 'auto',
            transition: {
                duration: 3,
                ease: "easeInOut",
                staggerChildren: 0.5
            }
        }
    };

    const floorVariants: Variants = {
        hidden: { opacity: 0, scaleY: 0, y: 50 },
        visible: {
            opacity: 1,
            scaleY: 1,
            y: 0,
            transition: { duration: 0.8, type: "spring" }
        }
    };

    return (
        <div className="relative w-full h-full flex items-end justify-center perspective-[1000px]">
            {/* Ground Base */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="absolute bottom-0 w-3/4 h-4 bg-gray-800 rounded-full blur-md opacity-50"
            />

            <div className="relative flex flex-col items-center justify-end">
                {/* Crane (Optional simple SVG representation) */}

                {/* Building Structure */}
                <motion.div
                    className="w-48 md:w-64 bg-slate-900 border-x-2 border-t-2 border-slate-700/50 rounded-t-xl overflow-hidden shadow-2xl relative z-10"
                    initial="hidden"
                    animate="visible"
                    variants={buildingVariants}
                >
                    {/* Roof */}
                    <div className="h-8 bg-slate-800 border-b border-slate-700 flex items-center justify-center gap-4">
                        <div className="w-2 h-4 bg-red-500/50 rounded-t animate-pulse"></div>
                        <div className="w-1 h-6 bg-slate-400"></div>
                    </div>

                    {/* Floors */}
                    {Array.from({ length: floors }).map((_, i) => (
                        <motion.div
                            key={i}
                            variants={floorVariants}
                            className="h-16 border-b border-slate-700/50 bg-slate-800/80 backdrop-blur-sm relative flex items-center justify-evenly px-4"
                        >
                            {/* Windows */}
                            {Array.from({ length: windowsPerFloor }).map((_, w) => (
                                <motion.div
                                    key={w}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0.5, 1] }}
                                    transition={{ delay: 2 + (i * 0.2) + (w * 0.1), duration: 2, repeat: Infinity, repeatDelay: 5 }}
                                    className="w-6 h-10 bg-gradient-to-b from-blue-300/20 to-blue-500/10 border border-blue-400/20 rounded-sm"
                                />
                            ))}
                        </motion.div>
                    ))}

                    {/* Ground Floor (Lobby) */}
                    <motion.div variants={floorVariants} className="h-24 bg-slate-900 border-t-4 border-slate-600 flex items-end justify-center pb-0 relative overflow-hidden">
                        <div className="absolute inset-0 bg-yellow-500/5 animate-pulse" />
                        <div className="w-12 h-16 bg-gradient-to-t from-blue-500/20 to-transparent border-x border-t border-blue-400/30 rounded-t-lg mx-2" />
                        <div className="w-12 h-16 bg-gradient-to-t from-blue-500/20 to-transparent border-x border-t border-blue-400/30 rounded-t-lg mx-2" />
                    </motion.div>

                </motion.div>

                {/* Reflection/Shadow */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.4 }}
                    transition={{ delay: 2 }}
                    className="w-48 md:w-64 h-24 bg-gradient-to-b from-slate-900 to-transparent transform scale-y-[-1] opacity-30 blur-sm mask-image-gradient"
                />
            </div>
        </div>
    );
};
