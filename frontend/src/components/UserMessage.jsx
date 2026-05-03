import { motion } from 'framer-motion';

export default function UserMessage({ message }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex justify-end my-6"
    >
      <div className="bg-blue-600 text-white px-6 py-4 rounded-3xl max-w-[85%] md:max-w-[75%] shadow-md text-[17px] rounded-br-sm leading-relaxed inline-block">
        {message}
      </div>
    </motion.div>
  );
}