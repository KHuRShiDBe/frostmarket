import type { ReactNode } from "react";
import Link from "next/link";

export default function ContactTrigger({
  children,
  className,
  onClick,
  productId,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  /** When set, the inquiry page preselects this product's model. */
  productId?: string;
}) {
  const href = productId ? `/inquiry?model=${encodeURIComponent(productId)}` : "/inquiry";

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
