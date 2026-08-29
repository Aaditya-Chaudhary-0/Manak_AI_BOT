import { ListOrdered } from 'lucide-react';
import type { ImportantClause } from '../../data/mockStandardsData';

interface StandardClausesTableProps {
  clauses: ImportantClause[];
}

export function StandardClausesTable({ clauses }: StandardClausesTableProps) {
  if (!clauses || clauses.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-2xs space-y-4">
      <div className="flex items-center space-x-2 border-b border-gray-100 pb-3">
        <ListOrdered className="w-5 h-5 text-gray-700" />
        <h3 className="text-base font-bold text-gray-900">
          Important Standard Clauses & Test Methods
        </h3>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 w-28 shrink-0">Clause No.</th>
              <th className="py-3 px-4 w-48">Topic / Parameter</th>
              <th className="py-3 px-4">Requirement / Test Protocol Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {clauses.map((clause, idx) => (
              <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-gray-900 bg-gray-50/40">
                  {clause.clauseNumber}
                </td>
                <td className="py-3 px-4 font-semibold text-gray-900">
                  {clause.topic}
                </td>
                <td className="py-3 px-4 text-gray-600 leading-relaxed">
                  {clause.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StandardClausesTable;
