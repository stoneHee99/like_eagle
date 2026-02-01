import { useState } from 'react';
import { CustomSelect } from './CustomSelect';

interface UserInfoModalProps {
  onSubmit: (info: { temple: string; generation: string; name: string }) => void;
}

const templeNames = [
  "강남", "경주", "과천", "광명", "광주", "구리", "김포", "남양", "당진", "대구",
  "대전", "동탄", "부곡", "부천", "부평", "산서", "서산", "세종", "수원", "시화",
  "시흥", "아산", "안산", "안양", "안중", "양주", "영등포", "영종도", "영통", "온양",
  "용인", "원주", "율전", "인제", "인천", "일산", "장유", "전원", "전주평화", "전주효자",
  "진위", "진주", "천안", "충주", "판교", "평택", "포일"
];

const templeOptions = templeNames.map(name => ({
  value: `${name}성전`,
  label: `🏛️ ${name}성전`,
}));

const generationOptions = Array.from({ length: 37 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}기`,
}));

export function UserInfoModal({ onSubmit }: UserInfoModalProps) {
  const [temple, setTemple] = useState('');
  const [generation, setGeneration] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (temple && generation && name) {
      onSubmit({ temple, generation, name });
    }
  };

  const isValid = temple && generation && name.trim();

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6 z-50"
    >
      <div
        className="bg-gradient-to-b from-white to-amber-50 rounded-3xl w-4/5 shadow-2xl border-4 border-amber-200"
        style={{ padding: '32px 24px' }}
      >
        {/* Header */}
        <div className="text-center" style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🦅</div>
          <h2 className="text-amber-700 font-bold" style={{ fontSize: '18px', marginBottom: '4px' }}>
            독수리 의원에 오신 것을 환영합니다
          </h2>
          <p className="text-amber-500" style={{ fontSize: '12px' }}>
            말씀 처방을 위해 정보를 입력해주세요
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* 성전 */}
          <div style={{ marginBottom: '16px' }}>
            <label className="block text-amber-700 font-bold" style={{ fontSize: '14px', marginBottom: '6px' }}>
              성전
            </label>
            <CustomSelect
              value={temple}
              onChange={setTemple}
              options={templeOptions}
              placeholder="성전을 선택하세요"
            />
          </div>

          {/* 기수 */}
          <div style={{ marginBottom: '16px' }}>
            <label className="block text-amber-700 font-bold" style={{ fontSize: '14px', marginBottom: '6px' }}>
              기수
            </label>
            <CustomSelect
              value={generation}
              onChange={setGeneration}
              options={generationOptions}
              placeholder="기수를 선택하세요"
            />
          </div>

          {/* 이름 */}
          <div style={{ marginBottom: '24px' }}>
            <label className="block text-amber-700 font-bold" style={{ fontSize: '14px', marginBottom: '6px' }}>
              이름
            </label>
            <input
              type="text"
              placeholder="이름을 입력하세요"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '14px',
                backgroundColor: 'white',
                border: '2px solid #FDE68A',
                borderRadius: '12px',
                color: '#78350F',
                outline: 'none',
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid}
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '16px',
              cursor: isValid ? 'pointer' : 'not-allowed',
              background: isValid
                ? 'linear-gradient(to right, #FBBF24, #F97316)'
                : '#E5E7EB',
              color: isValid ? 'white' : '#9CA3AF',
              boxShadow: isValid ? '0 4px 12px rgba(251, 191, 36, 0.4)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            시작하기 ✨
          </button>
        </form>
      </div>
    </div>
  );
}
