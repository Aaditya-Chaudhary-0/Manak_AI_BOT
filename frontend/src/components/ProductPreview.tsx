

function ProductPreview() {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto bg-black rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-1">You</div>
          <div className="bg-gray-800 text-white rounded p-2">
            What are the safety standards for electric kettles?
          </div>
        </div>
        <div className="mb-4">
          <div className="text-sm text-gray-400 mb-1">MANAK AI</div>
          <div className="bg-gray-700 rounded p-2">
            <p className="mb-2">The relevant BIS standard is <span className="text-red-500 font-semibold">IS 1234:2022</span> – Safety requirements for electric kettles.</p>
            <p className="text-sm text-gray-300">This standard covers voltage limits, insulation, and thermal protection.</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs bg-green-700 text-green-100 px-2 py-1 rounded">Confidence: High</span>
              <a href="#" className="text-blue-400 hover:underline text-sm">View Source</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-600 pt-4 text-sm text-gray-400">
          Powered by MANAK AI – your BIS assistant.
        </div>
      </div>
    </section>
  );
}

export default ProductPreview;
