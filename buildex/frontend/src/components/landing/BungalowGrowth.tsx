import { motion } from 'framer-motion';

export const BungalowGrowth = () => {
    return (
        <div className="relative w-full h-[500px] flex items-end justify-center overflow-hidden">

            {/* 1. The Ground/Plot */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1 }}
                className="absolute bottom-10 w-full h-2 bg-green-800/50 rounded-full blur-sm"
            />

            <div className="relative w-96 h-80 flex flex-col items-center justify-end z-10">

                {/* 5. The Roof */}
                <motion.div
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2.5, duration: 0.8, type: "spring" }}
                    className="w-[110%] h-0 border-l-[180px] border-r-[180px] border-b-[100px] border-l-transparent border-r-transparent border-b-slate-800 drop-shadow-2xl z-20"
                >
                    {/* Roof Detail/Window */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 3.2 }}
                        className="absolute top-[40px] left-[-20px] w-10 h-10 bg-slate-700 rounded-full border-4 border-slate-600 shadow-inner"
                    />
                </motion.div>

                {/* 4. First Floor / Main Body */}
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 160 }}
                    transition={{ delay: 1.5, duration: 1, ease: 'easeInOut' }}
                    className="w-[90%] bg-slate-100 border-x-4 border-slate-300 relative overflow-hidden shadow-xl"
                >
                    {/* Columns appearing first inside */}
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="absolute left-2 top-0 w-4 bg-slate-400 h-full"
                    />
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: '100%' }}
                        transition={{ delay: 1.7, duration: 0.8 }}
                        className="absolute right-2 top-0 w-4 bg-slate-400 h-full"
                    />

                    {/* Windows Fade In */}
                    <div className="flex justify-between px-8 pt-8">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 3.5 }}
                            className="w-20 h-24 bg-blue-200 border-4 border-slate-700 shadow-inner grid grid-cols-2 gap-1 p-1"
                        >
                            <div className="bg-blue-300/50"></div>
                            <div className="bg-blue-300/50"></div>
                            <div className="bg-blue-300/50"></div>
                            <div className="bg-blue-300/50"></div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 3.7 }}
                            className="w-20 h-24 bg-blue-200 border-4 border-slate-700 shadow-inner grid grid-cols-2 gap-1 p-1"
                        >
                            <div className="bg-blue-300/50"></div>
                            <div className="bg-blue-300/50"></div>
                            <div className="bg-blue-300/50"></div>
                            <div className="bg-blue-300/50"></div>
                        </motion.div>
                    </div>
                </motion.div>

                {/* 3. The Slab/Plinth Level */}
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '95%' }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="h-4 bg-slate-600 rounded-sm shadow-md z-10"
                />

                {/* 2. Ground Floor / Garage Section */}
                <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 100 }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    className="w-[95%] bg-slate-200 border-x-4 border-slate-300 flex items-end justify-between px-6 relative"
                >
                    {/* Garage Door */}
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 4 }}
                        className="w-32 h-24 bg-slate-400 border-t-8 border-slate-500 rounded-t-lg bg-[linear-gradient(transparent_9px,#334155_1px)] bg-[length:100%_10px]"
                    />

                    {/* Main Entry Door */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 4.2 }}
                        className="w-20 h-28 bg-amber-800 border-4 border-slate-700 relative mb-0"
                    >
                        <div className="absolute right-2 top-1/2 w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"></div>
                    </motion.div>
                </motion.div>

                {/* 1. Foundation */}
                <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-8 bg-slate-800 rounded-sm"
                />

            </div>

            {/* Trees/Environment (Popping up at end) */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 4.5, type: 'spring' }}
                className="absolute bottom-10 left-10 md:left-20 flex flex-col items-center"
            >
                <div className="w-16 h-16 bg-green-600 rounded-full -mb-2 z-10 shadow-lg" />
                <div className="w-4 h-12 bg-amber-900 rounded-sm" />
            </motion.div>

            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 4.7, type: 'spring' }}
                className="absolute bottom-10 right-10 md:right-20 flex flex-col items-center"
            >
                <div className="w-12 h-12 bg-green-500 rounded-full -mb-2 z-10 shadow-lg" />
                <div className="w-2 h-8 bg-amber-900 rounded-sm" />
            </motion.div>

        </div>
    );
};
