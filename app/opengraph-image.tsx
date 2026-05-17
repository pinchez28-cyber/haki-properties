import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#FAF8F2",
          color: "#1F2933",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <div style={{ alignItems: "center", display: "flex", gap: "24px" }}>
            <div
              style={{
                alignItems: "center",
                background: "#0B5D3B",
                borderRadius: "28px",
                color: "white",
                display: "flex",
                fontSize: "42px",
                fontWeight: 900,
                height: "112px",
                justifyContent: "center",
                width: "132px",
              }}
            >
              HMP
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  color: "#0B5D3B",
                  fontSize: "54px",
                  fontWeight: 900,
                }}
              >
                Haki Marketplace
              </div>
              <div
                style={{
                  color: "#D6A84F",
                  fontSize: "24px",
                  fontWeight: 800,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                Verified property deals
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.08,
              maxWidth: "760px",
            }}
          >
            Verified homes, land, and real estate across East Africa
          </div>

          <div style={{ color: "#475569", fontSize: "28px", maxWidth: "760px" }}>
            Compare market values, upload documents, and reduce duplicate-sale
            risk before property deals move forward.
          </div>
        </div>

        <div
          style={{
            background: "#0B5D3B",
            borderRadius: "36px",
            color: "white",
            display: "flex",
            flexDirection: "column",
            fontSize: "28px",
            fontWeight: 800,
            gap: "22px",
            padding: "44px",
            width: "330px",
          }}
        >
          <div>Homes</div>
          <div>Land</div>
          <div>Document checks</div>
          <div>Market overview</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
