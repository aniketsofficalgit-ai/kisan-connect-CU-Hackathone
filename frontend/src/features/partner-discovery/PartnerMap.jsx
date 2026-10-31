import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldCheck, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

// Fix Leaflet default marker icon path issues in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom green marker icon
const customGreenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const PartnerMap = ({ partners = [] }) => {
  const defaultCenter = [28.6139, 76.2090]; // North India center

  return (
    <div className="map-container-box relative">
      <MapContainer
        center={defaultCenter}
        zoom={6}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {partners.map((partner) => {
          const lat = partner.latitude || 30.9010;
          const lng = partner.longitude || 75.8573;
          return (
            <Marker key={partner.id} position={[lat, lng]} icon={customGreenIcon}>
              <Popup>
                <div className="p-1 max-w-[220px] text-xs">
                  <div className="flex items-center gap-1 text-[#1E4D2B] font-bold text-sm mb-1">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    <span>{partner.business_name}</span>
                  </div>
                  <p className="text-gray-600 flex items-center gap-1 mb-1 text-[11px]">
                    <MapPin size={11} className="shrink-0" /> {partner.service_area}
                  </p>
                  <p className="font-semibold text-gray-800 text-[11px]">
                    Pricing: {partner.pricing_details}
                  </p>
                  <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={`/partner-details/${partner.id}`}
                      className="font-bold text-[#1E4D2B] hover:underline text-[11px]"
                    >
                      View Profile &rarr;
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PartnerMap;
