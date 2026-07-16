function SkillLevelSelect({ value, onChange }) {
  return (
    <div className="mb-4">
      <label htmlFor="skill-level" className="block font-semibold mb-2 text-gray-800">
        Your skill level
      </label>
      <select
        id="skill-level"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>
    </div>
  );
}

export default SkillLevelSelect;