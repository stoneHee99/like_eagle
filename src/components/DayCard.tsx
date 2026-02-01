interface DayCardProps {
  day: number;
  isUnlocked: boolean;
  isToday: boolean;
  isOpened: boolean;
  isAnimating: boolean;
  onClick: () => void;
}

const pillColors = [
  { left: '#F6D76B', right: '#DFA23C' }, // amber
  { left: '#F2A9A9', right: '#D44B4B' }, // red
  { left: '#9FC0FF', right: '#3C64F4' }, // blue
  { left: '#A7E9B2', right: '#44B85A' }, // green
  { left: '#C7B5FF', right: '#6D4CF4' }, // purple
  { left: '#F5C18D', right: '#E07A2E' }, // orange
  { left: '#F2A7E5', right: '#C94AA6' }, // pink
];

export function DayCard({ day, isUnlocked, isToday, isOpened, isAnimating, onClick }: DayCardProps) {
  const colorIndex = (day - 1) % pillColors.length;
  const colors = pillColors[colorIndex];

  // 카드 스타일 (약통 느낌)
  const cardStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1',
    backgroundColor: '#fffaf0',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: isToday
      ? '0 8px 20px rgba(251, 191, 36, 0.4)'
      : '0 6px 12px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    cursor: isUnlocked ? 'pointer' : 'not-allowed',
    opacity: isUnlocked ? 1 : 0.6,
    border: isToday ? '2px solid #FBBF24' : 'none',
  };

  // 알약 캡슐 스타일 (가로로 눕힌 형태)
  const capsuleStyle: React.CSSProperties = {
    width: 'clamp(22px, 60%, 34px)',
    height: 'clamp(12px, 35%, 18px)',
    borderRadius: '999px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    overflow: 'hidden',
    transform: 'rotate(-10deg)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
  };

  // 잠긴 상태
  if (!isUnlocked) {
    return (
      <div style={cardStyle}>
        {/* 구멍 장식 */}
        <CutoutDecorations />

        {/* 날짜 */}
        <span style={dayNumStyle}>{day}</span>

        {/* 잠긴 알약 */}
        <div style={{ ...capsuleStyle, opacity: 0.5 }}>
          <span style={{ background: '#D1D5DB' }} />
          <span style={{ background: '#9CA3AF' }} />
        </div>

        {/* 자물쇠 */}
        <div style={{ position: 'absolute', fontSize: '10px' }}>🔒</div>
      </div>
    );
  }

  // 열린 상태 (이미 본 말씀)
  if (isOpened && !isAnimating) {
    return (
      <button onClick={onClick} style={{ ...cardStyle, border: 'none', background: '#fffaf0' }}>
        <CutoutDecorations />
        <span style={dayNumStyle}>{day}</span>

        {/* 열린 알약 - 살짝 벌어진 모습 */}
        <div style={{ position: 'relative', width: '36px', height: '24px' }}>
          <div
            style={{
              position: 'absolute',
              left: '0px',
              width: '18px',
              height: '14px',
              backgroundColor: colors.left,
              borderRadius: '999px 4px 4px 999px',
              transform: 'rotate(-25deg) translateX(-2px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '0px',
              width: '18px',
              height: '14px',
              backgroundColor: colors.right,
              borderRadius: '4px 999px 999px 4px',
              transform: 'rotate(5deg) translateX(2px)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          />
        </div>
      </button>
    );
  }

  // 애니메이션 중
  if (isAnimating) {
    return (
      <div style={cardStyle}>
        <CutoutDecorations />
        <span style={dayNumStyle}>{day}</span>

        <div style={{ position: 'relative', width: '36px', height: '24px' }}>
          <div
            style={{
              position: 'absolute',
              left: '0px',
              width: '18px',
              height: '14px',
              backgroundColor: colors.left,
              borderRadius: '999px 4px 4px 999px',
              animation: 'capsuleOpenLeft 0.6s ease-out forwards',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: '0px',
              width: '18px',
              height: '14px',
              backgroundColor: colors.right,
              borderRadius: '4px 999px 999px 4px',
              animation: 'capsuleOpenRight 0.6s ease-out forwards',
            }}
          />
        </div>

        <style>{`
          @keyframes capsuleOpenLeft {
            0% { transform: rotate(-10deg) translateX(0); }
            100% { transform: rotate(-25deg) translateX(-4px); }
          }
          @keyframes capsuleOpenRight {
            0% { transform: rotate(-10deg) translateX(0); }
            100% { transform: rotate(5deg) translateX(4px); }
          }
        `}</style>
      </div>
    );
  }

  // 닫힌 상태 (아직 안 본 말씀)
  return (
    <button onClick={onClick} style={{ ...cardStyle, border: isToday ? '2px solid #FBBF24' : 'none', background: '#fffaf0' }}>
      <CutoutDecorations />
      <span style={dayNumStyle}>{day}</span>

      {/* 닫힌 알약 */}
      <div style={capsuleStyle} className={isToday ? 'animate-pulse' : ''}>
        <span style={{ background: colors.left }} />
        <span style={{ background: colors.right }} />
        {/* 광택 효과 */}
        <div
          style={{
            position: 'absolute',
            left: '12%',
            top: '18%',
            width: '48%',
            height: '55%',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.35)',
            pointerEvents: 'none',
          }}
        />
        {/* 중앙 구분선 */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '2px',
            bottom: '2px',
            width: '2px',
            transform: 'translateX(-1px)',
            background: 'rgba(255,255,255,0.65)',
            borderRadius: '999px',
          }}
        />
      </div>

      {isToday && (
        <div
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            fontSize: '10px',
          }}
        >
          ✨
        </div>
      )}
    </button>
  );
}

// 날짜 숫자 스타일
const dayNumStyle: React.CSSProperties = {
  position: 'absolute',
  top: '6px',
  left: '8px',
  fontSize: 'clamp(11px, 3vw, 14px)',
  fontWeight: 500,
  color: 'rgba(0,0,0,0.5)',
  lineHeight: 1,
};

// 약통 구멍 장식 컴포넌트
function CutoutDecorations() {
  const cutoutStyle: React.CSSProperties = {
    position: 'absolute',
    width: '12px',
    height: '12px',
    borderRadius: '999px',
    background: '#FEF3C7',
    pointerEvents: 'none',
  };

  return (
    <>
      {/* 좌우 구멍 */}
      <span style={{ ...cutoutStyle, left: '-6px', top: '50%', transform: 'translateY(-50%)' }} />
      <span style={{ ...cutoutStyle, right: '-6px', top: '50%', transform: 'translateY(-50%)' }} />
      {/* 상하 구멍 */}
      <span style={{ ...cutoutStyle, top: '-6px', left: '50%', transform: 'translateX(-50%)' }} />
      <span style={{ ...cutoutStyle, bottom: '-6px', left: '50%', transform: 'translateX(-50%)' }} />
    </>
  );
}
