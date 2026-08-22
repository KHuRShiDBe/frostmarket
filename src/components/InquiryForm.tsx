"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { getBrandDisplayName, getProduct, SPEC_PENDING } from "@/data/products";

const INQUIRY_TYPES = ["구매 문의", "제품 문의", "배송 문의", "설치 문의", "기타 문의"] as const;

const fieldLabelClass = "text-sm font-medium text-slate-700";
const fieldInputClass =
  "rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/30";

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="m8.5 12.3 2.4 2.4 4.6-4.9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function InquiryForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [interest, setInterest] = useState("");
  const [inquiryType, setInquiryType] = useState<(typeof INQUIRY_TYPES)[number]>(
    INQUIRY_TYPES[0],
  );
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const modelId = new URLSearchParams(window.location.search).get("model");
    if (!modelId) return;
    const product = getProduct(modelId);
    if (!product) return;

    const brand = getBrandDisplayName(product.brand);
    // Reading window.location (client-only) on mount to prefill from a
    // product-detail link; can't be a lazy useState initializer since this
    // is a static page with no server-side query param to read.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInterest(brand === SPEC_PENDING ? product.model : `${brand} ${product.model}`);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName("");
    setContact("");
    setInterest("");
    setInquiryType(INQUIRY_TYPES[0]);
    setMessage("");
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-sky-100 bg-sky-50 p-8 text-center sm:p-12">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm">
          <CheckIcon />
        </span>
        <h2 className="font-heading text-lg font-bold text-slate-900 sm:text-xl">
          온라인 문의 접수 기능은 준비 중입니다
        </h2>
        <p className="max-w-sm text-sm leading-relaxed text-slate-500">
          빠른 시일 내에 온라인 문의 접수 기능을 제공해 드릴 예정입니다. 입력해 주신
          내용은 저장되거나 전송되지 않았습니다. 이용에 불편을 드려 죄송합니다.
        </p>
        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:border-sky-300 hover:text-sky-600"
          >
            다시 작성하기
          </button>
          <Link
            href="/#catalog"
            className="inline-flex items-center justify-center rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700"
          >
            제품 목록 보기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="inquiry-name" className={fieldLabelClass}>
          이름 <span className="text-rose-500">*</span>
        </label>
        <input
          id="inquiry-name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력해 주세요"
          className={fieldInputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="inquiry-contact" className={fieldLabelClass}>
          연락처 <span className="text-rose-500">*</span>
        </label>
        <input
          id="inquiry-contact"
          type="text"
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="휴대폰 번호 또는 이메일"
          className={fieldInputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="inquiry-interest" className={fieldLabelClass}>
          관심 제품 / 모델명
        </label>
        <input
          id="inquiry-interest"
          type="text"
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          placeholder="예: LG전자 B502S53 (선택 사항)"
          className={fieldInputClass}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="inquiry-type" className={fieldLabelClass}>
          문의 유형 <span className="text-rose-500">*</span>
        </label>
        <select
          id="inquiry-type"
          required
          value={inquiryType}
          onChange={(e) => setInquiryType(e.target.value as (typeof INQUIRY_TYPES)[number])}
          className={`${fieldInputClass} appearance-none bg-[url('data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%221.7%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:20px] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
        >
          {INQUIRY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="inquiry-message" className={fieldLabelClass}>
          문의 내용 <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="inquiry-message"
          required
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="문의하실 내용을 자세히 적어 주세요"
          className={`${fieldInputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        className="mt-2 inline-flex w-full items-center justify-center rounded-full bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 sm:w-auto"
      >
        문의 보내기
      </button>
    </form>
  );
}
