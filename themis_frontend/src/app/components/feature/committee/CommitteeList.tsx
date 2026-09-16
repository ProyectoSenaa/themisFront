import React from 'react';

interface CommitteeListProps {
  committees: Array<{ id: string; Tipo_de_comite: string; fecha: string }>;
  onSelectCommittee: (committee: { id: string; Tipo_de_comite: string; fecha: string }) => void;
}

const CommitteeList: React.FC<CommitteeListProps> = ({ committees, onSelectCommittee }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold text-gray-900">Comités ({committees.length})</h3>
      <ul className="divide-y divide-gray-100">
        {committees.map((committee) => (
          <li
            key={committee.id}
            className="p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => onSelectCommittee(committee)}
          >
            <div className="font-medium text-gray-800">{committee.Tipo_de_comite}</div>
            <div className="text-sm text-gray-600">{committee.fecha}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CommitteeList;
