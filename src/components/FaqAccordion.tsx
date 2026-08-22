"use client";

import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "배송은 어떻게 진행되나요?",
    a: "배송 절차와 소요 기간은 제품 및 지역에 따라 달라질 수 있습니다. 상세 내용은 구매 문의를 통해 확인해 주세요.",
  },
  {
    q: "설치 서비스가 제공되나요?",
    a: "설치 서비스 제공 여부와 비용은 아직 안내해 드릴 수 있는 확정된 내용이 없습니다. 상세 내용은 구매 문의를 통해 확인해 주세요.",
  },
  {
    q: "제품 보증은 어떻게 확인하나요?",
    a: "제품별 보증 조건은 현재 준비 중입니다. 상세 내용은 구매 문의를 통해 확인해 주세요.",
  },
  {
    q: "원하는 모델이 품절이면 어떻게 하나요?",
    a: "현재 FrostMarket에서는 실시간 재고 확인 기능을 제공하고 있지 않습니다. 원하시는 모델의 재고 상황은 구매 문의를 통해 확인해 주세요.",
  },
  {
    q: "제품 비교 기능은 어떻게 사용하나요?",
    a: "각 제품 카드의 '비교하기'를 선택하면 최대 3개까지 담을 수 있습니다. 화면 하단에 나타나는 비교 바에서 '비교하기' 버튼을 누르면 선택한 제품들의 사양을 나란히 비교하실 수 있습니다.",
  },
  {
    q: "구매 문의는 어떻게 하나요?",
    a: "제품 상세 페이지나 헤더 · 푸터의 '구매 문의' 버튼을 누르면 문의하기 페이지로 이동합니다. 이름, 연락처, 관심 제품, 문의 유형, 문의 내용을 작성하실 수 있으며, 현재 온라인 문의 접수 기능은 준비 중이라 제출 시 안내 메시지가 표시됩니다.",
  },
  {
    q: "제품 정보가 “확인 중”으로 표시되는 이유는 무엇인가요?",
    a: "FrostMarket은 실제로 확인되지 않은 사양 정보를 임의로 표시하지 않습니다. 아직 확인되지 않은 항목은 '확인 중'으로 표시되며, 확인되는 대로 순차적으로 업데이트할 예정입니다.",
  },
  {
    q: "교환 및 반품 정책은 어디에서 확인할 수 있나요?",
    a: "교환 및 반품 정책은 현재 준비 중입니다. 상세 내용은 구매 문의를 통해 확인해 주세요.",
  },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
        open ? "rotate-180" : ""
      }`}
      fill="none"
      aria-hidden
    >
      <path
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-2xl divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {FAQ_ITEMS.map((item, i) => {
        const open = openIndex === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : i)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50 sm:px-6 sm:py-5"
            >
              <span className="text-sm font-semibold text-slate-900 sm:text-base">
                {item.q}
              </span>
              <ChevronIcon open={open} />
            </button>
            <div
              className={`grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 overflow-hidden px-5 pb-4 sm:px-6 sm:pb-5">
                <p className="text-sm leading-relaxed text-slate-500 sm:text-base">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
