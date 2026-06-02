"use client";

import { motion } from "motion/react";
import { CONTENT } from "@/lib/constants";
import { letterParagraph } from "@/lib/animations";

/**
 * Section 6 — The Letter (climax).
 *
 * The previous (dark) section gives way to a warm paper background. A white
 * band at the very top sells the "fade to white, then paper" transition. Each
 * paragraph fades + rises into place as it scrolls into view. The signature is
 * set in the handwriting font, in gold.
 */
export function Letter() {
  return (
    <section className="paper-texture relative px-6 py-32 sm:py-48">
      {/* fade-to-white transition coming out of the dark memory scene */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-white to-transparent"
      />

      <article className="relative mx-auto max-w-[56ch] text-center">
        {CONTENT.letter.paragraphs.map((para, i) => (
          <motion.p
            key={i}
            variants={letterParagraph}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.6 }}
            className="mb-10 font-display text-[1.3rem] leading-[1.7] text-neutral-800 sm:text-[1.4rem]"
          >
            {para}
          </motion.p>
        ))}

        <motion.p
          variants={letterParagraph}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          className="mt-16 font-signature text-4xl text-[#b8945f] sm:text-5xl"
        >
          {CONTENT.letter.signature}
        </motion.p>
      </article>
    </section>
  );
}
