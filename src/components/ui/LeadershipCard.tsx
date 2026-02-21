'use client';

import { useState } from 'react';
import Image from 'next/image';

interface LeadershipCardProps {
  name: string;
  role: string;
  photo: string;
  bio?: string;
}

export default function LeadershipCard({ name, role, photo, bio }: LeadershipCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        className="text-center cursor-pointer bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all"
        onClick={() => bio && setModalOpen(true)}
        role={bio ? 'button' : undefined}
        tabIndex={bio ? 0 : undefined}
        onKeyDown={(e) => { if (bio && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); setModalOpen(true); } }}
        aria-label={bio ? `View ${name}'s bio` : undefined}
      >
        <Image src={photo} alt={`${name} - ${role}`} width={400} height={400} className="w-full aspect-square object-cover" />
        <div className="p-5">
          <div className="text-lg font-bold text-navy">{name}</div>
          <div className="text-[0.8125rem] text-gray-500">{role}</div>
        </div>
      </div>

      {modalOpen && bio && (
        <div className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-6" role="dialog" aria-modal="true" aria-label={`${name} biography`} onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl max-w-[600px] w-full max-h-[90vh] overflow-y-auto p-10 relative" onClick={(e) => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-xl text-gray-500 hover:text-navy p-2" onClick={() => setModalOpen(false)} aria-label="Close">
              <i className="fas fa-times" />
            </button>
            <Image src={photo} alt={name} width={120} height={120} className="w-[120px] h-[120px] rounded-2xl object-cover mb-5" />
            <h3 className="text-2xl font-bold text-navy mb-1">{name}</h3>
            <p className="text-[0.9375rem] text-gray-500 mb-5">{role}</p>
            <div className="text-[0.9375rem] leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: bio }} />
          </div>
        </div>
      )}
    </>
  );
}
