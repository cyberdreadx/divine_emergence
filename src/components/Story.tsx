import meditation from "@/assets/de-meditation.webp";

const facts = [
  "Going on 5 years of experience as a breathwork specialist.",
  "A background in psychology and mental health / substance abuse.",
  "Psychedelic-assisted therapy helped me permanently end my relationship with prescription medication.",
];

const Story = () => {
  return (
    <section id="about" className="py-20 md:py-32 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <span className="text-gold font-sans text-xs uppercase tracking-[0.3em] block mb-6">
          Welcome to Divine Emergence
        </span>

        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl md:sticky md:top-24">
            <img
              src={meditation}
              alt="A moment of stillness in breathwork"
              className="w-full aspect-[4/5] object-cover"
              loading="lazy"
            />
          </div>

          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-foreground leading-[1.15] mb-8">
              I'm Laura, a psychospiritual practitioner based in{" "}
              <span className="italic text-gold">South Florida</span>.
            </h2>

            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                I tried everything. Medication, talk therapy, rehab, psychiatric
                care. I did the work that was supposed to "work." After years of
                exploring western medicine, I felt defeated because none of it was
                addressing what was actually there: unprocessed emotion and stored
                trauma living in my <span className="text-foreground">body</span>.
                Not just the mind.
              </p>
              <p>
                When I found breathwork, something became evident. My nervous system
                started to regulate. Emotions I'd been carrying for years finally had
                somewhere to go. It was the first thing that worked at the level I
                actually needed it to.
              </p>
              <p>
                I left my master's psychology program. I left my career in dual
                diagnosis. I went all in on this work because I saw what was possible
                when someone stopped managing and masking their pain and started
                moving through it.
              </p>
              <p className="text-foreground font-serif text-xl italic leading-relaxed">
                I don't provide symptom relief or coping strategies. We dive into a
                holistic approach that creates actual transformation.
              </p>
            </div>

            <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
              <h3 className="font-serif text-lg text-foreground mb-4">Three things about me</h3>
              {facts.map((f, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="font-serif text-gold text-lg leading-none mt-0.5">
                    0{i + 1}
                  </span>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Story;
