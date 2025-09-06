"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ManifestoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Manifesto({ isOpen, onClose }: ManifestoProps) {
  const manifestoText = `We live like lab techs inside a simulation that keeps pretending it is the real world. Markets are its weather. Prices move like particles through a chamber. Most of what you see is noise, a storm of fake trails and staged collisions. We are here to cut through it.

We treat every token as an experiment. Measure the mass. Track the flows. Watch the rare events that bend the curve. Our Analyzer pulls structure from the blur. Our Predictor fits trajectories to the next tick and the next hour, not with faith but with evidence and error bars. Our Quantum Eraser deletes the lies in the record and keeps the paths that survive contact with reality. Our Retrocausality lets tomorrow whisper to today by simulating futures and feeding the feedback right back into the present.

This is not about worshiping charts. It is about building instruments that make the hidden field visible. When the simulation twitches, we see the twitch. When it tries to mislead us, we remove the trick and keep the truth.

We accept that certainty is a myth. But clarity is not. We will never know everything. We will know enough to act. And we will act before the crowd.`;

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[50] bg-black/80 backdrop-blur-sm flex items-center justify-center p-8 cursor-default"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="bg-black/90 border border-white/20 rounded-lg p-8 max-w-4xl max-h-[80vh] overflow-y-auto relative cursor-default"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: 'VT323, monospace',
            }}
          >
            {/* Manifesto content */}
            <div className="text-white leading-relaxed space-y-6">
              <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-4">
                <h1 className="text-3xl font-bold">
                  MANIFESTO
                </h1>
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="text-white/60 hover:text-white transition-colors duration-200 text-2xl ml-4 cursor-pointer"
                  aria-label="Close manifesto"
                >
                  ×
                </button>
              </div>
              
              <div className="text-lg space-y-4">
                {manifestoText.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="indent-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
