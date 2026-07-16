function ImpactBanner({ impact }) {
  if (!impact) return null;

  return (
    <div className="mb-6 rounded-2xl p-5 border border-green-200/60 shadow-sm" style={{
      background: "linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 50%, #a5d6a7 100%)"
    }}>
      <div className="flex items-start gap-3">
        <span className="text-3xl leading-none mt-0.5">🌍</span>
        <div>
          <h3 className="font-bold text-green-900 text-base mb-2">Your environmental impact</h3>
          <div className="flex flex-wrap gap-4">
            <div>
              <span className="text-2xl font-extrabold text-green-800">{impact.estimated_waste_diverted_grams}g</span>
              <p className="text-xs text-green-700/70 font-medium mt-0.5">waste diverted</p>
            </div>
            <div className="border-l border-green-300/60 pl-4">
              <span className="text-2xl font-extrabold text-green-800">{impact.estimated_co2_saved_grams}g</span>
              <p className="text-xs text-green-700/70 font-medium mt-0.5">CO₂ saved</p>
            </div>
          </div>
          <p className="text-xs text-green-700/50 mt-2.5">{impact.note}</p>
        </div>
      </div>
    </div>
  );
}

export default ImpactBanner;