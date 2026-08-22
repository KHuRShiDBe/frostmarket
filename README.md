# FrostMarket

LG전자와 삼성전자의 실제 냉장고 모델을 한눈에 비교하고 살펴볼 수 있는 냉장고 카탈로그 웹사이트입니다.
A refrigerator catalog website for browsing and comparing real LG Electronics and Samsung Electronics refrigerator models side by side.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-frostmarket.vercel.app-38bdf8?style=for-the-badge)](https://frostmarket.vercel.app)

## Live Demo

**[https://frostmarket.vercel.app](https://frostmarket.vercel.app)**

---

## 소개 (Korean)

FrostMarket는 LG전자 10종, 삼성전자 10종, 총 20개의 실제 냉장고 모델을 실제 촬영된 제품 이미지와 함께 제공하는 냉장고 전문 카탈로그입니다. 사용자는 브랜드별로 제품을 탐색하고, 모델명으로 검색하고, 최대 3개의 제품을 나란히 비교하고, 관심 있는 제품을 저장할 수 있습니다. 아직 확인되지 않은 사양은 임의로 채우지 않고 "확인 중"으로 정직하게 표시하는 것을 원칙으로 합니다.

## Introduction (English)

FrostMarket is a refrigerator catalog site featuring 20 real refrigerator models — 10 from LG Electronics and 10 from Samsung Electronics — presented with actual product photography. Users can browse by brand, search by model name, compare up to 3 products side by side, and save favorites. Any specification that hasn't been verified yet is honestly shown as "확인 중" (Pending Verification) rather than being guessed or invented.

---

## 주요 기능 / Main Features

- 🧊 **20개 실제 냉장고 카탈로그** — LG전자 10종 + 삼성전자 10종, 총 123장의 실제 제품 이미지
  20-product real refrigerator catalog (10 LG + 10 Samsung), 123 real product photos
- 🔍 **모델명 검색** 및 **브랜드별 필터** (전체 / LG / Samsung)
  Model-name search and brand filtering (All / LG / Samsung)
- 🎛️ **동적 필터** — 도어 타입, 색상, 용량 범위 (데이터에 실제로 존재하는 값만 표시)
  Dynamic filters for door type, color, and capacity range (built only from confirmed data)
- ↕️ **정렬** — 기본순 / 브랜드순 / 모델명 오름차순·내림차순, **필터 초기화** 버튼
  Sorting (default / by brand / model name asc·desc) and a one-click filter reset
- 🖼️ **제품 상세 페이지** — 대형 이미지 갤러리, 썸네일 탐색, 상세 사양표, 비슷한 제품, 최근 본 제품
  Product detail pages with a large image gallery, thumbnail navigation, a full spec table, similar products, and recently viewed
- ❤️ **관심 제품(즐겨찾기)** — localStorage에 저장되어 새로고침해도 유지
  Favorites, persisted in `localStorage` across page reloads
- ⚖️ **제품 비교** — 최대 3개 제품을 표 형태로 나란히 비교
  Side-by-side comparison of up to 3 products
- ⚡ **빠른 보기(Quick View)** — 목록을 떠나지 않고 제품을 빠르게 확인
  Quick View modal for previewing a product without leaving the list
- 📩 **문의하기 폼** — 문의 유형별 양식, 제품 상세에서 진입 시 모델 자동 선택
  An inquiry form with categorized inquiry types, auto-selecting the model when opened from a product page
- 📱 **완전 반응형 디자인** — 모바일 전용 햄버거 메뉴 포함
  Fully responsive design, including a dedicated mobile hamburger menu
- 🔎 **SEO 최적화** — 동적 메타데이터, Open Graph, `sitemap.xml`, `robots.txt`, 파비콘
  SEO-ready: dynamic per-page metadata, Open Graph tags, `sitemap.xml`, `robots.txt`, and a custom favicon
- ✅ **정확성 우선 원칙** — 확인되지 않은 사양이나 연락처 정보를 절대 임의로 생성하지 않음
  Accuracy-first by design: unverified specs and contact details are never fabricated

---

## 제품 목록 / Product Lineup

**LG전자 (LG Electronics) — 10종**
B502S53 · D312MBE31 · D502MEE33 · G646GBB031 · M876GBB231 · Q343GIC183S · S834MEE111 · S836MEE022 · T876MEE011 · T876MEE1H1

**삼성전자 (Samsung Electronics) — 10종**
RM70F63R2A · RM70F90M1ZD · RM70H91RMA · RM80F91H1W · RM80H64S2A · RM90F91D1W · RM90H64P2W · RS70F65Q2Y · RS84DB5002CW · RS84DB5661CW

---

## 기술 스택 / Tech Stack

- [Next.js 16](https://nextjs.org/) — App Router, Turbopack
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- `next/image` — 자동 이미지 최적화 (반응형 리사이징 + 최신 포맷 변환)
  automatic image optimization (responsive resizing + modern format conversion)
- [ESLint](https://eslint.org/) (`eslint-config-next`)

---

## 로컬 설치 및 실행 / Local Installation & Running

### 요구 사항 / Requirements

- Node.js 20 이상 / Node.js 20 or later
- npm

### 설치 / Install

```bash
git clone <this-repository-url>
cd frostmarket
npm install
```

### 개발 서버 실행 / Run the development server

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 여세요.
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 프로덕션 빌드 / Production build

```bash
npm run build
npm start
```

### 코드 검사 / Linting

```bash
npm run lint
```

---

## 프로젝트 구조 / Project Structure

```
src/
  app/            # Next.js App Router 페이지 (홈, 제품 상세, FAQ, 소개, 문의하기 등)
  components/     # UI 컴포넌트 (카탈로그, 갤러리, 비교, 즐겨찾기 등)
  context/        # 클라이언트 상태 관리 (즐겨찾기, 비교, 최근 본 제품 등)
  data/           # 제품 데이터 및 헬퍼 함수 (src/data/products.ts)
  lib/            # 공용 유틸리티 (SEO 헬퍼 등)
public/
  products/       # 브랜드/모델별 실제 제품 이미지
```

---

## 데이터 정확성에 대한 안내 / A Note on Data Accuracy

모든 제품의 사양은 실제로 확인된 정보만 표시되며, 아직 확인되지 않은 항목은 임의의 값 대신 "확인 중"으로 표시됩니다. 연락처, 회사 정보 등도 실제로 확정된 내용이 없는 경우 정직하게 "준비 중"으로 안내합니다.

Every product's specifications reflect only verified information — unverified fields are shown as "확인 중" (Pending Verification) rather than filled with invented values. Contact details and company information are likewise honestly marked as "준비 중" (Coming Soon) where nothing has been finalized yet.
