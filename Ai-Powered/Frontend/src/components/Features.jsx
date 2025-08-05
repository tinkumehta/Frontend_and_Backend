const features = [
  { title: "Content Generation", desc: "Use AI to instantly generate high-quality content." },
  { title: "Built for Speed", desc: "Generate, edit, and export in seconds." },
  { title: "Cloud-Synced", desc: "Access your drafts anywhere, anytime." },
];

export default function Features() {
  return (
    <section className="py-16 px-6 bg-white text-gray-900 text-center">
      <h2 className="text-3xl font-bold mb-6">Features</h2>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((f, idx) => (
          <div key={idx} className="p-6 border rounded-2xl shadow hover:shadow-md transition">
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
