import qrcode from "qrcode-generator";

/** 주소를 QR 모듈 격자(true=검은 칸)로 만들어요. 순수 계산이라 화면·내보내기가 공유해요. */
export function qrModules(text: string): boolean[][] {
  const qr = qrcode(0, "M");
  qr.addData(text || " ");
  qr.make();
  const n = qr.getModuleCount();
  const rows: boolean[][] = [];
  for (let r = 0; r < n; r++) {
    const row: boolean[] = [];
    for (let c = 0; c < n; c++) row.push(qr.isDark(r, c));
    rows.push(row);
  }
  return rows;
}

/** 주소를 QR 코드 SVG로 그려요. size는 픽셀 한 변 길이예요. */
export function QrCode({ value, size }: { value: string; size: number }) {
  const modules = qrModules(value);
  const n = modules.length;
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${n} ${n}`}
      shapeRendering="crispEdges"
    >
      <rect width={n} height={n} fill="#ffffff" />
      {modules.map((row, r) =>
        row.map((on, c) =>
          on ? (
            <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#000000" />
          ) : null,
        ),
      )}
    </svg>
  );
}
