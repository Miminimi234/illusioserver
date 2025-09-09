"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ManifestoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Manifesto({ isOpen, onClose }: ManifestoProps) {
  const manifestoText = `Illusio exists because markets behave like a simulation that keeps claiming to be reality. Prices flicker, narratives multiply, and most of what you see is noise laid over a smaller signal. Our job is to build an instrument that lets you see the signal early enough to matter.

We start by treating every token as an experiment. First we measure what is actually there. Wallets that enter and leave. Liquidity that holds or slips. Order flow that speeds up or stalls. We look for the rare events that quietly bend the curve. This is the work of the Analyzer. It takes the blur apart and gives it structure you can inspect.

Next we ask where the path is heading. The Predictor does not promise miracles. It fits a trajectory from what has been observed and shows its uncertainty out loud. You get a direction, a speed, and a range rather than a slogan. If the world changes, the fit changes with it.

Then we repair the record. The Quantum Eraser removes what should never have counted in the first place. Spoofed orders, wash trades, synthetic depth, and other tricks are filtered out so the remaining history is something you can trust. Good inputs make better forecasts. There is no mystery there.

Finally we let tomorrow talk to today. The retrocausality engine runs many possible futures and looks for the footprints they would leave in the present. When those footprints begin to appear in live data, confidence rises. When they fail to appear, confidence falls. You watch cause and effect meet in the middle rather than guessing from one side.

All of this is visible. The Retrocausality Lab shows live transactions as pulses through a simple diagram of the experiment. You can see which branch a trade reinforces, which detector lights up, and how those paths update the forecast in real time. The result is not a prophecy. It is a decision aid that is honest about what is known, what is changing, and what remains uncertain.

Illusio is not about worshiping charts or chasing stories. It is about building better instruments and using them with discipline. Certainty is not available. Clarity is. We measure, we clean, we simulate, we compare, and then we act when the picture is good enough and still early. That is the point of the project and the promise we intend to keep.`;

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
              fontFamily: ' STILL, monospace',
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
