function SkillLevelSelect({ value, onChange }) {
  return (
    <div className="mb-4">
      <label htmlFor="skill-level" className="block font-semibold mb-2 text-gray-800 text-sm">
        Your skill level
      </label>
      <select
        id="skill-level"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-auto px-3.5 py-2.5 border border-gray-200 rounded-xl text-gray-700 bg-gray-50/50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm transition-all cursor-pointer"
      >
        <option value="Beginner">🌱 Beginner — keep it simple</option>
        <option value="Intermediate">🔧 Intermediate — I've got some tools</option>
        <option value="Advanced">⚡ Advanced — bring it on</option>
      </select>
    </div>
  );
}

export default SkillLevelSelect;