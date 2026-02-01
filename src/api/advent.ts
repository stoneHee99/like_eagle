// API 응답 타입
export interface AdventVerseItem {
  sequence: number;
  book_name: string;
  book_display_name: string;
  chapter: number;
  verse: number;
  content: string;
  reference: string;
}

export interface AdventVerseListResponse {
  name: string;
  temple: string;
  batch: number;
  verses: AdventVerseItem[];
}

// API Base URL - 개발환경에서는 프록시 사용 (/api), 프로덕션에서는 직접 호출
const API_BASE_URL = import.meta.env.DEV ? '/api' : 'https://api.gntc-youth.com';

export async function fetchAdventVerses(
  name: string,
  temple: string,
  batch: number
): Promise<AdventVerseListResponse> {
  const params = new URLSearchParams({
    name,
    temple,
    batch: String(batch),
  });

  const response = await fetch(`${API_BASE_URL}/advent?${params}`);

  if (!response.ok) {
    throw new Error(`API 호출 실패: ${response.status}`);
  }

  return response.json();
}
