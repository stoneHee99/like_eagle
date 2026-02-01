// API 응답과 호환되는 Verse 타입
export interface Verse {
  day: number;        // sequence를 day로 매핑
  reference: string;  // API의 reference 그대로 사용
  text: string;       // API의 content를 text로 매핑
}

// API 응답을 Verse 타입으로 변환
export function mapApiVerseToVerse(apiVerse: {
  sequence: number;
  content: string;
  reference: string;
}): Verse {
  return {
    day: apiVerse.sequence,
    reference: apiVerse.reference,
    text: apiVerse.content,
  };
}
