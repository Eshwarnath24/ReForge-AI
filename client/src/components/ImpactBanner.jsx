function ImpactBanner({ impact }) {
  if (!impact) return null;

  return (
    <div className="mb-6 rounded-3xl p-6 shadow-md" style={{
      background: "linear-gradient(135deg, #234b32 0%, #386641 50%, #4a7c59 100%)"
    }}>
      <div className="flex items-start gap-4">
        <span className="text-4xl leading-none mt-1">🌍</span>
        <div>
          <h3 className="font-bold text-[#fdfbf7] text-lg mb-2">Your environmental impact</h3>
          <div className="flex flex-wrap gap-5">
            <div>
              <span className="text-3xl font-extrabold text-white">{impact.estimated_waste_diverted_grams}g</span>
              <p className="text-sm text-[#e6dfcd] font-medium mt-0.5">waste diverted</p>
            </div>
            <div className="border-l border-[#e6dfcd]/30 pl-5">
              <span className="text-3xl font-extrabold text-white">{impact.estimated_co2_saved_grams}g</span>
              <p className="text-sm text-[#e6dfcd] font-medium mt-0.5">CO₂ saved</p>
            </div>
          </div>
          <p className="text-xs text-[#e6dfcd]/70 mt-3">{impact.note}</p>
        </div>
      </div>
    </div>
  );
}

export default ImpactBanner;