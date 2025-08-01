"use client";

declare global {
    interface Window {
      kakao: any;
    }
  }

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function SeoulDistrictMapPage() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=039270177862ec2c7c46e905b6d3352f&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    let goBackButton: HTMLButtonElement | null = null;

    script.onload = () => {
      window.kakao.maps.load(async () => {
        if (!mapRef.current) return;

        const map = new window.kakao.maps.Map(mapRef.current, {
          center: new window.kakao.maps.LatLng(37.5665, 126.9780),
          level: 9,
        });

        const customOverlay = new window.kakao.maps.CustomOverlay({});
        const infowindow = new window.kakao.maps.InfoWindow({ removable: true });

        const seoulMap = await (await fetch("/data/seoul.geojson")).json();
        const dongData = await (await fetch("/data/seoul_districts_topo.json")).json();
        const centers = [
            { name: "강남구", lat: 37.5172, lng: 127.0473 },
            { name: "강동구", lat: 37.5301, lng: 127.1238 },
            { name: "강북구", lat: 37.6396, lng: 127.0256 },
            { name: "강서구", lat: 37.5509, lng: 126.8495 },
            { name: "관악구", lat: 37.4784, lng: 126.9516 },
            { name: "광진구", lat: 37.5385, lng: 127.0823 },
            { name: "구로구", lat: 37.4954, lng: 126.8874 },
            { name: "금천구", lat: 37.4604, lng: 126.9000 },
            { name: "노원구", lat: 37.6542, lng: 127.0568 },
            { name: "도봉구", lat: 37.6688, lng: 127.0470 },
            { name: "동대문구", lat: 37.5744, lng: 127.0396 },
            { name: "동작구", lat: 37.5124, lng: 126.9392 },
            { name: "마포구", lat: 37.5663, lng: 126.9014 },
            { name: "서대문구", lat: 37.5791, lng: 126.9368 },
            { name: "서초구", lat: 37.4836, lng: 127.0326 },
            { name: "성동구", lat: 37.5633, lng: 127.0367 },
            { name: "성북구", lat: 37.5894, lng: 127.0167 },
            { name: "송파구", lat: 37.5145, lng: 127.1066 },
            { name: "양천구", lat: 37.5169, lng: 126.8664 },
            { name: "영등포구", lat: 37.5263, lng: 126.8962 },
            { name: "용산구", lat: 37.5324, lng: 126.9908 },
            { name: "은평구", lat: 37.6176, lng: 126.9227 },
            { name: "종로구", lat: 37.5730, lng: 126.9794 },
            { name: "중구", lat: 37.5636, lng: 126.9976 },
            { name: "중랑구", lat: 37.5985, lng: 127.0927 },
        ];

        let regionPolygons: any[] = [];
        let dongPolygons: any[] = [];

        const displayDongAreas = (dongGeo: any[]) => {
          dongGeo.forEach((dong) => {
            const geometry = dong.geometry;
            const drawPolygon = (coords: number[][]) => {
              const path = coords.map(([lng, lat]) => new window.kakao.maps.LatLng(lat, lng));
              const polygon = new window.kakao.maps.Polygon({
                map,
                path,
                strokeWeight: 2,
                strokeColor: "#5C5B5C",
                strokeOpacity: 0.8,
                fillColor: "#CACACB",
                fillOpacity: 0.7,
              });
              dongPolygons.push(polygon);
              addDongEvents(polygon, dong);
            };

            if (geometry.type === "Polygon") {
                drawPolygon(geometry.coordinates[0]);
              } else if (geometry.type === "MultiPolygon") {
                geometry.coordinates.forEach((multi: number[][][]) => drawPolygon(multi[0]));
              }
              
          });
        };

        const addDongEvents = (polygon: any, dong: any) => {
          window.kakao.maps.event.addListener(polygon, "mouseover", (e: any) => {
            polygon.setOptions({ fillColor: "#b29ddb" });
            customOverlay.setPosition(e.latLng);
            customOverlay.setMap(map);
          });

          window.kakao.maps.event.addListener(polygon, "mouseout", () => {
            polygon.setOptions({ fillColor: "#CACACB" });
            customOverlay.setMap(null);
          });

          window.kakao.maps.event.addListener(polygon, "click", (e: any) => {
            const content = document.createElement("div");
            content.innerHTML = `
              <div style="padding:8px; font-size:13px;">
                <strong>${dong.properties.DONG_KOR_NM}</strong><br />
                이 지역 맛집을 보시겠어요?<br/><br/>
                <button id="btn-goto" style="background:#B36B00;color:white;padding:4px 8px;border-radius:5px;">맛집 보기</button>
              </div>`;
            infowindow.setContent(content);
            infowindow.setPosition(e.latLng);
            infowindow.setMap(map);

            content.querySelector("#btn-goto")?.addEventListener("click", () => {
              router.push("/restaurant");
            });
            addGoBackButton();
          });
        };

        const displayArea = (coords: number[][], name: string) => {
          const path = coords.map(([lng, lat]) => new window.kakao.maps.LatLng(lat, lng));
          const polygon = new window.kakao.maps.Polygon({
            map,
            path,
            strokeWeight: 2,
            strokeColor: "#004c80",
            strokeOpacity: 0.8,
            fillColor: "#fff",
            fillOpacity: 0.6,
          });

          regionPolygons.push(polygon);

          window.kakao.maps.event.addListener(polygon, "mouseover", (e: any) => {
            polygon.setOptions({ fillColor: "#d2c7ef" });
            customOverlay.setPosition(e.latLng);
            customOverlay.setMap(map);
          });

          window.kakao.maps.event.addListener(polygon, "mouseout", () => {
            polygon.setOptions({ fillColor: "#ffffff" });
            customOverlay.setMap(null);
          });

          window.kakao.maps.event.addListener(polygon, "click", () => {
            regionPolygons.forEach((p) => p.setMap(null));
            regionPolygons = [];

            const center = centers.find((c) => c.name === name);
            if (center) map.setCenter(new window.kakao.maps.LatLng(center.lat, center.lng));
            map.setLevel(7);

            const dongs = dongData.features.filter((f: any) => f.properties.SIG_KOR_NM === name);
            displayDongAreas(dongs);
            addGoBackButton();
            console.log(dongs);
          });
        };

        const addGoBackButton = () => {
          if (goBackButton) return;
          goBackButton = document.createElement("button");
          goBackButton.innerText = "구 다시 선택하기";
          goBackButton.style.cssText =
            "position:absolute;top:20px;right:20px;background:#B36B00;color:white;padding:10px 16px;border-radius:8px;z-index:100;";
          goBackButton.onclick = () => resetRegions();
          document.body.appendChild(goBackButton);
        };

        const resetRegions = () => {
          dongPolygons.forEach((p) => p.setMap(null));
          dongPolygons = [];
          infowindow.close();

          map.setLevel(9);
          map.setCenter(new window.kakao.maps.LatLng(37.5665, 126.9780));
          if (goBackButton) {
            goBackButton.remove();
            goBackButton = null;
          }

          seoulMap.features.forEach((f: any) => {
            displayArea(f.geometry.coordinates[0], f.properties.SIG_KOR_NM);
          });
        };

        seoulMap.features.forEach((f: any) => {
          displayArea(f.geometry.coordinates[0], f.properties.SIG_KOR_NM);
        });
      });
    };

    return () => {
      if (goBackButton) goBackButton.remove();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FFFCF3] p-4">
      <h1 className="text-2xl font-bold text-center text-[#4B2E2E] mb-1">우리 지역 맛집 알아보기</h1>
      <p className="text-center text-[#7A6C5D] text-sm mb-5">
        아래 지도에서 지역을 선택하세요.
      </p>
      <div className="flex justify-center">
        <div className="w-full max-w-5xl h-[600px] rounded-xl shadow border border-[#eee] overflow-hidden">
          <div ref={mapRef} className="w-full h-full" />
        </div>
      </div>
      
    </div>
  );
}