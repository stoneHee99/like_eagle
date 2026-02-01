import { useState, useEffect } from 'react';
import { DayCard } from './DayCard';
import { VerseModal } from './VerseModal';
import { UserInfoModal } from './UserInfoModal';
import { fetchAdventVerses } from '../api/advent';
import type { Verse } from '../data/verses';
import { mapApiVerseToVerse } from '../data/verses';

const STORAGE_KEY = 'eagle-clinic-opened-days';
const USER_INFO_KEY = 'eagle-clinic-user-info';
const VERSES_KEY = 'eagle-clinic-verses';

interface UserInfo {
  temple: string;
  generation: string;
  name: string;
}

export function Calendar() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [openedDays, setOpenedDays] = useState<number[]>([]);
  const [animatingDay, setAnimatingDay] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [verses, setVerses] = useState<Verse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // localStorage에서 데이터 불러오기
  useEffect(() => {
    const savedUserInfo = localStorage.getItem(USER_INFO_KEY);
    if (savedUserInfo) {
      setUserInfo(JSON.parse(savedUserInfo));
    }

    const savedOpenedDays = localStorage.getItem(STORAGE_KEY);
    if (savedOpenedDays) {
      setOpenedDays(JSON.parse(savedOpenedDays));
    }

    const savedVerses = localStorage.getItem(VERSES_KEY);
    if (savedVerses) {
      setVerses(JSON.parse(savedVerses));
    }

    setIsLoading(false);
  }, []);

  // 오늘 날짜 기준으로 열리는 일수 계산
  const getUnlockedUntil = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1; // 0-indexed
    const day = now.getDate();

    // 2월이면 해당 날짜까지만 열림, 3월 이후면 전체 열림
    if (year === 2025 && month === 2) {
      return Math.min(day, 28);
    }
    // 2025년 1월 이전이면 아무것도 안 열림, 그 외(3월 이후)는 전체 열림
    if (year === 2025 && month < 2) {
      return 0;
    }
    return 28;
  };

  const unlockedUntil = getUnlockedUntil();

  const getDayStatus = (day: number) => {
    return {
      isUnlocked: day <= unlockedUntil,
      isToday: day === unlockedUntil
    };
  };

  const handleDayClick = (day: number) => {
    const { isUnlocked } = getDayStatus(day);
    if (!isUnlocked) return;

    // 이미 본 말씀이면 바로 팝업
    if (openedDays.includes(day)) {
      setSelectedDay(day);
      return;
    }

    // 처음 보는 말씀이면 애니메이션 시작
    setAnimatingDay(day);

    // 열린 날짜 저장
    const newOpenedDays = [...openedDays, day];
    setOpenedDays(newOpenedDays);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newOpenedDays));

    // 애니메이션 끝나면 팝업 표시
    setTimeout(() => {
      setAnimatingDay(null);
      setSelectedDay(day);
    }, 700);
  };

  const handleUserInfoSubmit = async (info: UserInfo) => {
    setIsLoading(true);
    setError(null);

    try {
      // API 호출
      const response = await fetchAdventVerses(
        info.name,
        info.temple,
        parseInt(info.generation)
      );

      // 응답을 Verse 타입으로 변환
      const mappedVerses = response.verses.map(mapApiVerseToVerse);

      // 상태 및 localStorage 저장
      setUserInfo(info);
      setVerses(mappedVerses);
      localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
      localStorage.setItem(VERSES_KEY, JSON.stringify(mappedVerses));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'API 호출에 실패했습니다.');
      console.error('API 호출 오류:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedVerse = selectedDay ? verses.find(v => v.day === selectedDay) : null;

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🦅</div>
          <div className="text-amber-500">로딩중...</div>
        </div>
      </div>
    );
  }

  // 에러 발생 시
  if (error && !userInfo) {
    const isNotFound = error === 'NOT_FOUND';
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center p-6">
        <div className="text-center" style={{ maxWidth: '300px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {isNotFound ? '🔍' : '😢'}
          </div>
          <div className="text-amber-800 font-bold" style={{ fontSize: '16px', marginBottom: '12px' }}>
            {isNotFound ? '해당 청년의 간증 내용이 검색되지 않았습니다.' : '오류가 발생했습니다.'}
          </div>
          {isNotFound && (
            <div className="text-amber-600" style={{ fontSize: '14px', marginBottom: '20px' }}>
              각 성전에 문의 부탁드립니다.
            </div>
          )}
          <button
            onClick={() => setError(null)}
            className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-6 py-3 rounded-xl font-bold shadow-md"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col justify-center py-6 gap-16">
      {/* Header */}
      <header className="px-4 text-center">
        <div style={{ fontSize: '48px', marginBottom: '4px' }}>🦅</div>
        <h1 className="font-bold text-amber-700" style={{ fontSize: '28px', marginBottom: '4px' }}>
          독수리 의원
        </h1>
        <p className="text-amber-500" style={{ fontSize: '14px' }}>
          ✨ 하루 한 말씀, 독수리처럼 날아오르기 ✨
        </p>
        {userInfo && (
          <p className="text-amber-600" style={{ fontSize: '14px', marginTop: '8px' }}>
            {userInfo.temple} {userInfo.generation}기 {userInfo.name}
          </p>
        )}
      </header>

      {/* Calendar Grid */}
      <main style={{ width: '90%', margin: '0 auto' }}>
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-3" style={{ marginBottom: '16px' }}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
            <div
              key={i}
              className="text-center font-extrabold"
              style={{ color: 'rgba(0,0,0,0.45)', letterSpacing: '0.1em', fontSize: '12px' }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7 gap-x-3 gap-y-4">
          {verses.map((verse) => {
            const { isUnlocked, isToday } = getDayStatus(verse.day);
            const isOpened = openedDays.includes(verse.day);
            const isAnimating = animatingDay === verse.day;
            return (
              <DayCard
                key={verse.day}
                day={verse.day}
                isUnlocked={isUnlocked}
                isToday={isToday}
                isOpened={isOpened}
                isAnimating={isAnimating}
                onClick={() => handleDayClick(verse.day)}
              />
            );
          })}
        </div>
      </main>

      {/* User Info Modal */}
      {!userInfo && <UserInfoModal onSubmit={handleUserInfoSubmit} />}

      {/* Verse Modal */}
      <VerseModal
        verse={selectedVerse ?? null}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  );
}
