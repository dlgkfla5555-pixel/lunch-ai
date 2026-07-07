"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}

type Props = {
  address: string;
};

export default function CafeteriaMap({ address }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      setError("지도를 불러오지 못했어요. (카카오맵 스크립트 로드 실패)");
      return;
    }

    window.kakao.maps.load(() => {
      if (!window.kakao.maps.services) {
        setError("주소 변환 서비스를 불러오지 못했어요.");
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();

      geocoder.addressSearch(address, (result: any[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK && mapRef.current) {
          const coords = new window.kakao.maps.LatLng(
            Number(result[0].y),
            Number(result[0].x)
          );

          const map = new window.kakao.maps.Map(mapRef.current, {
            center: coords,
            level: 3,
          });

          new window.kakao.maps.Marker({ map, position: coords });
        } else {
          setError("주소로 위치를 찾지 못했어요.");
        }
      });
    });
  }, [address]);

  if (error) {
    return <p className="text-sm text-gray-400 py-4 text-center">{error}</p>;
  }

  return <div ref={mapRef} className="w-full h-48 rounded-xl overflow-hidden" />;
}
