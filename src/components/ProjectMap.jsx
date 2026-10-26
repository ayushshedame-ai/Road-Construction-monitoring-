import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Crosshair, MapPin } from 'lucide-react';

export default function ProjectMap({
  projects = [],
  selectedProject = null,
  onSelectProject = null,
  height = '460px',
  zoom = 12,
  detailMode = false
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const tileLayerRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState('osm'); // 'osm', 'satellite', 'esri_street'

  // High-resolution basemap servers (Free, No API Key Required, Zero Watermarks)
  const TILE_SERVERS = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attrib: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    satellite: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attrib: 'Tiles &copy; Esri, Maxar, Earthstar Geographics'
    },
    esri_street: {
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      attrib: 'Tiles &copy; Esri &mdash; National Geographic, DeLorme, NAVTEQ'
    }
  };

  const switchTileLayer = (layerKey) => {
    if (!mapInstanceRef.current || !TILE_SERVERS[layerKey]) return;
    setActiveLayer(layerKey);

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    const newLayer = L.tileLayer(TILE_SERVERS[layerKey].url, {
      attribution: TILE_SERVERS[layerKey].attrib,
      maxZoom: 19
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Leaflet map instance
    if (!mapInstanceRef.current) {
      const center = selectedProject
        ? [selectedProject.coordinates.lat, selectedProject.coordinates.lng]
        : [18.545, 73.785]; // Center of Pune Metropolitan Highway Grid

      const map = L.map(mapContainerRef.current, {
        center: center,
        zoom: zoom,
        zoomControl: false,
        attributionControl: false
      });

      // Default to OpenStreetMap
      const initialLayer = L.tileLayer(TILE_SERVERS.osm.url, {
        attribution: TILE_SERVERS.osm.attrib,
        maxZoom: 19
      }).addTo(map);

      tileLayerRef.current = initialLayer;

      // Add zoom control in bottom-right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Recalculate container size
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    // Clear previous vector layers
    map.eachLayer((layer) => {
      if (layer !== tileLayerRef.current) {
        map.removeLayer(layer);
      }
    });

    if (detailMode && selectedProject) {
      // ========================================================
      // DETAIL MODE: Real Curved Highway Alignment & Chainage
      // ========================================================
      const waypoints = selectedProject.waypoints || [];
      if (waypoints.length > 0) {
        // Compute split index along the curve
        const splitRatio = Math.min(1, Math.max(0, selectedProject.completedLengthKm / selectedProject.totalLengthKm));
        const splitIndex = Math.max(1, Math.floor(waypoints.length * splitRatio));
        const completedPts = waypoints.slice(0, splitIndex + 1);
        const remainingPts = waypoints.slice(splitIndex);

        // 1. Completed Section - Google Maps Highway Ribbon (Outer Casing + Emerald Core)
        L.polyline(completedPts, {
          color: '#ffffff',
          weight: 10,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        L.polyline(completedPts, {
          color: '#059669', // Vibrant highway emerald green
          weight: 6,
          opacity: 1.0,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        // 2. Remaining Section - Construction Work-Zone Ribbon (Outer Casing + Orange Dash)
        L.polyline(remainingPts, {
          color: '#ffffff',
          weight: 8,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        L.polyline(remainingPts, {
          color: '#ea580c', // Bright civil construction hazard orange
          weight: 5,
          dashArray: '10, 8',
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        // 3. Translucent Road Buffer Corridor
        L.polyline(waypoints, {
          color: '#3b82f6',
          weight: 22,
          opacity: 0.12,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(map);

        // 4. Start Point Pin (Start Chainage)
        const startPt = waypoints[0];
        const startMarker = L.divIcon({
          className: 'custom-start-pin',
          html: `
            <div style="background-color: #059669; color: white; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px;">
              S
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });
        L.marker(startPt, { icon: startMarker })
          .addTo(map)
          .bindTooltip(`<b>Start:</b> ${selectedProject.chainage.split('to')[0]}<br/>${selectedProject.location}`, { permanent: false });

        // 5. Active Construction Frontier Pin (Pulsing Radar Beacon on exact highway curve)
        const frontierPt = completedPts[completedPts.length - 1];
        const frontierMarker = L.divIcon({
          className: 'custom-frontier-pin',
          html: `
            <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
              <div style="position: absolute; width: 34px; height: 34px; background: rgba(234, 88, 12, 0.35); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="background: #ea580c; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 10px rgba(234,88,12,0.6); z-index: 10;"></div>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });

        L.marker(frontierPt, { icon: frontierMarker })
          .addTo(map)
          .bindTooltip(
            `<b>Active Frontier:</b> ${selectedProject.completedLengthKm} km Done<br/><b>Verified Stage:</b> ${selectedProject.currentStage}`,
            { permanent: true, direction: 'top' }
          );

        // 6. High-Accuracy RTK GPS Tolerance Circle
        L.circle(frontierPt, {
          radius: selectedProject.gpsAccuracyMeters || 4.2,
          color: '#ea580c',
          weight: 1.5,
          fillColor: '#ea580c',
          fillOpacity: 0.18
        }).addTo(map);

        // 7. End Point Pin (End Chainage)
        const endPt = waypoints[waypoints.length - 1];
        const endMarker = L.divIcon({
          className: 'custom-end-pin',
          html: `
            <div style="background-color: #475569; color: white; width: 26px; height: 26px; border-radius: 50%; border: 3px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 11px;">
              E
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });
        L.marker(endPt, { icon: endMarker })
          .addTo(map)
          .bindTooltip(`<b>End:</b> ${selectedProject.chainage.split('to')[1] || ''}<br/>Remaining: ${(selectedProject.totalLengthKm - selectedProject.completedLengthKm).toFixed(1)} km`, { permanent: false });

        map.fitBounds(L.polyline(waypoints).getBounds(), { padding: [50, 50] });
      }

    } else {
      // ========================================================
      // OVERVIEW MODE: Authentic Road Ribbons Snapped to Highway Curves
      // ========================================================
      projects.forEach((proj) => {
        let pinColor = '#059669'; // Green on track
        if (proj.status === 'DELAYED') pinColor = '#d97706';
        if (proj.status === 'ANOMALY') pinColor = '#dc2626';

        // Draw true-to-life Google Maps road ribbons along highway curves
        if (proj.waypoints && proj.waypoints.length > 1) {
          // 1. Outer White Highway Casing (Halo)
          L.polyline(proj.waypoints, {
            color: '#ffffff',
            weight: 9,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);

          // 2. Inner Color Road Ribbon
          L.polyline(proj.waypoints, {
            color: pinColor,
            weight: 5.5,
            opacity: 0.95,
            lineCap: 'round',
            lineJoin: 'round'
          }).addTo(map);
        }

        // Draw GPS Accuracy Circle
        L.circle([proj.coordinates.lat, proj.coordinates.lng], {
          radius: proj.status === 'ANOMALY' ? 400 : 150,
          color: pinColor,
          weight: 1,
          dashArray: '4, 4',
          fillColor: pinColor,
          fillOpacity: 0.08
        }).addTo(map);

        // Status Pin Icon
        const customIcon = L.divIcon({
          className: 'custom-pin',
          html: `
            <div style="background-color: ${pinColor}; width: 32px; height: 32px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.38); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;">
              <div style="width: 10px; height: 10px; background: white; border-radius: 50%;"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([proj.coordinates.lat, proj.coordinates.lng], { icon: customIcon }).addTo(map);

        const popupContent = `
          <div style="font-family: inherit; min-width: 230px; padding: 4px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
              <span style="font-size: 10px; font-weight: 800; color: ${pinColor}; text-transform: uppercase;">
                ${proj.status}
              </span>
              <span style="font-size: 9px; color: #475569; font-weight: 700; background: #f1f5f9; padding: 2px 6px; border-radius: 4px;">
                GPS Acc: ±${proj.gpsAccuracyMeters}m
              </span>
            </div>
            <div style="font-size: 13px; font-weight: 800; color: #0f172a; margin-bottom: 3px;">
              ${proj.name}
            </div>
            <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
              ${proj.location} · Chainage ${proj.chainage}
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #1e3a8a; margin-bottom: 8px;">
              ${proj.progressPercent}% complete · Stage: ${proj.currentStage}
            </div>
            <button id="view-proj-${proj.id}" style="width: 100%; background: #1e3a8a; color: white; border: none; padding: 8px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer; transition: background 0.2s;">
              Inspect Project Stretch &rarr;
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);

        marker.on('popupopen', () => {
          const btn = document.getElementById(`view-proj-${proj.id}`);
          if (btn && onSelectProject) {
            btn.onclick = () => onSelectProject(proj);
          }
        });
      });
    }

  }, [projects, selectedProject, detailMode, zoom, onSelectProject]);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm" style={{ height }}>
      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Layer Switcher (Top-Right) */}
      <div className="absolute top-3 right-3 z-[400] bg-white/95 backdrop-blur-md px-2 py-1.5 rounded-xl border border-slate-200 text-xs shadow-md flex items-center space-x-1 font-semibold">
        <button
          onClick={() => switchTileLayer('osm')}
          className={`px-2.5 py-1 rounded-lg transition-colors ${
            activeLayer === 'osm' ? 'bg-brand-700 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Street Map
        </button>
        <button
          onClick={() => switchTileLayer('satellite')}
          className={`px-2.5 py-1 rounded-lg transition-colors ${
            activeLayer === 'satellite' ? 'bg-brand-700 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Satellite
        </button>
        <button
          onClick={() => switchTileLayer('esri_street')}
          className={`px-2.5 py-1 rounded-lg transition-colors ${
            activeLayer === 'esri_street' ? 'bg-brand-700 text-white font-bold' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Topographic
        </button>
      </div>

      {/* Map Header Status Legend (Placed on Top-Left without collision, or Bottom-Left) */}
      {!detailMode ? (
        <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 text-xs shadow-md flex items-center space-x-3.5">
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block shadow-2xs"></span>
            <span className="text-slate-800 font-bold">On track</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block shadow-2xs"></span>
            <span className="text-slate-800 font-bold">Delayed</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block shadow-2xs"></span>
            <span className="text-slate-800 font-bold">Anomaly</span>
          </div>
          <div className="border-l border-slate-200 pl-3 text-[11px] text-slate-500 flex items-center space-x-1">
            <Crosshair className="w-3.5 h-3.5 text-brand-700" />
            <span>High-Accuracy GPS (±4.2m)</span>
          </div>
        </div>
      ) : (
        <div className="absolute top-3 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-200 text-xs shadow-md flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-emerald-600" />
          <span className="text-slate-900 font-bold">
            Live Chainage: {selectedProject.chainage} ({selectedProject.location})
          </span>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-md ml-1">
            RTK LOCKED · ±{selectedProject.gpsAccuracyMeters}m
          </span>
        </div>
      )}
    </div>
  );
}
